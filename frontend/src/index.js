import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Provider} from 'react-redux'
import store from './store'
import App from './App';
import ErrorBoundary from './components/ErrorBoundary'
import "./App.css"

if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
}

ReactDOM.render(
  <ErrorBoundary>
    <Provider store = {store}>
      <App />
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);

