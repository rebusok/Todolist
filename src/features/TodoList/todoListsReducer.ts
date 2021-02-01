
import {AppActionType, AppThunk} from "../../App/store";
import {API} from "../../API/API";
import {RequestStatusType, setErrorApp, setStatusApp} from "../../App/app-reducer";
import { handleServerAppError } from "../../utils/error-utils";


export type FilterType = 'All' | 'Active' | 'Completed';
export type TodolistType= {
    id: string
    addedDate: string
    order: number
    title: string
}
export type TodoListDomainType = TodolistType & {
    filter: FilterType
    entityStatus: RequestStatusType
}

const initialState: Array<TodoListDomainType> = []
export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type:'ADD-TODOLIST'
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title:string
}
export type ChangeTodolistFilterActionType = {
    type:'CHANGE-TODOLIST-FILTER'
    id: string
    filter:FilterType
}



export const todolistsReducer = (state: Array<TodoListDomainType>=initialState, action: AppActionType):Array<TodoListDomainType> => {
    switch (action.type) {
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({
                ...tl,
                filter: 'All',
                entityStatus:"idle"
            }))
        }

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodolist:TodoListDomainType = {
                ...action.todolist,
                filter: 'All',
                entityStatus:"idle"
            }
            return [...state, newTodolist]
        case 'CHANGE-TODOLIST-TITLE':

            return [...state.map(tl => tl.id !== action.id
                ? tl
                : {...tl, title: action.title})
            ]
        case 'CHANGE-TODOLIST-FILTER':

            return [...state.map(tl => tl.id !== action.id
                ? tl
                : {...tl, filter: action.filter})
            ]
        case'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id
            ? {...tl, entityStatus:action.entityStatus}
            : tl)
        default:
            return state
    }
}
export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {type: 'SET-TODOLISTS', todolists}
}

export const RemoveTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId}
}
export const AddTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return { type: "ADD-TODOLIST",  todolist}
}
export const ChangeTodolistTitleAC = ( todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return { type: "CHANGE-TODOLIST-TITLE", id:todolistId,  title:title}
}
export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterType): ChangeTodolistFilterActionType => {
    return { type: "CHANGE-TODOLIST-FILTER", id:todolistId,  filter:filter}
}
export const changeTodolistEntityStatusAC = (id:string, entityStatus:RequestStatusType) => {
    return ({
        type: 'CHANGE-TODOLIST-ENTITY-STATUS',
        id,
        entityStatus
    } as const)
}

export type ChangeTodolistEntityStatus = ReturnType<typeof changeTodolistEntityStatusAC>
export const getTodolistT = ():AppThunk => (dispatch) => {
    dispatch(setStatusApp("loading"))
    API.getTodoList()
        .then(res => {
            if (res.status === 200) {
                dispatch(setTodolistsAC(res.data))
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
        })
}
export const removeTodoListT = (todolistId: string):AppThunk => (dispatch) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    dispatch(setStatusApp("loading"))
    API.deleteTodoList(todolistId)
        .then((res) => {
            if(res.data.resultCode === 0){
                dispatch(RemoveTodolistAC(todolistId))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
        })
}
export const ChangeTodolistTitleF = (todolistId: string, title: string):AppThunk => (dispatch) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    dispatch(setStatusApp("loading"))
    API.updateTodoList(todolistId, title)
        .then(res => {
            if(res.data.resultCode === 0){
                dispatch(ChangeTodolistTitleAC(todolistId, title))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            dispatch(setErrorApp(error.message))
        })
        .finally(() => {
            dispatch(setStatusApp("succeeded"))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
        })
}
export const  AddTodolistF = (title: string):AppThunk => (dispatch) => {
    dispatch(setStatusApp("loading"))
    API.createTodoList(title)
        .then(res => {
            if(res.data.resultCode === 0){
                dispatch(AddTodolistAC(res.data.data.item))
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





