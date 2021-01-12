import axios from "axios";

const key = "be583272-b0d8-4135-8f53-6b8fcf5092e2";
const configOMB = {
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials:true,
    headers:{
        "API-KEY": key
    }
};

type TodolistType= {
    id: string
    addedDate: string
    order: number
    title: string
}
type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: number
    startDate: string
    status: number
    title: string
    todoListId: string
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
    updateTask: (todoId:string,taskId:string, title:string) => {
        return axiosInstance.put<ResponseType>(`todo-lists/${todoId}/tasks/${taskId}`, {title})
    }

}