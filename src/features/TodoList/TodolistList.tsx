import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemForm";
import TodoList from "./todoList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../App/store";
import {AddTodolistF, ChangeTodolistFilterAC, FilterType, getTodolistT, TodoListDomainType} from "./todoListsReducer";
import {TaskStateTask} from "../Task/TaskReducer";
import {Redirect} from "react-router-dom";

const TodolistList = () => {
    const todoList = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateTask>(state => state.tasks)
    const isLoggenIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    const stableDispatch = useCallback(dispatch, [])
    useEffect(() =>{
        if (!isLoggenIn) {
            return
        }
        stableDispatch(getTodolistT())
    }, [stableDispatch, isLoggenIn])
    const changeFilter = useCallback((value: FilterType, todoListId: string) => {

        stableDispatch(ChangeTodolistFilterAC({id:todoListId, filter:value}))

    }, [stableDispatch])




    const addTodoList = (title: string) => {
        dispatch(AddTodolistF(title))
    }
    if (!isLoggenIn) {
        return <Redirect to={'/login'}/>
    }
    return (
        <>
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
        </>
    );
};

export default TodolistList;