import React from 'react';
import {Checkbox, IconButton} from "@material-ui/core";
import EditableSpan from "../components/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskDomainType, TaskStatuses} from "./TaskReducer";
import s from './Task.module.css'
import {RequestStatusType} from "../App/app-reducer";

type TaskPropsType = {
    task: TaskDomainType
    onChangTaskStatus: (id:string,status: TaskStatuses) => void
    onChanges: (id:string,title:string) => void
    onDeleteHandler: (id:string) => void
    entityStatus: RequestStatusType
}


const Task = React.memo(({task:{status, title, id},onChangTaskStatus, onChanges, onDeleteHandler, entityStatus}:TaskPropsType) => {
   const onChangeTitle = (value:string) => {
       onChanges(id, value)
   }

    return (
        <div  className={status === TaskStatuses.Completed ? s.is_done : ''}>
            <Checkbox
                color='primary'
                checked={status ===TaskStatuses.Completed}
                disabled={entityStatus === "loading"}
                onChange={(e) => onChangTaskStatus(id, e.currentTarget.checked? TaskStatuses.Completed:TaskStatuses.New)}/>
            <EditableSpan value={title} onChanges={onChangeTitle} blured={true} />
            <IconButton
                onClick={() => onDeleteHandler(id)} disabled={ entityStatus === "loading"}>
                <Delete/>
            </IconButton>
        </div>
    )
})

export default Task;