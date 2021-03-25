//sagas
import {call, put, takeEvery} from "redux-saga/effects";
import {setErrorApp, setStatusApp} from "../../App/app-reducer";
import {AxiosResponse} from "axios";
import {APITask, getTasksResponse, ResponseType} from "../../API/API";
import {changeTodolistEntityStatusAC} from "../TodoList/todoListsReducer";
import {AddTaskAC, RemoveTaskAC, setTasksAC} from "./TaskReducer";
import {handleServerAppErrors} from "../../utils/error-utils";

export function* getTaskTodoSaga(action: ReturnType<typeof getTaskTodo>) {
    console.log('reredasd')
    const res: AxiosResponse<getTasksResponse> = yield call(APITask.getTask, action.todoListId)
    yield put(setStatusApp("loading"))
    try {
        if (res.status === 200) {
            yield put(setTasksAC(res.data.items, action.todoListId))
        }
    } catch (e) {
        yield   put(setErrorApp(e.message))
    } finally {
        yield put(setStatusApp("succeeded"))
    }
}
export const getTaskTodo = (todoListId: string) => {
    console.log(todoListId)
    return {type: 'TASKS/FETCH_TASKS', todoListId}
}


export function* removeTaskSaga(action: ReturnType<typeof removeTask>) {
    yield  put(setStatusApp("loading"))
    yield put(changeTodolistEntityStatusAC(action.todoListId, 'loading'))
    const res: AxiosResponse<ResponseType> = yield  call(APITask.deleteTask, action.todoListId, action.taskId)
    try {
        if (res.data.resultCode === 0) {
            yield put(RemoveTaskAC(action.taskId, action.todoListId))
        }
    } catch (e) {
        yield put(setErrorApp(e.message))
    } finally {
        yield put(setStatusApp("succeeded"))
        yield put(changeTodolistEntityStatusAC(action.todoListId, 'failed'))
    }
}
export const removeTask = (taskId: string, todoListId: string) => ({type: "TASKS/REMOVE_TASKS", taskId, todoListId})



export function* addTaskSaga (action: ReturnType<typeof addTask>){
     yield put(setStatusApp("loading"))
     yield put(changeTodolistEntityStatusAC(action.todoListId, 'loading'))
     const res = yield call(APITask.createTask, action.todoListId, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(AddTaskAC(res.data.data.item, action.todoListId))
        } else {
            handleServerAppErrors(res.data, put)
        }
    }catch (e) {
        yield put(setErrorApp(e.message))
    }finally {
        yield put(setStatusApp("succeeded"))
        yield put(changeTodolistEntityStatusAC(action.todoListId, 'failed'))
    }
}
export const addTask = (todoListId: string, title: string) => ({type: "TASKS/ADD_TASK", title, todoListId})

export function* tasksWatcherSaga() {
    yield takeEvery('TASKS/FETCH_TASKS', getTaskTodoSaga)
    yield takeEvery('TASKS/REMOVE_TASKS', removeTaskSaga)
    yield takeEvery('TASKS/ADD_TASK', addTaskSaga)

}