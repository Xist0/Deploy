import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../Header';
import { Context } from '../../main';

import AuthService from '../../components/service/AuthService'; // Импортируем сервис аутентификации

function PersonalAccount() {
    const [login, setLogin] = useState('');
    const [role, setRole] = useState('');
    const [greeting, setGreeting] = useState('');
    const [loggedOut, setLoggedOut] = useState(false);
    const { store } = useContext(Context);

    useEffect(() => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        let greetingText = '';
        if (currentHour >= 6 && currentHour < 12) {
            greetingText = "Доброе утро";
        } else if (currentHour >= 12 && currentHour < 18) {
            greetingText = "Добрый день";
        } else if (currentHour >= 18 && currentHour < 22) {
            greetingText = "Добрый вечер";
        } else {
            greetingText = "Доброй ночи";
        }
        setGreeting(greetingText);
    }, []);

    const handleLogout = async () => {
        try {
            await AuthService.logout(); 
            localStorage.removeItem('token');
            localStorage.removeItem('roleName');
            localStorage.removeItem('username');
            localStorage.getItem('token')
            setLogin('');
            setRole('');
            setLoggedOut(true);
        } catch (error) {
            console.error('Ошибка выхода:', error);
        }
    };

    const renderUserInfo = () => {

        return (
            <>
                <h1>{greeting} {store.user.login}</h1>
                <h1>Роль: {store.user.role}</h1> 
                <button onClick={() => store.logout()}>Выйти</button>
            </>
        );
    };

    if (loggedOut) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <div className="container-box">
                <div className="Personal-container">
                    {renderUserInfo()}
                    <div className="personal-container-orders">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalAccount;
