import {call, put, takeEvery} from "redux-saga/effects";
import {authAPI} from "../API/API";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {setErrorApp, setIsInitializedAC, setStatusApp} from "./app-reducer";

export function* initializeAppSaga() {
    const res = yield call(authAPI.me)
    yield put(setStatusApp('loading'))
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(true));
        } else {

        }
    } catch (e) {
        yield put(setErrorApp(e.message))
    } finally {
        yield  put(setStatusApp("succeeded"))
        yield  put(setIsInitializedAC(true))
    }
}

export const initializeApp = () => {
    return {type: 'APP/SET-INITIALS-APP'}
}
export function* appWatcherSaga() {
    yield takeEvery('APP/SET-INITIALS-APP', initializeAppSaga)

}