import {API} from "../../API/API";
import {RequestStatusType, setErrorApp, setStatusApp} from "../../App/app-reducer";
import {handleServerAppError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


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

export const getTodolistT = createAsyncThunk('todolists/getTodo', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setStatusApp({status: "loading"}))
    const res = await API.getTodoList()
    try {
        if (res.status === 200) {
            dispatch(setStatusApp({status: "succeeded"}))
            return {todolists: res.data}
        } else {
            dispatch(setStatusApp({status: "failed"}))
            return rejectWithValue({})
        }
    } catch (e) {
        dispatch(setErrorApp(e.message))
        dispatch(setStatusApp({status: "failed"}))
        return rejectWithValue({})
    }
})
export const addTodolistF = createAsyncThunk('todolists/addTodoList', async (param:{title: string}, {dispatch, rejectWithValue}) => {
    dispatch(setStatusApp({status: "loading"}))
    const res = await API.createTodoList(param.title)
    try {
        if (res.status === 200) {
            dispatch(setStatusApp({status: "succeeded"}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setStatusApp({status: "failed"}))
            return rejectWithValue({})
        }
    } catch (e) {
        dispatch(setErrorApp(e.message))
        dispatch(setStatusApp({status: "failed"}))
        return rejectWithValue({})
    }
})
export const ChangeTodolistTitleF = createAsyncThunk('todolists/changeTodoTitle', async (param:{todolistId: string, title: string}, {dispatch, rejectWithValue}) => {
    dispatch(setStatusApp({status: "loading"}))
    const {todolistId, title} = param
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "loading"}))
    const res = await API.updateTodoList(todolistId, title)
    try {
        if (res.status === 200) {
            dispatch(setStatusApp({status: "succeeded"}))
            return {id: todolistId, title}
        } else {
            dispatch(setStatusApp({status: "failed"}))
            dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "failed"}))
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e) {
        dispatch(setErrorApp(e.message))
        dispatch(setStatusApp({status: "failed"}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: "failed"}))
        return rejectWithValue({})
    }
})

export const removeTodoListT = createAsyncThunk('todolists/removeTodo', async (param:{todolistId: string}, {dispatch, rejectWithValue}) => {
    dispatch(changeTodolistEntityStatusAC({entityStatus: "loading", id: param.todolistId}))
    dispatch(setStatusApp({status: "loading"}))
   const res = await API.deleteTodoList(param.todolistId)
       try {
           if (res.data.resultCode === 0) {
               dispatch(changeTodolistEntityStatusAC({id: param.todolistId, entityStatus: "failed"}))
               dispatch(setStatusApp({status: "succeeded"}))
               return {todolistId: param.todolistId}
           } else {
               handleServerAppError(res.data, dispatch)
               dispatch(setStatusApp({status: "failed"}))
              return  rejectWithValue(null)
           }
       }catch(e) {
           dispatch(setErrorApp(e.message))
           dispatch(setStatusApp({status: "failed"}))
           return  rejectWithValue(null)
       }

})

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodoListDomainType>,
    reducers: {
        ChangeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: builder => {
        builder.addCase(getTodolistT.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'All', entityStatus: "idle"}))
        })
        builder.addCase(removeTodoListT.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        })
        builder.addCase(addTodolistF.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'All', entityStatus: 'idle'})
        })
        builder.addCase(ChangeTodolistTitleF.fulfilled,(state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistEntityStatusAC,
    ChangeTodolistFilterAC,
} = slice.actions









