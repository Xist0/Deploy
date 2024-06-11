import React, { useContext, useState } from 'react';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import './login.css';

function LoginForm() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const { store } = useContext(Context);
    const [message, setMessage] = useState('');

    const handleRegistration = async () => {
        try {
            await store.registration(login, password, role);
            handleMessage('Пользователь успешно создан');
            clearForm();
        } catch (error) {
            handleMessage(`Ошибка создания пользователя: ${error.message}`);
        }
    };

    const handleMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, 3000); 
    };

    const clearForm = () => {
        setLogin('');
        setPassword('');
        setRole('');
    };

    return (
        <div className='container-login'>
            <h1>Создание новой учётной записи</h1>

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
            <select onChange={(e) => setRole(e.target.value)} value={role}>
                <option value="">Выберите роль</option>
                <option value="Администратор">Администратор</option>
                <option value="Приём">Приём</option>
                <option value="Отправка">Отправка</option>
                <option value="Стажёр">Стажёр</option>
                <option value="Мастер">Мастер</option>
                <option value="Выдача">Выдача</option>
                <option value="Курьер">Курьер</option>
                <option value="ТехАдмин">ТехАдмин</option>
            </select>
            <h1>{message}</h1>
            <button onClick={handleRegistration}>Создать</button>
        </div>
    );
}

export default observer(LoginForm);
