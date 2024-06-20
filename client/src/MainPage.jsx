
import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import WarrantyRepair from './components/pages/WarrantyRepair.jsx';
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
import AllOrders from './components/pages/AllOrders.jsx';

const MainPage = () => {
    const { store } = useContext(Context);
    const userRole = store.user.role
    return (
        <>
            <Header />
            {/* <AppMedia /> */}
            <Routes>
                <Route path="/WarrantyRepair" element={userRole === 'Администратор' || userRole === 'Менеджер' || userRole === 'Мастер' ? <WarrantyRepair /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/OrderStatus" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <OrderStatus /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/Orders" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Orders /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/Maxvi" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Maxvi /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/Employees" element={userRole === 'Администратор' ? <Employees /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/ChangeOrder" element={userRole === 'Администратор' || userRole === 'Мастер' ? <ChangeOrder /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/Calls" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <Calls /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/AllOrders" element={userRole === 'Администратор' || userRole === 'Мастер' || userRole === 'Менеджер' ? <AllOrders /> : <Navigate to="/PersonalAccount" />} />
                <Route path='/PhoneBook' element={<PhoneBook />} />
                <Route path='/' element={<PersonalAccount />}/>
                <Route path="/SearchOrder" element={userRole === 'Администратор' || userRole === 'ADMIN' || userRole === 'Менеджер' ? <SearchOrder /> : <Navigate to="/PersonalAccount" />} />
                <Route path="/adminka" element={userRole === 'Администратор' ? <Adminka /> : <Navigate to="/PersonalAccount" />} />
                <Route path='/Acceptance' element={userRole === 'Туркистанская' || userRole === 'Выдача' || userRole === 'Отправка' || userRole === 'Администратор' ? <Acceptance /> : <Navigate to="/PersonalAccount" />} />
                <Route path='/Shipment' element={userRole === 'Туркистанская' || userRole === 'Приёмка' || userRole === 'Отправка' || userRole === 'Администратор' ? <Shipment /> : <Navigate to="/PersonalAccount" />} />
            </Routes>
        </>
    );
};

export default MainPage;
