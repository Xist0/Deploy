import React, { useContext } from 'react';
import './pages.css/SeacrOrder.css';
import QRcodeScaner from './QRcodeScaner';
import { Context } from '../../main';

function Acceptance() {
    const { store } = useContext(Context);

    const userRole = store.user.role;
    const UserName = store.user.login
    const acceptanceFetch = async (data, userRole, UserName) => {
        try {
            const response = await fetch(`/api/acceptance/${data}/${userRole}/${UserName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    return (
        <div className="container-box">
            <div className="container-block">
                <h1>Приём товара</h1>
                <QRcodeScaner updateSearchWithQRCode={(data) => acceptanceFetch(data, userRole, UserName)} />
                <div className="container-results"></div>
            </div>
        </div>
    );
}

export default Acceptance;
