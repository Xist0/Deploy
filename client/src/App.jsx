import React, { useContext, useEffect, useState  } from 'react';
import './index.css';
import './components/component/login.css'
import LoginForm from './components/component/LoginForm';
import { Context } from './main';
import { observer } from 'mobx-react-lite'
import MainPage from './MainPage';

function App() {
  const {store} = useContext(Context);

  useEffect(() => {
      if (localStorage.getItem('token')) {
          store.checkAuth()
      }
  }, [])

  

  if (store.isLoading) {
      return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
      return (
          <div>
              <LoginForm/>
          </div>
      );
  }

  return (
      <div>
          <MainPage/>

      </div>
  );
}

export default observer(App);
