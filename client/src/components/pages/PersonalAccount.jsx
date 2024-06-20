import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../../main';
import AuthService from '../../components/service/AuthService';
import { GoTriangleDown } from "react-icons/go";

function PersonalAccount() {
    const [login, setLogin] = useState('');
    const [role, setRole] = useState('');
    const [greeting, setGreeting] = useState('');
    const [isOrdersVisible, setIsOrdersVisible] = useState(true);
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
            localStorage.getItem('token');
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
                <div className="container-login">
                    {renderUserInfo()}
                    <div className="personal-container-orders">
                    </div>
                </div>
                {/* <div className="orders-box">
                    <h1 onClick={() => setIsOrdersVisible(!isOrdersVisible)}>
                        Список активных заказов
                        <GoTriangleDown className={`icon ${isOrdersVisible ? 'rotate' : ''}`} />
                    </h1>
                    <div className={`orders-content ${isOrdersVisible ? 'visible' : ''}`}>
                        <div className="orders-container">
                            <div className="orders-left">
                                <h1>ООНФ-018751</h1>
                                <button>Перейти</button>
                            </div>
                            <div className="orders-centr">
                                <h1>Телефон Xaimi Redmi 13C</h1>
                                <h1>ИП Ленинг Виталий Александрович</h1>
                            </div>
                            <div className="orders-right">
                                <h3>Авторизованный ремонт</h3>
                                <div className="orders-status">
                                    <button className='orders-button-status'>Срочный</button>
                                </div>
                            </div>
                        </div>
                        <div className="orders-container">
                            <div className="orders-left">
                                <h1>ООНФ-018751</h1>
                                <button>Перейти</button>
                            </div>
                            <div className="orders-centr">
                                <h1>Телефон Xaimi Redmi 13C</h1>
                                <h1>ИП Ленинг Виталий Александрович</h1>
                            </div>
                            <div className="orders-right">
                                <h3>Авторизованный ремонт</h3>
                                <div className="orders-status">
                                    <button className='orders-button-status' id='bntn'>Диагностика</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default PersonalAccount;
