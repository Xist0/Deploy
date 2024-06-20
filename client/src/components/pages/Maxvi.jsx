import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Messenger from './messenger/Messenger';

function Maxvi() {
    const [isLoading, setIsLoading] = useState(false);
    const [number, setNumber] = useState('');
    const [isItsLoading, setIsItsLoading] = useState(false);
    const [records, setRecords] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selectedDefect, setSelectedDefect] = useState('');
    const [defectsList, setDefectsList] = useState([]);
    const [selectedPart, setSelectedPart] = useState('');
    const [partsList, setPartsList] = useState([]);
    const [worksList, setWorksList] = useState([]);
    const [manualPartName, setManualPartName] = useState('');
    const [manualPartPrice, setManualPartPrice] = useState('');
    const [selectedWork, setSelectedWork] = useState('');
    const [aktData, setAktData] = useState({
        device_defect_parts: [],
        device_defect_causes: [],
        device_location_after: '',
        act_issuing_reason: ''
    });
    const [partsData, setPartsData] = useState(null);
    const [selectedDefectPart, setSelectedDefectPart] = useState('');
    const [selectedDefectCause, setSelectedDefectCause] = useState('');
    const [selectedLocationAfter, setSelectedLocationAfter] = useState('');
    const [selectedIssuing, setSelectedIssuing] = useState('');
    const [showManualDefectCause, setShowManualDefectCause] = useState(false);
    const [showManualDefectParts, setShowManualDefectParts] = useState(true);
    const [combinedPartsData, setCombinedPartsData] = useState(null);
    const [manualDefectCause, setManualDefectCause] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [manualDefectCauseParts, setManualDefectCauseParts] = useState('');
    const [showRejectReson, setshowRejectReson] = useState('');
    const [manualDefectPartsReason, setManualDefectPartsReason] = useState('');
    const [actIssuingReasonDescription, setActIssuingReasonDescription] = useState(false);
    const [deviceErrors, setDeviceErrors] = useState({
        device_id: '',
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
    const [allFieldsSelected, setAllFieldsSelected] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalReject, setShowModalReject] = useState(false);
    const [showModalParts, setShowModalParts] = useState(false);

    useEffect(() => {
        if (selectedIssuing && selectedDefectPart && selectedDefectCause && selectedLocationAfter) {
            setAllFieldsSelected(true);
        } else {
            setAllFieldsSelected(false);
        }
    }, [selectedIssuing, selectedDefectPart, selectedDefectCause, selectedLocationAfter]);
    useEffect(() => {
        const isValid = Object.values(deviceErrors).every(value => !value);
        setIsSaveEnabled(isValid);
    }, [deviceErrors]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchMaxvi(searchValue);
        }
    };

    const handleManualDefectCauseChange = (e) => {
        const value = e.target.value;
        setManualDefectCause(value);
    };

    const handleRejectReason = (e) => {
        const value = e.target.value
        setRejectReason(value)
    }

    const handleSelectedIssuingChange = (e) => {
        const value = e.target.value;
        setManualDefectCauseParts(value);
    };

    const handleManualDefectPartsChange = (e) => {
        const value = e.target.value;
        setManualDefectPartsReason(value);
    };

    const handleSelectedDefectPartChange = (e) => {
        const value = e.target.value;
        setSelectedDefectPart(value);
    };

    const handleSelectedDefectCauseChange = (e) => {
        const value = e.target.value;
        setSelectedDefectCause(value);
    };

    const handleSelectedLocationAfterChange = (e) => {
        const value = e.target.value;
        setSelectedLocationAfter(value);
    };


    const handleResponseError = (response) => {
        if (response.status === 500) {
            alert('Произошла ошибка сервера. Пожалуйста, попробуйте еще раз или обратитесь к администратору.');
            window.location.reload();
        }
    };[handleResponseError]

    const handleDataCombination = (partsDataFromManualSubmit, partsDataFromList) => {
        if (partsDataFromManualSubmit && partsDataFromList) {
            const combinedData = {
                act_issuing_reason: partsDataFromManualSubmit.act_issuing_reason,
                device: {
                    device_defect_parts: partsDataFromList.device.device_defect_parts,
                    device_defect_causes: partsDataFromList.device.device_defect_causes,
                    device_location_after: partsDataFromList.device.device_location_after
                }
            };
            setCombinedPartsData(combinedData);
        }
    };

    useEffect(() => {
        handleDataCombination(partsData, partsData);
    }, [partsData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecords(prevState => ({
            ...prevState,
            device: {
                ...prevState.device,
                [name]: value
            }
        }), () => {
            validateForm(); // Вызываем валидацию после обновления состояния
        });
    };

    const validateForm = () => {
        const errors = { ...deviceErrors };
        let isFormValid = true;
        Object.keys(errors).forEach(key => {
            if (!records.device[key] && key !== 'device_sale_date') {
                errors[key] = 'This field is required';
                isFormValid = false;
            } else {
                errors[key] = '';
            }
        });
        setDeviceErrors(errors);
        setIsSaveEnabled(isFormValid);
    };
    const validateField = (fieldName, value) => {
        const errors = { ...deviceErrors };
        let isFormValid = true;
        if (!value) {
            errors[fieldName] = 'This field is required';
            isFormValid = false;
        } else {
            errors[fieldName] = '';
        }
        setDeviceErrors(errors);
        setIsSaveEnabled(isFormValid);
    };

    const handleBlur = () => {
        validateForm();
    };
    const fetchMaxvi = async () => {
        if (searchValue.trim() === '') {
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/WarrantyOrdermaxvi/${encodeURIComponent(searchValue)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const responseExternal = await fetch(`/api/GetExternalLinkAndSendData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data })
            });
            if (!responseExternal.ok) {
                throw new Error(`HTTP error! Status: ${responseExternal.status}`);
            }
            const dataExternal = await responseExternal.json();
            setDefectsList(dataExternal.device.device_defects);
            setRecords(data);
            // Обнуляем выбранные элементы
            setSelectedIssuing('');
            setSelectedDefectPart('');
            setSelectedDefectCause('');
            setSelectedLocationAfter('');
            setSelectedWork('');
            setSelectedPart('');
            setManualPartName('');
            setManualPartPrice('');
            // Обнуляем состояние ошибок устройства
            setDeviceErrors({
                device_id: '',
                device_full_model: '',
                device_type: '',
                device_brand: '',
                device_model: '',
                device_sn: '',
                device_imei: '',
                device_appearance: '',
                device_equipment: '',
            });

            // Очищаем состояние списка работ и деталей
            setWorksList([]);
            setPartsList([]);

            // Сбрасываем состояние акта
            setAktData({
                device_defect_parts: [],
                device_defect_causes: [],
                device_location_after: '',
                act_issuing_reason: ''
            });

            // Сбрасываем данные о частях
            setPartsData(null);

            // Очищаем ручное описание причины дефекта
            setManualDefectCause('');
            setManualDefectPartsCause('');

            // Проверяем форму после загрузки данных
            validateForm();

        } catch (error) {
            console.error('Error fetching data:', error);
            // Извлечение поля "error" из текста ошибки
            const errorMessage = error.message.match(/"error":\s*"([^"]+)"/);
            alert(errorMessageText);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (records.device) {
            validateForm();
        }
    }, [records.device]);

    useEffect(() => {
        const isFormValid = Object.values(records.device || {}).every(value => value);
        setIsSaveEnabled(isFormValid);
    }, [records]);
    const handleWorkChange = async (e) => {
        const { value } = e.target;
        setSelectedWork(value);

        sendSelectedWork(value);
    };
    const handleDataChange = (field, value) => {
        setAktData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };
    const handleDefectChange = async (e) => {
        const { value } = e.target;
        setSelectedDefect(value);
        if (selectedDefect !== value) {
            setSelectedWork('');
        }
        try {
            const response = await fetch(`/api/SendDefectToExternalLink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: records.url,
                    device: {
                        ...records.device,
                        device_defects: [value]
                    }
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log('Response from external server:', responseData);
            const extractedWorks = responseData.works.map(work => work.work_name);
            setWorksList(extractedWorks);
            const extractedParts = responseData.parts.filter(part => part.part_name);
            setPartsList(extractedParts);
        } catch (error) {
            console.error('Error sending defect to external link:', error);
            // alert(error.message || 'Ошибка загрузки данных');
        }
    };


    const sendSelectedWork = async (selectedWork) => {
        try {
            const response = await fetch(`/api/GetAllWorks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: records.url,
                    works: [{
                        ...records.works[0],
                        work_name: selectedWork
                    }]
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseData = await response.json();
            const filteredParts = responseData.parts.filter(part => part.part_name);
            setPartsList(filteredParts);

            if (!responseData.part_required) {
                handleManualSubmitfalse();
            }
            console.log('Response from server:', responseData);
        } catch (error) {
            console.error('Error sending selected work:', error);
            // alert(error.message || 'Ошибка загрузки данных');
        }
        finally {
            setIsItsLoading(false); // Здесь устанавливаем false в конце блока
        }
    };


    const handleManualSubmitfalse = async () => {
        setIsItsLoading(true)
        try {
            const response = await fetch(`/api/GetAllParts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: records.url,
                    parts: []
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Response from server:', responseData);
            setPartsData(responseData);
            setManualPartName('');
            setManualPartPrice('');
            setShowManualDefectParts(responseData.device.device_defect_parts === true)
            if (responseData.device.device_defect_parts === true) {
                setShowModalParts(true)
            }
            setshowRejectReson(responseData.reject_reason === true)
            if (
                setShowModalReject(true)
            )
                setShowManualDefectCause(responseData.device.device_defect_causes === true);
            if (responseData.device.device_defect_causes === true) {
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(error.message || 'Ошибка загрузки данных');
        } finally {
            setIsItsLoading(false);
        }
    };



    // Отправка с полей для ручного ввода данных
    const handleManualSubmit = async () => {
        if (manualPartName && manualPartPrice) {
            const newPart = {
                part_id: '',
                part_name: manualPartName,
                part_price: manualPartPrice
            };
            setIsItsLoading(true);
            try {
                const response = await fetch(`/api/GetAllParts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        link: records.url,
                        parts: [newPart]
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const responseData = await response.json();
                console.log('Response from server:', responseData);
                setManualPartName('');
                setManualPartPrice('');
                setShowManualDefectParts(responseData.device.device_defect_parts === true)
                if (responseData.device.device_defect_parts === true) {
                    setShowModalParts(true)
                }
                setshowRejectReson(responseData.reject_reason === true)
                if (
                    setShowModalReject(true)
                )
                    setShowManualDefectCause(responseData.device.device_defect_causes === true);
                if (responseData.device.device_defect_causes === true) {
                    setShowModal(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert(error.message || 'Ошибка загрузки данных');
            } finally {
                setIsItsLoading(false); // Здесь устанавливаем false в конце блока
            }
        }
    };


    const handlePartChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedPart(selectedValue);
        sendSelectedPart(partsList.find(part => part.part_id === selectedValue));
    };

    // Отправка из списка 
    const sendSelectedPart = async (selectedPartObject) => {
        setIsItsLoading(true);
        try {
            const response = await fetch(`/api/GetAllParts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: records.url,
                    parts: [{
                        part_id: selectedPartObject.part_id,
                        part_name: selectedPartObject.part_name,
                        part_price: selectedPartObject.part_price
                    }]
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log('Response from server:', responseData);
            setPartsData(responseData)
            setManualPartName('');
            setManualPartPrice('');
            setshowRejectReson(responseData.reject_reason === true)
            if (
                setShowModalReject(true)
            )
                setShowManualDefectCause(responseData.device.device_defect_causes === true);
            if (responseData.device.device_defect_causes === true) {
                setShowModal(true);
            }
            setShowManualDefectParts(responseData.device.device_defect_parts === true)
            if (responseData.device.device_defect_parts === true) {
                setShowModalParts(true)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert(error.message || 'Ошибка загрузки данных');
        } finally {
            setIsItsLoading(false);
        }
    };

    const handleCheckboxChange = (field, value, checked) => {
        if (checked) {
            handleDataChange(field, [...aktData[field], value]);
        } else {
            handleDataChange(field, aktData[field].filter(item => item !== value));
        }
    };
    // Функция для сохранения данных
    const handleSave = async () => {
        if (actIssuingReasonDescription || showManualDefectCause) {
            handleFinish();
        } else {
            await handleAktSave(); // Дождаться завершения запроса
        }
    };


    const handleAktSave = async () => {
        setIsItsLoading(true);
        try {
            let defectCause;
            if (Array.isArray(partsData.device.device_defect_causes)) {
                defectCause = partsData.device.device_defect_causes.includes(true)
                    ? manualDefectCauseParts
                    : selectedDefectCause;
            } else {
                defectCause = selectedDefectCause;
            }

            const response = await fetch(`/api/SaveAktData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    link: records.url,
                    reject_reason: rejectReason,
                    act_issuing_reason: selectedIssuing,
                    device: {
                        device_defect_parts: manualDefectPartsReason.trim() !== '' ? [manualDefectPartsReason] : [],
                        device_defect_causes: [defectCause],
                        device_location_after: selectedLocationAfter
                    },
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Response from server:', responseData);

                setShowManualDefectCause(responseData.device.device_defect_causes === true);
                setActIssuingReasonDescription(responseData.act_issuing_reason_description);
                if (responseData.device.device_defect_causes === true) {
                    setShowModal(true);
                }
                setManualPartName('');
                setManualPartPrice('');
                if (response.status === 201) {
                    alert('Успех!');
                    window.location.reload();
                }
            } else {
                const errorText = await response.text();
                console.error('Error saving akt data:', errorText);
                const errorMessage = errorText.match(/"error":\s*"([^"]+)"/);
                const error = errorMessage ? errorMessage[1] : 'Ошибка загрузки данных';
                alert(error);
            }


        } catch (error) {
            console.error('Error saving akt data:', error);
            alert(error.message || 'Ошибка загрузки данных');
        } finally {
            setIsItsLoading(false);
        }
    };



    const handleFinish = async () => {
        setIsLoading(true);

        try {
            const formData = {
                act_issuing_reason_description: actIssuingReasonDescription ? manualDefectCause : "",
                device: {
                    device_defect_causes: [manualDefectCauseParts],
                }
            };

            const response = await fetch(`/api/Finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formData })
            });
            const responseData = await response.json();
            console.log('Response from server:', responseData);
            if (response.status === 201) {
                alert('Успех!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error finishing data:', error);
            alert(error.message || 'Ошибка загрузки данных');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <div className="container-box">
                <div className="maxvi-header">
                    <input
                        type="text"
                        placeholder="Введите номер заказа"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={() => fetchMaxvi(searchValue)}>Найти</button>
                </div>
                <div className="container-maxvi">
                    {isLoading ? (
                        <div className="loading-animation">
                            <img src="/pic/LogoAnims.svg" alt="" />
                        </div>
                    ) : (
                        records && (
                            <div className="order-details">
                                <div className="order-details-header">
                                    <div className="section-order-maxvi">
                                        <h1>Заказ {records.order_id}</h1>
                                        <div className="table-row">
                                            <div className="table-cell">Дата заказа: {records.order_date}</div>
                                            <div className="table-cell">Тип заказа: {records.order_type}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-details-main-container">
                                    <div className="order-details-main-container-sell">
                                        <div className="section-seller">
                                            <h1>Продавец</h1>
                                            {records.retail_user && (
                                                <div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Имя продавца:</div>
                                                        <div className="table-cell">{records.retail_user.user_name}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Номер телефона:</div>
                                                        <div className="table-cell">{records.retail_user.user_phone}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Адрес:</div>
                                                        <div className="table-cell">{records.retail_user.user_address}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Физический адрес:</div>
                                                        <div className="table-cell">{records.retail_user.user_legal_address}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Тип продавца:</div>
                                                        <div className="table-cell">{records.retail_user.user_type}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className='section'>
                                            <h1>Устройство</h1>
                                            {records.device && (
                                                <div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Номер устройства:</div>
                                                        <input
                                                            type="text"
                                                            name="device_id"
                                                            value={records.device.device_id || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_id ? 'empty-field' : 'table-input'}
                                                        />

                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Дата продажи:</div>
                                                        <input
                                                            type="text"
                                                            name="device_sale_date"
                                                            value={records.device.device_sale_date}
                                                            onChange={handleChange}

                                                            className={'table-input'}
                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Полная модель:</div>
                                                        <input
                                                            type="text"
                                                            name="device_full_model"
                                                            value={records.device.device_full_model || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_full_model ? 'empty-field' : 'table-input'}
                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Тип устройства:</div>
                                                        <input
                                                            type="text"
                                                            name="device_type"
                                                            value={records.device.device_type || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_type ? 'empty-field' : 'table-input'}
                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Бренд:</div>
                                                        <input
                                                            type="text"
                                                            name="device_brand"
                                                            value={records.device.device_brand || 'table-input'}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_brand ? 'empty-field' : 'table-input'}
                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Модель:</div>
                                                        <input
                                                            type="text"
                                                            name="device_model"
                                                            value={records.device.device_model || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_model ? 'empty-field' : 'table-input'}
                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Серийник:</div>
                                                        <input
                                                            type="text"
                                                            name="device_sn"
                                                            value={records.device.device_sn || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_sn ? 'empty-field' : 'table-input'}
                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">IMEI:</div>
                                                        <input
                                                            type="text"
                                                            name="device_imei"
                                                            value={records.device.device_imei || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_imei ? 'empty-field' : 'table-input'}
                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Внешний вид:</div>
                                                        <input
                                                            type="text"
                                                            name="device_appearance"
                                                            value={records.device.device_appearance || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_appearance ? 'empty-field' : 'table-input'}

                                                        />
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Комплектация:</div>
                                                        <input
                                                            type="text"
                                                            name="device_equipment"
                                                            value={records.device.device_equipment || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className={deviceErrors.device_equipment ? 'empty-field' : 'table-input'}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="section">
                                            <h1>Покупатель</h1>
                                            {records.end_user && (
                                                <div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Имя покупателя:</div>
                                                        <div className="table-cell">{records.end_user.user_name}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Номер телефона:</div>
                                                        <div className="table-cell">{records.end_user.user_phone}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Адрес:</div>
                                                        <div className="table-cell">{records.end_user.user_address}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Физический адрес:</div>
                                                        <div className="table-cell">{records.end_user.user_legal_address}</div>
                                                    </div>
                                                    <div className="table-row">
                                                        <div className="table-cell">Тип покупателя:</div>
                                                        <div className="table-cell">{records.end_user.user_type}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                                <div className="order-details-main-container-zapchasti">
                                    {!isSaveEnabled && (
                                        <p>Заполните все поля для продолжения</p>
                                    )}
                                    {isSaveEnabled && records && records.device && defectsList && (
                                        <>
                                            <div className="dropdown">
                                                <select value={selectedDefect} onChange={handleDefectChange} disabled={combinedPartsData && partsData}>
                                                    <option value="" hidden>Выберите дефект</option>
                                                    {defectsList.map((defect, index) => (
                                                        <option key={index} value={defect}>{defect}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {selectedDefect && worksList && worksList.length > 0 && (
                                                <div className="dropdown">
                                                    <select name="select" value={selectedWork} onChange={handleWorkChange} disabled={combinedPartsData && partsData}>
                                                        <option value="" hidden>Выберите работу</option>
                                                        {worksList.map((work, index) => (
                                                            <option key={index} className="select-option" value={work}>{work}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {worksList && partsList && partsList.length > 0 && (
                                                <div className='parts-app'>
                                                    <div className="dropdown">
                                                        <select value={selectedPart} onChange={handlePartChange} disabled={combinedPartsData && partsData}>
                                                            <option value="" hidden>Выберите запчасть</option>
                                                            {partsList.map((part, index) => (
                                                                <option key={index} value={part.part_id} className="select-option">{part.part_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {partsList.length > 0 && (
                                                        <div className='parts-dropdown-add'>
                                                            <input
                                                                type="text"
                                                                value={manualPartName}
                                                                onChange={(e) => setManualPartName(e.target.value)}
                                                                placeholder="Название запчасти"
                                                                disabled // Делаем поле неактивным
                                                                style={{ background: '#f0f0f0' }} // Добавляем серый фон
                                                            />
                                                            <input
                                                                type="number"
                                                                value={manualPartPrice}
                                                                onChange={(e) => setManualPartPrice(e.target.value)}
                                                                placeholder="Цена запчасти"
                                                                disabled м
                                                                style={{ background: '#f0f0f0' }}
                                                            />
                                                            <button onClick={handleManualSubmit} disabled style={{ cursor: 'not-allowed' }}>Добавить</button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {partsData && (isItsLoading ? (
                                                <div className="loading-animation">
                                                    <img src="/pic/LogoAnims.svg" alt="" />
                                                </div>
                                            ) : (
                                                <div className="order-details-main-container-zapchasti">
                                                    <div className="dropdown">
                                                        {showManualDefectParts && (
                                                            <div className="dropdown ">
                                                                <h5>Не подлежит дальнейшей эксплуатации</h5>
                                                                <div className="parts-dropdown-add">
                                                                    <input
                                                                        value={manualDefectPartsReason}
                                                                        placeholder='По причине выхода из строя следующих блоков'
                                                                        onChange={handleManualDefectPartsChange}
                                                                        style={{ borderColor: manualDefectPartsReason.length > 2 ? '' : 'red' }}
                                                                    />

                                                                    <select value={selectedIssuing} onChange={(e) => setSelectedIssuing(e.target.value)}>
                                                                        <option value="" >Причина выдачи акта</option>
                                                                        {Array.isArray(partsData.act_issuing_reason) && partsData.act_issuing_reason.length > 0 ?
                                                                            partsData.act_issuing_reason.map((part, index) => (
                                                                                <option key={index} value={part} className="select-option">{part}</option>
                                                                            )) : null
                                                                        }
                                                                    </select>
                                                                    {actIssuingReasonDescription && (
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Введите причину"
                                                                            value={manualDefectCause}
                                                                            onChange={handleManualDefectCauseChange}
                                                                            style={{ borderColor: manualDefectCause.length > 3 ? '' : 'red' }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {partsData.device.device_defect_parts && Array.isArray(partsData.device.device_defect_parts) && (
                                                            <select value={selectedDefectPart} onChange={(e) => setSelectedDefectPart(e.target.value)}>
                                                                <option value="" hidden>Неисправная запчасть</option>
                                                                {partsData.device.device_defect_parts.map((part, index) => (
                                                                    <option key={index} value={part} className="select-option">{part}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                        {showRejectReson && (
                                                            <div className='parts-dropdown-add dropdown'>
                                                                <h5>Причина откраза в гарантийном ремонте</h5>
                                                                <input type="text"
                                                                    placeholder='По причине'
                                                                    value={rejectReason}
                                                                    onChange={handleRejectReason}
                                                                    style={{ borderColor: rejectReason.length > 3 ? '' : 'red' }}
                                                                />
                                                            </div>

                                                        )}
                                                        {partsData.device.device_defect_causes && partsData.device.device_defect_causes.length > 0 && (
                                                            <div className='parts-dropdown-add dropdown'>
                                                                <h5>Изделине находится в вышеуказанном состоянии по причине</h5>
                                                                <select
                                                                    value={selectedDefectCause}
                                                                    onChange={(e) => setSelectedDefectCause(e.target.value)}
                                                                >
                                                                    <option value="" hidden>
                                                                        Изделине находится в вышеуказанном состоянии по причине:
                                                                    </option>
                                                                    {partsData.device.device_defect_causes.map((cause, index) => (
                                                                        <option key={index} value={cause} className="select-option">
                                                                            {cause}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        )}


                                                        {showManualDefectCause && (

                                                            <div className="parts-dropdown-add">
                                                                <input
                                                                    placeholder='По причине:'
                                                                    value={manualDefectCauseParts}
                                                                    onChange={handleSelectedIssuingChange}
                                                                    style={{ borderColor: manualDefectCauseParts > 3 ? '' : 'red' }}
                                                                />
                                                            </div>

                                                        )}
                                                        <h5>Местонахождение изделия после осведетельства</h5>
                                                        <select value={selectedLocationAfter} onChange={(e) => setSelectedLocationAfter(e.target.value)}>
                                                            <option value="" hidden>Местонахождение изделия после осведетельства</option>
                                                            {partsData.device.device_location_after.length > 0 && Array.isArray(partsData.device.device_location_after) && (
                                                                partsData.device.device_location_after.map((location, index) => (
                                                                    <option key={index} value={location} className="select-option">{location}</option>
                                                                ))
                                                            )}
                                                        </select>


                                                        {isItsLoading && (
                                                            <div className="loading-animation">
                                                                <img src="/pic/LogoAnims.svg" alt="" />
                                                            </div>
                                                        )}
                                                        {!isItsLoading && (
                                                            <button onClick={handleSave} disabled={isItsLoading}>
                                                                Сохранить
                                                            </button>
                                                        )}
                                                    </div>

                                                </div>
                                            )
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Messenger />
        </div>
    );
}

export default Maxvi;