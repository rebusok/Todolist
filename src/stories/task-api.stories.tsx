import React, {useEffect, useState} from 'react'
import {APITask} from "../API/API";


export default {
    title: 'API'
}
const todoId = 'a6d86e13-d5ee-42b0-bf09-ca8d988e7f8d'
export const GetTask = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        APITask.getTask(todoId).then(res => {
            console.log(res)
            setState(res.data.items)
        })


    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        APITask.createTask(todoId, 'NewTaskTest').then(res => {
            console.log(res)
            setState(res.data)
        })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const taskId = "75faa54c-2af7-4c37-8862-f597694980e2"
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
    APITask.deleteTask(todoId,taskId).then(res => {
        console.log(res)
        setState(res.data)
    })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTask= () => {
    const [state, setState] = useState<any>(null)
    const taskId = 'a275bc59-ee36-4ffd-9efc-963b01f01a30'
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
    APITask.updateTask(todoId,taskId,'REACT').then(res => {
        console.log(res)
        setState(res.data)
    })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
