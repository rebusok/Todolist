
import {FilterType,  TodoListType} from '../App'
import {v1} from "uuid";
export type ActionType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType |ChangeTodolistFilterActionType
export const todoListId1 = v1();
export const todoListId2 = v1();

const initialState: Array<TodoListType> = []
export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type:'ADD-TODOLIST'
    title:string
    todolistId: string
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



export const todolistsReducer = (state: Array<TodoListType>=initialState, action: ActionType):Array<TodoListType> => {
    switch (action.type) {

        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':

            const newTodoList: TodoListType = {
                id: action.todolistId,
                title:action.title,
                filter: "All"
            }
            return [...state, newTodoList]
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


export const RemoveTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId}
}
export const AddTodolistAC = (title: string): AddTodolistActionType => {
    return { type: "ADD-TODOLIST",  title:title, todolistId: v1()}
}
export const ChangeTodolistTitleAC = ( todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return { type: "CHANGE-TODOLIST-TITLE", id:todolistId,  title:title}
}
export const ChangeTodolistFilterAC = (todolistId: string, filter: FilterType): ChangeTodolistFilterActionType => {
    return { type: "CHANGE-TODOLIST-FILTER", id:todolistId,  filter:filter}
}

