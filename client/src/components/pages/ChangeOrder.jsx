import React, { useState, useEffect } from 'react';
import Header from '../Header';
import './pages.css/SeacrOrder.css';
import { useLocation } from 'react-router-dom';
import Messenger from './messenger/Messenger';
import { IoMdCloseCircleOutline } from "react-icons/io";

function ChangeOrder() {
  const [number, setNumber] = useState('');
  const [records, setRecords] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [matchedParts, setMatchedParts] = useState([]);
  const [matchedWork, setMatchedWork] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [formData, setFormData] = useState({
    nameParts: '',
    selectedParts: [],
    selectedWork: [],
  });
  const [editedPrices, setEditedPrices] = useState([]);
  const [deletedParts, setDeletedParts] = useState([]);
  const [changedData, setChangedData] = useState([]);
  const [deletedWork, setDeletedWork] = useState([]);
  const [editedWorkPrices, setEditedWorkPrices] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderNumber = queryParams.get('orderNumber');
    if (orderNumber) {
      setNumber(orderNumber);
      fetchData(orderNumber);
    }
  }, [location.search]);

  const fetchData = async (searchNumber) => {
    if (searchNumber.trim() === '') {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/byt/order/${searchNumber}`);
      const data = await response.json();
      setRecords(data);
      setInitialData(data); // Сохраняем изначальные данные
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для возвращения к изначальным данным
  const resetData = () => {
    setFormData({
      nameParts: '',
      selectedParts: [],
      selectedWork: [], // Добавляем сброс выбранных работ
    });
    setEditedPrices([]);
    setDeletedParts([]);
    setChangedData([]);
    setDeletedWork([]); // Добавляем сброс удаленных работ
  };

  const handleChange = (e) => {
    setNumber(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData(number);
    }
  };

  const searchParts = async (nameParts) => {
    try {
      const response = await fetch(`/api/parts1c/${encodeURIComponent(nameParts)}`); // Изменяем поиск на соответствующий раздел
      const data = await response.json();
      setMatchedParts(data);
    } catch (error) {
      console.error('Error searching parts:', error);
      setMatchedParts([]);
    }
  };

  const searchWork = async (nameWork) => {
    try {
      const response = await fetch(`/api/works1c/${encodeURIComponent(nameWork)}`); // Изменяем поиск на соответствующий раздел
      const data = await response.json();
      setMatchedWork(data);
    } catch (error) {
      console.error('Error searching work:', error);
      setMatchedWork([]);
    }
  };

  const handlePartClick = (part) => {
    setSelectedPart(part);
  };

  const handleRemoveButtonClick = (index) => {
    if (index < formData.selectedParts.length) {
      const updatedSelectedParts = formData.selectedParts.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        selectedParts: updatedSelectedParts,
      });
    } else {
      const partIndex = index - formData.selectedParts.length;
      const updatedData = changedData.filter((_, i) => i !== partIndex);
      setChangedData(updatedData);
      const updatedDeletedParts = [...deletedParts, index];
      setDeletedParts(updatedDeletedParts);
      setInitialData(prevData => {
        const updatedParts = prevData.parts.filter((_, i) => i !== partIndex);
        return { ...prevData, parts: updatedParts };
      });
    }
  };

  const handleRemoveWorkButtonClick = (index) => {
    if (index < formData.selectedWork.length) {
      const updatedSelectedWork = formData.selectedWork.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        selectedWork: updatedSelectedWork,
      });
    } else {
      const workIndex = index - formData.selectedWork.length;
      const updatedData = changedData.filter((_, i) => i !== workIndex);
      setChangedData(updatedData);
      const updatedDeletedWork = [...deletedWork, workIndex];
      setDeletedWork(updatedDeletedWork);
      setInitialData(prevData => {
        const updatedWork = prevData.work.filter((_, i) => i !== workIndex);
        return { ...prevData, work: updatedWork };
      });
    }
  };
  const handleWorkPriceChange = (index, event) => {
    const newPrices = [...editedWorkPrices];
    newPrices[index] = event.target.value;
    setEditedWorkPrices(newPrices);
    const updatedData = [...changedData];
    if (index < formData.selectedWork.length) {
      formData.selectedWork[index].work_price = event.target.value;
    } else {
      const workIndex = index - formData.selectedWork.length;
      initialData.work[workIndex].work_price = event.target.value;
      updatedData[workIndex] = { ...initialData.work[workIndex], work_price: event.target.value };
    }
    setChangedData(updatedData); // Обновляем массив измененных данных
  };

  const handleAddButtonClick = () => {
    if (selectedPart) {
      const newSelectedPart = { ...selectedPart, parts_price: selectedPart.parts_price };
      setFormData({
        ...formData,
        selectedParts: [...formData.selectedParts, newSelectedPart],
      });
      setSelectedPart(null);
      setChangedData([...changedData, newSelectedPart]); // Добавляем новый элемент в массив измененных данных
      setInitialData(prevData => {
        const updatedParts = [...prevData.parts, newSelectedPart];
        return { ...prevData, parts: updatedParts };
      });
    }
  };

  const handleAddWorkClick = () => {
    if (selectedPart) {
      const newSelectedPart = { ...selectedPart, work_price: selectedPart.work_price };
      setFormData({
        ...formData,
        selectedWork: [...formData.selectedWork, newSelectedPart],
      });
      setSelectedPart(null);
      setChangedData([...changedData, newSelectedPart]); // Добавляем новый элемент в массив измененных данных
      setInitialData(prevData => {
        const updatedWork = [...prevData.work, newSelectedPart];
        return { ...prevData, work: updatedWork };
      });
    }
  };

  const handlePriceChange = (index, event) => {
    const newPrices = [...editedPrices];
    newPrices[index] = event.target.value;
    setEditedPrices(newPrices);
    const updatedData = [...changedData];
    if (index < formData.selectedParts.length) {
      formData.selectedParts[index].parts_price = event.target.value;
    } else {
      const partIndex = index - formData.selectedParts.length;
      initialData.parts[partIndex].parts_price = event.target.value;
      updatedData[partIndex] = { ...initialData.parts[partIndex], parts_price: event.target.value };
    }
    setChangedData(updatedData); // Обновляем массив измененных данных
  };

  const handleSaveChanges = () => {
    const changedDataToSend = {
      id_order: initialData.id_order,
      parts: formData.selectedParts, // Изменяем на отправку выбранных запчастей
      work: formData.selectedWork, // Изменяем на отправку выбранных работ
    };

    console.log('Измененные данные для отправки:', changedDataToSend);
  };

  const renderData = () => {
    if (isLoading) {
      return (
        <div className="loading-animation">
          <img src="/public/LogoAnims.svg" alt="" />
        </div>
      );
    }
    if (!records || !records.parts || !records.work) {
      return <p>Ничего не найдено</p>;
    }
    return (
      <div className="">
        <div className="container-block-main">
          <div className='forma-input input-column'>
            <div className="container-search-result-title">
              <h1>Заказ: {records.id_order}</h1>
            </div>
            <div className="container-block-orders">
              <label >
                <h4>Пользователь:</h4> <p>{records.user.name_user}</p>
              </label>
              <label >
                <h4>Номер телефона:</h4> <p>{records.user.phone_user}</p>
              </label>
              <label >
                <h4>Адресс:</h4> <p>{records.user.address_user}</p>
              </label>
              <label >
                <h4>Тип устройства:</h4> <p>{records.device.type}</p>
              </label>
              <label >
                <h4>Бренд:</h4> <p>{records.device.brand}</p>
              </label>
              <label >
                <h4>Номер модели:</h4> <p>{records.device.model}</p>
              </label>
              <label >
                <h4>Стутус:</h4> <p>{records.status.status_order}</p>
              </label>
              <label >
                <h4>Серийный номер модели:</h4> <p>{records.device.sn}</p>
              </label>
              <label >
                <h4>Дефект:</h4> <p>{records.device.defect}</p>
              </label>
            </div>
            <select name="option">
              <option value="" disabled selected hidden>Выберите статус</option>
            </select>
          </div>
          <div className="forma-input input-column">
            <div className="container-block-orders">
              <div className="container-search-result-parts-title">
                <h1>Работа</h1>
              </div>
              {formData.selectedWork.concat(records.work).map((workItem, key) => (
                deletedWork.includes(key) ? null : (
                  <div key={key} className='container-search-result-parts-main'>
                    <p>{workItem.work_name || workItem.name_parts}</p>
                    <div className="container-search-result-parts-prise">
                      <input
                        type="text"
                        value={editedWorkPrices[key] || workItem.work_price}
                        onChange={(event) => handleWorkPriceChange(key, event)}
                      />
                      <IoMdCloseCircleOutline onClick={() => handleRemoveWorkButtonClick(key)} />
                    </div>
                  </div>
                )
              ))}
              <div className="container-block-search">
                <input
                  type="text"
                  placeholder="Название"
                  className="input-style input-valid"
                  onChange={(e) => {
                    handleChange(e);
                    searchWork(e.target.value)
                  }}
                />
                <button onClick={handleAddWorkClick}>Добавить</button>
              </div>
              {matchedWork && matchedWork.length > 0 && (
                <div className="matched-users">
                  {matchedWork.map((work, index) => (
                    <div
                      key={index}
                      className={`matched-user ${selectedPart === work ? 'matched-user-acktive' : ''}`}
                      onClick={() => handlePartClick(work)}
                    >
                      {work.name_parts}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="forma-input input-column">
            <div className="container-block-orders">
              <div className="container-search-result-parts-title">
                <h1>Запчасти</h1>
              </div>
              {formData.selectedParts.concat(records.parts).map((partItem, index) => (
                deletedParts.includes(index) ? null : (
                  <div key={index} className='container-search-result-parts-main'>
                    <p>{partItem.parts_name || partItem.name_parts}</p>
                    <div className="container-search-result-parts-prise">
                      <input
                        type="text"
                        value={editedPrices[index] || partItem.parts_price}
                        onChange={(event) => handlePriceChange(index, event)}
                      />
                      <IoMdCloseCircleOutline onClick={() => handleRemoveButtonClick(index)} />
                    </div>
                  </div>
                )
              ))}
              <div className="container-block-search">
                <input
                  type="text"
                  placeholder="Название"
                  className="input-style input-valid"
                  onChange={(e) => {
                    handleChange(e);
                    searchParts(e.target.value);
                  }}
                />
                <button onClick={handleAddButtonClick}>Добавить</button>
              </div>
              {matchedParts && matchedParts.length > 0 && (
                <div className="matched-users">
                  {matchedParts.map((part, index) => (
                    <div
                      key={index}
                      className={`matched-user ${selectedPart === part ? 'matched-user-acktive' : ''}`}
                      onClick={() => handlePartClick(part)}
                    >
                      {part.name_parts}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container-block-search">
          <button onClick={handleSaveChanges}>Сохранить</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="container-box">
        <div className="container-block">
          <div className="container-block-search">
            <input
              type="number"
              pattern="\d*"
              value={number}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder='Введите номер заказа'
            />
            <button onClick={() => fetchData(number)}>Найти</button>
          </div>
          <div className="container-results">{renderData()}</div>
        </div>
      </div>
      <Messenger />
    </div>
  );
}

export default ChangeOrder;
