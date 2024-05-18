import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { store } from './components/redux/store.js';
import './index.css';
import Store from './components/store/store.js';

const storeInstance = new Store();

export const Context = createContext({ store: storeInstance });

ReactDOM.createRoot(document.getElementById('root')).render(
  <Context.Provider value={{ store: storeInstance }}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Context.Provider>
);
