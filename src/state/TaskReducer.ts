
import {TaskStateTask} from '../App'
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, todoListId1, todoListId2} from "./todoListsReducer";


const initialState: TaskStateTask = {
    [todoListId1]: [
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'ReactJS', isDone: false},
        {id: v1(), title: 'Rest Api', isDone: false},
        {id: v1(), title: 'GraphQL', isDone: false}
    ],
    [todoListId2]: [
        {id: v1(), title: 'dog', isDone: true},
        {id: v1(), title: 'cat', isDone: true},
        {id: v1(), title: 'rabbit', isDone: false},
        {id: v1(), title: 'Rest Api', isDone: false},
        {id: v1(), title: 'GraphQL', isDone: false}
    ]
}
export type ActionType =
    RemoveTaskType |
    AddTaskActionType |
    ChangeTaskStatusActionType |
    ChangeTaskTitleActionType |
    RemoveTodolistActionType |
    AddTodolistActionType

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
    isDone:boolean
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
            let task = {id: v1(), title: action.value, isDone: false};
            let todolistTasks = state[action.TodoListId];
            state[action.TodoListId] = [task, ...todolistTasks];
            return {...state}
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(task => task.id !== action.taskId
                        ? task
                        : {...task, isDone: action.isDone})
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

export const ChangeTaskStatusAC = (taskId:string, isDone:boolean, todoListId:string):ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS',taskId, isDone, todoListId}
}
export const ChangeTaskTitleAC = (taskId:string, title:string, todoListId:string):ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE',taskId, title, todoListId}
}


