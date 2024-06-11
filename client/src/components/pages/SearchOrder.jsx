import React, { useState, useEffect, useContext } from 'react';
import './pages.css/SeacrOrder.css';
import QRcodeScaner from './QRcodeScaner';
import { useLocation } from 'react-router-dom';
import { Context } from '../../main';

function SearcOrder() {
    const [number, setNumber] = useState('');
    const [records, setRecords] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
            <div >
                <div className="container-search-result">
                    <div className="container-search-result-title">
                        <h1>Заказ: {records.order_id}</h1>
                    </div>
                    <div className="container-search-result-main">
                        <h2>Пользователь:</h2> <p>{records.retail_user.user_name}</p>
                        <h2>Тип пользователя:</h2> <p>{records.retail_user.user_type}</p>
                        <h2>Номер телефона:</h2> <p>{records.retail_user.user_phone}</p>
                        <div className="OrderDefect"><h2>Адрес:</h2> <p>{records.retail_user.user_address}</p></div>
                        <h2>Дата заказа:</h2> <p>{records.order_date}</p>
                        <h2>Тип устройства:</h2> <p>{records.device.device_type}</p>
                        <h2>Тип ремонта:</h2> <p>{records.order_type}</p>
                        <h2>ID устройства:</h2> <p>{records.device.device_id}</p>
                        <h2>Бренд:</h2> <p>{records.device.device_brand}</p>
                        <div className="OrderDefect"><h2>Внешний вид:</h2> <p>{records.device.device_appearance}</p></div>
                        <h2>Комплектация:</h2> <p>{records.device.device_equipment}</p>
                        <h2>Номер модели:</h2> <p>{records.device.device_model}</p>
                        <h2>Статус:</h2> <p>{records.order_status}</p>
                        <h2>Серийный номер модели:</h2> <p>{records.device.device_sn}</p>
                        <h2>IMEI:</h2> <p>{records.device.device_imei}</p>
                        <div className="OrderDefect"><h2>Дефект:</h2> <p>{records.device.device_stated_defect}</p></div>
                    </div>
                    <div className="container-search-result-work">
                        <div className="container-search-result-parts-title">
                            <h1>Работы</h1>
                        </div>
                        {records.works.map((workItem, index) => (
                            <div key={index} className='container-search-result-parts-main'>
                                <p>{workItem.work_name}</p>
                                <h4>Цена:{workItem.work_price}</h4>
                            </div>
                        ))}
                        <div className="container-search-result-parts">
                            <div className="container-search-result-parts-title">
                                <h1>Запчасти</h1>
                            </div>
                            {records.parts.map((partItem, index) => (
                                <div key={index} className='container-search-result-parts-main'>
                                    <p>{partItem.part_name}</p>
                                    <h4>Цена:{partItem.part_price}</h4>
                                </div>
                            ))}
                        </div>
                        <button>Оповестить клиента</button>
                        <button>Отправить смс</button>

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
            </div >
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
