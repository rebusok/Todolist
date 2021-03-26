import {call, put, takeEvery} from "redux-saga/effects";
import {setErrorApp, setStatusApp} from "../../App/app-reducer";
import {API} from "../../API/API";
import {
    AddTodolistAC,
    changeTodolistEntityStatusAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    setTodolistsAC
} from "./todoListsReducer";
import {handleServerAppErrors} from "../../utils/error-utils";

export function* getTodolistSaga() {
    yield put(setStatusApp("loading"))
    const res = yield call(API.getTodoList)
    try {
        if (res.status === 200) {
            yield put(setTodolistsAC(res.data))
        }
    } catch (e) {
        yield put(setErrorApp(e.message))
    } finally {

        yield put(setStatusApp("succeeded"))
    }
}

export const getTodolist = () => ({type: "TODOLIST/FETCH_TODOLIST"})


export function* removeTodoListSaga(action: ReturnType<typeof removeTodoList>) {
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    yield put(setStatusApp("loading"))
    const res = yield call(API.deleteTodoList, action.todolistId)
    try {
        if (res.data.resultCode === 0) {
            yield put(RemoveTodolistAC(action.todolistId))
        } else {
            handleServerAppErrors(res.data, put)
        }
    } catch (e) {
        yield put(setErrorApp(e.message))
    } finally {
        yield put(setStatusApp("succeeded"))
        yield put(changeTodolistEntityStatusAC(action.todolistId, 'failed'))
    }


}

export const removeTodoList = (todolistId: string) => ({type: "TODOLIST/REMOVE_TODOLIST", todolistId})

export function* ChangeTodolistTitleSaga(action: ReturnType<typeof ChangeTodolistTitle>) {
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    yield put(setStatusApp("loading"))
    const res = yield call(API.updateTodoList, action.todolistId, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(ChangeTodolistTitleAC(action.todolistId, action.title))
        } else {
            handleServerAppErrors(res.data, put)
        }
    } catch (e) {
        yield put(setErrorApp(e.message))
    } finally {
        yield put(setStatusApp("succeeded"))
        yield put(changeTodolistEntityStatusAC(action.todolistId, 'failed'))
    }
}

export const ChangeTodolistTitle = (todolistId: string, title: string) => ({
    type: "TODOLIST/CHANGE_TODOLIST_TITLE",
    title,
    todolistId
})


export function* AddTodolistSaga(action: ReturnType<typeof AddTodolist>) {
    yield put(setStatusApp("loading"))
    const res = yield call(API.createTodoList, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(AddTodolistAC(res.data.data.item))
        } else {
            handleServerAppErrors(res.data, put)
        }
    } catch (e) {
        yield put(setErrorApp(e.message))
    } finally {
        yield put(setStatusApp("succeeded"))
    }
}

export const AddTodolist = (title: string) => ({type: "TODOLIST/ADD_TODOLIST", title})

export function* todoListWatcherSaga() {
    yield takeEvery("TODOLIST/FETCH_TODOLIST", getTodolistSaga)
    yield takeEvery("TODOLIST/REMOVE_TODOLIST", removeTodoListSaga)
    yield takeEvery("TODOLIST/CHANGE_TODOLIST_TITLE", ChangeTodolistTitleSaga)
    yield takeEvery("TODOLIST/ADD_TODOLIST", AddTodolistSaga)
}