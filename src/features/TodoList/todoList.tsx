import React, {useCallback, useEffect} from "react";

import AddItemForm from "../../components/AddItemForm";
import EditableSpan from "../../components/EditableSpan";
import {Button} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import Task from "../Task/Task";
import {
    addTaskT,
    fetchTasks,
    removeTaskT,
    TaskDomainType,
    TaskStatuses, updateTaskTC,

} from "../Task/TaskReducer";
import {ChangeTodolistTitleF, FilterType, removeTodoListT} from "./todoListsReducer";
import {useDispatch} from "react-redux";
import {RequestStatusType} from "../../App/app-reducer";

type PropsType = {
    title: string;
    tasks: Array<TaskDomainType>;
    changeFilter: (value: FilterType, todoListId: string) => void;
    filter: FilterType
    TodoListId: string
    entityStatus: RequestStatusType
}


const TodoList = React.memo((props: PropsType) => {

    const {tasks, filter, title, changeFilter, TodoListId} = props;
    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, [])

    useEffect(() => {
        stableDispatch(fetchTasks(TodoListId))
    }, [stableDispatch, TodoListId])


    const addTasks = useCallback((value: string) => {
        stableDispatch(addTaskT({title:value, todolistId:TodoListId}))
    }, [stableDispatch, TodoListId])


    const onChangesTitle = useCallback((value: string) => {
        stableDispatch(ChangeTodolistTitleF({title:value, todolistId:TodoListId}))
    }, [stableDispatch, TodoListId])


    const onRemoveHandler = useCallback(() => {
        stableDispatch(removeTodoListT({todolistId:TodoListId}))
    }, [stableDispatch, TodoListId])


    let filteredTodoList = tasks;
    if (filter === 'Active') {
        filteredTodoList = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'Completed') {
        filteredTodoList = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    const onChangTaskStatus = useCallback((id: string, status: TaskStatuses) => {
        stableDispatch(updateTaskTC({taskId:id, model:{status}, todolistId:TodoListId}))
    }, [stableDispatch, TodoListId])

    const onChangesTaskTitle = useCallback((id: string, title: string) => {
        stableDispatch(updateTaskTC({taskId:id, model:{title}, todolistId:TodoListId}))
    }, [stableDispatch, TodoListId])

    const onDeleteHandler = useCallback((taskId: string) => {
        stableDispatch(removeTaskT({taskId, TodoListId}))
    }, [stableDispatch, TodoListId])


    const onChangeAllHandler = () => changeFilter('All', TodoListId);
    const onChangeActiveHandler = () => changeFilter('Active', TodoListId);
    const onChangeCompletedHandler = () => changeFilter('Completed', TodoListId);

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