import {Dispatch} from 'redux'
import {setErrorApp, setStatusApp} from "../../App/app-reducer";
import {authAPI} from '../../API/API';
import {handleServerAppError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value:boolean}>){
            state.isLoggedIn =  action.payload.value
        }
    }
})


export const authReducer = slice.reducer
export const {setIsLoggedInAC}  = slice.actions

// thunks
export const loginTC = (data: any) => (dispatch: Dispatch) => {
    dispatch(setStatusApp({status:'loading'}))
    authAPI.login(data)
        .then(res => {
            console.log(res)
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:true}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp({status:"succeeded"}))
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setStatusApp({status:'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:false}))
                dispatch(setStatusApp({status:'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            dispatch(setErrorApp(error.message))
        })
}