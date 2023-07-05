// AdminHome.js
/*
This file will be the admin home page. It will display a welcome message
and a button to view all users.
*/
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import Styled from 'styled-components';

const CeneteredDiv = Styled.div`
  text-align: center;
`;

const StyledButton = Styled.button`
  background-color: green;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 15px 32px;
  margin: 0 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2rem;
`;

function AdminHome() {
  return (
    <CeneteredDiv>
      <HeaderNav />
      <h1>Welcome to the Admin Page</h1>
      <Link to="/admin-view-all-users">
        <StyledButton>View All Users</StyledButton>
      </Link>
    </CeneteredDiv>
  );
}

export default AdminHome;
