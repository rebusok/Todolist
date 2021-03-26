import {AppRootStateType} from "./store";

export const selectStatus = (state:AppRootStateType) => state.app.status
export const selectIsInitialized = (state:AppRootStateType) => state.app.isInitialized
export const selectTasks = (state:AppRootStateType) => state.tasks