import React, { useState } from 'react';

const SearchUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayData, setDisplayData] = useState([]);

  const fetchSearchData = async (query) => {
    try {
      const response = await fetch(`/api/1c/users/search?query=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const json = await response.json();
      setDisplayData(json);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return; // Если строка запроса пустая, выходим
    setLoading(true);
    await fetchSearchData(searchQuery);
  };

  return (
    <div>
      <div className="container-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Введите ФИО или номер телефона"
        />
        <button onClick={handleSearch}>Поиск</button>
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <ul>
            {displayData.map(user => (
              <li key={user.id_user}>
                <p>{`ID: ${user.id_user}`}</p>
                <p>{`Имя: ${user.name_user}`}</p>
                <p>{`Телефон: ${user.phone_user}`}</p>
                <p>{`Тип: ${user.type}`}</p>
                <p>{`Адрес: ${user.address_user}`}</p>
                <p>{`Дата создания: ${user.date_create}`}</p>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default SearchUsers;
