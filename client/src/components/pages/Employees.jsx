import React, { useState, useEffect } from 'react'
import Header from '../Header'
import Messenger from './messenger/Messenger'
import { useSelector } from 'react-redux';
import axios from 'axios';

function Employees() {
  const role = useSelector((state) => state.auth.role);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://order.service-centr.com/users');
      const usersData = response.data;
      console.log('Список пользователей:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
    }
  };

  const handleAddUser = (userData) => {
    setUsers(prevUsers => [...prevUsers, userData]);
  };

  return (
    <div>
      <Header />
      <div className="container-box">
        <div>
          <h2>Список пользователей:</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <p>Имя: {user.name}</p>
                <p>Роль: {user.role}</p>
              </li>
            ))}
          </ul>
        </div>
        {(role === 'Директор') && (<Reg onAddUser={handleAddUser} />)}
      </div>
      <Messenger />
    </div>
  )
}

export default Employees

