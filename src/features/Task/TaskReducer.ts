import {AppRootStateType, AppThunk} from "../../App/store";
import {APITask, TaskPriorities} from "../../API/API";
import {Dispatch} from "redux";
import {setErrorApp, setStatusApp} from "../../App/app-reducer";
import {
    AddTodolistAC,
    changeTodolistEntityStatusAC,
    RemoveTodolistAC,
    setTodolistsAC
} from "../TodoList/todoListsReducer";
import {handleServerAppError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


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

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasksAC(state, action: PayloadAction<{tasks: Array<TaskType>, todolistId: string}> ) {
            state[action.payload.todolistId] = action.payload.tasks
        },
        RemoveTaskAC(state, action: PayloadAction<{taskId: string, TodoListId: string}> ) {
            const tasks = state[action.payload.TodoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if(index > -1 ) {
                tasks.splice(index, 1)
            }
        },
        AddTaskAC(state, action: PayloadAction<{task: TaskType}> ) {
           state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        ChangeTaskStatusAC(state, action: PayloadAction<{taskId: string, status: TaskStatuses, todoListId: string}> ) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if(index > -1 ) {
                tasks[index].status = action.payload.status
            }
        },
        ChangeTaskTitleAC(state, action: PayloadAction<{taskId: string, title: string, todoListId: string}> ) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if(index > -1 ) {
                tasks[index].title = action.payload.title
            }
        }
    },
    extraReducers: (bilder) => {
        bilder.addCase(AddTodolistAC, (state, action) => {
            state[action.payload.todolist.id]  = []
        });
        bilder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach((tl:any) => {
                state[tl.id] = []
            })
        });
        bilder.addCase(RemoveTodolistAC, (state, action) => {
            delete state[action.payload.id]
        });
    }
    // {
    //     [AddTodolistAC.type]: (state, action: PayloadAction<{ todolist: TodolistType }>) => {},
    //     [setTodolistsAC.type]: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {},
    //     [RemoveTodolistAC.type]: (state, action: PayloadAction<{ id: string }>) => {},
    // }
})


export const TasksReducer = slice.reducer
export const {setTasksAC,AddTaskAC,ChangeTaskStatusAC,ChangeTaskTitleAC,RemoveTaskAC} = slice.actions



export const getTaskTodoT = (todoId: string): AppThunk => (dispatch) => {
    dispatch(setStatusApp({status:"loading"}))
    APITask.getTask(todoId)
        .then(res => {
            if (res.status === 200) {
                dispatch(setTasksAC({tasks:res.data.items, todolistId:todoId}))
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp({status:"succeeded"}))
        })
}
export const removeTaskT = (taskId: string, TodoListId: string): AppThunk => (dispatch) => {
    dispatch(setStatusApp({status:"loading"}))
    dispatch(changeTodolistEntityStatusAC({entityStatus:'loading', id:TodoListId}))
    APITask.deleteTask(TodoListId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(RemoveTaskAC({taskId, TodoListId}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp({error:error.message}))
        })
        .finally(() => {
            dispatch(setStatusApp({status:"succeeded"}))
            dispatch(changeTodolistEntityStatusAC({entityStatus:'failed', id:TodoListId}))
        })

}
export const addTaskT = (todoId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setStatusApp({status:"loading"}))
    dispatch(changeTodolistEntityStatusAC({entityStatus:'loading', id:todoId}))
    APITask.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(AddTaskAC({task:res.data.data.item}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp({status:"succeeded"}))
            dispatch(changeTodolistEntityStatusAC({entityStatus:'failed', id:todoId}))
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
        dispatch(setStatusApp({status:"loading"}))
        dispatch(changeTodolistEntityStatusAC({entityStatus:'loading', id:todolistId}))
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
                        dispatch(ChangeTaskStatusAC({taskId,todoListId:todolistId, status}))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch(error => {
                    dispatch(setErrorApp({error:error.message}))
                })
                .finally(() => {
                    dispatch(setStatusApp({status:"succeeded"}))
                    dispatch(changeTodolistEntityStatusAC({entityStatus:'failed', id:todolistId}))
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
    dispatch(setStatusApp({status:"loading"}))
    dispatch(changeTodolistEntityStatusAC({entityStatus:'loading', id:todoListId}))
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
                    dispatch(ChangeTaskTitleAC({todoListId, taskId,title}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(error => {
                dispatch(setErrorApp(error.message))
            })
            .finally(() => {
                dispatch(setStatusApp({status:"succeeded"}))
                dispatch(changeTodolistEntityStatusAC({entityStatus:'failed', id:todoListId}))
            })


    }
}


