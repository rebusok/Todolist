import React, {ChangeEvent} from "react";
import {TaskType, FilterType} from './App';
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import DeleteIcon from '@material-ui/icons/Delete';
type PropsType = {
    title: string;
    tasks: Array<TaskType>;
    deleteTask: (id: string, todoListId: string) => void;
    changeFilter: (value: FilterType, todoListId: string) => void;
    addTask: (value: string, todoListId: string) => void;
    changeTaskStatus: (id: string, isDone: boolean, todoListId: string) => void
    filter: FilterType
    idTodo: string
    removeTodoList: (todoListId: string) => void
    changeInput: (id: string, title: string, todoListId: string) => void
    changeTitle: (value: string, todoListId: string) => void;
}


const TodoList = (props: PropsType) => {
    const {tasks,changeInput,changeTitle, filter, removeTodoList, title, deleteTask, changeFilter, addTask, changeTaskStatus, idTodo} = props;
    const addTasks = (value: string) => {
        addTask(value, idTodo)
    }
    const onChangesTitle = (value:string) => {
        changeTitle(value, idTodo)
    }

    const itemsLi = tasks.map(({isDone, title, id}) => {
        const onChangTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
            changeTaskStatus(id, e.currentTarget.checked, idTodo);
        }
        const onChanges = (value:string) => {
            changeInput(id,value, idTodo)
        }

        return (
            <div key={id} className={isDone ? 'is-done' : ''}>
                <Checkbox
                       color='primary'
                       checked={isDone}
                       onChange={onChangTaskStatus}/>
                <EditableSpan value={title} onChanges={onChanges} blured={true}/>
                <IconButton
                    onClick={() => deleteTask(id, idTodo)}>
                    <Delete/>
                </IconButton>
            </div>
        )
    });


    const onChangeAllHandler = () => changeFilter('All', idTodo);
    const onChangeActiveHandler = () => changeFilter('Active', idTodo);
    const onChangeCompletedHandler = () => changeFilter('Completed', idTodo);

    return (
        <div>
            <EditableSpan value={title} onChanges={onChangesTitle} blured={false}/>
            <AddItemForm addItem={addTasks}/>
            <div>
                {itemsLi}
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

                onClick={() => removeTodoList(idTodo)}>
                Remove List
            </Button>
        </div>
    )
};
export default TodoList;