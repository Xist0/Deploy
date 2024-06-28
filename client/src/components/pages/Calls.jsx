import React, { useState, useEffect, useRef } from 'react';
import './orders.css';
import { Link, useNavigate } from 'react-router-dom';
import Messenger from './messenger/Messenger';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { FaCalendarAlt } from "react-icons/fa";
import { DateRange } from 'react-date-range';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { GoTriangleDown } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaTimesCircle } from "react-icons/fa";
const Modal = ({ cal, isModalOpen, toggleModal, downloadAudio }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      // Update current time
    };

    const handleLoadedData = () => {
      // Set duration
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  const stopAudio = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCloseModal = () => {
    stopAudio();
    toggleModal();
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">{cal.name}</h5>

        </div>
        <div className="modal-body">
          <div className="audio-container">
            <audio ref={audioRef} src={`/api/audio/${cal.name}`} preload="auto" controls></audio>

          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary btn-sm" onClick={handleCloseModal}>
            Закрыть
          </button>


          <button onClick={() => downloadAudio(cal.name)}>Скачать</button>

        </div>
      </div>
    </div>
  );
};


const Calls = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableHeaderVisible, setTableHeaderVisibility] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFIO, setSearchFIO] = useState('');
  const [searchNumber, setSearchNumber] = useState('');
  const [sortByDateTimeAsc, setSortByDateTimeAsc] = useState(true);
  const [searchOrder, setSearchOrder] = useState('');
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [noDataMessage, setNoDataMessage] = useState('');
  const [isDateRangeVisible, setIsDateRangeVisible] = useState(false);
  const iconClass = isDateRangeVisible ? 'rotate' : '';
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [matchedOrder, setMatchedOrder] = useState([])
  const navigate = useNavigate();
  const [requestCounter, setRequestCounter] = useState(0);
  const [state, setState] = useState([
    {
      startDatePlaceholder: null,
      endDatePlaceholder: null,
      key: 'selection'
    }
  ]);
  const shouldShowResetIcon = searchTerm || searchFIO || searchNumber || searchOrder;
  const latestRequestCounter = useRef(0);
  useEffect(() => {
    latestRequestCounter.current = requestCounter;
  }, [requestCounter]);

  const russianTranslations = {
    startDatePlaceholder: 'Начальная дата',
    endDatePlaceholder: 'Конечная дата',
    ...ru,
  };


  const handleToggleDateRange = () => {
    setIsDateRangeVisible(!isDateRangeVisible);
    const icon = document.querySelector('.chevron-icon');
    if (icon) {
      icon.classList.toggle('rotated');
    }
  };
  const handleFIOClick = (fio) => {
    const searchUrl = `https://order.service-centr.com/AllOrders?fio=${encodeURIComponent(fio)}`;
    window.open(searchUrl, '_blank');
  };

  const parseOrderNumber = (text) => {
    const orderNumberRegex = /00НФ-(\d+)/;
    const match = text.match(orderNumberRegex);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  };

  const fetchData = async () => {
    setRequestCounter(requestCounter + 1);

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setIsSearchDisabled(true);
    setNoDataMessage(''); // Сброс сообщения об отсутствии данных
    try {
      let startDateParam = state[0].startDate ? format(state[0].startDate, 'yyyy-MM-dd') : null;
      let endDateParam = state[0].endDate ? format(state[0].endDate, 'yyyy-MM-dd') : null;
      const searchNumberValue = searchNumber || null;

      const response = await fetch(`/api/callstoday/${startDateParam ?? 'null'}/${endDateParam ?? 'null'}/${searchNumberValue}`);
      const data = await response.json();

      if (data === null || data.length === 0) {
        setNoDataMessage('Ничего не найдено при запросе');
        setRecords([]);
        setTableHeaderVisibility(false);
      } else {
        data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

        setRecords(data);
        setTableHeaderVisibility(true);
      }

      if (latestRequestCounter.current === requestCounter) {
        setRecords(data);
        setTableHeaderVisibility(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsSearchDisabled(false);
    }
  };



  const filterfetchData = async () => {

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      let startDateParam = null;
      let endDateParam = null;
      const searchNumberValue = null;

      const response = await fetch(`/api/callstoday/${startDateParam ?? 'null'}/${endDateParam ?? 'null'}/${searchNumberValue}`);
      const data = await response.json();

      data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

      setRecords(data);
      setTableHeaderVisibility(true);
      if (latestRequestCounter.current === requestCounter) {
        setRecords(data);
        setTableHeaderVisibility(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsSearchDisabled(false);
    }
  };
  const handleNumberClick = (number) => {
    setSearchNumber(number); // Устанавливаем номер в поле поиска
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
    setIsDateRangeVisible(false);

  };
  const searchUsers = async (fullName) => {
    try {
      const response = await fetch(`/api/users/search/${encodeURIComponent(fullName)}`);
      const data = await response.json();
      const filteredUsers = data.filter(user => user.user_phone);
      setMatchedOrder([]); // Очищаем результаты поиска заказов
      setMatchedUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setMatchedUsers([]);
    }
  };

  const searchUserOrder = async (number) => {
    try {
      const response = await fetch(`/api/byt/order/${encodeURIComponent(number)}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setMatchedUsers([]); // Очищаем результаты поиска пользователей
        setMatchedOrder(data);
      } else {
        setMatchedUsers([]); // Очищаем результаты поиска пользователей
        setMatchedOrder([data]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const fetchRecordDetails = async (name, date) => {
    const response = await fetch(`/api/order/record/${date}/${name}`);

    try {
      const data = await response.json();
      setSelectedRecord({ name, data });
      setIsModalOpen(true);
      handleSearchTermChange({});
    } catch (error) {
      console.log(error);
    }
  };

  const filterRecords = (term) => {
    if (term === "") {
      fetchData();
      return;
    }
    const filteredRecords = records.filter(record => {
      return (
        record.inNomberP_record.includes(term) ||
        record.outNombr_record.includes(term) ||
        (record.orders[0] && record.orders[0].id_order.includes(term))
      );
    });

    setRecords(filteredRecords);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearchTermChange = (e) => {
    const term = e.target.value.trim();
    setSearchTerm(term);
    filterRecords(term);

  };
  const handleOrderClick = (order) => {
    setSearchNumber(order.retail_user.user_phone);
    setSearchFIO(order.retail_user.user_name);
    setMatchedOrder([]);
    // fetchData()
  }

  const handleUserClick = (user) => {
    setSearchFIO(user.user_name);
    setSearchNumber(user.user_phone);
    setMatchedUsers([]);
  };
  const handleSearchNumberChange = (e) => {
    const { value } = e.target;
    setSearchNumber(value);
  };
  const handleSearchFIOChange = (e) => {
    const { value } = e.target;
    setSearchFIO(value);
    searchUsers(value);
  };
  const handleSearchOrderChange = (e) => {
    const { value } = e.target;
    setSearchOrder(value);
    if (value === '') {
      setMatchedOrder([]);
    } else {
      searchUserOrder(value);
    }
  };
  const downloadAudio = async (name) => {
    try {
      const response = await fetch(`/api/audio/${name}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    }
  };

  const handleClick = (event) => {
    event.preventDefault();

    const text = event.target.textContent;
    const orderNumber = parseOrderNumber(text);

    if (orderNumber) {
      const searchUrl = `https://order.service-centr.com/SearchOrder?orderNumber=${orderNumber}`;
      window.open(searchUrl, '_blank');
    } else {
      console.error('Failed to parse order number from link:', text);
    }
  };
  const closeDateRange = () => {
    if (isDateRangeVisible) {
      setIsDateRangeVisible(false);
    }
  };
  const handleSortByDateTime = () => {
    setSortByDateTimeAsc(!sortByDateTimeAsc);
    const sortedRecords = [...records];
    sortedRecords.sort((a, b) => {
      const dateTimeA = new Date(`${a.date_time}`);
      const dateTimeB = new Date(`${b.date_time}`);
      return sortByDateTimeAsc ? dateTimeB - dateTimeA : dateTimeA - dateTimeB;
    });

    setRecords(sortedRecords);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };
  const resetFilters = () => {
    setSearchTerm('');
    setSearchFIO('');
    setSearchNumber('');
    setSearchOrder('');
    setState([{ startDate: null, endDate: null, key: 'selection' }]); // Adjusted state reset
    filterfetchData(); // Fetch new data after resetting filters
  };
  const handleTypeHeaderClick = () => {
    let newFilterType;
    switch (filterType) {
      case 'all':
        newFilterType = 'outgoing';
        break;
      case 'outgoing':
        newFilterType = 'incoming';
        break;
      case 'incoming':
        newFilterType = 'all';
        break;
      default:
        newFilterType = 'all';
        break;
    }
    setFilterType(newFilterType);
  };

  const renderRecords = () => {
    if (!records || records.length === 0) {
      return <tr><td colSpan="8">{noDataMessage || 'Нет данных для отображения'}</td></tr>;
    }

    let filteredRecords = records;
    if (filterType === 'incoming') {
      filteredRecords = records.filter(record => record.call_type === 'Входящий');
    } else if (filterType === 'outgoing') {
      filteredRecords = records.filter(record => record.call_type === 'Исходящий');
    }

    return filteredRecords.map((cal, index) => {
      let logoCall;
      const [date, time] = cal.date_time.split(' ');

      const formattedDate = date.split('-').slice(1).join('.');

      let callDuration = cal.call_bill_sec;
      if (callDuration) {
        const timeParts = callDuration.split(':');
        if (timeParts.length === 3 && timeParts[0] === '00') {
          callDuration = timeParts.slice(1).join(':');
        }
      }

      if (cal.call_status === 'NO ANSWER') {
        logoCall = cal.call_type === 'Входящий'
          ? <img src="/pic/inCallErr.svg" style={{ color: 'red' }} />
          : <img src="/pic/outCallErr.svg" style={{ color: 'red' }} />;
      } else {
        logoCall = cal.call_type === 'Входящий'
          ? <img src="/pic/inCallOk.svg" className='call-mobail-logo-blue' onClick={() => fetchRecordDetails(cal.record_file_name, cal.date)} />
          : <img src="/pic/outCallOk.svg" className='call-mobail-logo-blue' style={{ color: 'blue' }} onClick={() => fetchRecordDetails(cal.record_file_name, cal.date)} />;
      }

      let displayNumber;
      if (cal.name_user && cal.name_user.length > 0) {
        displayNumber = <Link className="link-button-calls" onClick={() => handleFIOClick(cal.name_user)}>{cal.name_user}</Link>;
      } else if (cal.in_number && cal.in_number.length < 4 && cal.out_nomber && cal.out_nomber.length < 4) {
        displayNumber = (
          <React.Fragment>
            {cal.in_number} {'>'} {cal.out_nomber}
          </React.Fragment>
        );
      } else if (cal.out_nomber && cal.out_nomber.length < 4) {
        displayNumber = <a className="link-button-calls" onClick={() => handleNumberClick(cal.in_number)}>{cal.in_number}</a>;
      } else if (cal.in_number && cal.in_number.length < 4) {
        displayNumber = <a className="link-button-calls" onClick={() => handleNumberClick(cal.out_nomber)}>{cal.out_nomber}</a>;
      }


      return (
        <tr key={index} className='mobail-calls-tr'>
          <td className='calls-mobail'>
            {cal.in_number && cal.in_number.length < 4 ? (
              <p>{cal.in_number}</p>
            ) : (
              <p>{cal.in_number}</p>
            )}
          </td>
          <td className='calls-outNumber'>  {cal.out_nomber && cal.in_number.length < 4 ? (
            <p>{cal.out_nomber}</p>
          ) : (
            <p>{cal.in_number}</p>
          )}</td>
          <td className='calls-mobail-adab mobail-fio'>
            {displayNumber}
          </td>
          <td className='th-style-width td-orders calls-mobail-adab'>
            {cal.id_order && cal.id_order.length > 0 && cal.id_order.startsWith('00НФ') ? (
              <Link target={"_blank"} className='link-button-calls' to="#" onClick={handleClick}>{cal.id_order}</Link>
            ) : (
              cal.id_order && cal.id_order.length > 0 ? cal.id_order.slice(5) : 'Нет заказа'
            )}
          </td>
          <td className='call-time'>
            {cal.date_time}
          </td>
          <td className='date-time'>
            <span className='date'>{formattedDate}</span>
            <span className='time'>{time}</span>
          </td>
          <td>{callDuration}</td>
          <td className='call-mobail-logo'>{logoCall}</td>
        </tr>
      );
    });
  };
  const closeDate = () => {
    closeDateRange()
    fetchData()
  }
  useEffect(() => {
    filterRecords(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <Messenger />
      <div div className="container-box">
        <div className="calls-container">
          <div className="row row-cols-auto">
            <div className="p-3 mb-2">
              <form onSubmit={handleSubmit}>
                <div className="row-cols">
                  <div className="row-cols-calendar">
                  <FaCalendarAlt className='row-cols-calendar-svg' />

                  <label onClick={handleToggleDateRange}>
                    <GoTriangleDown className={`icon ${isDateRangeVisible ? 'rotate' : ''}`} />
                  </label>
                  </div>
                  {isDateRangeVisible && (
                    <DateRange
                      locale={russianTranslations}
                      startDatePlaceholder='Начальная дата'
                      endDatePlaceholder='Конечная дата'
                      format="yyyy-MM-dd"
                      editableDateInputs={true}
                      onChange={(item) => setState([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={state}
                    />
                  )}
                  <div className="search-icon"                   >
                    <input
                      type="text"
                      className="search-input"
                      onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"

                      value={searchNumber}
                      onChange={handleSearchNumberChange}
                      onFocus={closeDateRange}
                      placeholder='Поиск'
                      disabled={isLoading || isSearchDisabled}

                    />
                    <div className="search-icon" disabled={isLoading || isSearchDisabled} onClick={() => closeDate()}>
                      <IoSearch />
                    </div>
                  </div>
                  <div className="search-icon-delete">
                    {shouldShowResetIcon && (
                      <FaTimesCircle
                        className="reset-icon"
                        onClick={resetFilters}
                        style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '20px' }}
                      />
                    )}
                  </div>
                </div>

              </form>

            </div>
          </div>
          <div className="calls-container">
            <div className="row row-cols-auto">
              <div className="col">

                {isLoading ? (
                  <div className="loading-animation"> <img src="/pic/LogoAnims.svg" alt="" /></div>
                ) : (
                  <table className="table">
                    {isTableHeaderVisible && (
                      <thead>
                        <tr>
                          <th scope="col" className='calls-mobail'>Офис</th>
                          <th className='calls-outNumber'> Номер </th>
                          <th scope="col" className='th-style-width calls-mobail'>Клиент</th>
                          <th scope="col" className='calls-mobail'>заказ наряд</th>
                          <th className='th-filter' onClick={handleSortByDateTime}>
                            Дата и время
                            <GoTriangleDown
                              style={{
                                transform: sortByDateTimeAsc ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            />
                          </th>
                          <th scope="col" className='calls-mobail'>Время <br /> разговора</th>

                          <th className='th-filter table-left ' scope="col" onClick={handleTypeHeaderClick}>тип звонка</th>
                        </tr>
                      </thead>
                    )}
                    <tbody>{renderRecords()}</tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
        {selectedRecord && (
          <Modal
            cal={selectedRecord}
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            downloadAudio={downloadAudio}
          />
        )}
      </div>
      {/* <div className="block-searh">
                  <input
                    type="text"
                    value={searchFIO}
                    className='input-search'
                    onChange={handleSearchFIOChange}
                    onFocus={closeDateRange}
                    placeholder='Поиск по ФИО'
                    disabled={isLoading || isSearchDisabled}
                  />
                  {matchedUsers.length > 0 && (
                    <div className="matched-users">
                      {matchedUsers.map((user, index) => (
                        <div key={index} className="matched-user" onClick={() => handleUserClick(user)}>
                          {user.user_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="block-searh">

                  <input
                    type="number"
                    onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57"
                    value={searchOrder}
                    className='input-search'
                    onChange={handleSearchOrderChange}
                    onFocus={closeDateRange}
                    placeholder='Поиск по номеру заказа'
                    disabled={isLoading || isSearchDisabled}
                  />
                  {matchedOrder.length > 0 && (
                    <div className="matched-users-orders">
                      {matchedOrder.map((order, index) => (
                        <div key={index} className="matched-user" type="submit" disabled={isLoading || isSearchDisabled} onClick={() => handleOrderClick(order)} >
                          {order.retail_user.user_name} <br />
                          {order.retail_user.user_phone}
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}
    </>
  );
};

export default Calls;