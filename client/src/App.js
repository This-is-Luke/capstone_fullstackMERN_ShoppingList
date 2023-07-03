import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Register from './components/Register';
import LoginThankyou from './components/LoginThankyou';
import Login from './components/Login';
import AdminHome from './components/AdminHome';
import AdminViewAllUsers from './components/AdminViewAllUsers';
import AdminViewUserList from './components/AdminViewUserList';
import AdminAddItems from './components/AdminAddItems';
import AdminEditList from './components/AdminEditList';
import UserHome from './components/UserHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login-thankyou" element={<LoginThankyou />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/admin-view-all-users" element={<AdminViewAllUsers />} />
        <Route path="/admin-view-user-list" element={<AdminViewUserList />} />
        <Route path="/admin-add-items" element={<AdminAddItems />} />
        <Route path="/admin-edit-list" element={<AdminEditList />} />
      </Routes>
    </Router>
  );
}

export default App;
