
import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AppMedia from './components/AppMedia';
import Works from './components/pages/Works.jsx';
import WarrantyRepair from './components/pages/WarrantyRepair.jsx';
import SpareParts from './components/pages/SpareParts.jsx';
import OrderStatus from './components/pages/OrderStatus.jsx';
import Orders from './components/pages/Orders.jsx';
import Employees from './components/pages/Employees.jsx';
import ChangeOrder from './components/pages/ChangeOrder.jsx';
import Calls from './components/pages/Calls.jsx';
import SearchOrder from './components/pages/SearchOrder.jsx';
import PersonalAccount from './components/pages/PersonalAccount.jsx';
import { Context } from './main.jsx';
import Acceptance from './components/pages/Acceptance.jsx';
import PhoneBook from './components/pages/PhoneBook.jsx';
import Maxvi from './components/pages/Maxvi.jsx'
import Adminka from './components/pages/Adminka.jsx'
import Shipment from './components/pages/Shipment.jsx';

const MainPage = () => {
    const { store } = useContext(Context);
    const userRole = store.user.role
    return (
        <>
            <Header />
            {/* <AppMedia /> */}
            <Routes>
                <Route path="/Works" element={userRole === 'Администратор' || userRole === 'Мастер' ? <Works /> : <Navigate to="/" />} />
                <Route path="/WarrantyRepair" element={userRole === 'Администратор' || userRole === 'Менеджер' || userRole === 'Мастер' ? <WarrantyRepair /> : <Navigate to="/" />} />
                <Route path="/SpareParts" element={userRole === 'Администратор' || userRole === 'Мастер' ? <SpareParts /> : <Navigate to="/" />} />
                <Route path="/OrderStatus" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <OrderStatus /> : <Navigate to="/" />} />
                <Route path="/Orders" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Orders /> : <Navigate to="/" />} />
                <Route path="/Maxvi" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Maxvi /> : <Navigate to="/" />} />
                <Route path="/Employees" element={userRole === 'Администратор' ? <Employees /> : <Navigate to="/" />} />
                <Route path="/ChangeOrder" element={userRole === 'Администратор' || userRole === 'Мастер' ? <ChangeOrder /> : <Navigate to="/" />} />
                <Route path="/Calls" element={userRole === 'Администратор' || userRole === 'Админ' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Calls /> : <Navigate to="/" />} />
                <Route path='PhoneBook' element={<PhoneBook />} />
                <Route path="/SearchOrder" element={userRole === 'Администратор' || userRole === 'Админ' || userRole === 'Менеджер' ? <SearchOrder /> : <Navigate to="/" />} />
                <Route path="/adminka" element={userRole === 'Администратор' || userRole === 'Админ' ? <Adminka /> : <Navigate to="/" />} />
                <Route path="/PersonalAccount" element={<PersonalAccount />} />
                <Route path='/SpareParts' element={<SpareParts />} />
                <Route path='/Acceptance' element={userRole === 'Туркистанская' || userRole === 'Приёмка' || userRole === 'Отправка' || userRole === 'Администратор' ? <Acceptance /> : <Navigate to="/" />} />
                <Route path='/Shipment' element={userRole === 'Туркистанская' || userRole === 'Приёмка' || userRole === 'Отправка' || userRole === 'Администратор' ? <Shipment /> : <Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default MainPage;
