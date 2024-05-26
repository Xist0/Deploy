import React, { useEffect, useState } from 'react';

function User({ user, deleteUser, updateUserRole }) {
    const [selectedRole, setSelectedRole] = useState(user.role);

    const handleRoleChange = (event) => {
        const newRole = event.target.value;
        setSelectedRole(newRole);
        updateUserRole(user.id, newRole);
    };

    return (
        <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.login}</td>
            <td>{user.role}</td>
            <td>
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
            </td>
            <td>
                <button onClick={() => deleteUser(user.id)}>Удалить</button>
            </td>
        </tr>
    );
}

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

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

    const handleMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, 3000); 
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Сотрудники</h2>
            <div>{message}</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Роль</th>
                        <th>Изменить роль</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <User
                            key={user.id}
                            user={user}
                            deleteUser={deleteUser}
                            updateUserRole={updateUserRole}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
