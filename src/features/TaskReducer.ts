import {AppActionType, AppRootStateType, AppThunk} from "../App/store";
import {APITask, TaskPriorities} from "../API/API";
import {Dispatch} from "redux";
import {setErrorApp, setStatusApp} from "../App/app-reducer";
import {changeTodolistEntityStatusAC} from "./todoListsReducer";
import {handleServerAppError} from "../utils/error-utils";


const initialState: TaskStateTask = {}


export type TaskStateTask = {
    [key: string]: Array<TaskDomainType>
}
export type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TaskPriorities
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}
export type TaskDomainType = TaskType & {
    status: TaskStatuses
}

export enum TaskStatuses {
    New = 0,
    inProgress = 1,
    Completed = 2,
    Draft = 3
}

export type RemoveTaskType = {
    type: 'REMOVE-TASK'
    taskId: string
    TodoListId: string
}
export type AddTaskActionType = {
    type: 'ADD-TASK'
    task: TaskType
    TodoListId: string
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    status: TaskStatuses
    todoListId: string
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    title: string
    todoListId: string
}
export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}

export const TasksReducer = (state: TaskStateTask = initialState, action: AppActionType): TaskStateTask => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }

        case 'REMOVE-TASK':
            state[action.TodoListId] = state[action.TodoListId].filter(t => t.id !== action.taskId);
            return {...state}
        case 'ADD-TASK':

            let todolistTasks = state[action.TodoListId];
            state[action.TodoListId] = [action.task, ...todolistTasks];
            return {...state}
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id !== action.taskId
                        ? task
                        : {...task, status: action.status})
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id !== action.taskId
                        ? task
                        : {...task, title: action.title})
            }
        case "REMOVE-TODOLIST":
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        default:
            return state
    }
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}

export const RemoveTaskAC = (taskId: string, TodoListId: string): RemoveTaskType => {
    return {type: 'REMOVE-TASK', taskId, TodoListId}
}
export const AddTaskAC = (task: TaskType, TodoListId: string): AddTaskActionType => {
    return {type: "ADD-TASK", task, TodoListId}
}

export const ChangeTaskStatusAC = (taskId: string, status: TaskStatuses, todoListId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todoListId}
}
export const ChangeTaskTitleAC = (taskId: string, title: string, todoListId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todoListId}
}


export const getTaskTodoT = (todoId: string): AppThunk => (dispatch) => {
    dispatch(setStatusApp("loading"))
    APITask.getTask(todoId)
        .then(res => {
            if (res.status === 200) {
                dispatch(setTasksAC(res.data.items, todoId))
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
        })
}
export const removeTaskT = (taskId: string, TodoListId: string): AppThunk => (dispatch) => {
    dispatch(setStatusApp("loading"))
    dispatch(changeTodolistEntityStatusAC(TodoListId, 'loading'))
    APITask.deleteTask(TodoListId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(RemoveTaskAC(taskId, TodoListId))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
            dispatch(changeTodolistEntityStatusAC(TodoListId, 'failed'))
        })

}
export const addTaskT = (todoId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setStatusApp("loading"))
    dispatch(changeTodolistEntityStatusAC(todoId, 'loading'))
    APITask.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(AddTaskAC(res.data.data.item, todoId))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
            dispatch(changeTodolistEntityStatusAC(todoId, 'failed'))
        })
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва

        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })
        dispatch(setStatusApp("loading"))
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        if (task) {
            APITask.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status
            })
                .then((res) => {
                    if(res.data.resultCode === 0){
                        dispatch(ChangeTaskStatusAC(taskId, status, todolistId))
                        dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch(error => {
                    dispatch(setErrorApp(error.message))
                })
                .finally(() => {
                    dispatch(setStatusApp("succeeded"))
                    dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
                })

        }
    }
}

export const ChangeTaskTitleF = (taskId: string, title: string, todoListId: string): AppThunk => (dispatch, getState: () => AppRootStateType) => {
    const allTasksFromState = getState().tasks;
    const tasksForCurrentTodolist = allTasksFromState[todoListId]
    const task = tasksForCurrentTodolist.find(t => {
        return t.id === taskId
    })
    dispatch(setStatusApp("loading"))
    dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'))
    if (task) {
        APITask.updateTask(todoListId, taskId, {
            title: title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status
        })
            .then((res) => {
                if(res.data.resultCode === 0){
                    dispatch(ChangeTaskTitleAC(taskId, title, todoListId))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => {
                dispatch(setErrorApp(error.message))
            })
            .finally(() => {
                dispatch(setStatusApp("succeeded"))
                dispatch(changeTodolistEntityStatusAC(todoListId, 'failed'))
            })


    }
}


