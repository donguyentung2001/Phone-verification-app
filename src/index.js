import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

//render App component to the root div in the index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

