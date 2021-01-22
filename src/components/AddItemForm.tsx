import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import { IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";
import {RequestStatusType} from "../App/app-reducer";


type AddItemFormType = {
    addItem: (title: string) => void
    entityStatus?: RequestStatusType
}

const AddItemForm = React.memo((props:AddItemFormType) => {
    const [value, setTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const onTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setTitle(e.currentTarget.value);
    }
    const onTitleKeyHandler = (e:KeyboardEvent<HTMLInputElement>) => {
        if (error !==null){
            setError(null)
        }
        if (e.key === "Enter"){
            callBackAddItem();
        }

    }
    const callBackAddItem = () => {

        if (value.trim() !== ''){
            props.addItem(value);

        } else {
            setError('Title is required')
        }
        setTitle('');
    }
    return (
        <div>
            <TextField
                value={value}
                onChange={onTitleChangeHandler}
                onKeyDown={onTitleKeyHandler}
                error={!!error}
                label={'Title'}
                helperText={error}
            />
            <IconButton
                color='primary'
                onClick={callBackAddItem}
                disabled={props.entityStatus === "loading"}
            >
                <AddBox/>
            </IconButton>

        </div>
    )
})

export default AddItemForm;