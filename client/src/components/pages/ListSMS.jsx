import React, { useEffect, useState } from 'react';
import { GoTriangleDown } from 'react-icons/go';

function ListSMS() {
    const [smsList, setSMSList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isSMSVisible, setIsSMSVisible] = useState(false);
    const [newSMS, setNewSMS] = useState({
        template_type: '',
        template_text: ''
    });
    const [editingSMS, setEditingSMS] = useState(null);
    const [updatedSMS, setUpdatedSMS] = useState({
        template_type: '',
        template_text: ''
    });

    useEffect(() => {
        fetchSMS();
    }, []);

    // Получение списка SMS-шаблонов
    const fetchSMS = async () => {
        try {
            const response = await fetch('/api/alltemplate', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const data = await response.json();
            setSMSList(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching SMS templates:', error);
            setLoading(false);
        }
    };

    // Удаление SMS-шаблона по ID
    const deleteSMS = async (smsId) => {
        try {
            await fetch(`/api/deletetemplate/${smsId}`, {
                method: 'DELETE',
            });
            setSMSList(smsList.filter(sms => sms.template_id !== smsId));
            handleMessage('Шаблон успешно удален');
        } catch (error) {
            console.error('Error deleting SMS template:', error);
            handleMessage('Ошибка при удалении шаблона');
        }
    };

    // Обновление SMS-шаблона
    const updateSMS = async (updatedData) => {
        const { template_id, ...rest } = updatedData;
        try {
            const response = await fetch(`/api/puttemplate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ template_id, ...rest }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            handleMessage('Шаблон успешно обновлен');
            fetchSMS();
        } catch (error) {
            console.error('Error updating SMS template:', error);
            handleMessage('Ошибка при обновлении шаблона');
        }
    };

    // Обработка сообщений об ошибках и успехе
    const handleMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    // Обработка добавления нового SMS-шаблона
    const handleAddSMS = async () => {
        if (!newSMS.template_type || !newSMS.template_text) {
            handleMessage('Пожалуйста, заполните все поля');
            return;
        }
    
        try {
            const response = await fetch('/api/posttemplate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSMS),
            });
    
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
    
            const addedSMS = await response.json();
            // Проверьте структуру данных
            console.log('Added SMS template:', addedSMS);
    
            // Вместо проверки на `addedSMS.template`, обновите SMSList после вызова fetchSMS
            // если `addedSMS` содержит сообщение об успешном добавлении
            if (addedSMS.message === 'Шаблон успешно добавлен') {
                // Очистите поля формы
                setNewSMS({ template_type: '', template_text: '' });
                // Обновите список шаблонов
                fetchSMS();
                handleMessage('Шаблон успешно добавлен');
            } else {
                console.error('Unexpected response structure:', addedSMS);
            }
        } catch (error) {
            console.error('Error adding SMS template:', error);
            handleMessage('Ошибка при добавлении шаблона');
        }
    };
    
    // Обработка изменения значений полей формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSMS(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Запуск режима редактирования
    const handleEdit = (sms) => {
        setEditingSMS(sms.template_id);
        setUpdatedSMS({
            template_type: sms.template_type,
            template_text: sms.template_text
        });
    };

    // Сохранение изменений
    const handleSaveEdit = async (smsId) => {
        try {
            await updateSMS({ template_id: smsId, ...updatedSMS });
            setEditingSMS(null);
            handleMessage('Изменения сохранены');
        } catch (error) {
            console.error('Error updating SMS:', error);
            handleMessage('Ошибка при сохранении изменений');
        }
    };
    // Отмена редактирования
    const handleCancelEdit = () => {
        setEditingSMS(null);
        setUpdatedSMS({ template_type: '', template_text: '' });
    };

    return (
        <>
            <div className={`staff ${isSMSVisible ? 'expanded' : ''}`}>
                <h2 className={`staffh2 ${isSMSVisible ? 'staffh2Active' : ''}`} onClick={() => setIsSMSVisible(!isSMSVisible)}>
                    Шаблоны СМС <GoTriangleDown className={`icon ${isSMSVisible ? 'rotate' : ''}`} />
                </h2>
                {isSMSVisible && (
                    <>
                        <div>{message}</div>
                        <div className="table-container">
                            <table>
                                <thead className='table-container-mobail'>
                                    <tr>
                                        <th>Тип</th>
                                        <th>Текст</th>
                                        <th colSpan="3">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className='table-container-mobail-tbody'>
                                    {smsList.map((sms) => (
                                        <tr key={sms.template_id}>
                                            <td>
                                                {editingSMS === sms.template_id ? (
                                                    <input
                                                        type="text"
                                                        className='sms-type'
                                                        name="template_type"
                                                        value={updatedSMS.template_type}
                                                        onChange={(e) => setUpdatedSMS({ ...updatedSMS, template_type: e.target.value })}
                                                    />
                                                ) : (
                                                    sms.template_type
                                                )}
                                            </td>
                                            <td>
                                                {editingSMS === sms.template_id ? (
                                                    <input
                                                        type="text"
                                                        className='printer-url'
                                                        name="template_text"
                                                        value={updatedSMS.template_text}
                                                        onChange={(e) => setUpdatedSMS({ ...updatedSMS, template_text: e.target.value })}
                                                    />
                                                ) : (
                                                    sms.template_text
                                                )}
                                            </td>
                                            <td className='printer-btn'>
                                                {editingSMS === sms.template_id ? (
                                                    <>
                                                        <button onClick={() => handleSaveEdit(sms.template_id)}>Сохранить</button>
                                                        <button onClick={() => deleteSMS(sms.template_id)}>Удалить</button>
                                                        <button onClick={handleCancelEdit}>Отмена</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleEdit(sms)}>Редактировать</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className='printer-url'
                                                placeholder='Тип'
                                                name="template_type"
                                                value={newSMS.template_type}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className='printer-url'
                                                placeholder='Текст сообщения'
                                                name="template_text"
                                                value={newSMS.template_text}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td colSpan="2" className="printer-btn">
                                            <button onClick={handleAddSMS}>Добавить</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default ListSMS;
