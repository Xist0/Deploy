import React, { useState } from 'react';
import Header from '../Header';

function WarrantyRepair() {
    const [searchValue, setSearchValue] = useState('');
    const [editedData, setEditedData] = useState(null);
    const [deviceData, setDeviceData] = useState(null);
    const [deviceErrors, setDeviceErrors] = useState({
        device_id: '',
        device_sale_date: '',
        device_full_model: '',
        device_type: '',
        device_brand: '',
        device_model: '',
        device_sn: '',
        device_imei: '',
        device_appearance: '',
        device_equipment: '',
    });
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    function validateForm() {
        const errors = { ...deviceErrors };
        let isFormValid = true;

        // Проверяем каждое поле на наличие ошибок
        Object.keys(errors).forEach(key => {
            if (!deviceData[key]) {
                errors[key] = 'This field is required';
                isFormValid = false;
            } else {
                errors[key] = '';
            }
        });

        // Обновляем состояние ошибок и доступности кнопки "Сохранить"
        setDeviceErrors(errors);
        setIsSaveEnabled(isFormValid);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDeviceData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBlur = () => {
        validateForm(); // Вызываем валидацию при потере фокуса
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`/api/WarrantyOrdermaxvi/${encodeURIComponent(searchValue)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDeviceData(data.device);
            setEditedData(data);
            validateForm(); // Проверяем форму после загрузки данных
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSaveClick = () => {
        // Реализуем функционал сохранения здесь
        console.log('Data to be saved:', deviceData);
    };

    return (
        <div>

            <div className="container-box">
                <div className="WarrantySearch">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Введите номер заказа"
                    />
                    <button onClick={handleSubmit}>Найти</button>
                </div>
                {editedData && (
                    <div className="Warranty-Conteiner">
                        <div className="expanded-content-active">
                            <div className='section'>
                                <h1>Устройство</h1>
                                <div className="table-row">
                                    <div className="table-cell">Номер устройства:</div>
                                    <input
                                        type="text"
                                        name="device_id"
                                        value={deviceData?.device_id || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_id ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Дата продажи:</div>
                                    <input
                                        type="text"
                                        name="device_sale_date"
                                        value={deviceData?.device_sale_date || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_sale_date ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Полная модель:</div>
                                    <input
                                        type="text"
                                        name="device_full_model"
                                        value={deviceData?.device_full_model || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_full_model ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Тип устройства:</div>
                                    <input
                                        type="text"
                                        name="device_type"
                                        value={deviceData?.device_type || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_type ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Бренд:</div>
                                    <input
                                        type="text"
                                        name="device_brand"
                                        value={deviceData?.device_brand || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_brand ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Модель:</div>
                                    <input
                                        type="text"
                                        name="device_model"
                                        value={deviceData?.device_model || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_model ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Серийник:</div>
                                    <input
                                        type="text"
                                        name="device_sn"
                                        value={deviceData?.device_sn || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_sn ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">IMEI:</div>
                                    <input
                                        type="text"
                                        name="device_imei"
                                        value={deviceData?.device_imei || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_imei ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Состояние устройства:</div>
                                    <input
                                        type="text"
                                        name="device_appearance"
                                        value={deviceData?.device_appearance || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_appearance ? 'empty-field' : ''}
                                    />
                                </div>
                                <div className="table-row">
                                    <div className="table-cell">Комплектация:</div>
                                    <input
                                        type="text"
                                        name="device_equipment"
                                        value={deviceData?.device_equipment || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={deviceErrors.device_equipment ? 'empty-field' : ''}
                                    />
                                </div>
                            </div>
                            <div className='expanded-content-main-button'>
                                <button onClick={handleSaveClick} disabled={!isSaveEnabled} style={{ backgroundColor: isSaveEnabled ? '' : 'gray' }}>Сохранить</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WarrantyRepair;
