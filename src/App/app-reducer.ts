import {authAPI} from "../API/API"
import {handleServerAppError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    error: null | string
    isInitialized: boolean
}
export const initializeAppTC = createAsyncThunk('app/initial', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setStatusApp({status: 'loading'}))
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setStatusApp({status: 'succeeded'}))
            dispatch(setIsLoggedInAC({value:true}))
            return
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setStatusApp({status: 'failed'}))
            return rejectWithValue({})
        }
    } catch (e) {
        dispatch(setErrorApp(e.message))
        dispatch(setStatusApp({status: 'failed'}))
        return rejectWithValue({})
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'loading',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setStatusApp(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setErrorApp(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state ) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer
export const {setStatusApp, setErrorApp} = slice.actions

