import React from 'react';
import {Checkbox, IconButton} from "@material-ui/core";
import EditableSpan from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskDomainType} from "./state/TaskReducer";


type TaskPropsType = {
    task: TaskDomainType
    onChangTaskStatus: (id:string,isDone:boolean) => void
    onChanges: (id:string,title:string) => void
    onDeleteHandler: (id:string) => void
}


const Task = React.memo(({task:{isDone, title, id},onChangTaskStatus, onChanges, onDeleteHandler}:TaskPropsType) => {
    return (
        <div  className={isDone ? 'is-done' : ''}>
            <Checkbox
                color='primary'
                checked={isDone}
                onChange={(e) => onChangTaskStatus(id, e.currentTarget.checked)}/>
            <EditableSpan value={title} onChanges={() => onChanges(id,title)} blured={true}/>
            <IconButton
                onClick={() => onDeleteHandler(id)}>
                <Delete/>
            </IconButton>
        </div>
    )
})

export default Task;