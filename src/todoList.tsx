import React from "react";
import { TaskType } from './App';


type PropsType = {
    title: string;
    tasks: Array<TaskType>;
}



const TodoList  = ({tasks, title}: PropsType) => {


    const itemsLi = tasks.map(({isDone, title}) => {
        return(
            <li><input type="checkbox" checked={isDone}/> <span>{title}</span></li>
        )
    });

    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {itemsLi}
            </ul>
            <div>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    )
};
export  default  TodoList;