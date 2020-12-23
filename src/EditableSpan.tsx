import React, {ChangeEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanType = {
    value:string
    onChanges: (newValue:string) => void
    blured: boolean
}

const EditableSpan = React.memo((props:EditableSpanType) => {
    console.log('CAAALLL span')
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.value)
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {

        setTitle(e.currentTarget.value);
    }
    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value)
    }
    const activateViewMetod = () => {
        setEditMode(false);
        props.onChanges(title);
    }
    return (
        editMode
            ? <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMetod}/>
            : props.blured
            ? <span onDoubleClick={activateEditMode}>{props.value}</span>
            : <h3 onDoubleClick={activateEditMode}>{props.value}</h3>
    )
})

export default EditableSpan;