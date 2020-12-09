
import {FilterType, TodoListType} from '../App'
import {v1} from "uuid";
export type ActionType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType |ChangeTodolistFilterActionType

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



export const todolistsReducer = (state: Array<TodoListType>, action: ActionType) => {
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
            let todolist1 = state.find(tl => tl.id === action.id);
            if(todolist1){
                todolist1.title = action.title;
                return [...state]
            }
            return state
        case 'CHANGE-TODOLIST-FILTER':
            let todolist = state.find(tl => tl.id === action.id);
            if(todolist){
                todolist.filter = action.filter;
                return [...state]
            }
            return state
        default:
            throw new Error("I don't understand this type")
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

