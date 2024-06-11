import React, { useState, useEffect, useRef } from 'react';
import { IoChevronDownOutline } from "react-icons/io5";
import './orders.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate once
import Messenger from './messenger/Messenger';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { GoTriangleDown } from "react-icons/go";

const Modal = ({ cal, isModalOpen, toggleModal, downloadAudio }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedData = () => {
      setDuration(audio.duration);
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

  const handleTimeSeek = (e) => {
    const audio = audioRef.current;
    const seekTime = parseFloat(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleCloseModal = () => {
    stopAudio();
    toggleModal();
  };

  return (
    <div className={`modal-door${isModalOpen ? 'modal-dialog' : ''}`}>
      <div className="modal fade" id={`exampleModal-${cal.id_record}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${cal.record_file_name}`} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`exampleModalLabel-${cal.id_record}`}>{cal.name}</h5>
            </div>
            <div className="modal-body">
              <audio ref={audioRef} src={`/api/audio/${cal.name}`} preload="auto" controls></audio>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary btn-sm" onClick={handleCloseModal}>
                Закрыть
              </button>
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={() => downloadAudio(cal.name)}
              >
                Скачать
              </button>
            </div>
          </div>
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
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [filterType, setFilterType] = useState('all');
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
    try {
      let startDateParam = state[0].startDate ? format(state[0].startDate, 'yyyy-MM-dd') : null;
      let endDateParam = state[0].endDate ? format(state[0].endDate, 'yyyy-MM-dd') : null;
      const searchNumberValue = searchNumber || null;

      const response = await fetch(`/api/callstoday/${startDateParam ?? 'null'}/${endDateParam ?? 'null'}/${searchNumberValue}`);
      const data = await response.json();
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

  const handleSortByDate = () => {
    setSortByDateAsc(!sortByDateAsc);
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

  const fetchRecordDetails = async (name, day) => {
    const response = await fetch(`/api/order/record/${day}/${name}`);

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

  const handleSortByDateTime = () => {
    setSortByDateTimeAsc(!sortByDateTimeAsc);
    const sortedRecords = [...records];
    sortedRecords.sort((a, b) => {
      const dateTimeA = new Date(`${a.day}T${a.time}`);
      const dateTimeB = new Date(`${b.day}T${b.time}`);
      return sortByDateTimeAsc ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
    });

    setRecords(sortedRecords);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
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
      return <tr><td colSpan="10">Нет данных для отображения</td></tr>;
    }

    let filteredRecords = records;
    if (filterType === 'incoming') {
      filteredRecords = records.filter(record => record.call_type === 'Входящий');
    } else if (filterType === 'outgoing') {
      filteredRecords = records.filter(record => record.call_type === 'Исходящий');
    }

    if (sortByDateAsc) {
      filteredRecords.sort((a, b) => new Date(a.day) - new Date(b.day));
    } else {
      filteredRecords.sort((a, b) => new Date(b.day) - new Date(a.day));
    }

    return filteredRecords.map((cal, index) => {
      let logoCall;
      let playButton;

      if (cal.call_status === 'NO ANSWER') {
        playButton = <td className='tdRed' id='td'><label>Отсутствует</label></td>;
        logoCall = cal.call_type === 'Входящий' ? <img src="/pic/inCallErr.svg" style={{ color: 'transparent' }} /> : <img src="/pic/outCallErr.svg" style={{ color: 'blue' }} />;
      } else {
        if (cal.call_status === 'NO ANSWER') {
          playButton = <td className='tdRed' id='td'><label>Отсутствует</label></td>;
          logoCall = cal.call_type === 'Входящий' ? <img src="/pic/inCallErr.svg" style={{ color: 'transparent' }} /> : <img src="/pic/outCallErr.svg" style={{ color: 'blue' }} />;
        } else {
          playButton = (
            <td className="table-success" style={{ textAlign: 'center', backgroundColor: '#52f65257' }}>
              <button
                className="btn-td"
                onClick={() => {
                  fetchRecordDetails(cal.record_file_name, cal.day)
                }}
              >
                Воспроизвести
              </button>
            </td>
          );
          logoCall = cal.call_type === 'Входящий' ? <img src="/pic/inCallOk.svg" style={{ color: 'blue' }} /> : <img src="/pic/outCallOk.svg" style={{ color: 'blue' }} />;
        }
      }

      return (
        <tr key={index}>
          <td id='type_call' className='table-left'>{cal.call_type}</td>
          <td>{cal.in_number}</td>
          <td>{cal.out_nomber}</td>
          <td className='th-style-width truncate'>
            <Link className="link-button" onClick={() => handleFIOClick(cal.name_user)}>
              {cal.name_user}
            </Link>
          </td>
          <td>
            {cal.id_order && cal.id_order.length > 0 && cal.id_order.startsWith('00НФ') ? (
              <Link target={"_blank"} to="#" onClick={handleClick}>{cal.id_order}</Link>
            ) : (
              cal.id_order && cal.id_order.length > 0 ? cal.id_order : 'Нет заказа'
            )}
          </td>
          <td>{`${cal.day} ${cal.time}`}</td>

          <td>{logoCall}</td>
          <td id='type-butn'>{playButton}</td>
        </tr>
      );
    });
  };
  useEffect(() => {
    filterRecords(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <Messenger />
      <div className="container-box">
        <div className="calls-container">
          <div className="row row-cols-auto">
            <div className="p-3 mb-2">
              <form onSubmit={handleSubmit}>
                <div className="row-cols">
                  <label onClick={handleToggleDateRange}>
                    Введите дату поиска записей <GoTriangleDown className={`icon ${isDateRangeVisible ? 'rotate' : ''}`} />
                  </label>
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
                </div>

                <input
                  type="text"
                  value={searchNumber}
                  className='input-search'
                  onChange={handleSearchNumberChange}
                  placeholder='Поиск по номеру'
                  disabled={isLoading || isSearchDisabled}
                />
                <input
                  type="text"
                  value={searchFIO}
                  className='input-search'
                  onChange={handleSearchFIOChange}
                  placeholder='Поиск по ФИО'
                  disabled={isLoading || isSearchDisabled}
                />

                <input
                  type="text"
                  value={searchOrder}
                  className='input-search'
                  onChange={handleSearchOrderChange}
                  placeholder='Поиск по номеру заказа'
                  disabled={isLoading || isSearchDisabled}
                />
                <button type="submit" className="btn btn-primary" disabled={isLoading || isSearchDisabled}>поиск</button>
              </form>
              <div className="seath-container">
                <div className="container-poisk">
                  {matchedOrder.length > 0 && (
                    <div className="matched-users">
                      {matchedOrder.map((order, index) => (
                        <div key={index} className="matched-user" type="submit" disabled={isLoading || isSearchDisabled} onClick={() => handleOrderClick(order)} >
                          {order.retail_user.user_name} <br />
                          {order.retail_user.user_phone}
                        </div>
                      ))}
                    </div>
                  )}
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

              </div>
            </div>
          </div>
          <div className="calls-container">
            <div className="row row-cols-auto">
              <div className="col">

                {isLoading ? (
                  <div className="loading-animation"> <img src="/public/LogoAnims.svg" alt="" /></div>
                ) : (
                  <table className="table">
                    {isTableHeaderVisible && (
                      <thead>
                        <tr>
                          <th className='th-filter table-left ' scope="col" onClick={handleTypeHeaderClick}>тип звонка</th>
                          <th scope="col">набранный номер</th>
                          <th scope="col">номер звонящий</th>
                          <th scope="col" className='th-style-width'>Ф.И.О</th>
                          <th scope="col">заказ наряд</th>
                          <th className='th-filter' onClick={handleSortByDateTime}>
                            Дата и время
                            <GoTriangleDown
                              style={{
                                transform: sortByDateTimeAsc ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            />
                          </th>
                          <th className="icon"></th>
                          <th scope="col">воспроизвести</th>
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
    </div>
  );
};

export default Calls;