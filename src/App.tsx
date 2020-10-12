import React from 'react';
import './App.css';
import TodoList from "./todoList";


export type TaskType = {
    id: number;
    title: string;
    isDone: boolean;
}
const App = () =>{

    const task1 = [
        {id: 1, title: 'HTML&CSS', isDone: true},
        {id: 2, title: 'JS', isDone: true},
        {id: 3, title: 'RaectJS', isDone: false}

    ];
    const task2 = [
        {id: 1, title: 'Hello Word', isDone: true},
        {id: 2, title: 'I am Happy', isDone: false},
        {id: 3, title: 'Yo', isDone: false}

    ];
    return (
        <div className="App">
            <TodoList title={'What to learn'} tasks={task1}/>
            <TodoList title={'Songs'} tasks={task2}/>

        </div>
    );
};
export  default  App;

