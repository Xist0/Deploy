import React from 'react';
import './orders.css';

const Summary = ({ formData, onEditClick }) => {
  return (
    <div className="container-box">
      <div className='forma-input-end'>
        <h2> Просмотр данных</h2>
        <div className="forma-input-main">
          <div className="forma-input-main-content">
            <h3>Вариант:</h3> <p>{formData.option}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>ФИО:</h3> <p>{formData.fullName}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Номер телефона:</h3> <p>{formData.phoneNumber}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Адрес:</h3> <p>{formData.address}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Тип устройства:</h3> <p>{formData.deviceType}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Фирма:</h3> <p>{formData.brand}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Модель:</h3> <p>{formData.model}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Серийный номер:</h3> <p>{formData.serialNumber}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Внешний вид:</h3> <p>{formData.appearanceComments}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Комплектация</h3> <p>{formData.equipmentComments}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Пожелания:</h3> <p>{formData.wishes}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Мастер:</h3> <p>{formData.master}</p>
          </div>
          <div className="forma-input-main-content">
            <h3>Статус:</h3> <p>{formData.status}</p>
          </div>
        </div>
        <div className="divButton">
          <button onClick={onEditClick}>Редактировать</button>
          <button >Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
