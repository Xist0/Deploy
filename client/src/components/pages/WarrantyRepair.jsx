import React, { useState, useEffect } from 'react';
import Messenger from './messenger/Messenger';
import axios from 'axios';
import { TbExclamationMark } from "react-icons/tb";


function WarrantyRepair() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [types, setTypes] = useState([]);
  const [receivedData, setReceivedData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({
    endUserName: '',
    deviceAppearance: '',
    deviceEquipment: '',
    deviceSaleDate: '',
    orderType: '',
    DeviceModel: '',
  });
  const [imei, setImei] = useState('');
  const minInputLength = 3;
  const minInputLengthsn = 10;
  useEffect(() => {
    fetchTypes();

  }, []);

  useEffect(() => {
    if (editedData) {
      const { end_user, device } = editedData;
      const isValiddeviceSn = device.device_sn && device.device_sn.trim().length >= minInputLengthsn;
      const isValidDeviceAppearance = device.device_appearance && device.device_appearance.trim().length >= minInputLength;
      const isValidDeviceEquipment = device.device_equipment && device.device_equipment.trim().length >= minInputLength;
      const isValidDeviceModel = device.device_model && device.device_model.trim().length >= minInputLength;
      setIsValid(
        isValidDeviceEquipment && isValiddeviceSn && isValidDeviceAppearance
      );
      setErrors({
        deviceAppearance: isValidDeviceAppearance ? '' : `Поле должно содержать не менее ${minInputLength} символов`,
        deviceSn: isValiddeviceSn ? '' : `Поле должно содержать не менее ${minInputLengthsn} символов`,
        deviceEquipment: isValidDeviceEquipment ? '' : `Поле должно содержать не менее ${minInputLength} символов`,
        deviceModel: isValidDeviceModel ? '' : `Поле должно содержать не менее ${minInputLength} символов`,
      });
    }
  }, [editedData, minInputLength, minInputLengthsn]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('/api/parser/warrantyorder', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Данные с файла:', response.data);
      const { data } = response;

      // Преобразование данных перед добавлением
      const formattedData = data.map(item => ({
        ...item,
        warrantyStatus: checkWarranty(item.device.device_sn), // Добавляем статус гарантии
      }));

      setReceivedData(formattedData);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkWarranty = (deviceSn) => {
    // Извлекаем год и месяц из серийного номера
    const year = parseInt(deviceSn.slice(-10, -6));
    const month = parseInt(deviceSn.slice(-6, -4));
    // Получаем текущую дату
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Проверяем год и месяц
    if (currentYear > year || (currentYear === year && currentMonth > month)) {
      return 'Гарантия закончилась';
    } else {
      return 'Гарантия еще действует';
    }
  };

  const toggleExpandedRow = (index, orderId) => {
    if (isEditing) return;

    if (expandedRow === index) {
      setExpandedRow(null);
      setSelectedOrderId(null);
    } else {
      setExpandedRow(index);
      setSelectedOrderId(orderId); // Сохраняем order_id при раскрытии строки
    }
  };

  const handleEditClick = (data) => {
    setEditedData(data);
    setEditMode(true);
    setIsEditing(true);
    setImei(data.device.device_imei);
  };

  const handleSaveClick = async () => {
    if (!isValid) {
      console.log('Please fill in all required fields.');
      return;
    }
    try {
      const { device, end_user } = editedData;
      const dataToSend = {
        ...editedData,
        device: {
          ...device,
          device_imei: imei,
          device_full_model: `${device.device_type} ${device.device_brand} ${device.device_model}`,
        },
        end_user: {
          ...end_user
        },
      };
      console.log('Data to send:', dataToSend);

      const response = await axios.post('/api/1c/WarrantyOrder', dataToSend);
      console.log('Response data:', response.data);
      if (response.status === 200 && response.data) {
        const responseData = response.data;
        const order_id = responseData.order_id || '';
        const order_Error = responseData.order_Error || 'Заказ наряд создан!';
        console.log('Данные успешно сохранены:', order_id);
        console.log('Статус заказа:', order_Error);
        alert(`Номер заказа: ${order_id}\nСтатус: ${order_Error}`);
      } else {
        console.log('Данные не получены или отсутствуют');
      }

      setEditMode(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setIsEditing(false);
  };
  const fetchTypes = async () => {
    try {
      const response = await fetch('/api/typeofrepaire');
      const data = await response.json();
      setTypes(data.types);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };
  const handleImeiChange = (e) => {
    setImei(e.target.value);
  };

  const renderEditButtons = () => {
    return (
      <div className='expanded-content-main-button'>
        <button disabled={!isValid} onClick={handleSaveClick} style={{ backgroundColor: isValid ? '' : 'gray' }}>Сохранить</button>
        <button onClick={handleCancelClick}>Отмена</button>
      </div>
    );
  };

  const renderEditModeContent = () => {
    const handleDeviceAppearance = (e) => {
      setEditedData({ ...editedData, device: { ...editedData.device, device_appearance: e.target.value } });
      setErrors({ ...errors, deviceAppearance: e.target.value.trim().length >= minInputLength ? '' : `Поле должно содержать не менее ${minInputLength} символов` });
    };
    const handleDeviceSn = (e) => {
      setEditedData({ ...editedData, device: { ...editedData.device, device_sn: e.target.value } });
      setErrors({ ...errors, deviceSn: e.target.value.trim().length >= minInputLengthsn ? '' : `Поле должно содержать не менее ${minInputLengthsn} символов` });
    };
    const handleDeviceEquipmentChange = (e) => {
      setEditedData({ ...editedData, device: { ...editedData.device, device_equipment: e.target.value } });
      setErrors({ ...errors, deviceEquipment: e.target.value.trim().length >= minInputLength ? '' : `Поле должно содержать не менее ${minInputLength} символов` });
    };

    const handlaDeviceModelChange = (e) => {
      setEditedData({ ...editedData, device: { ...editedData.device, device_model: e.target.value } });
      setErrors({ ...errors, deviceModel: e.target.value.trim().length >= minInputLength ? '' : `Поле должно содержать не менее ${minInputLength} символов` });
    };

    const handleEndUserAddressChange = (e) => {
      setEditedData({ ...editedData, end_user: { ...editedData.end_user, user_address: e.target.value } });
      setErrors({ ...errors, endUserAddress: '' });
    };

    const handleEndUserDateChange = (e) => {
      setEditedData({ ...editedData, device: { ...editedData.device, device_sale_date: e.target.value } });
      setErrors({ ...errors, endUserDate: '' });
    };

    const handleEndUserPhoneChange = (e) => {
      setEditedData({ ...editedData, end_user: { ...editedData.end_user, user_phone: e.target.value } });
    };

    const handleOrderType = (e) => {
      setEditedData({ ...editedData, order_type: e.target.value });
    };



    return (
      <div className="expanded-content-active">
        <div className='expanded-content-main'>
          <h1>Покупатель</h1>
          <h4>{editedData.end_user.user_name} </h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Внешний вид</h1>
          <div className="expanded-content-main-inpit">
            <input
              type="text"
              value={editedData.device.device_appearance}
              onChange={handleDeviceAppearance}
              style={{ borderColor: errors.deviceAppearance ? 'red' : '' }}
            />
          </div>
        </div>
        <div className='expanded-content-main'>
          <h1>Серийный номер</h1>
          <div className="expanded-content-main-inpit">
            <input
              type="text"
              value={editedData.device.device_sn}
              onChange={handleDeviceSn}
              style={{ borderColor: errors.deviceSn ? 'red' : '' }}
            />
            {editedData.device.device_brand === "Maxvi" ? (
              <span >{editedData.warrantyStatus}</span>
            ) : (
              editedData.device.device_sn ? (
                <span><h4>Не является maxvi</h4></span>
              ) : (
                <span></span>
              )
            )}
          </div>
        </div>

        <div className='expanded-content-main'>
          <h1>IMEI</h1>
          <div className="expanded-content-main-inpit">
            <input
              type="text"
              value={imei}
              onChange={handleImeiChange}
            />
          </div>
        </div>
        <div className='expanded-content-main'>
          <h1>Комплектация</h1>
          <div className="expanded-content-main-inpit">
            <input
              type="text"
              value={editedData.device.device_equipment}
              onChange={handleDeviceEquipmentChange}
              style={{ borderColor: errors.deviceEquipment ? 'red' : '' }}
            />
          </div>
        </div>
        <div className='expanded-content-main'>
          <h1>Тип ремонта</h1>
          <div className="expanded-content-main-inpit">
            <select
              value={editedData.order_type}
              onChange={handleOrderType}
            >
              <option value="" disabled hidden>Выберите тип ремонта</option>
              {types.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <TbExclamationMark />

          </div>
        </div>
        <div className='expanded-content-main'>
          <h1>Дата продажи</h1>
          <div className="expanded-content-main-inpit">
            <input
              type="text"
              value={editedData.device.device_sale_date}
              onChange={handleEndUserDateChange}
              style={{ borderColor: errors.endUserDate ? 'red' : '' }}
            />
            {editedData.device.device_sale_date.trim() === '' && <h4>Предторг</h4>}
          </div>
        </div>

        <div className='expanded-content-main'>
          <h1>Полная модель</h1>
          <h4>{editedData.device.device_type} {editedData.device.device_brand} {editedData.device.device_model}</h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Модель EXEL</h1>
          <div className="expanded-content-main-inpit"><label>{editedData.device.device_excel_model}</label></div>
        </div>
        <div className='expanded-content-main'>
          <h1>Модель</h1>
          <div className="expanded-content-main-inpit">
            <input type="text"
              value={editedData.device.device_model}
              onChange={handlaDeviceModelChange}
              style={{ borderColor: errors.deviceModel ? 'red' : '' }}
            /></div>
        </div>
        <div className='expanded-content-main'>
          <h1>Адрес</h1>
          <div className="expanded-content-main-inpit">
            <input
              type="text"
              value={editedData.end_user.user_address}
              onChange={handleEndUserAddressChange}
              style={{ borderColor: errors.endUserAddress ? 'red' : '' }}
            />
          </div>
        </div>
        <div className='expanded-content-main'>
          <h1>Телефон</h1>
          <div className="expanded-content-main-inpit">
            <input
              type="text"
              value={editedData.end_user.user_phone}
              onChange={handleEndUserPhoneChange}

            />
          </div>
        </div>
        {renderEditButtons()}
      </div>
    );
  };

  const renderViewModeContent = (data) => {
    return (
      <div className="expanded-content">
        <div className='expanded-content-main'>
          <h1>Покупатель</h1>
          <h4><>{data.end_user.user_name}</></h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Внешний вид</h1>
          <h4><>{data.device.device_appearance}</> </h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Комплектация</h1>
          <h4><>{data.device.device_equipment}</> </h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Тип ремонта</h1>
          <h4><>{data.order_type}</> </h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Дата продажи</h1>
          <h4><>{data.device.device_sale_date}</></h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Полная модель</h1>
          <h4>{data.device.device_type} {data.device.device_brand} {data.device.device_model}</h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Модель EXEL</h1>
          <h4>{data.device.device_excel_model}</h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Адрес</h1>
          <h4>{data.end_user.user_address}</h4>
        </div>
        <div className='expanded-content-main'>
          <h1>Телефон</h1>
          <h4>{data.end_user.user_phone}</h4>
        </div>

        <div className='expanded-content-main-button'>
          <button onClick={() => handleEditClick(data)}>Редактировать</button>
        </div>
      </div>
    );
  };

  const WarrantyOrder = () => {
    if (isLoading) {
      return (
        <div className="loading-animation">
          <img src="/pic/LogoAnims.svg" alt="" />
        </div>
      );
    }

    return (
      <div className="Warranty-Conteiner">
        <h1>Заказы</h1>
        <div className="Warranty-Conteiner-line"></div>
        <div className="Warranty-Conteiner-box">
          {receivedData && receivedData.length > 0 ? (
            <div className="table-container">
              <table className="Warranty-Conteiner-nav">
                <thead>
                  <tr>
                    <th>№ заказа</th>
                    <th>Продавец</th>
                    <th>Тип ремонта</th>
                    <th>Тип аппарата</th>
                    <th>Фирма</th>
                    <th>Модель</th>
                    <th>Серийный номер</th>
                    <th>IMEI</th>
                    <th>Деффект</th>
                  </tr>
                </thead>
                <tbody>
                  {receivedData.map((data, index) => (
                    <React.Fragment key={index}>
                      <tr onClick={() => toggleExpandedRow(index)}>
                        <td>{selectedOrderId}</td>
                        <td>{data.retail_user.user_name}</td>
                        <td><label>{data.order_type}</label></td>
                        <td><label>{data.device.device_type}</label></td>
                        <td>{data.device.device_brand}</td>
                        <td>{data.device.device_model}</td>
                        <td><label>{data.device.device_sn} </label></td>
                        <td><label>{data.device.device_imei} </label></td>
                        <td><label>{data.device.device_defect}</label></td>
                      </tr>
                      {expandedRow === index && (
                        <tr className="expanded-row" key={`expanded-${index}`} >
                          <td colSpan="10">
                            {editMode ? renderEditModeContent() : renderViewModeContent(data)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {expandedRow !== null && (
                <div className="expanded-content-wide">
                </div>
              )}
            </div>
          ) : (
            <div>Нет данных для отображения</div>
          )}
        </div>
      </div>
    );
  };


  return (
    <div>
      <div className="container-box">
        <div className="WarrantySearch">
          <form encType="multipart/form-data">
            <input type="file" name="file" onChange={handleFileChange} />
            <button type="button" onClick={handleSubmit}>Отправить</button>
          </form>
        </div>
        {WarrantyOrder()}
      </div>
      <Messenger />
    </div>
  );
}

export default WarrantyRepair;
