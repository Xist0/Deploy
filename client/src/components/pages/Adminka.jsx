import React, { useState } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';
import UserList from './UserList';
import PrintComponent from './PrintComponent';
import ListPrinter from './ListPrinter';

function Adminka() {

    return (
        <div className="container-box">
            <RegisterForm  />
            <UserList />
            {/* <PrintComponent/> */}
            <ListPrinter/>
        </div>
    );
}

export default Adminka;
