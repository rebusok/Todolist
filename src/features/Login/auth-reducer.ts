import {Dispatch} from 'redux'
import {setErrorApp, setStatusApp} from "../../App/app-reducer";
import {AppActionType} from "../../App/store";
import {authAPI} from '../../API/API';
import {handleServerAppError} from "../../utils/error-utils";


const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AppActionType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: any) => (dispatch: Dispatch<AppActionType>) => {
    dispatch(setStatusApp('loading'))
    authAPI.login(data)
        .then(res => {
            console.log(res)
            if(res.data.resultCode === 0){
                dispatch(setIsLoggedInAC(true))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
        })
}
export const logoutTC = () => (dispatch: Dispatch<AppActionType>) => {
    dispatch(setStatusApp('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setStatusApp('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            dispatch(setErrorApp(error.message))
        })
}


// types
export type ActionsTypeAuth = ReturnType<typeof setIsLoggedInAC>