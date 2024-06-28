import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";

function OrderCard({ order, toggleDetails, isOpen }) {
    const [showDetails, setShowDetails] = useState(isOpen);

    useEffect(() => {
        setShowDetails(isOpen);
    }, [isOpen]);

    const handleToggleDetails = () => {
        toggleDetails(order.order_id);
        setShowDetails(!showDetails);
    };

    const parseOrderNumber = (text) => {
        const orderNumberRegex = /00НФ-0*(\d+)/;
        const match = text.match(orderNumberRegex);

        if (match) {
            return match[1];
        } else {
            return null;
        }
    };

    const handleClick = (event) => {
        event.preventDefault();
        const orderNumber = parseOrderNumber(order.order_id);
        if (orderNumber) {
            const searchUrl = `https://order.service-centr.com/SearchOrder?orderNumber=${orderNumber}`;
            window.open(searchUrl, '_blank');
        } else {
            console.error('Failed to parse order number from link:', order.order_id);
        }
    };

    return (
        <>
            <div className={`order-card`} onClick={handleClick}>
                <div className={`order-card-main`}>
                    <div className="order-details-box">
                        <div className="order-details-main">
                            <h3>Заказ: {order.order_id}</h3>
                            <p>Дата заказа: {order.order_date}</p>
                            <p>Тип заказа: {order.order_type}</p>
                            <p>Статус заказа: {order.order_status}</p>
                        </div>
                        <div className="order-dateils-user" >
                            <h1>Клиент: {order.retail_user.user_name}</h1>
                            <p>Номер телефона: {order.retail_user.user_phone}</p>
                            <p>Адрес: {order.retail_user.user_address}</p>
                            <p>Тип клиента: {order.retail_user.user_type}</p>
                        </div>
                        <div className="order-dateils-device">
                            <h1>Устройство: {order.device.device_full_model}</h1>
                            <p>Внешний вид: {order.device.device_appearance}</p>
                            <p>Дефект: {order.device.device_stated_defect}</p>
                            <p>Комплектация: {order.device.device_equipment}</p>
                        </div>
                    </div>
                </div>

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
    const [isOrdersVisible, setIsOrdersVisible] = useState(false);
    const [filteredDeviceBrands, setFilteredDeviceBrands] = useState([]);
    const [loading, setLoading] = useState(false);
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
        fetchDeviceTypes();
        fetchDeviceBrands();
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
    }, [searchParams]);

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

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handlePrevious = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
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
            handleSearch(fio);
        }
    }, [location.search]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(searchValue);
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        pageNumbers.push(
            <a
                key={1}
                onClick={() => paginate(1)}
                className={`page-item-pag ${currentPage === 1 ? 'page-item-pag-active' : ''}`}
            >
                1
            </a>
        );

        if (currentPage > 6) {
            pageNumbers.push(<a key="dots-before" className='page-item-pag' >...</a>);
        }

        const startPage = Math.max(2, currentPage - 5);
        const endPage = Math.min(totalPages - 1, currentPage + 5);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <a
                    key={i}
                    onClick={() => paginate(i)}
                    className={`page-item-pag ${i === currentPage ? 'page-item-pag-active' : ''}`}
                >
                    {i}
                </a>
            );
        }

        if (endPage < totalPages - 1) {
            pageNumbers.push(<a key="dots-after" className='page-item-pag'>...</a>);
        }

        pageNumbers.push(
            <a
                key={totalPages}
                onClick={() => paginate(totalPages)}
                className={`page-item-pag ${currentPage === totalPages ? 'page-item-pag-active' : ''}`}
            >
                {totalPages}
            </a>
        );

        return pageNumbers;
    };

    return (
        <div className="container-box">
            <div className="order-box">

                <div className="order-filter">
                    <div className="orders-box">
                        <div className='orders-box-nav'>
                    
                            <h1 onClick={() => setIsOrdersVisible(!isOrdersVisible)}>
                                Дополнительные параметры поиска
                                <GoTriangleDown className={`icon ${isOrdersVisible ? 'rotate' : ''}`} />
                            </h1>
                        </div>
                        <div className={`orders-content ${isOrdersVisible ? 'visible' : ''}`}>
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
                            <div className="device-form">
                                <label className="input-container">
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
                                    {formData.deviceType !== '' && (
                                        <div className="matched-deviceType" style={{ display: filteredDeviceTypes.length > 0 && selectedDeviceType === null ? 'block' : 'none' }}>
                                            {filteredDeviceTypes.map((type, index) => (
                                                <div className='device_vibor' key={index} onClick={() => handleDeviceTypeClick(type)}>
                                                    <h1>{type.device_type_name}</h1>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </label>

                                <label className="input-container">
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
                                    {formData.deviceBrand !== '' && (
                                        <div className="matched-deviceBrand" style={{ display: filteredDeviceBrands.length > 0 && selectedDeviceBrand === null ? 'block' : 'none' }}>
                                            {filteredDeviceBrands.map((brand, index) => (
                                                <div className='device_vibor' key={index} onClick={() => handleDeviceBrandClick(brand)}>
                                                    <h1>{brand.device_brand_name}</h1>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className="search-container">
                                <input
                                    type="text"
                                    className="search-input"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Введите номер"
                                />
                                <div className="search-icon" onClick={() => handleSearch(searchValue)}>
                                    <IoSearch />
                                </div>
                            </div>
                    </div>
                </div>
                {loading ? (
                    <div className="loading-animation"> <img src="/pic/LogoAnims.svg" alt="" /></div>
                ) : (
                    <div className="order-list">
                        <div className="order-cards">
                            {currentOrders.map((order, index) => (
                                <OrderCard key={index} order={order} toggleDetails={toggleDetails} isOpen={expandedOrderId === order.order_id} />
                            ))}
                        </div>
                        <div className="pagination">
                            <button onClick={handlePrevious} className={`page-item ${currentPage === 1 ? 'pagination-button-aut' : ''}`}>
                                Назад
                            </button>
                            {renderPageNumbers()}
                            <button onClick={handleNext} className={`page-item ${currentPage === totalPages ? 'pagination-button-aut' : ''}`}>
                                Вперед
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllOrders;
