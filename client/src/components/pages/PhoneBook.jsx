import React, { useState, useEffect } from 'react';
import './orders.css';

const PhoneBook = () => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTableHeaderVisible, setTableHeaderVisibility] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 25;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching data from /api/1c/users');
            const response = await fetch(`/api/1c/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Data received:', data);
            setRecords(data);
            setTableHeaderVisibility(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderRecords = () => {
        let filteredRecords = records;
        if (searchTerm) {
            filteredRecords = records.filter(record =>
                record.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.user_phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.user_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.user_legal_address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

        if (!currentRecords || currentRecords.length === 0) {
            return <tr><td colSpan="10">Нет данных для отображения</td></tr>;
        }

        return currentRecords.map((cal, index) => {
            return (
                <tr key={index}>
                    <td id='type_call'>{cal.user_id}</td>
                    <td>{cal.user_name}</td>
                    <td>{cal.user_phone}</td>
                    <td>{cal.user_address}</td>
                    <td>{cal.user_legal_address}</td>
                </tr>
            );
        });
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(records.length / recordsPerPage);

    const handlePrevious = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNext = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        pageNumbers.push(
            <a
                key={1}
                onClick={() => setCurrentPage(1)}
                className={`page-item-pag ${currentPage === 1 ? 'page-item-pag-active' : ''}`}
            >
                1
            </a>
        );

        if (currentPage > 6) {
            pageNumbers.push(<a key="dots-before" className='page-item-pag'>...</a>);
        }

        const startPage = Math.max(2, currentPage - 5);
        const endPage = Math.min(totalPages - 1, currentPage + 5);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <a
                    key={i}
                    onClick={() => setCurrentPage(i)}
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
                onClick={() => setCurrentPage(totalPages)}
                className={`page-item-pag ${currentPage === totalPages ? 'page-item-pag-active' : ''}`}
            >
                {totalPages}
            </a>
        );

        return pageNumbers;
    };

    return (
        <div className="container-box">
            <div className="calls-container">
                <div className="phone-book">
                    {isLoading ? (
                        <div className="loading-animation"> <img src="/pic/LogoAnims.svg" alt="" /></div>
                    ) : (
                        <div className="phone-book">
                            <div className="phone-book-search">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                    placeholder="Поиск совпадений"
                                />
                            </div>
                            <table className="table">
                                {isTableHeaderVisible && (
                                    <thead>
                                        <tr>
                                            <th scope="col">ID 1C</th>
                                            <th scope="col">ФИО</th>
                                            <th scope="col">Номер</th>
                                            <th scope="col">Адрес</th>
                                            <th scope="col">Юридический адрес</th>
                                        </tr>
                                    </thead>
                                )}
                                <tbody>{renderRecords()}</tbody>
                            </table>
                            <div className="pagination">
                                <button
                                    onClick={handlePrevious}
                                    className={`page-item ${currentPage === 1 ? 'pagination-button-aut' : ''}`}
                                    disabled={currentPage === 1}
                                >
                                    Назад
                                </button>
                                {renderPageNumbers()}
                                <button
                                    onClick={handleNext}
                                    className={`page-item ${currentPage === totalPages ? 'pagination-button-aut' : ''}`}
                                    disabled={currentPage === totalPages}
                                >
                                    Вперед
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhoneBook;
