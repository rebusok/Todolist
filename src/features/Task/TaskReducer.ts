import {AppRootStateType} from "../../App/store";
import {APITask, TaskPriorities, UpdateTaskModelType} from "../../API/API";
import {setErrorApp, setStatusApp} from "../../App/app-reducer";
import {
    addTodolistF,
    changeTodolistEntityStatusAC, getTodolistT, removeTodoListT,

} from "../TodoList/todoListsReducer";
import {handleServerAppError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


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
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export enum TaskStatuses {
    New = 0,
    inProgress = 1,
    Completed = 2,
    Draft = 3
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setStatusApp({status: "loading"}))
    try {
        const res = await APITask.getTask(todolistId)

        const tasks = res.data.items
        thunkAPI.dispatch(setStatusApp({status: "succeeded"}))

        return {tasks, todolistId}
    } catch (e) {
        thunkAPI.dispatch(setErrorApp(e.message))
    }


})
export const removeTaskT = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, TodoListId: string }, {
    dispatch,
    rejectWithValue
}) => {
    const {TodoListId, taskId} = param
    dispatch(setStatusApp({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC({entityStatus: 'loading', id: TodoListId}))
    try {
        const res = await APITask.deleteTask(TodoListId, taskId)
        if (res.data.resultCode === 0) {
            dispatch(setStatusApp({status: "succeeded"}))
            dispatch(changeTodolistEntityStatusAC({entityStatus: 'succeeded', id: TodoListId}))
            return {taskId: taskId, TodoListId: TodoListId}
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setStatusApp({status: "failed"}))
            dispatch(changeTodolistEntityStatusAC({entityStatus: 'failed', id: TodoListId}))
            return rejectWithValue({})
        }
    } catch (e) {
        dispatch(setErrorApp(e.message))
        dispatch(setStatusApp({status: "failed"}))
        dispatch(changeTodolistEntityStatusAC({entityStatus: 'failed', id: TodoListId}))
        return rejectWithValue({})
    }
})
export const addTaskT = createAsyncThunk('tasks/addTask', async (param: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    const {todolistId, title} = param
    dispatch(setStatusApp({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC({entityStatus: 'loading', id: todolistId}))
    try {
        const res = await APITask.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(setStatusApp({status: "succeeded"}))
            dispatch(changeTodolistEntityStatusAC({entityStatus: 'succeeded', id: todolistId}))
            return res.data.data.item
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTodolistEntityStatusAC({entityStatus: 'failed', id: todolistId}))
            return rejectWithValue({})
        }
    } catch (e) {
        dispatch(setErrorApp(e.message))
        dispatch(setStatusApp({status: "failed"}))
        dispatch(changeTodolistEntityStatusAC({entityStatus: 'failed', id: todolistId}))
        return rejectWithValue({})
    }

})
export const updateTaskTC = createAsyncThunk('task/update', async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }, {
    dispatch,
    rejectWithValue,
    getState
}) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)
    if (!task) {
        //throw new Error("task not found in the state");
        rejectWithValue('task not found in the state')
    }
    dispatch(setStatusApp({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC({entityStatus: 'loading', id: param.todolistId}))
    if (task) {
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...param.model
        }

        const res = await APITask.updateTask(param.todolistId, param.taskId, apiModel)
        try {
            if (res.data.resultCode === 0) {
                dispatch(setStatusApp({status: "succeeded"}))
                dispatch(changeTodolistEntityStatusAC({entityStatus: 'succeeded', id: param.todolistId}))
                return param
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setStatusApp({status: "failed"}))
                dispatch(changeTodolistEntityStatusAC({entityStatus: 'failed', id: param.todolistId}))
                return rejectWithValue('task not found in the state')

            }
        } catch (e) {
            dispatch(setErrorApp(e))
            dispatch(setStatusApp({status: "failed"}))
            dispatch(changeTodolistEntityStatusAC({entityStatus: 'failed', id: param.todolistId}))
            return rejectWithValue('task not found in the state')
        }
    }
})

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (bilder) => {
        bilder.addCase(addTodolistF.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        bilder.addCase(getTodolistT.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl: any) => {
                state[tl.id] = []
            })
        });
        bilder.addCase(removeTodoListT.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        });
        bilder.addCase(fetchTasks.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.todolistId] = action.payload.tasks
            }
        })
        bilder.addCase(removeTaskT.fulfilled, (state, action) => {
            if (action && action.payload) {
                const tasks = state[action.payload.TodoListId]
                const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            }
        })
        bilder.addCase(addTaskT.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload)
        })
        bilder.addCase(updateTaskTC.fulfilled, ((state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            }
        }))
    }
})
export const TasksReducer = slice.reducer





