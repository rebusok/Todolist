//sagas
import {call, put, select, takeEvery} from "redux-saga/effects";
import {setErrorApp, setStatusApp} from "../../App/app-reducer";
import {AxiosResponse} from "axios";
import {APITask, getTasksResponse, ResponseType} from "../../API/API";
import {changeTodolistEntityStatusAC} from "../TodoList/todoListsReducer";
import {
    AddTaskAC,
    ChangeTaskStatusAC,
    ChangeTaskTitleAC,
    RemoveTaskAC,
    setTasksAC,
    TaskStatuses,
    TaskType
} from "./TaskReducer";
import {handleServerAppErrors} from "../../utils/error-utils";
import {selectTasks} from "../../App/selectors";


export function* getTaskTodoSaga(action: ReturnType<typeof getTaskTodo>) {
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


export function* addTaskSaga(action: ReturnType<typeof addTask>) {
    yield put(setStatusApp("loading"))
    yield put(changeTodolistEntityStatusAC(action.todoListId, 'loading'))
    const res = yield call(APITask.createTask, action.todoListId, action.title)
    try {
        if (res.data.resultCode === 0) {
            yield put(AddTaskAC(res.data.data.item, action.todoListId))
        } else {
            handleServerAppErrors(res.data, put)
        }
    } catch (e) {
        yield put(setErrorApp(e.message))
    } finally {
        yield put(setStatusApp("succeeded"))
        yield put(changeTodolistEntityStatusAC(action.todoListId, 'failed'))
    }
}

export const addTask = (todoListId: string, title: string) => ({type: "TASKS/ADD_TASK", title, todoListId})

export function* updateTaskStatusSaga(action: ReturnType<typeof updateTaskStatus>) {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком  // чтобы у неё отобрать остальные св-ва
    const allTasksFromState = yield select(selectTasks);
    const tasksForCurrentTodolist = allTasksFromState[action.todoListId]
    const task = tasksForCurrentTodolist.find((t:TaskType) => {
        return t.id === action.taskId
    })
    yield put(setStatusApp("loading"))
    yield put(changeTodolistEntityStatusAC(action.todoListId, 'loading'))
    if (task) {
        const res = yield call(APITask.updateTask, action.todoListId, action.taskId, {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: action.status
        })
        try {
            if (res.data.resultCode === 0) {
                yield put(ChangeTaskStatusAC(action.taskId, action.status, action.todoListId))
                yield put(changeTodolistEntityStatusAC(action.todoListId, 'failed'))
            } else {
                handleServerAppErrors(res.data, put)
            }
        } catch (e) {
            yield  put(setErrorApp(e.message))
        } finally {
            yield put(setStatusApp("succeeded"))
            yield put(changeTodolistEntityStatusAC(action.todoListId, 'failed'))
        }
    }
}

export const updateTaskStatus = (taskId: string, todoListId: string, status: TaskStatuses) => ({
    type: "TASKS/UPDATE_TASK_STATUS",
    taskId,
    todoListId,
    status
})
export function* ChangeTaskTitleSaga (action: ReturnType<typeof ChangeTaskTitle>) {
    const allTasksFromStates = yield select(selectTasks);
    const tasksForCurrentTodolist = allTasksFromStates[action.todoListId]
    const task = tasksForCurrentTodolist.find((t:TaskType) => {
        return t.id === action.taskId
    })
    yield put(setStatusApp("loading"))
    yield put(changeTodolistEntityStatusAC(action.todoListId, 'loading'))
    if (task) {
        const res = yield call(APITask.updateTask, action.todoListId, action.taskId, {
            title: action.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status
        })
        try {
            if (res.data.resultCode === 0) {
                yield put(ChangeTaskTitleAC(action.taskId, action.title, action.todoListId))
            } else {
                handleServerAppErrors(res.data, put)
            }
        } catch (e) {
            yield  put(setErrorApp(e.message))
        } finally {
            yield put(setStatusApp("succeeded"))
            yield put(changeTodolistEntityStatusAC(action.todoListId, 'failed'))
        }
    }
}
export const ChangeTaskTitle = (taskId: string, title: string, todoListId: string) => ({
    type: "TASKS/UPDATE_TASK_TITLE",
    taskId,
    todoListId,
    title
})
export function* tasksWatcherSaga() {
    yield takeEvery('TASKS/FETCH_TASKS', getTaskTodoSaga)
    yield takeEvery('TASKS/REMOVE_TASKS', removeTaskSaga)
    yield takeEvery('TASKS/ADD_TASK', addTaskSaga)
    yield takeEvery('TASKS/UPDATE_TASK_STATUS', updateTaskStatusSaga)
    yield takeEvery('TASKS/UPDATE_TASK_TITLE', ChangeTaskTitleSaga)

}