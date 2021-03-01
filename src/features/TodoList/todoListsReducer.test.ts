import {
    FilterType,
    TodoListDomainType,
    todolistsReducer,
    TodolistType,
    ChangeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    getTodolistT, removeTodoListT, addTodolistF, ChangeTodolistTitleF
} from "./todoListsReducer"
import { v1 } from "uuid"
import {RequestStatusType} from "../../App/app-reducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodoListDomainType> = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'All', entityStatus: 'idle', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'All', entityStatus: 'idle', addedDate: '', order: 0}
    ]
})

test('correct todolist should be removed', () => {
    let payload = {todolistId:todolistId1};
    const endState = todolistsReducer(startState, removeTodoListT.fulfilled(payload, 'requeistId', payload))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let todolist: TodolistType = {
        title: 'New Todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }


    let payload = {todolist:todolist};
    const endState = todolistsReducer(startState, addTodolistF.fulfilled(payload, 'requireId', {title:'New Todolist'}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('All')
})

test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist'

    let payload = {id:todolistId2, title:newTodolistTitle};
    const action = ChangeTodolistTitleF.fulfilled(payload, 'reqId', {todolistId:todolistId2, title:newTodolistTitle})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterType = 'Completed'

    const action = ChangeTodolistFilterAC({id:todolistId2, filter:newFilter})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('All')
    expect(endState[1].filter).toBe(newFilter)
})
test('todolists should be added', () => {

    let payload = {todolists:startState};
    const action = getTodolistT.fulfilled(payload, 'requestId')

    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2)
})
test('correct entity status of todolist should be changed', () => {
    let newStatus: RequestStatusType = 'loading'

    const action = changeTodolistEntityStatusAC({id:todolistId2, entityStatus:newStatus})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newStatus)
})



