


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    error: null | string
}

const initialState: InitialStateType = {
    status: 'loading',
    error: null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}
export const setStatusApp = (status:RequestStatusType) => {
    return ({type: 'APP/SET-STATUS', status} as const)
}
export const setErrorApp = (error: null | string) => {
    return({type:'APP/SET-ERROR', error} as const)
}

export type SetAppStatusActionType = ReturnType<typeof setStatusApp>
export type SetAppErrorActionType = ReturnType<typeof setErrorApp>

type ActionsType = any