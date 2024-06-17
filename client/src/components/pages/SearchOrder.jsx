import React, { useState, useEffect, useContext } from 'react';
import './pages.css/SeacrOrder.css';
import QRcodeScaner from './QRcodeScaner';
import { useLocation } from 'react-router-dom';
import { Context } from '../../main';

function SearcOrder() {
    const [number, setNumber] = useState('');
    const [records, setRecords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const { store } = useContext(Context);
    const userRole = store.user.role;
    const UserName = store.user.login;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderNumber = queryParams.get('orderNumber');
        if (orderNumber) {
            const trimmedOrderNumber = orderNumber.replace(/^0+/, '');
            setNumber(trimmedOrderNumber);
            fetchData(trimmedOrderNumber);
        }
    }, [location.search]);

    const fetchData = async (searchNumber) => {
        if (searchNumber.trim() === '') {
            return;
        }
        setIsLoading(true);
        try {
            const encodedUserRole = encodeURIComponent(userRole);
            const response = await fetch(`/api/byt/order/${searchNumber}/${encodedUserRole}/${UserName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setNumber(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchData(number);
        }
    };

    const searchWithQRCode = (searchNumber) => {
        setNumber(searchNumber);
        fetchData(searchNumber);
    };

    const handleNotifyClient = async () => {
        if (!records || !records.retail_user || !records.retail_user.user_phone) {
            alert('Номер телефона не найден');
            return;
        }
        const requestData = {
            phone_number: records.retail_user.user_phone,
            msg_text: 'Оповестить'
        };
        try {
            const response = await fetch('/api/sms/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const responseData = await response.json();
            console.log('Data received:', responseData);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    const handleSendSMS = async () => {
        if (!records || !records.retail_user || !records.retail_user.user_phone) {
            alert('Номер телефона не найден');
            return;
        }
        const requestData = {
            phone_number: records.retail_user.user_phone,
            msg_text: message
        };
        try {
            const response = await fetch('/api/sms/message/sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const responseData = await response.json();
            console.log('Data received:', responseData);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    const renderData = () => {
        if (isLoading) {
            return (
                <div className="loading-animation"> <img src="/public/LogoAnims.svg" alt="" /></div>
            );
        }
        if (!records) {
            return <p>Ничего не найдено</p>;
        }

        return (
            <div>
                <div className="container-search-result">
                    <div className="container-search-result-title">
                        <h1>Заказ: {records.order_id}</h1>
                    </div>
                    <div className="container-search-result-main">
                        <h2>Пользователь:</h2> <p>{records.retail_user.user_name || 'Не указано'}</p>
                        <h2>Тип пользователя:</h2> <p>{records.retail_user.user_type || 'Не указано'}</p>
                        <h2>Номер телефона:</h2> <p>{records.retail_user.user_phone || 'Не указано'}</p>
                        <div className="OrderDefect"><h2>Адрес:</h2> <p>{records.retail_user.user_address || 'Не указано'}</p></div>
                        <h2>Дата заказа:</h2> <p>{records.order_date || 'Не указано'}</p>
                        <h2>Тип устройства:</h2> <p>{records.device.device_type || 'Не указано'}</p>
                        <h2>Тип ремонта:</h2> <p>{records.order_type || 'Не указано'}</p>
                        <h2>ID устройства:</h2> <p>{records.device.device_id || 'Не указано'}</p>
                        <h2>Бренд:</h2> <p>{records.device.device_brand || 'Не указано'}</p>
                        <div className="OrderDefect"><h2>Внешний вид:</h2> <p>{records.device.device_appearance || 'Не указано'}</p></div>
                        <h2>Комплектация:</h2> <p>{records.device.device_equipment || 'Не указано'}</p>
                        <h2>Номер модели:</h2> <p>{records.device.device_model || 'Не указано'}</p>
                        <h2>Статус:</h2> <p>{records.order_status || 'Не указано'}</p>
                        <h2>Серийный номер модели:</h2> <p>{records.device.device_sn || 'Не указано'}</p>
                        <h2>IMEI:</h2> <p>{records.device.device_imei || 'Не указано'}</p>
                        <div className="OrderDefect"><h2>Дефект:</h2> <p>{records.device.device_stated_defect || 'Не указано'}</p></div>
                    </div>
                    <div className="container-search-result-work">
                        <div className="container-search-result-parts-title">
                            <h1>Работы</h1>
                        </div>
                        {records.works.length > 0 ? (
                            records.works.map((workItem, index) => (
                                <div key={index} className='container-search-result-parts-main'>
                                    <p>{workItem.work_name || 'Не указано'}</p>
                                    <h4>Цена: {workItem.work_price || 'Не указано'}</h4>
                                </div>
                            ))
                        ) : (
                            <p>Ничего не найдено</p>
                        )}
                        <div className="container-search-result-parts">
                            <div className="container-search-result-parts-title">
                                <h1>Запчасти</h1>
                            </div>
                            {records.parts.length > 0 ? (
                                records.parts.map((partItem, index) => (
                                    <div key={index} className='container-search-result-parts-main'>
                                        <p>{partItem.part_name || 'Не указано'}</p>
                                        <h4>Цена: {partItem.part_price || 'Не указано'}</h4>
                                    </div>
                                ))
                            ) : (
                                <p>Ничего не найдено</p>
                            )}
                        </div>
                        <div className="container-search-sms">
                            <h1>Оповещение клиента:</h1>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder='Сообщение'>
                            </textarea>
                            <button onClick={handleSendSMS}>Отправить смс</button>
                            <button onClick={handleNotifyClient}>Оповестить клиента</button>
                        </div>
                    </div>
                </div>
                <div className="container-search-result-staff">
                    {/* {records.staff[0] && (
                        <div className='container-search-result-staff-main'>
                            <h1>Принял:</h1> <p>{records.staff[0].staff_name}</p>
                            <p>{records.staff[0].staff_job}</p>
                        </div>
                    )}
                    {records.staff[1] && (
                        <div className='container-search-result-staff-main'>
                            <h1>Мастер:</h1> <p>{records.staff[1].staff_name}</p>
                            <p>{records.staff[1].staff_job}</p>
                        </div>
                    )} */}
                </div>
            </div>
        );
    };

    return (
        <div className="container-box">
            <div className="container-block">
                <div className="container-block-search">
                    <input type="number" pattern="\d*" value={number} onChange={handleChange} onKeyPress={handleKeyPress} placeholder='Введите номер заказа' />
                    <button onClick={() => fetchData(number)}> Найти </button >
                </div>
                <QRcodeScaner updateSearchWithQRCode={searchWithQRCode} />
                <div className="container-results">{renderData()}</div>
            </div>
        </div>
    );
}

export default SearcOrder;
