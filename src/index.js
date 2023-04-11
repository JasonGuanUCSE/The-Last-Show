import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Obituary from './Obituary';
import App from './App';
import OverLay from './OverLay';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode >
    <App/>
    <Obituary />
    <OverLay/>
  </React.StrictMode>
);

