

import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todoListsReducer";


const initialState: TaskStateTask = {}
export type ActionType =
    RemoveTaskType |
    AddTaskActionType |
    ChangeTaskStatusActionType |
    ChangeTaskTitleActionType |
    RemoveTodolistActionType |
    AddTodolistActionType

export type TaskStateTask = {

    [key: string] : Array<TaskDomainType>

}
export type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: number
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}
export type TaskDomainType = TaskType & {
    status: TaskStatuses
}
export enum TaskStatuses  {
    New = 0,
    inProgress = 1,
    Completed= 2,
    Draft = 3
}

export type RemoveTaskType = {
    type: 'REMOVE-TASK'
    taskId:string
    TodoListId:string
}
export type AddTaskActionType = {
    type:'ADD-TASK'
    value: string
    TodoListId:string
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskId:string
    status: TaskStatuses
    todoListId:string
}
export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskId:string
    title:string
    todoListId:string
}

export const TasksReducer = (state: TaskStateTask = initialState, action: ActionType):TaskStateTask => {
    switch (action.type) {

        case 'REMOVE-TASK':
            state[action.TodoListId] = state[action.TodoListId].filter(t => t.id !== action.taskId);
            return {...state}
        case 'ADD-TASK':
            let task = {
                id: v1(),
                title: action.value,
                addedDate:'',
                deadline:'',
                description: '',
                order: 6,
                priority: 0,
                startDate: '',
                status: TaskStatuses.New,
                todoListId: action.TodoListId
            };
            let todolistTasks = state[action.TodoListId];
            state[action.TodoListId] = [task, ...todolistTasks];
            return {...state}
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id !== action.taskId
                        ? task
                        : {...task, status: action.status})
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id !== action.taskId
                        ? task
                        : {...task, title: action.title})
            }
        case "REMOVE-TODOLIST":
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        case "ADD-TODOLIST":
            return {...state, [action.todolistId]: []}
        default:
            return state
    }
}


export const RemoveTaskAC = (taskId:string, TodoListId:string): RemoveTaskType => {
    return { type: 'REMOVE-TASK',taskId, TodoListId }
}
export const AddTaskAC = (value: string, TodoListId: string): AddTaskActionType => {
    return { type: "ADD-TASK", value, TodoListId }
}

export const ChangeTaskStatusAC = (taskId:string, status: TaskStatuses, todoListId:string):ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS',taskId, status, todoListId}
}
export const ChangeTaskTitleAC = (taskId:string, title:string, todoListId:string):ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE',taskId, title, todoListId}
}


