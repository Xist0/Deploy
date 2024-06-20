import React, { useContext, useState } from 'react';
import './pages.css/SeacrOrder.css';
import QRcodeScaner from './QRcodeScaner';
import { Context } from '../../main';

function Acceptance() {
    const { store } = useContext(Context);
    const [orderStatus, setOrderStatus] = useState('');
    const [fadeOut, setFadeOut] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userRole = store.user.role || null;
    const UserName = store.user.login || null;
    const destination = null;

    const acceptanceFetch = async (orderNumber, userRole, UserName, destination) => {
        orderNumber = orderNumber || null;
        userRole = userRole || null;
        UserName = UserName || null;
        destination = destination || null;

        console.log(`Sending request with params: orderNumber=${orderNumber}, userRole=${userRole}, UserName=${UserName}, destination=${destination}`);

        setIsLoading(true); // Начало загрузки

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

            console.log('Response data:', responseData);

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
        } finally {
            setIsLoading(false); // Конец загрузки
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
                {isLoading && <div className="loading-animation"> <img src="/pic/LogoAnims.svg" alt="" /></div>}
                <QRcodeScaner updateSearchWithQRCode={handleQRCodeData} isButtonDisabled={isLoading} />
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
