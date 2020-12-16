import React from 'react';
import './App.css';
import TodoList from "./todoList";

import AddItemForm from "./AddItemForm";
import {AppBar, Toolbar, IconButton, Typography, Button, Grid, Container, Paper} from "@material-ui/core";

import {Menu} from "@material-ui/icons";
import {AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC} from "./state/TaskReducer";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
} from "./state/todoListsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStateTask} from "./App";


export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

export type FilterType = 'All' | 'Active' | 'Completed';

export type TodoListType = {
    id: string;
    title: string;
    filter: FilterType
}

const AppWithReducers = () => {




    const todoList = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateTask>(state => state.tasks)
    const dispatch = useDispatch()

    const deleteTask = (id: string, todoListId: string) => {
        dispatch(RemoveTaskAC(id, todoListId))
    }

    const addTask = (value: string, todoListId: string) => {
        dispatch(AddTaskAC(value, todoListId));
    }


    const changeTaskStatus = (id: string, isDone: boolean, todoListId: string) => {
        dispatch(ChangeTaskStatusAC(id, isDone, todoListId))
    }

    const changeFilter = (value: FilterType, todoListId: string) => {

        dispatch(ChangeTodolistFilterAC(todoListId, value))

    }

    const changeTitle = (value: string, todoListId: string) => {

        dispatch(ChangeTodolistTitleAC(todoListId, value))

    }

    const changeTaskInput = (id: string, title: string, todoListId: string) => {
        dispatch(ChangeTaskTitleAC(id, title, todoListId))
    }

    const removeTodoList = (todoListId: string) => {

        dispatch(RemoveTodolistAC(todoListId));

    }

    const filteredTodoList = (arrTodo: Array<TaskType>, filter: FilterType) => {
        switch (filter) {
            case "Active":
                return arrTodo.filter(tl => !tl.isDone)
            case "Completed":
                return arrTodo.filter(tl => tl.isDone)
            default:
                return arrTodo
        }
    }

    const addTodoList = (title: string) => {
        const action = AddTodolistAC(title)
        dispatch(action)



    }

    return (
        <div className="App">
            <AppBar>
                <Toolbar>
                    <IconButton edge='start' color='inherit' aria-label='menu'>
                        <Menu/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        News
                    </Typography>
                    <Button color={'inherit'}> login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{
                    padding: '20px'
                }}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoList.map(({id, title, filter}) => {
                            return (
                                <Grid item key={id}>
                                    <Paper style={{padding: '10px'}}>
                                        <TodoList
                                            key={id}
                                            idTodo={id}
                                            title={title}
                                            tasks={filteredTodoList(tasks[id], filter)}
                                            deleteTask={deleteTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeTaskStatus}
                                            filter={filter}
                                            removeTodoList={removeTodoList}
                                            changeInput={changeTaskInput}
                                            changeTitle={changeTitle}/>
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>


        </div>
    );
};
export default AppWithReducers;

