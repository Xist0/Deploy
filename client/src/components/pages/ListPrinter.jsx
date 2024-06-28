import React, { useEffect, useState } from 'react';
import { GoTriangleDown } from "react-icons/go";

function User({ printer, deleteUser, updatePrinter }) {  // Добавление updatePrinter в деструктуризацию props
    const [editing, setEditing] = useState(false);
    const [updatedPrinter, setUpdatedPrinter] = useState({ ...printer });

    const handleEdit = () => {
        setEditing(true);
        setUpdatedPrinter({ ...printer });
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setUpdatedPrinter({ ...printer });
    };

    const handleSaveEdit = async () => {
        try {
            await updatePrinter(updatedPrinter);
            setEditing(false);
            handleMessage('Изменения сохранены');
        } catch (error) {
            console.error('Error updating printer:', error);
            handleMessage('Ошибка при сохранении изменений');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPrinter(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <tr key={printer.printer_id}>
            <td>{editing ? <input type="text" className='printer-url' name="printer_name" value={updatedPrinter.printer_name} onChange={handleInputChange} /> : printer.printer_name}</td>
            <td>{editing ? <input type="text" className='printer-url' name="printer_type" value={updatedPrinter.printer_type} onChange={handleInputChange} /> : printer.printer_type}</td>
            <td>{editing ? <input type="text" className='printer-url' name="printer_location" value={updatedPrinter.printer_location} onChange={handleInputChange} /> : printer.printer_location}</td>
            <td>{editing ? <input type="text" className='printer-url' name="printer_url" value={updatedPrinter.printer_url} onChange={handleInputChange} /> : printer.printer_url}</td>
            <td className='printer-btn'>
                {editing ? (
                    <>
                        <button onClick={handleSaveEdit}>Сохранить</button>
                        <button onClick={() => deleteUser(printer.printer_id)}>Удалить</button>
                        <button onClick={handleCancelEdit}>Отмена</button>
                    </>
                ) : (
                    <button onClick={handleEdit}>Редактировать</button>
                )}
            </td>

        </tr>
    );
}

function ListPrinter() {
    const [printer, setPrinter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isStaffVisible, setIsStaffVisible] = useState(false);
    const [newPrinter, setNewPrinter] = useState({
        printer_name: '',
        printer_type: '',
        printer_location: '',
        printer_url: ''
    });

    useEffect(() => {
        fetchPrinter();
    }, []);

    const fetchPrinter = async () => {
        try {
            const response = await fetch('/api/allprinters', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const data = await response.json();
            setPrinter(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching printers:', error);
            setLoading(false);
        }
    };

    const deleteUser = async (printerId) => {
        try {
            await fetch(`/api/deleteprinter/${printerId}`, {
                method: 'DELETE',
            });
            setPrinter(printer.filter(p => p.printer_id !== printerId));
            handleMessage('Принтер успешно удален');
        } catch (error) {
            console.error('Error deleting printer:', error);
            handleMessage('Ошибка при удалении принтера');
        }
    };


    const updatePrinter = async (updatedData) => { 
        const { printer_id, ...rest } = updatedData; 
        try {
            const response = await fetch(`/api/changeprinter`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ printer_id, ...rest }), 
            });
    
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
    
            handleMessage('Данные принтера успешно обновлены');
            fetchPrinter();
        } catch (error) {
            console.error('Error updating printer:', error);
            handleMessage('Ошибка при обновлении данных принтера');
        }
    };

    const handleMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    const handleAddPrinter = async () => {
        try {
            const response = await fetch('/api/postprinter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPrinter),
            });
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            const addedPrinter = await response.json();
            setPrinter([...printer, addedPrinter.printer]);  
            setNewPrinter({ printer_name: '', printer_type: '', printer_location: '', printer_url: '' });
            handleMessage('Принтер успешно добавлен');
            fetchPrinter()
        } catch (error) {
            console.error('Error adding printer:', error);
            handleMessage('Ошибка при добавлении принтера');
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPrinter(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <div className={`staff ${isStaffVisible ? 'expanded' : ''}`}>
                <h2 className={`staffh2 ${isStaffVisible ? 'staffh2Active' : ''}`} onClick={() => setIsStaffVisible(!isStaffVisible)}>Принтеры <GoTriangleDown className={`icon ${isStaffVisible ? 'rotate' : ''}`} /></h2>
                {isStaffVisible && (
                    <>
                        <div>{message}</div>
                        <div className="table-container">
                            <table>
                                <thead className='table-container-mobail'>
                                    <tr>
                                        <th>Имя принтера</th>
                                        <th>Тип принтера</th>
                                        <th>Местоположение</th>
                                        <th>URL</th>
                                        <th colSpan="3">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className='table-container-mobail-tbody'>
                                    {printer.map((printer, index) => (
                                        <User
                                            key={index}
                                            printer={printer}
                                            deleteUser={deleteUser}
                                            updatePrinter={updatePrinter}  // Передача функции updatePrinter
                                        />
                                    ))}
                                    <tr>
                                        <td><input type="text" className='printer-url' placeholder='Имя' name="printer_name" value={newPrinter.printer_name} onChange={handleInputChange} /></td>
                                        <td><input type="text" className='printer-url' placeholder='Назначение' name="printer_type" value={newPrinter.printer_type} onChange={handleInputChange} /></td>
                                        <td><input type="text" className='printer-url' placeholder='Расположение' name="printer_location" value={newPrinter.printer_location} onChange={handleInputChange} /></td>
                                        <td><input type="text" className='printer-url' placeholder='URL ссылка' name="printer_url" value={newPrinter.printer_url} onChange={handleInputChange} /></td>
                                        <td colSpan="2" class="printer-btn"><button onClick={handleAddPrinter}>Добавить</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default ListPrinter;
