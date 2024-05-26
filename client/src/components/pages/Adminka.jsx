import React, { useState } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';
import UserList from './UserList';

function Adminka() {

    return (
        <div className="container-box">
            <RegisterForm  />
            <UserList />
        </div>
    );
}

export default Adminka;
