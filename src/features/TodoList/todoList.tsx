import React, {useCallback, useEffect} from "react";

import AddItemForm from "../../components/AddItemForm";
import EditableSpan from "../../components/EditableSpan";
import {Button} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import Task from "../Task/Task";
import {
    ChangeTaskTitleF,
    TaskDomainType,
    TaskStatuses,
    updateTaskStatusTC
} from "../Task/TaskReducer";
import {ChangeTodolistTitleF, FilterType, removeTodoListT} from "./todoListsReducer";
import {useDispatch} from "react-redux";
import {RequestStatusType} from "../../App/app-reducer";
import {getTaskTodo, removeTask, addTask} from "../Task/Tasks-sagas";

type PropsType = {
    title: string;
    tasks: Array<TaskDomainType>;
    changeFilter: (value: FilterType, todoListId: string) => void;
    filter: FilterType
    idTodo: string
    entityStatus: RequestStatusType
}


const TodoList = React.memo((props: PropsType) => {

    const {tasks, filter, title, changeFilter, idTodo} = props;
    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, [])

    useEffect(() => {
        stableDispatch(getTaskTodo(idTodo))
    }, [stableDispatch, idTodo])


    const addTasks = useCallback((value: string) => {
        stableDispatch(addTask(idTodo, value))
    }, [stableDispatch, idTodo])


    const onChangesTitle = useCallback((value: string) => {
        stableDispatch(ChangeTodolistTitleF(idTodo, value))
    }, [stableDispatch, idTodo])


    const onRemoveHandler = useCallback(() => {
        stableDispatch(removeTodoListT(idTodo))
    }, [stableDispatch, idTodo])


    let filteredTodoList = tasks;
    if (filter === 'Active') {
        filteredTodoList = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'Completed') {
        filteredTodoList = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    const onChangTaskStatus = useCallback((id: string, status: TaskStatuses) => {
        stableDispatch(updateTaskStatusTC(id, idTodo, status));
    }, [stableDispatch, idTodo])

    const onChangesTaskTitle = useCallback((id: string, title: string) => {
        debugger
        stableDispatch(ChangeTaskTitleF(id, title, idTodo))
    }, [stableDispatch, idTodo])

    const onDeleteHandler = useCallback((id: string) => {
        stableDispatch(removeTask(id, idTodo))
    }, [stableDispatch, idTodo])


    const onChangeAllHandler = () => changeFilter('All', idTodo);
    const onChangeActiveHandler = () => changeFilter('Active', idTodo);
    const onChangeCompletedHandler = () => changeFilter('Completed', idTodo);

    return (
        <div>
            <EditableSpan value={title} onChanges={onChangesTitle} blured={false}/>
            <AddItemForm addItem={addTasks} entityStatus={props.entityStatus}/>
            <div>
                {
                    filteredTodoList.map(t => {
                        return (
                            <Task task={t} onChangTaskStatus={onChangTaskStatus} onChanges={onChangesTaskTitle}
                                  onDeleteHandler={onDeleteHandler} entityStatus ={props.entityStatus}  key={t.id}/>
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
                disabled={props.entityStatus === "loading"}
                onClick={onRemoveHandler}>
                Remove List
            </Button>
        </div>
    )
});
export default TodoList;