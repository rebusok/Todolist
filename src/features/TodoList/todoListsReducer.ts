import {AppThunk} from "../../App/store";
import {API} from "../../API/API";
import {RequestStatusType, setErrorApp, setStatusApp} from "../../App/app-reducer";
import {handleServerAppError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type FilterType = 'All' | 'Active' | 'Completed';
export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
export type TodoListDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

const initialState: Array<TodoListDomainType> = []


const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            console.log(action)
           return  action.payload.todolists.map(tl => ({...tl, filter: 'All', entityStatus: "idle"}))
        },
        RemoveTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
            // return state.filter(tl => tl.id !== action.payload.id)
        },
        AddTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'All', entityStatus:'idle'})

        },
        ChangeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        ChangeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    }
})

export const todolistsReducer = slice.reducer
export const {
    AddTodolistAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC
} = slice.actions

export const getTodolistT = (): AppThunk => (dispatch) => {
    dispatch(setStatusApp({status: "loading"}))
    API.getTodoList()
        .then(res => {
            if (res.status === 200) {
                console.log(res)
                dispatch(setTodolistsAC({todolists: res.data}))
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp({status: "succeeded"}))
        })
}
export const removeTodoListT = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(changeTodolistEntityStatusAC({entityStatus: "loading", id: todolistId}))
    dispatch(setStatusApp({status: "loading"}))
    API.deleteTodoList(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "failed"}))
                dispatch(RemoveTodolistAC({id: todolistId}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp({status: "succeeded"}))

        })
}
export const ChangeTodolistTitleF = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "loading"}))
    dispatch(setStatusApp({status: "loading"}))
    API.updateTodoList(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(ChangeTodolistTitleAC({id: todolistId, title}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp({error: error.message}))
        })
        .finally(() => {
            dispatch(setStatusApp({status: "succeeded"}))
            dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "failed"}))
        })
}
export const AddTodolistF = (title: string): AppThunk => (dispatch) => {
    dispatch(setStatusApp({status: "loading"}))
    API.createTodoList(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(AddTodolistAC({todolist: res.data.data.item}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp({error: error.message}))
        })
        .finally(() => {
            dispatch(setStatusApp({status: "succeeded"}))
        })
}





