// import { setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType } from '../app/app-reducer';
import { Dispatch } from 'redux';
import { ResponseType } from '../API/API';
import {SetAppErrorActionType, SetAppStatusActionType, setErrorApp, setStatusApp} from "../App/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorApp(data.messages[0]))
    } else {
        dispatch(setErrorApp('Some error occurred'))
    }
    dispatch(setStatusApp('failed'))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setErrorApp(error.message))
    dispatch(setStatusApp('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorActionType | SetAppStatusActionType>