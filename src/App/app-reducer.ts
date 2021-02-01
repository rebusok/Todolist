import { authAPI } from "../API/API"
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError} from "../utils/error-utils";



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

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIAL-APP':
            return  {...state, isInitialized: action.value}
        default:
            return state
    }
}
export const setStatusApp = (status:RequestStatusType) => {
    return ({type: 'APP/SET-STATUS', status} as const)
}
export const setErrorApp = (error: null | string) => {
    return({type:'APP/SET-ERROR', error} as const)
}
export  const setIsInitializedAC = (value: boolean) => {
    return({type:'APP/SET-INITIAL-APP', value} as const)
}
export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusApp('loading'))
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));

        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch(error => {
        dispatch(setErrorApp(error.message))
    })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
            dispatch(setIsInitializedAC(true))
        })
}


export type SetAppStatusActionType = ReturnType<typeof setStatusApp>
export type SetAppErrorActionType = ReturnType<typeof setErrorApp>
export type SetAppInitialActionType = ReturnType<typeof setIsInitializedAC>

type ActionsType = any