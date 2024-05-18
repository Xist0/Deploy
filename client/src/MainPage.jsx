
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
import SearcOrder from './components/pages/SearcOrder.jsx';
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
                <Route path="/Works" element={userRole === 'Админ' || userRole === 'Мастер' ? <Works /> : <Navigate to="/" />} />
                <Route path="/WarrantyRepair" element={userRole === 'Админ' || userRole === 'Менеджер' || userRole === 'Мастер' ? <WarrantyRepair /> : <Navigate to="/" />} />
                <Route path="/SpareParts" element={userRole === 'Админ' || userRole === 'Мастер' ? <SpareParts /> : <Navigate to="/" />} />
                <Route path="/OrderStatus" element={userRole === 'Админ' || userRole === 'Мастер' || userRole === 'Менеджер' ? <OrderStatus /> : <Navigate to="/" />} />
                <Route path="/Orders" element={userRole === 'Админ' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Orders /> : <Navigate to="/" />} />
                <Route path="/Maxvi" element={userRole === 'Админ' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Maxvi /> : <Navigate to="/" />} />
                <Route path="/Employees" element={userRole === 'Админ' ? <Employees /> : <Navigate to="/" />} />
                <Route path="/ChangeOrder" element={userRole === 'Админ' || userRole === 'Мастер' ? <ChangeOrder /> : <Navigate to="/" />} />
                <Route path="/Calls" element={userRole === 'Админ' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Calls /> : <Navigate to="/" />} />
                <Route path='PhoneBook' element={<PhoneBook />} />
                <Route path="/SearcOrder" element={userRole === 'Админ' || userRole === 'ADMIN' || userRole === 'Менеджер' ? <SearcOrder /> : <Navigate to="/" />} />
                <Route path="/adminka" element={userRole === 'Админ' ? <Adminka /> : <Navigate to="/" />} />
                <Route path="/PersonalAccount" element={<PersonalAccount />} />
                <Route path='/SpareParts' element={<SpareParts />} />
                <Route path='/Acceptance' element={userRole === 'Туркистанская' || userRole === 'Приёмка' || userRole === 'Отправка' || userRole === 'Админ' ? <Acceptance /> : <Navigate to="/" />} />
                <Route path='/Shipment' element={userRole === 'Туркистанская' || userRole === 'Приёмка' || userRole === 'Отправка' || userRole === 'Админ' ? <Shipment /> : <Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default MainPage;
