import React, { useContext, useState } from 'react';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import './login.css'

function LoginForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); 
    const { store } = useContext(Context);

    const handleLogin = async () => {
        await store.login(login, password, role); 
    };
    return (
        <div className='container-login'>
            <h1>Авторизация</h1>

            <input
                onChange={e => setLogin(e.target.value)}
                value={login}
                type="text"
                placeholder='Логин'
            />
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder='Пароль'
            />
    
            <button onClick={handleLogin}>Войти</button>
        </div>
    );
}

export default observer(LoginForm);
