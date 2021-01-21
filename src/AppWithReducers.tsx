import React, {useCallback, useEffect} from 'react';
import './App.css';
import TodoList from "./todoList";

import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";

import {Menu} from "@material-ui/icons";
import {TaskStateTask} from "./state/TaskReducer";
import {
    AddTodolistF,
    ChangeTodolistFilterAC,
    FilterType,
    getTodolistT,
    TodoListDomainType,
} from "./state/todoListsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";


const AppWithReducers = () => {
    const todoList = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateTask>(state => state.tasks)
    const dispatch = useDispatch()
    const stableDispatch = useCallback(dispatch, [])
    useEffect(() =>{
        stableDispatch(getTodolistT())
    }, [stableDispatch])


    const changeFilter = useCallback((value: FilterType, todoListId: string) => {

        dispatch(ChangeTodolistFilterAC(todoListId, value))

    }, [dispatch])






    const addTodoList = (title: string) => {
        dispatch(AddTodolistF(title))
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
                                            changeFilter={changeFilter}
                                            filter={filter}
                                            />
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

