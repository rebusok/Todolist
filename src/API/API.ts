import axios from "axios";

const key = "be583272-b0d8-4135-8f53-6b8fcf5092e2";
const configOMB = {
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials:true,
    headers:{
        "API-KEY": key
    }
};

const axiosInstance = axios.create(configOMB);

const API = {
    getTodoList: () => {
        return axiosInstance.get('todo-lists')
    },

}