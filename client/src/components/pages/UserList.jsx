import React, { useEffect, useState } from 'react';
import { GoTriangleDown } from "react-icons/go";

function User({ user, deleteUser, updateUserRole, updateUser1CUserId }) {
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [user1CUserId, setUser1CUserId] = useState(user["1C_User_ID"]);

    const handleRoleChange = (event) => {
        const newRole = event.target.value;
        setSelectedRole(newRole);
        updateUserRole(user.id, newRole);
    };

    const handle1CUserIdChange = (event) => {
        setUser1CUserId(event.target.value);
    };

    const handle1CUserIdSubmit = () => {
        updateUser1CUserId(user.id, user1CUserId);
    };

    return (
        <tr key={user.id}>
            <td id='userID'>{user.id}</td>
            <td>{user.login}</td>
            <tr id='action'>
                <td id='userRole'>
                    <select onChange={handleRoleChange} value={selectedRole}>
                        <option value="">Выберите роль</option>
                        <option value="Администратор">Администратор</option>
                        <option value="Приём">Приём</option>
                        <option value="Отправка">Отправка</option>
                        <option value="Стажёр">Стажёр</option>
                        <option value="Мастер">Мастер</option>
                        <option value="Выдача">Выдача</option>
                        <option value="Курьер">Курьер</option>
                        <option value="ТехАдмин">ТехАдмин</option>
                    </select>
                    <button onClick={() => deleteUser(user.id)}>Удалить</button>


                </td>
                <td id='User1CID'>
                    <input
                        type="text"
                        value={user1CUserId}
                        onChange={handle1CUserIdChange}
                        placeholder="1C User ID"
                    />
                    <button onClick={handle1CUserIdSubmit}>Изменить</button>
                </td>
            </tr>

        </tr>
    );
}


function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isStaffVisible, setIsStaffVisible] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });
            setUsers(users.filter(user => user.id !== userId));
            handleMessage('Пользователь успешно удален');
        } catch (error) {
            console.error('Error deleting user:', error);
            handleMessage('Ошибка при удалении пользователя');
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });
            handleMessage('Роль пользователя успешно обновлена');
            fetchUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
            handleMessage('Ошибка при обновлении роли пользователя');
        }
    };

    const updateUser1CUserId = async (userId, new1CUserId) => {
        try {
            await fetch(`/api/users/${userId}/1c-user-id`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user1CUserId: new1CUserId }),
            });
            handleMessage('1C_User_ID успешно обновлен');
            fetchUsers();
        } catch (error) {
            console.error('Error updating 1C_User_ID:', error);
            handleMessage('Ошибка при обновлении 1C_User_ID');
        }
    };

    const handleMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    return (
        <>
            <div className={`staff ${isStaffVisible ? 'expanded' : ''}`}>
                <h2 className={`staffh2 ${isStaffVisible ? 'staffh2Active' : ''}`} onClick={() => setIsStaffVisible(!isStaffVisible)}>Сотрудники <GoTriangleDown className={`icon ${isStaffVisible ? 'rotate' : ''}`} /></h2>
                {isStaffVisible && (
                    <>
                        <div>{message}</div>
                        <div className="table-container">
                            <table>
                                <thead className='table-container-mobail'>
                                    <tr>
                                        <th>ID</th>
                                        <th id='UserName'>Имя</th>
                                        <th colspan="2">Действие</th>
                                    </tr>
                                    <tr >
                                        <th colspan="2"></th>
                                        <th id="userRole"><h1>Изменить роль</h1> <h1>1C ID</h1></th>


                                    </tr>
                                </thead>
                                <tbody className='table-container-mobail-tbody'>
                                    {users.map(user => (
                                        <User
                                            key={user.id}
                                            user={user}
                                            deleteUser={deleteUser}
                                            updateUserRole={updateUserRole}
                                            updateUser1CUserId={updateUser1CUserId}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}


export default UserList;
