import {AppRootStateType} from "../../App/store";

export const selectIsLoggenIn = (state:AppRootStateType) => state.auth.isLoggedIn