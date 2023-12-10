import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import ChessBoard from './components/ChessBoard.js';
import { Provider } from 'react-redux';
import boardReducer from './components/boardReducer.js';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({reducer : boardReducer})
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
        <div style={{ position: 'absolute', width: '850px', height: '850px', backgroundColor: 'brown', zIndex: -1, borderRadius: '10px'}}></div>
        <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            Chess
        </div>
        <Provider store={store}>
            <ChessBoard />
        </Provider>
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
