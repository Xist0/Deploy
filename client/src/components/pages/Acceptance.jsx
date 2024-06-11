import React, { useContext, useState, useEffect } from 'react';
import './pages.css/SeacrOrder.css';
import QRcodeScaner from './QRcodeScaner';
import { Context } from '../../main';

function Acceptance() {
    const { store } = useContext(Context);
    const [orderStatus, setOrderStatus] = useState('');
    const [fadeOut, setFadeOut] = useState(false);

    const userRole = store.user.role || null;
    const UserName = store.user.login || null;
    const destination = null;

    const acceptanceFetch = async (orderNumber, userRole, UserName, destination) => {
        orderNumber = orderNumber || null;
        userRole = userRole || null;
        UserName = UserName || null;
        destination = destination || null;

        try {
            const response = await fetch(`/api/shipment/${orderNumber}/${userRole}/${UserName}/${destination}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            let responseData;

            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
                console.error('Unexpected content type:', contentType);
            }

            console.log(responseData);

            if (responseData.order_status) {
                setOrderStatus(responseData.order_status);
                setFadeOut(false);

                setTimeout(() => {
                    setFadeOut(true);
                    setTimeout(() => {
                        setOrderStatus('');
                    }, 1000); 
                }, 1000);
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    const handleQRCodeData = (orderNumber) => {
        if (orderNumber) {
            console.log(`Order number extracted: ${orderNumber}`);
            acceptanceFetch(orderNumber, userRole, UserName, destination);
        } else {
            console.error('Invalid QR code format.');
        }
    };

    return (
        <div className="container-box">
            <div className="container-block">
                <h1>Выдать заказ</h1>
                <QRcodeScaner updateSearchWithQRCode={handleQRCodeData} />
                {orderStatus && (
                    <div className={`order-status ${fadeOut ? 'fade-out' : ''}`}>
                        <h1>{orderStatus}</h1>
                    </div>
                )}
                <div className="container-results"></div>
            </div>
        </div>
    );
}

export default Acceptance;
