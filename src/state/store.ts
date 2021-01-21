import {applyMiddleware, combineReducers, createStore} from 'redux';
import {
    AddTaskActionType,
    ChangeTaskStatusActionType,
    ChangeTaskTitleActionType,
    RemoveTaskType, SetTasksActionType,
    TasksReducer
} from "./TaskReducer";
import {
    AddTodolistActionType, ChangeTodolistFilterActionType,
    ChangeTodolistTitleActionType,
    RemoveTodolistActionType, SetTodolistsActionType,
    todolistsReducer
} from "./todoListsReducer";
import thunk, {ThunkAction} from "redux-thunk";


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: TasksReducer,
    todolists: todolistsReducer
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
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    AppRootStateType,
    unknown,
    AppActionType>
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;