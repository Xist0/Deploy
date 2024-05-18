// Shipment.jsx
import React, { useContext, useState } from 'react';
import './pages.css/SeacrOrder.css';
import QRcodeScaner from './QRcodeScaner';
import { Context } from '../../main';

function Shipment() {
    const { store } = useContext(Context);
    const [posishion, setPosishion] = useState('');
    const [qrData, setQRData] = useState(null);
    const userRole = store.user.role;
    const userName = store.user.login;
    const [isButtonDisabled, setButtonDisabled] = useState(true);

    const Form = () => {
        setPosishion('');
        setQRData(null);
        setButtonDisabled(true);
    };

    const acceptanceFetch = async (posishion, qrData, userRole, userName) => {
        try {
            const response = await fetch(`/api/shipment/${qrData}/${userRole}/${userName}/${posishion}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            Form();
            const responseData = await response.json();
            console.log(responseData);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(responseData);
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error.message);
        }
    };

    const handleQRCodeScan = (data) => {
        setQRData(data);
        if (posishion !== '' && data !== null) {
            acceptanceFetch(posishion, data, userRole, userName);
        }
    };

    const handleSelectChange = (e) => {
        const selectedPosishion = e.target.value;
        setPosishion(selectedPosishion);
        if (selectedPosishion !== '') {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    };

    return (
        <div className="container-box">
            <div className="container-block">
                <h1>Отправка товара</h1>
                <select onChange={handleSelectChange} value={posishion}>
                    <option hidden>Точка</option>
                    <option value="Туркистанская">Туркистанская</option>
                    <option value="Салмышкая">Салмышкая</option>
                    <option value="Бретская">Бретская</option>
                </select>
                {posishion === '' && (
                    <h1>Необходимо выбрать точку</h1>
                )}
                <div className="QRbutton" style={{ pointerEvents: isButtonDisabled ? 'none' : 'auto', cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }}>
                    <QRcodeScaner updateSearchWithQRCode={handleQRCodeScan} isButtonDisabled={isButtonDisabled} />
                </div>
            </div>
        </div>
    );
}

export default Shipment;
