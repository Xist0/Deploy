import React from 'react'
import { NavLink } from 'react-router-dom';
import './components.css';

function AppMedia() {
    return (
        <div className="container">
            <div className="block-top">
                <NavLink to="/SearcOrder" className="block"><div >Поиск заказа</div></NavLink>
                <NavLink to="/Orders" className="block"><div >Заказы</div></NavLink>
                <NavLink to="/Employees" className="block"><div >Сотрудники</div></NavLink>
                <NavLink to="/Calls" className="block"><div >Записи звонков</div></NavLink>
                <NavLink to="/OrderStatus"className="block"><div >Состояние заказа</div></NavLink>
                <NavLink to="/SpareParts"className="block"><div >Запчасти</div></NavLink>
                <NavLink to="/Works" className="block"><div >Работы</div></NavLink>
                <NavLink to="/WarrantyRepair" className="block"><div >Гарантийные ремонты</div></NavLink>
                <NavLink to="/ChangeOrder" className="block"><div >Изменить заказ</div></NavLink>
            </div>
        </div>
    )
}

export default AppMedia