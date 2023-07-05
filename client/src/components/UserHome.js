// UserHome.js
/*
This file will be the user home page. It will display a welcome message 
and a button to view the user's list.
*/
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';

function UserHome() {
  return (
    <div>
      <HeaderNav />
      <h1>Welcome to the User Home Page</h1>
      <Link to="/user-list">
        <button>View My List</button>
      </Link>
    </div>
  );
}

export default UserHome;
