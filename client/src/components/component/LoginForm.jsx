import React, { useContext, useState } from 'react';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import './login.css'

function LoginForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [isFieldsValid, setIsFieldsValid] = useState(false);
    const { store } = useContext(Context);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'login') setLogin(value);
        if (name === 'password') setPassword(value);
        if (login.trim() !== '' && password.trim() !== '') {
            setIsFieldsValid(true);
        } else {
            setIsFieldsValid(false);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await store.login(login, password, role);
            if (response.error) {
                setError(response.error);
            } else {
                setError('');
            }
        } catch (error) {
            setLogin('');
            setPassword('');
            setError(error.message);
        }
    };

    return (
        <div className='container-login'>
            <h1>Авторизация</h1>
            <input
                onChange={handleInputChange}
                value={login}
                name="login"
                type="text"
                placeholder='Логин'
                className={!isFieldsValid && login.trim() === '' ? 'invalid' : ''}
            />
            <input
                onChange={handleInputChange}
                value={password}
                name="password"
                type="password"
                placeholder='Пароль'
                className={!isFieldsValid && password.trim() === '' ? 'invalid' : ''}
            />

            <button onClick={handleLogin} disabled={!isFieldsValid} className={!isFieldsValid ? 'button-error' : ''}>Войти</button>
            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default observer(LoginForm);
