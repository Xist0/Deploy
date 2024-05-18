import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Messenger from './messenger/Messenger';
import { FiChevronLeft, FiChevronRight, FiSkipBack, FiSkipForward } from "react-icons/fi";

function Contractors() {
    const [currentPage, setCurrentPage] = useState(1);
    const [originalData, setOriginalData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/1c/users');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const json = await response.json();
            setOriginalData(json);
            setLoading(false);
            const startIndex = (currentPage - 1) * 50;
            const endIndex = startIndex + 50;
            setDisplayData(json.slice(startIndex, endIndex));
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(originalData.length / 50)) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(Math.ceil(originalData.length / 50));
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        const filteredData = originalData.filter((item) => {
            const searchFields = [item.name_user];
            return searchFields.some((field) =>
                String(field).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        const startIndex = (currentPage - 1) * 50;
        const endIndex = startIndex + 50;
        setDisplayData(filteredData.slice(startIndex, endIndex));
    };

    return (
        <div>
            <Header />
            <div className="container-box">
                <div className="box">
                    <div className="box-main">
                        {loading ? (
                            <div className="loading-animation"> <img src="/public/LogoAnims.svg" alt="" /></div>

                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID User</th>
                                        <th>ФИО</th>
                                        <th>Номер телефона</th>
                                        <th>Адресс</th>
                                    </tr>
                                </thead>
                                <tbody id="search-results">
                                    {Array.isArray(displayData) && displayData.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>
                                                    <p>{item.id_user} </p>
                                                </td>
                                                <td id='FIO'>
                                                    <p>{item.name_user} </p>
                                                </td>
                                                <td>
                                                    <p>{item.phone_user}</p>
                                                </td>
                                                <td>
                                                    <p>{item.address_user}</p>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className="pagination-custom">
                    <button onClick={handleFirstPage} disabled={currentPage === 1} className={currentPage === 1 ? 'disabled' : ''}><FiSkipBack /></button>
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className={currentPage === 1 ? 'disabled' : ''}><FiChevronLeft /></button>
                    <span>{currentPage}</span>
                    <button onClick={handleNextPage} disabled={currentPage === Math.ceil(originalData.length / 50)} className={currentPage === Math.ceil(originalData.length / 50) ? 'disabled' : ''}><FiChevronRight /></button>
                    <button onClick={handleLastPage} disabled={currentPage === Math.ceil(originalData.length / 50)} className={currentPage === Math.ceil(originalData.length / 50) ? 'disabled' : ''}><FiSkipForward /></button>
                </div>
            </div>
            <Messenger />
        </div>
    )
}

export default Contractors;
