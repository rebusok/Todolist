import {applyMiddleware, combineReducers, createStore} from 'redux';
import {
    AddTaskActionType,
    ChangeTaskStatusActionType,
    ChangeTaskTitleActionType,
    RemoveTaskType, SetTasksActionType,
    TasksReducer
} from "../features/Task/TaskReducer";
import {
    AddTodolistActionType, ChangeTodolistEntityStatus, ChangeTodolistFilterActionType,
    ChangeTodolistTitleActionType,
    RemoveTodolistActionType, SetTodolistsActionType,
    todolistsReducer
} from "../features/TodoList/todoListsReducer";
import thunk, {ThunkAction} from "redux-thunk";
import {appReducer, SetAppErrorActionType, SetAppInitialActionType, SetAppStatusActionType} from './app-reducer';
import { ActionsTypeAuth, authReducer } from '../features/Login/auth-reducer';


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: TasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store

export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionType =
    ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType
    | RemoveTaskType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | RemoveTodolistActionType
    | AddTodolistActionType
    | SetTasksActionType
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ChangeTodolistEntityStatus
    |SetAppInitialActionType
| ActionsTypeAuth
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    AppRootStateType,
    unknown,
    AppActionType>
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;