import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function OrderCard({ order, toggleDetails, isOpen }) {
    const [showDetails, setShowDetails] = useState(isOpen);

    useEffect(() => {
        setShowDetails(isOpen);
    }, [isOpen]);

    const handleToggleDetails = () => {
        toggleDetails(order.order_id);
        setShowDetails(!showDetails);
    };

    return (
        <>
            <div className={`order-card ${showDetails ? 'order-card-active' : ''}`} onClick={handleToggleDetails}>
                <div className={`order-card-main ${showDetails ? 'order-card-main-active' : ''}`}>
                    <h3>Order ID: {order.order_id}</h3>
                    <p>Дата заказа: {order.order_date}</p>
                    <p>Клиент: {order.retail_user.user_name}</p>
                    <p>Тип заказа: {order.order_type}</p>
                    <p>Статус заказа: {order.order_status}</p>
                    <p>Устройство: {order.device.device_full_model}</p>
                </div>
                {showDetails && (
                    <div className="order-card-details">
                        <div className="order-details-user">
                            <h1>Клиент</h1>
                            <p>ID клиента: {order.retail_user.user_id}</p>
                            <p>ФИО клиента: {order.retail_user.user_name}</p>
                            <p>Номер телефона: {order.retail_user.user_phone}</p>
                            <p>Адрес: {order.retail_user.user_address}</p>
                            <p>Тип клиента: {order.retail_user.user_type}</p>

                        </div>
                        <div className="order-dateils-device">
                            <h1>Устройство</h1>
                            <p>ID устройства: {order.device.device_id}</p>
                            <p>Полная модель: {order.device.device_full_model}</p>
                            <p>Тип устройства: {order.device.device_type}</p>
                            <p>Бренд: {order.device.device_brand}</p>
                            <p>Модель: {order.device.device_model}</p>
                            <p>Внешний вид: {order.device.device_appearance}</p>
                            <p>Коментарии: {order.device.device_equipment}</p>
                            <p>Дефект: {order.device.device_stated_defect}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}


function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(15);
    const [searchValue, setSearchValue] = useState('');
    const [searchParams, setSearchParams] = useState({});
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [staffs, setStaffs] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [filteredDeviceTypes, setFilteredDeviceTypes] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState(null);
    const [deviceBrands, setDeviceBrands] = useState([]);
    const location = useLocation();
    const [filteredDeviceBrands, setFilteredDeviceBrands] = useState([]);
    const [loading, setLoading] = useState(false); // Флаг загрузки данных
    const [selectedDeviceBrand, setSelectedDeviceBrand] = useState(null);
    const [formData, setFormData] = useState({
        master: '',
        master_id: '',
        deviceType: '',
        deviceTypeId: '',
        deviceBrand: '',
        deviceBrandId: '',
    });

        useEffect(() => {
        fetchStaff();
        fetchDeviceTypes()
        fetchDeviceBrands()
    }, []);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/orders/', {
                    params: searchParams
                });
                setOrders(response.data);
                setCurrentPage(1);
            } catch (error) {
                console.error('There was an error fetching the orders!', error);
                if (error.response && error.response.data && error.response.data.error) {
                    alert(error.response.data.error);
                    window.location.reload();
                }
            } finally {
                setLoading(false); 
            }
        };

        if (!loading) {
            fetchOrders();
        }
    }, [searchParams,]);
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
    const fetchDeviceBrands = async () => {
        try {
            const response = await fetch('/api/device/brands');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDeviceBrands(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching device brands:', error);
            setDeviceBrands([]);
        }
    };
    const searchDeviceBrands = (input) => {
        const filtered = deviceBrands.filter(brand =>
            brand.device_brand_name.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredDeviceBrands(filtered);
    };

    const resetDeviceBrand = () => {
        setFilteredDeviceBrands([]);
        setSelectedDeviceBrand(null);
    };
    const handleDeviceBrandChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            deviceBrand: value,
        }));
        if (value.trim() !== '') {
            searchDeviceBrands(value);
        } else {
            resetDeviceBrand();
        }
    };
    const handleDeviceBrandClick = (brand) => {
        setFormData((prevData) => ({
            ...prevData,
            deviceBrandId: brand.device_brand_id,
            deviceBrand: brand.device_brand_name,
        }));
        setSelectedDeviceBrand(brand.device_brand_name);
        setFilteredDeviceBrands([]);
    };

    const searchDeviceTypes = (input) => {
        const filtered = deviceTypes.filter(type =>
            type.device_type_name.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredDeviceTypes(filtered);
    };
    const resetDeviceType = () => {
        setFilteredDeviceTypes([]);
        setSelectedDeviceType(null);
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handlePrevious = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1)); // Не позволяет уйти ниже 1-й страницы
    };

    const handleNext = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages)); // Не позволяет уйти дальше максимальной страницы
    };

    const handleSearch = (fio) => {
        setSearchParams({
            fio: fio || null,
            master: formData.master || null,
            deviceType: formData.deviceType || null,
            deviceBrand: formData.deviceBrand || null,
        });
        setCurrentPage(1);
    };

    const toggleDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };
    const handleDeviceTypeClick = (type) => {
        setFormData((prevData) => ({
            ...prevData,
            deviceType: type.device_type_name,
        }));
        setSelectedDeviceType(type.device_type_name);
        setFilteredDeviceTypes([]);
    };

    const handleDeviceTypeChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            deviceType: value,
        }));
        if (value.trim() !== '') {
            searchDeviceTypes(value);
        } else {
            resetDeviceType();
        }
    };
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const fio = params.get('fio');
        if (fio) {
            setSearchValue(fio);
            handleSearch(fio); // Автоматически выполняем поиск
        }
    }, [location.search]);
    return (
        <div className="container-box">
            <div className="order-box">
                <h2>Список заказов</h2>
                <div className='order-nav'>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Введите значение для поиска"
                    />
                    <button onClick={() => handleSearch(searchValue)}>Найти</button>
                </div>
                <div className="order-filter">
                    <label className="input-column">
                        <select
                            name="master"
                            value={formData.master}
                            onChange={(e) => setFormData({ ...formData, master: e.target.value })}
                        >
                            <option value="" disabled hidden>Выберите мастера</option>
                            {staffs.map((staff) => (
                                <option key={staff.user_id} value={staff.user_id}>
                                    {staff.user_name}
                                </option>
                            ))}
                        </select>
                    </label>

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
                            placeholder="Тип аппарата"
                        />
                    </label>
                    {formData.deviceType !== '' && (
                        <div className="matched-users" style={{ display: filteredDeviceTypes.length > 0 && selectedDeviceType === null ? 'block' : 'none' }}>
                            {filteredDeviceTypes.map((type, index) => (
                                <div className='device_vibor' key={index} onClick={() => handleDeviceTypeClick(type)}>
                                    <h1>{type.device_type_name}</h1>
                                </div>
                            ))}
                        </div>
                    )}
                    <label>
                        <input
                            type="text"
                            name="deviceBrand"
                            value={formData.deviceBrand}
                            onChange={handleDeviceBrandChange}
                            onInput={(e) => {
                                if (e.target.value === '') {
                                    setFilteredDeviceBrands([]);
                                    setSelectedDeviceBrand(null);
                                }
                            }}
                            placeholder="Бренд аппарата"
                        />
                    </label>
                    {formData.deviceBrand !== '' && (
                        <div className="matched-users" style={{ display: filteredDeviceBrands.length > 0 && selectedDeviceBrand === null ? 'block' : 'none' }}>
                            {filteredDeviceBrands.map((brand, index) => (
                                <div className='device_vibor' key={index} onClick={() => handleDeviceBrandClick(brand)}>
                                    <h1>{brand.device_brand_name}</h1>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="order-cards">
                    {currentOrders.map((order, index) => (
                        <OrderCard key={index} order={order} toggleDetails={toggleDetails} isOpen={expandedOrderId === order.order_id} />
                    ))}
                </div>
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <a onClick={handlePrevious} className="page-link">
                                Назад
                            </a>
                        </li>
                        <li className="page-item disabled">
                            <span className="page-link">{currentPage}</span>
                        </li>
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <a onClick={handleNext} className="page-link">
                                Вперед
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );

}

export default AllOrders;

