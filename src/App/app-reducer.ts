import { authAPI } from "../API/API"
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";



export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    error: null | string
    isInitialized: boolean
}
const initialState: InitialStateType = {
    status: 'loading',
    error: null,
    isInitialized: false
}
const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setStatusApp(state, action: PayloadAction<{status:RequestStatusType}>){
            state.status =  action.payload.status
        },
        setErrorApp(state, action: PayloadAction<{error: null | string}>){
            state.error =  action.payload.error
        },
        setIsInitializedAC(state, action: PayloadAction<{value: boolean}>){
            state.isInitialized =  action.payload.value
        },

    }
})

export const appReducer = slice.reducer
export const {setStatusApp, setErrorApp, setIsInitializedAC}  = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusApp({status:'loading'}))
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value:true}));

        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch(error => {
        dispatch(setErrorApp(error.message))
    })
        .finally(() => {
            dispatch(setStatusApp({status:"succeeded"}))
            dispatch(setIsInitializedAC({value:true}))
        })
}