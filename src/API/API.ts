import axios from "axios";
import { TodolistType } from "../state/todoListsReducer";
import { TaskType } from "../state/TaskReducer";

const key = "34263072-624d-43a5-8a5f-75afa7ad4af4";
const configOMB = {
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials:true,
    headers:{
        "API-KEY": key
    }
};


type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}



const axiosInstance = axios.create(configOMB);

export const API = {
    getTodoList: () => {
        return axiosInstance.get<Array<TodolistType>>('todo-lists')
    },
    createTodoList: (title:string) => {
        return axiosInstance.post<ResponseType<{item:TodolistType}>>('todo-lists', {title})
    },
    deleteTodoList: (todoId:string) => {
        return axiosInstance.delete<ResponseType>(`todo-lists/${todoId}`)
    },
    updateTodoList: (todoId:string, title:string) => {
        return axiosInstance.put<ResponseType>(`todo-lists/${todoId}`, {title})
    }

}

export const APITask = {
    getTask: (todoId:string) => {
        return axiosInstance.get<{items: Array<TaskType>}>(`todo-lists/${todoId}/tasks`)
    },
    createTask: (todoId:string,title:string) => {
        return axiosInstance.post<ResponseType<{item:TaskType}>>(`todo-lists/${todoId}/tasks`, {title})
    },
    deleteTask: (todoId:string, taskId:string) => {
        return axiosInstance.delete<ResponseType>(`todo-lists/${todoId}/tasks/${taskId}`)
    },
    updateTask: (todoId:string,taskId:string, model: UpdateTaskModelType) => {
        return axiosInstance.put<ResponseType<TaskType>>(`todo-lists/${todoId}/tasks/${taskId}`, model)
    }

}