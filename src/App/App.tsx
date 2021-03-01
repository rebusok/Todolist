import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@material-ui/core";

import {Menu} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {NavLink, Redirect, Route, Switch} from 'react-router-dom';
import {Login} from '../features/Login/Login';
import TodolistList from "../features/TodoList/TodolistList";
import {logoutTC} from "../features/Login/auth-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar";


const App = () => {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggenIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    const stableDispatch = useCallback(dispatch, [])
    useEffect(() => {
        stableDispatch(initializeAppTC())
    }, [stableDispatch])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    const LogOutHandler = () => {
        dispatch(logoutTC())
    }
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar>
                <Toolbar>
                    <IconButton edge='start' color='inherit' aria-label='menu'>
                        <Menu/>
                    </IconButton>
                    <Typography variant={'h6'}>
                        News
                    </Typography>
                    {isLoggenIn
                        ? <Button className={'btn_app'} onClick={LogOutHandler}>Log Out</Button>
                        : <NavLink to={'/login'} className={'link_app'}> login</NavLink>}

                </Toolbar>
                {status === "loading" && <LinearProgress color={"secondary"}/>}
            </AppBar>
            <Container fixed>
                <Switch>
                    <Route exact path={'/'} render={() => <TodolistList/>}/>
                    <Route component={Login}   path={'/login'}/>
                    <Route path={'/404'}   render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                    <Redirect from={'*'} to={'/404'}/>
                </Switch>
            </Container>



        </div>
    );
};
export default App;

