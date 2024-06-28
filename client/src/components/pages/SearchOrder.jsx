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
    const [isEditing, setIsEditing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [editedRecords, setEditedRecords] = useState(null);
    const location = useLocation();
    const { store } = useContext(Context);
    const [selectedReceptionNumber, setSelectedReceptionNumber] = useState('');
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
            setEditedRecords(data); // Initialize editedRecords with fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setNumber(e.target.value);
    };
    const handleReceptionNumberChange = (e) => {
        setSelectedReceptionNumber(e.target.value);
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
        if (!selectedReceptionNumber) { // Проверка выбранного номера приемки
            alert('Пожалуйста, выберите номер приёмки');
            return;
        }
        const requestData = {
            to: records.retail_user.user_phone,
            from: selectedReceptionNumber // Использование выбранного номера приемки
        };
        try {
            const response = await fetch('/api/initiate_call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const result = await response.json();
            setModalMessage(`Статус: ${result.status}, Message: ${result.message}`);
        } catch (error) {
            setModalMessage(`Ошибка: ${error.message}`);
        } finally {
            setModalVisible(true);
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
            setModalMessage(`Status: ${result.status}, Message: ${result.message}`);
        } catch (error) {
            setModalMessage(`Ошибка: ${error.message}`);
        } finally {
            setModalVisible(true);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleEditFalse = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsEditing(false);

        const requestData = {
            retail_user: {
                user_id: editedRecords?.retail_user?.user_id || '',
                user_name: editedRecords?.retail_user?.user_name || '',
                user_phone: editedRecords?.retail_user?.user_phone || '',
                user_address: editedRecords?.retail_user?.user_address || '',
                user_legal_address: "",
                user_type: editedRecords?.retail_user?.user_type || '',
                user_source: editedRecords?.retail_user?.user_source || '',
                user_role: ""
            },
            master: {
                user_name: editedRecords?.master?.user_name || '',
                user_id: editedRecords?.master?.user_id || '',
            },
            manager: {
                user_name: `${store.user.login}`,
                user_id: `${store.manager_id || ''}`,
            },
            device: {
                device_id: editedRecords.device_id || '',
                device_model_id: editedRecords?.device?.device_model_id || '',
                device_sale_date: "",
                device_type_id: editedRecords?.device?.device_type_id || '',
                device_type: editedRecords?.device?.device_type || '',
                device_brand_id: editedRecords?.device?.device_brand_id || '',
                device_full_model: editedRecords?.device?.device_full_model || '',
                device_brand: editedRecords?.device?.device_brand || '',
                device_model: editedRecords?.device?.device_model || '',
                device_excel_model: "",
                device_sn: editedRecords?.device?.device_sn || '',
                device_imei: editedRecords?.device?.device_imei || '',
                device_appearance: editedRecords?.device?.device_appearance || '',
                device_equipment: editedRecords?.device?.device_equipment || '',
                device_stated_defect: editedRecords?.device?.device_stated_defect || '',
            },
            comment: editedRecords?.comment || '',
            parts: editedRecords?.parts || [],
            works: editedRecords?.works || [],
            sources: {
                sources_id: editedRecords?.sources?.sources_id || '',
                sources_name: editedRecords?.sources?.sources_name || ''
            }
        };
        console.log('Saving with data:', requestData);

        try {
            const response = await fetch('/api/neworder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const responseData = await response.json();
            console.log('Data received:', responseData);
            setRecords({ ...editedRecords });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRecords(prevRecords => {
            let updatedRecords = { ...prevRecords };
            let nestedObj = updatedRecords;

            const keys = name.split('.');
            for (let i = 0; i < keys.length - 1; i++) {
                if (!nestedObj[keys[i]]) {
                    nestedObj[keys[i]] = {};
                }
                nestedObj = nestedObj[keys[i]];
            }
            nestedObj[keys[keys.length - 1]] = value;

            return updatedRecords;
        });
    };
    const renderData = () => {
        if (isLoading) {
            return (
                <div className="loading-animation"> <img src="/pic/LogoAnims.svg" alt="" /></div>
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
                        <div className="OrderDefect">
                            <h2>Пользователь:</h2>
                            {isEditing ? (
                                <input
                                    name="retail_user.user_name"
                                    value={editedRecords.retail_user.user_name}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.retail_user.user_name || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Тип пользователя:</h2>
                            {isEditing ? (
                                <input
                                    name="retail_user.user_type"
                                    value={editedRecords.retail_user.user_type}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.retail_user.user_type || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Номер телефона:</h2>
                            {isEditing ? (
                                <input
                                    name="retail_user.user_phone"
                                    value={editedRecords.retail_user.user_phone}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.retail_user.user_phone || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Адрес:</h2>
                            {isEditing ? (
                                <input
                                    name="retail_user.user_address"
                                    value={editedRecords.retail_user.user_address}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.retail_user.user_address || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Дата заказа:</h2>
                            {isEditing ? (
                                <input
                                    name="order_date"
                                    value={editedRecords.order_date}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.order_date || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Модель устройства:</h2>
                            {isEditing ? (
                                <input
                                    name="device.device_brand"
                                    value={editedRecords.device.device_brand}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.device.device_brand || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Внешний вид:</h2>
                            {isEditing ? (
                                <input
                                    name="device.device_appearance"
                                    value={editedRecords.device.device_appearance}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.device.device_appearance || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Комплектация:</h2>
                            {isEditing ? (
                                <input
                                    name="device.device_equipment"
                                    value={editedRecords.device.device_equipment}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.device.device_equipment || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Номер модели:</h2>
                            {isEditing ? (
                                <input
                                    name="device.device_model"
                                    value={editedRecords.device.device_model}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.device.device_model || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Статус:</h2>
                            {isEditing ? (
                                <input
                                    name="order_status"
                                    value={editedRecords.order_status}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.order_status || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Серийный номер модели:</h2>
                            {isEditing ? (
                                <input
                                    name="device.device_sn"
                                    value={editedRecords.device.device_sn}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.device.device_sn || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>IMEI:</h2>
                            {isEditing ? (
                                <input
                                    name="device.device_imei"
                                    value={editedRecords.device.device_imei}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.device.device_imei || 'Не указано'}</p>
                            )}
                        </div>
                        <div className="OrderDefect">
                            <h2>Дефект:</h2>
                            {isEditing ? (
                                <input
                                    name="device.device_stated_defect"
                                    value={editedRecords.device.device_stated_defect}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <p>{records.device.device_stated_defect || 'Не указано'}</p>
                            )}
                        </div>
                        {/* {!isEditing && <button onClick={handleEdit}>Редактировать</button>} */}
                        {isEditing && <button onClick={handleSave}>Сохранить</button>}
                        {isEditing && <button onClick={handleEditFalse}>Отмена</button>}
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
                            <div className="container-search-sms-block">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder='Сообщение'>
                                </textarea>
                                <button onClick={handleSendSMS}>Отправить смс</button>
                            </div>
                            <div className="container-search-sms-block">                          
                                <label className='input-column'>
                                    <select value={selectedReceptionNumber} onChange={handleReceptionNumberChange}>
                                        <option value="" disabled hidden>Номер приёмки</option>
                                        <option value="101">Салмышская</option>
                                        <option value="201">Туркистансикая</option>
                                        <option value="301">Бретская</option>
                                    </select>
                                </label>
                                <button onClick={handleNotifyClient}>Позвонить клиенту</button>
                            </div>
                        </div>
                    </div>
                </div>
                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
                            <p>{modalMessage}</p>
                        </div>
                    </div>
                )}
                {/* <div className="container-search-result-staff">
                    {records.staff[0] && (
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
                    )}
                </div> */}
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
