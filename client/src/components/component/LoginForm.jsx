import React, { useContext, useState } from 'react';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import './login.css'
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";


function LoginForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [isFieldsValid, setIsFieldsValid] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Новое состояние

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
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && isFieldsValid) {
            handleLogin();
        }
    };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState); // Функция для переключения видимости пароля
    };

    return (
        <div className='container-login'>
            <h1>Авторизация</h1>
            <input
                onChange={handleInputChange}
                onKeyPress={handleKeyPress} // Добавлено обработчик нажатия клавиши
                value={login}
                name="login"
                type="text"
                placeholder='Логин'
                className={!isFieldsValid && login.trim() === '' ? 'invalid' : ''}
            />
            <div className="password-container">
                <input
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress} // Добавлено обработчик нажатия клавиши
                    value={password}
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder='Пароль'
                    className={!isFieldsValid && password.trim() === '' ? 'invalid' : ''}
                />
                {isPasswordVisible ? (
                    <FaEyeSlash onClick={togglePasswordVisibility} />
                ) : (
                    <IoEyeSharp onClick={togglePasswordVisibility} />
                )}

            </div>
            <button onClick={handleLogin} disabled={!isFieldsValid} className={!isFieldsValid ? 'button-error' : ''}>Войти</button>
            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default observer(LoginForm);
