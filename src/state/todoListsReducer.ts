
import {AppActionType, AppThunk} from "./store";
import {API} from "../API/API";


export type FilterType = 'All' | 'Active' | 'Completed';
export type TodolistType= {
    id: string
    addedDate: string
    order: number
    title: string
}
export type TodoListDomainType = TodolistType & {
    filter: FilterType
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
                filter: 'All'
            }))
        }

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodolist:TodoListDomainType = {
                ...action.todolist,
                filter: 'All'
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
export const getTodolistT = ():AppThunk => (dispatch) => {
    API.getTodoList()
        .then(res => {
            dispatch(setTodolistsAC(res.data))
        })
}
export const removeTodoListT = (todolistId: string):AppThunk => (dispatch) => {

    API.deleteTodoList(todolistId)
        .then((res) => {
            if(res.status === 200){
                dispatch(RemoveTodolistAC(todolistId))
            } else {
                console.log('ErrorEvent')
            }
        })
}
export const ChangeTodolistTitleF = (todolistId: string, title: string):AppThunk => (dispatch) => {
    API.updateTodoList(todolistId, title)
        .then(res => {
            if(res.status === 200){
                dispatch(ChangeTodolistTitleAC(todolistId, title))
            } else {
                console.log('ErrorEvent')
            }
        })
}
export const  AddTodolistF = (title: string):AppThunk => (dispatch) => {
    API.createTodoList(title)
        .then(res => {
            dispatch(AddTodolistAC(res.data.data.item))
        })
}





