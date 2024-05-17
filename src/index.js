import React from 'react';
import ReactDOM from 'react-dom/client';
import App2 from './App2';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

const AppMemo = React.memo(App);

root.render(
  
   <>
    <AppMemo />
   </>

);


