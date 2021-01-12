import React, {useCallback} from 'react';
import './App.css';
import TodoList from "./todoList";

import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";

import {Menu} from "@material-ui/icons";
import {
    AddTaskAC,
    ChangeTaskStatusAC,
    ChangeTaskTitleAC,
    RemoveTaskAC,
    TaskStateTask,
    TaskStatuses
} from "./state/TaskReducer";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    FilterType,
    RemoveTodolistAC,
    TodoListDomainType,
} from "./state/todoListsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";


const AppWithReducers = () => {
    const todoList = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateTask>(state => state.tasks)
    const dispatch = useDispatch()
    const deleteTask = useCallback((id: string, todoListId: string) => {
        dispatch(RemoveTaskAC(id, todoListId))
    }, [dispatch])

    const addTask = useCallback((value: string, todoListId: string) => {
        dispatch(AddTaskAC(value, todoListId));
    }, [dispatch])


    const changeTaskStatus = useCallback((id: string, status: TaskStatuses, todoListId: string) => {
        dispatch(ChangeTaskStatusAC(id, status, todoListId))
    }, [dispatch])

    const changeFilter = useCallback((value: FilterType, todoListId: string) => {

        dispatch(ChangeTodolistFilterAC(todoListId, value))

    }, [dispatch])

    const changeTitle = useCallback((value: string, todoListId: string) => {

        dispatch(ChangeTodolistTitleAC(todoListId, value))

    }, [dispatch])

    const changeTaskInput = useCallback((id: string, title: string, todoListId: string) => {
        dispatch(ChangeTaskTitleAC(id, title, todoListId))
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {

        dispatch(RemoveTodolistAC(todoListId));

    }, [dispatch])


    const addTodoList = async (title: string) => {
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
                    <Button color={'inherit'} > login</Button>
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
                                            tasks={tasks[id]}
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

