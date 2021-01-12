import React, {useCallback} from "react";

import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import Task from "./Task";
import {TaskDomainType, TaskStatuses} from "./state/TaskReducer";
import {FilterType} from "./state/todoListsReducer";

type PropsType = {
    title: string;
    tasks: Array<TaskDomainType>;
    deleteTask: (id: string, todoListId: string) => void;
    changeFilter: (value: FilterType, todoListId: string) => void;
    addTask: (value: string, todoListId: string) => void;
    changeTaskStatus: (id: string, status: TaskStatuses, todoListId: string) => void
    filter: FilterType
    idTodo: string
    removeTodoList: (todoListId: string) => void
    changeInput: (id: string, title: string, todoListId: string) => void
    changeTitle: (value: string, todoListId: string) => void;
}


const TodoList = React.memo((props: PropsType) => {
    console.log("Todolist called")
    const {tasks,changeInput,changeTitle, filter, removeTodoList, title, deleteTask, changeFilter, addTask, changeTaskStatus, idTodo} = props;
    const addTasks = useCallback((value: string) => {
        addTask(value, idTodo)
    },[addTask, idTodo])
    const onChangesTitle = useCallback((value:string) => {
        changeTitle(value, idTodo)
    },[changeTitle, idTodo])
    const onRemoveHandler = useCallback(() => {
        removeTodoList(idTodo)
    },[removeTodoList, idTodo])



    let filteredTodoList = tasks;
    if(filter === 'Active'){
        filteredTodoList = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if(filter === 'Completed'){
        filteredTodoList = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    const onChangTaskStatus = useCallback((id:string,status: TaskStatuses) => {
        changeTaskStatus(id, status, idTodo);
    }, [changeTaskStatus, idTodo])
    const onChanges = useCallback((id:string,title:string) => {
        changeInput(id,title, idTodo)
    },[changeInput,idTodo])
    const onDeleteHandler = useCallback((id:string) => {
        deleteTask(id, idTodo)
    }, [deleteTask,  idTodo])



    const onChangeAllHandler = () => changeFilter('All', idTodo);
    const onChangeActiveHandler = () => changeFilter('Active', idTodo);
    const onChangeCompletedHandler = () => changeFilter('Completed', idTodo);

    return (
        <div>
            <EditableSpan value={title} onChanges={onChangesTitle} blured={false}/>
            <AddItemForm addItem={addTasks}/>
            <div>
                {
                    filteredTodoList.map(t => {
                        return (
                            <Task task={t} onChangTaskStatus={onChangTaskStatus} onChanges={onChanges} onDeleteHandler={onDeleteHandler} key={t.id}/>
                        )
                    })
                }
            </div>
            <div className={'btn_remove'}>
                <Button

                    variant={filter === 'All' ? 'outlined' : 'text'}
                    onClick={onChangeAllHandler}>All
                </Button>
                <Button
                    variant={filter === 'Active' ? 'outlined' : 'text'}
                    color={'primary'}
                    onClick={onChangeActiveHandler}>Active
                </Button>
                <Button
                    color={'secondary'}
                    variant={filter === 'Completed' ? 'outlined' : 'text'}
                    onClick={onChangeCompletedHandler}>Completed

                </Button>
            </div>
            <Button
                variant='contained'
                color='secondary'
                startIcon={<DeleteIcon/>}

                onClick={onRemoveHandler}>
                Remove List
            </Button>
        </div>
    )
});
export default TodoList;