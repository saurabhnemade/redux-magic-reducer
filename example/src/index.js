import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux-magic-reducer';
import reducers from './reducers/index';

import './index.css'
import App from './App'

const mystore = createStore(reducers);
window.mystore = mystore;

ReactDOM.render(<App store={mystore} />, document.getElementById('root'))
