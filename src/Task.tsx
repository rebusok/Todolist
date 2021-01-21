import React from 'react';
import {Checkbox, IconButton} from "@material-ui/core";
import EditableSpan from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskDomainType, TaskStatuses} from "./state/TaskReducer";
import s from './Task.module.css'

type TaskPropsType = {
    task: TaskDomainType
    onChangTaskStatus: (id:string,status: TaskStatuses) => void
    onChanges: (id:string,title:string) => void
    onDeleteHandler: (id:string) => void
}


const Task = React.memo(({task:{status, title, id},onChangTaskStatus, onChanges, onDeleteHandler}:TaskPropsType) => {
   const onChangeTitle = (value:string) => {
       onChanges(id, value)
   }

    return (
        <div  className={status === TaskStatuses.Completed ? s.is_done : ''}>
            <Checkbox
                color='primary'
                checked={status ===TaskStatuses.Completed}
                onChange={(e) => onChangTaskStatus(id, e.currentTarget.checked? TaskStatuses.Completed:TaskStatuses.New)}/>
            <EditableSpan value={title} onChanges={onChangeTitle} blured={true}/>
            <IconButton
                onClick={() => onDeleteHandler(id)}>
                <Delete/>
            </IconButton>
        </div>
    )
})

export default Task;