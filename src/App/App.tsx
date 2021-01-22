import React, {useCallback, useEffect} from 'react';
import './App.css';
import TodoList from "../features/todoList";

import AddItemForm from "../components/AddItemForm";
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Toolbar,
    Typography
} from "@material-ui/core";

import {Menu} from "@material-ui/icons";
import {TaskStateTask} from "../features/TaskReducer";
import {
    AddTodolistF,
    ChangeTodolistFilterAC,
    FilterType,
    getTodolistT,
    TodoListDomainType,
} from "../features/todoListsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {RequestStatusType} from "./app-reducer";


const App = () => {
    const todoList = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateTask>(state => state.tasks)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

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
                {status === "loading" && <LinearProgress color={"secondary"}/>}
            </AppBar>

            <Container fixed>
                <Grid container style={{
                    padding: '20px'
                }}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoList.map(({id, title, filter, entityStatus}) => {
                            return (
                                <Grid item key={id}>
                                    <Paper style={{padding: '10px'}}>
                                        <TodoList
                                            key={id}
                                            idTodo={id}
                                            title={title}
                                            tasks={tasks[id]}
                                            entityStatus={entityStatus}
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
export default App;

