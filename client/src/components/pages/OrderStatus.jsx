import React, { useContext, useEffect, useState } from 'react';
import Summary from './Summary';
import './orders.css';
import { Context } from '../../main';
import Messenger from './messenger/Messenger';
import { AddressSuggestions } from 'react-dadata';

const OrderStatus = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const { store } = useContext(Context);
  const [value, setValue] = useState();
  const [qrCodeLink, setQrCodeLink] = useState('');
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    userType: '',
    source_user_id: '',
    source_user_name: '',
    master: '',
    master_id: '',
    deviceModelId: '',
    deviceTypeId: '',
    deviceType: '',
    brandId: '',
    brand: '',
    model: '',
    serialNumber: '',
    imei: '',
    appearanceComments: '',
    equipmentComments: '',
    defect: '',
    master: '',
    master_id: '',
  });
  const [validation, setValidation] = useState({
    option: false,
    fullName: false,
    phoneNumber: false,
    user_name: false,
    address: false,
    source_user: false,
    deviceType: false,
    userType: false,
    brand: false,
    imei: false,
    сomment: false,
    model: false,
    serialNumber: false,
    appearanceComments: false,
    equipmentComments: false,
    defect: false,
    master: false,
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [types, setTypes] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [filteredDeviceTypes, setFilteredDeviceTypes] = useState([]);
  const [filteredBrandsTypes, setFilteredBrandsTypes] = useState([]);
  const [source, setSource] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [selectedBrandType, setSelectedBrandType] = useState(null);
  const [matchedBrands, setMatchedBrands] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [deviceModel, setDeviceModel] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);

  useEffect(() => {
    fetchTypes();
    fetchStaff();
    fetchDeviceBrands();
    fetchDeviceTypes();
    fetchSource();
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
  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      const data = await response.json();
      const staffsData = data.map((staff) => ({
        user_id: staff.user_id,
        user_name: staff.user_name,
      }));
      setStaffs(staffsData);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };
  const fetchSource = async () => {
    try {
      const response = await fetch('/api/source');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSource(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching source:', error);
      setSource([]);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch('/api/device/types');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDeviceTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching device types:', error);
      setDeviceTypes([]);
    }
  };

  const isFormValid = () => {
    switch (step) {
      case 1:
        return validation.option;
      case 2:
        return validation.fullName && validation.phoneNumber && validation.source_user && validation.userType;
      case 3:
        return validation.deviceType && validation.brand && validation.model && validation.serialNumber && validation.appearanceComments && validation.equipmentComments && validation.defect && validation.imei && validation.сomment;
      case 4:
        return validation.master;
      default:
        return false;
    }
  };
  const fetchDeviceBrands = async () => {
    try {
      const response = await fetch('/api/device/brands');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMatchedBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching device brands:', error);
      setMatchedBrands([]);
    }
  };


  const handleChange = async (e) => {
    const { name, value } = e.target || e; // Учитывает случай, когда функция вызывается из AddressSuggestions
    const trimmedValue = value.trim();

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      [name]: trimmedValue !== '',
      phoneNumber: name === 'phoneNumber' ? trimmedValue !== '' : prevValidation.phoneNumber,
      address: name === 'address' ? trimmedValue !== '' : prevValidation.address,
    }));
    if (trimmedValue === '') {
      if (name === 'brand') {
        setFilteredBrandsTypes([]);
        setSelectedBrandType(null);
        fetchDeviceBrands();
      } else if (name === 'deviceType') {
        setFilteredDeviceTypes([]);
        setSelectedDeviceType(null);
        fetchDeviceTypes();
      } else if (name === 'fullName') {
        setMatchedUsers([]);
      } else if (name === 'model') {
        setDeviceModel([]);
      }
      return;
    }

    if (name === 'phoneNumber' || name === 'address' || name === 'brand' || name === 'deviceType' || name === 'fullName' || name === 'model') {
      setValidation((prevValidation) => ({
        ...prevValidation,
        [name]: trimmedValue !== '',
      }));
    }

    let updatedFormData = { ...formData, [name]: value };

    if (name === 'source_user_id') {
      const selectedSource = source.find(item => item.sources_id === value);
      updatedFormData = {
        ...updatedFormData,
        source_user_name: selectedSource ? selectedSource.sources_name : '',
      };

    }
    if (name === 'source_user') {
      const selectedSource = source.find(item => item.sources_id === value);
      updatedFormData = {
        ...updatedFormData,
        source_user_id: selectedSource ? selectedSource.sources_id : '',
        source_user_name: selectedSource ? selectedSource.sources_name : '',
      };
    }
    setFormData(updatedFormData);
    if (name === 'fullName') {
      searchUsers(trimmedValue);
    }

    if (name === 'model' && trimmedValue !== '') {
      searchModel(trimmedValue);
    }

    if (name === 'brand') {
      const filteredBrands = matchedBrands.filter((brand) =>
        brand.device_brand_name.toLowerCase().includes(trimmedValue.toLowerCase())
      );
      setFilteredBrandsTypes(filteredBrands);
    }


    if (name === 'deviceType') {
      const filteredTypes = deviceTypes.filter((type) =>
        type.device_type_name.toLowerCase().includes(trimmedValue.toLowerCase())
      );
      setFilteredDeviceTypes(filteredTypes);
    }
  };

  const searchUsers = async (fullName) => {
    try {
      const response = await fetch(`/api/users/search/${encodeURIComponent(fullName)}`);
      const data = await response.json();
      setMatchedUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching users:', error);
      setMatchedUsers([]);
    }
  };

  const searchModel = async (deviceModel) => {
    try {
      const response = await fetch(`/api/device/model/${encodeURIComponent(deviceModel)}`);
      const data = await response.json();
      setDeviceModel(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching models:', error);
      setDeviceModel([]);
    }
  };

  const handleModelClick = (model) => {
    setFormData((prevData) => ({
      ...prevData,
      model: model.device_model_name,
      deviceModelId: model.device_model_id,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      model: true,
    }));
    setDeviceModel([]);
  };

  const handleBrandClick = (brand) => {
    setFormData((prevData) => ({
      ...prevData,
      brandId: brand.device_brand_id,
      brand: brand.device_brand_name,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      brand: true,
    }));
    setSelectedBrandType(brand.device_brand_name);
  };

  const handleUserClick = (user) => {
    setFormData((prevData) => ({
      ...prevData,
      fullName: user.user_name || '',
      user_id: user.user_id || '',
      phoneNumber: user.user_phone || '',
      address: user.user_address || '',
      source_user: user.user_source || '',
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      fullName: Boolean(user.user_name),
      phoneNumber: Boolean(user.user_phone),
      address: Boolean(user.user_address),
      source_user: Boolean(user.user_source),
    }));
    setMatchedUsers([]);
  };
  const handleDeviceTypeClick = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      deviceTypeId: type.device_type_id,
      deviceType: type.device_type_name,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      deviceType: true,
    }));
    setSelectedDeviceType(type.device_type_name);
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleSubmit = async () => {
    const cleanData = mapFormDataToServerFormat(formData);
    try {
      const response = await saveFetch(cleanData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Ошибка отправки формы');
    }
  };

  const handleEditClick = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const mapFormDataToServerFormat = (formData) => {
    const cleanData = {
      retail_user: {
        user_id: formData.user_id,
        user_name: formData.fullName,
        user_phone: formData.phoneNumber,
        user_address: formData.address,
        user_legal_address: "",
        user_type: formData.userType,
        user_source: formData.source_user_id,
        user_role: ""
      },

      master: {
        user_name: formData.master,
        user_id: formData.master_id,
      },

      manager: {
        user_name: `${store.user.login}`,
        user_id: `${store.manager_id}`,
      },
      device: {
        device_model_id: formData.deviceModelId,
        device_sale_date: "",
        device_type_id: formData.deviceTypeId || "",
        device_type: formData.deviceType || "",
        device_brand_id: formData.brandId,
        device_full_model: formData.deviceType + " " + formData.brand + " " + formData.model,
        device_brand: formData.brand || "",
        device_model: formData.model || "",
        device_excel_model: "",
        device_sn: formData.serialNumber || "",
        device_imei: formData.imei,
        device_appearance: formData.appearanceComments || "",
        device_equipment: formData.equipmentComments || "",
        device_stated_defect: formData.defect || "",
      },
      comment: formData.сomment,
      parts: [],
      works: [],
      sources: {
        sources_id: formData.source_user_id,
        sources_name: formData.source_user_name
      }
    };

    return cleanData;
  };

  const saveFetch = async (cleanData) => {
    const serverData = mapFormDataToServerFormat(cleanData);
    console.log('Данные отправлены:', cleanData);
    try {
      const response = await fetch('/api/neworder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        throw new Error(`Ошибка выполнения запроса, статус: ${response.status}`);
      }
      const responseData = await response.json();
      console.log('Response from server:', responseData);
      if (responseData.error) {
        alert(responseData.error);
      } else {
        const orderId = responseData.order_id.replace(/[^\d]/g, '');
        setOrderId(orderId);
        const newQrCodeLink = `https://order.service-centr.com/SearchOrder?prderNumber=${orderId}`;
        setQrCodeLink(newQrCodeLink);
        console.log('QR Code Link:', newQrCodeLink);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(error.message || 'Ошибка загрузки данных');
    }
  };
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setValidation((prevValidation) => ({
      ...prevValidation,
      userType: e.target.value !== '',
    }));
  };

  const handleDeviceTypeChange = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      deviceType: value,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      deviceType: value.trim() !== '',
    }));
    if (value.trim() !== '') {
      searchDeviceTypes(value);
    } else {
      resetDeviceType();
    }
  };

  const resetDeviceType = () => {
    setFilteredDeviceTypes([]);
    setSelectedDeviceType(null);
  };
  const handleMasterClick = (master) => {
    setFormData((prevData) => ({
      ...prevData,
      master: master.user_name,
      master_id: master.user_id,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      master: true,
    }));
  };

  const handleModelChange = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      model: value,
    }));
    setValidation((prevValidation) => ({
      ...prevValidation,
      model: value.trim() !== '',
    }));
    if (value.trim() !== '') {
      searchModel(value);
    } else {
      setDeviceModel([]);
    }
  };

  useEffect(() => {
    if (deviceTypes.length > 0 && formData.deviceType !== '') {
      const filteredTypes = deviceTypes.filter((type) =>
        type.device_type_name.toLowerCase().includes(formData.deviceType.toLowerCase())
      );
      setFilteredDeviceTypes(filteredTypes);
    }
  }, [deviceTypes, formData.deviceType]);

  useEffect(() => {
    if (matchedBrands.length > 0 && formData.brand !== '') {
      const filteredBrands = matchedBrands.filter((brand) =>
        brand.device_brand_name.toLowerCase().includes(formData.brand.toLowerCase())
      );
      setFilteredBrandsTypes(filteredBrands);
    }
  }, [matchedBrands, formData.brand]);

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
                  <option value="" disabled hidden>Выберите тип ремонта</option>
                  {types.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                <button
                  onClick={handleNextStep}
                  disabled={!isFormValid() || (step === 1 && formData.option === '')}
                  className={!isFormValid() ? 'disabled-button' : ''}
                >
                  Далее
                </button>
              </label>
            </div>
          )}
          {step === 2 && (
            <div className='forma-input input-column'>
              <h2>Шаг 2: Ввод данных</h2>
              <label >
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
              </label>
              {matchedUsers.length > 0 && (
                <div className="matched-Order-users">
                  {matchedUsers.map((user, index) => (
                    <div key={index} className="matched-Order-user" onClick={() => handleUserClick(user)}>
                      {user.user_name}
                    </div>
                  ))}
                </div>
              )}
              <label >
                <select
                  value={userType}
                  className={userType !== '' ? '' : 'input-error'}
                  onChange={handleUserTypeChange}>
                  <option value="" disabled hidden>Тип клиента</option>
                  <option value="Юр. Лицо">Юр. Лицо</option>
                  <option value="ИП">ИП</option>
                  <option value="Физ. лицо">Физ. лицо</option>
                  <option value="Гос. огран">Гос. огран</option>
                </select>
              </label>
              <label id='phone'>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`input-style ${validation.phoneNumber ? 'input-valid' : 'input-error'}`}
                  placeholder="Номер Телефона"
                />
              </label>

              <AddressSuggestions
                token="5b62c95fa0f8d31860b557b959d74091b06ee92c"
                value={formData.address}
                onChange={(value) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    address: value.value, // Change value to value.value
                  }));
                  setValidation((prevValidation) => ({
                    ...prevValidation,
                    address: value.value.trim() !== '', // Change value to value.value
                  }));
                }}
                onSuggestionSelected={(suggestion) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    address: suggestion.value,
                  }));
                  setValidation((prevValidation) => ({
                    ...prevValidation,
                    address: suggestion.value.trim() !== '',
                  }));
                }}
                className={`input-style ${validation.address ? 'input-valid' : 'input-error'}`}
                placeholder="Адрес"
              />

              <select
                name="source_user"
                value={formData.source_user}
                onChange={handleChange}
                className={validation.source_user ? '' : 'input-error'}
              >
                <option value="" disabled hidden>Как узнали о нас</option>
                {source.map((item) => (
                  <option key={item.sources_id} value={item.sources_id}>
                    {item.sources_name}
                  </option>
                ))}
              </select>
              <div className="divButton">
                <button onClick={handlePrevStep}>Назад</button>
                <button
                  onClick={handleNextStep}
                  disabled={!isFormValid() || (step === 2 && formData.option === '')}
                  className={!isFormValid() ? 'disabled-button' : ''}
                >
                  Далее
                </button>
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
                  onChange={handleDeviceTypeChange}
                  onInput={(e) => {
                    if (e.target.value === '') {
                      setFilteredDeviceTypes([]);
                      setSelectedDeviceType(null);
                    }
                  }}
                  onBlur={() => {
                    if (formData.brand === '' && selectedBrandType !== null) {
                      setSelectedBrandType(null);
                    }
                  }}
                  className={`input-style ${validation.deviceType ? 'input-valid' : 'input-error'}`}
                  placeholder="Тип аппарата"
                />
              </label>
              {formData.deviceType !== '' && (
                <div className="matched-Order-users" style={{ display: filteredDeviceTypes.length > 0 && selectedDeviceType === null ? 'flex' : 'none' }}>
                  {filteredDeviceTypes.map((type, index) => (
                    <div  className="matched-Order-user"  key={index} onClick={() => handleDeviceTypeClick(type)}>
                      <h1>{type.device_type_name}</h1>
                    </div>
                  ))}
                </div>
              )}
              <label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      brand: e.target.value,
                    }));
                    setValidation((prevValidation) => ({
                      ...prevValidation,
                      brand: e.target.value.trim() !== '',
                    }));
                  }}
                  onInput={(e) => {
                    if (e.target.value === '') {
                      setFilteredBrandsTypes([]);
                      setSelectedBrandType(null);
                    }
                  }}
                  onBlur={() => {
                    if (formData.brand === '' && selectedBrandType !== null) {
                      setSelectedBrandType(null);
                    }
                  }}
                  className={`input-style ${validation.brand ? 'input-valid' : 'input-error'}`}
                  placeholder="Фирма"
                />
              </label>
              {formData.brand !== '' && (
                <div className="matched-Order-users" style={{ display: filteredBrandsTypes.length > 0 && selectedBrandType === null ? 'flex' : 'none' }}>
                  {filteredBrandsTypes.map((brand, index) => (
                    <div className="matched-Order-user" key={index} onClick={() => handleBrandClick(brand)}>
                      <h1>{brand.device_brand_name}</h1>
                    </div>
                  ))}
                </div>
              )}
              <label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleModelChange}
                  className={`input-style ${validation.model ? 'input-valid' : 'input-error'}`}
                  placeholder="Модель"
                />
              </label>
              {deviceModel.length > 0 && (
                <div className="matched-Order-users">
                  {deviceModel.map((model, index) => (
                    <div key={index} className="matched-Order-user" onClick={() => handleModelClick(model)}>
                      {model.device_model_name}
                    </div>
                  ))}
                </div>
              )}
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
              <label>
                <input
                  type="text"
                  name="imei"
                  value={formData.imei}
                  onChange={handleChange}
                  className={`input-style ${validation.imei ? 'input-valid' : 'input-error'}`}
                  placeholder="imei"
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
                <h4>Дефект:</h4>
                <textarea
                  name="defect"
                  value={formData.defect}
                  onChange={handleChange}
                  className={`input-style ${validation.defect ? 'input-valid' : 'input-error'}`}
                />
              </label>
              <label id='comments'>
                <h4>Коментарий:</h4>
                <textarea
                  name="сomment"
                  value={formData.сomment}
                  onChange={handleChange}
                  className={`input-style ${validation.сomment ? 'input-valid' : 'input-error'}`}
                />
              </label>
              <div className="divButton">
                <button onClick={handlePrevStep}>Назад</button>
                <button
                  onClick={handleNextStep}
                  disabled={!isFormValid() || (step === 3 && formData.option === '')}
                  className={!isFormValid() ? 'disabled-button' : ''}
                >
                  Далее
                </button>
              </div>
            </div>
          )}
          {step === 4 && staffs && staffs.length > 0 && (
            <div className='forma-input input-column'>
              <h4>Шаг 4: Мастер</h4>
              <label className="input-column">
                <select
                  name="master"
                  value={formData.master}
                  onChange={(e) => {
                    const selectedMaster = staffs.find((staff) => staff.user_id === e.target.value);
                    handleMasterClick(selectedMaster);
                  }}
                  className={validation.master ? '' : 'input-error'}
                >
                  <option value="" disabled hidden>Выберите мастера</option>
                  {staffs.map((staff) => (
                    <option key={staff.user_id} value={staff.user_id}>
                      {staff.user_name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="divButton">
                <button onClick={handlePrevStep}>Назад</button>
                <button
                  disabled={!isFormValid()}
                  onClick={handleNextStep}
                  className={!isFormValid() ? 'disabled-button' : ''}
                >
                  Отправить
                </button>
              </div>
            </div>
          )}
          {step === 5 && (
            <Summary
              formData={formData}
              onEditClick={handleEditClick}
              saveButton={saveFetch}
              orderId={orderId}
              handleSubmit={handleSubmit}
              qrCodeLink={qrCodeLink}
            />)}
        </div>
      </div>
      <Messenger />
    </div>
  );
};

export default OrderStatus;

