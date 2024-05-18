import React, { useState, useEffect } from 'react';
import Summary from './Summary';
import Header from '../Header';
import './orders.css';
import Messenger from './messenger/Messenger';

const OrderStatus = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    option: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    source_user: '',
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    appearanceComments: '',
    equipmentComments: '',
    wishes: '',
    master: '',
    status: '',
  });

  const [validation, setValidation] = useState({
    option: false,
    fullName: false,
    phoneNumber: false,
    address: false,
    source_user: false,
    deviceType: false,
    brand: false,
    model: false,
    serialNumber: false,
    appearanceComments: false,
    equipmentComments: false,
    wishes: false,
    master: false,
    status: false,
  });

  const [types, setTypes] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const response = await fetch('/api/typeofrepaire');
      const data = await response.json();
      setTypes(data.types);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    setFormData((prevData) => ({
      ...prevData,
      [name]: trimmedValue,
    }));

    setValidation((prevValidation) => ({
      ...prevValidation,
      [name]: trimmedValue !== '',
    }));
  };

  const searchUsers = async (fullName) => {
    try {
      const response = await fetch(`/api/users/search/${encodeURIComponent(fullName)}`);
      const data = await response.json();
      setMatchedUsers(data.users);
    } catch (error) {
      console.error('Error searching users:', error);
      setMatchedUsers([]);
    }
  };

  const handleUserClick = (user) => {
    // Заполняем данные выбранного пользователя в форме
    setFormData({
      ...formData,
      fullName: user.name_user,
      phoneNumber: user.phone_user,
      address: user.address_user,
      source_user: user.source_user,
    });

    // Очищаем список совпадающих пользователей
    setMatchedUsers([]);
  };

  const isFormValid = Object.values(validation).every((isValid) => isValid);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    handleNextStep();
  };

  const handleEditClick = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div>

      <div className="">
        <div className='Multi-forma'>
          {step === 1 && (
            <div className='forma-input'>
              <h2>Шаг 1: Тип ремонта</h2>
              <label className="input-column">
                <select
                  name="option"
                  value={formData.option}
                  onChange={handleChange}
                  className={validation.option ? '' : 'input-error'}
                >
                  <option value="" disabled selected hidden>Выберите тип ремонта</option>
                  {types.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                <button className='divButton' onClick={handleNextStep} >Далее</button>
              </label>
            </div>
          )}
          {step === 2 && (
            <div className='forma-input input-column'>
              <h2>Шаг 2: Ввод данных</h2>
              <label id='fullname'>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    handleChange(e);
                    searchUsers(e.target.value);
                  }}
                  className={`input-style ${validation.fullName ? 'input-valid' : 'input-error'}`}
                  placeholder="Ф.И.О. клиента"
                />
                {matchedUsers.length > 0 && (
                  <div className="matched-users">
                    {matchedUsers.map((user, index) => (
                      <div key={index} className="matched-user" onClick={() => handleUserClick(user)}>
                        {user.name_user}
                      </div>
                    ))}
                  </div>
                )}
              </label>
              <label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`input-style ${validation.phoneNumber ? 'input-valid' : 'input-error'}`}
                  placeholder="Номер Телефона"
                />
              </label>
              <label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`input-style ${validation.address ? 'input-valid' : 'input-error'}`}
                  placeholder="Адрес"
                />
              </label>
              <select name="option-step-2" id="">
                <option value="" disabled selected hidden>Как узнали о нас</option>
                <option
                  value={formData.source_user}>
                </option>
              </select>
              <div className="divButton">
                <button onClick={handlePrevStep}>Назад</button>
                <button onClick={handleNextStep} >Далее</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className='forma-input input-column'>
              <h4>Шаг 3: Устройство</h4>
              <label>
                <input
                  type="text"
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  className={`input-style ${validation.deviceType ? 'input-valid' : 'input-error'}`}
                  placeholder="Тип аппарата"
                />
              </label>
              <label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`input-style ${validation.brand ? 'input-valid' : 'input-error'}`}
                  placeholder="Фирма"
                />
              </label>
              <label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`input-style ${validation.model ? 'input-valid' : 'input-error'}`}
                  placeholder="Модель"
                />
              </label>
              <label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className={`input-style ${validation.serialNumber ? 'input-valid' : 'input-error'}`}
                  placeholder="Серийный номер"
                />
              </label>
              <label id='comments'>
                <h4>Внешний вид:</h4>
                <textarea
                  name="appearanceComments"
                  value={formData.appearanceComments}
                  onChange={handleChange}
                  className={`input-style ${validation.appearanceComments ? 'input-valid' : 'input-error'}`}
                />
              </label>
              <label id='comments'>
                <h4>Комплектация:</h4>
                <textarea
                  name="equipmentComments"
                  value={formData.equipmentComments}
                  onChange={handleChange}
                  className={`input-style ${validation.equipmentComments ? 'input-valid' : 'input-error'}`}
                />
              </label>
              <label id='comments'>
                <h4>Пожелания:</h4>
                <textarea
                  name="wishes"
                  value={formData.wishes}
                  onChange={handleChange}
                  className={`input-style ${validation.wishes ? 'input-valid' : 'input-error'}`}
                />
              </label>
              <div className="divButton">
                <button onClick={handlePrevStep}>Назад</button>
                <button onClick={handleNextStep} >Далее</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className='forma-input input-column'>
              <h4>Шаг 4: Мастер</h4>
              <label>
                <input
                  type="text"
                  name="master"
                  value={formData.master}
                  onChange={handleChange}
                  className={`input-style ${validation.master ? 'input-valid' : 'input-error'}`}
                  placeholder="Мастер"
                />
              </label>
              <label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`input-style ${validation.status ? 'input-valid' : 'input-error'}`}
                  placeholder="Статус"
                />
              </label>
              <div className="divButton">
                <button onClick={handlePrevStep}>Назад</button>
                <button onClick={handleSubmit} >Отправить</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <Summary formData={formData} onEditClick={handleEditClick} />
          )}
        </div>

      </div>
      <Messenger />
    </div>
  );
};

export default OrderStatus;
