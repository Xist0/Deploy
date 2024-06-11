import React, { useState } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';
import UserList from './UserList';
import PrintComponent from './PrintComponent';

function Adminka() {

    return (
        <div className="container-box">
            <RegisterForm  />
            <UserList />
            <PrintComponent/>
        </div>
    );
}

export default Adminka;
