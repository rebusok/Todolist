import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import AppWithReducers from "./AppWithReducers";
import {Provider} from "react-redux";
import {store} from "./state/store";

ReactDOM.render(
    <Provider store={store}>
        <AppWithReducers/>
    </Provider>, document.getElementById('root'));



