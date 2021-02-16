// import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../app/app-reducer';
import { Dispatch } from 'redux';
import { ResponseType } from '../API/API';
import {  setErrorApp, setStatusApp} from "../App/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setErrorApp({error:data.messages[0]}))
    } else {
        dispatch(setErrorApp({error:'Some error occurred'}))
    }
    dispatch(setStatusApp({status:'failed'}))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
    dispatch(setErrorApp({error:error.message}))
    dispatch(setStatusApp({status:'failed'}))
}

