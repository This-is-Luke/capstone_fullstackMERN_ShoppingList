// AdminHome.js
/*
This file will be the admin home page. It will display a welcome message
and a button to view all users.
*/
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';

function AdminHome() {
  return (
    <div>
      <HeaderNav />
      <h1>Welcome to the Admin Home Page</h1>
      <Link to="/admin-view-all-users">
        <button>View All Users</button>
      </Link>
    </div>
  );
}

export default AdminHome;
