// UserHome.js
/*
This file will be the user home page. It will display a welcome message 
and a button to view the user's list.
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

const StyledH1 = Styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin-top: 5rem;
`;

function UserHome() {
	return (
		<CeneteredDiv>
			<HeaderNav />
			<StyledH1>Click here to view your list</StyledH1>
			<Link to="/user-list">
				<StyledButton>View My List</StyledButton>
			</Link>
		</CeneteredDiv>
	);
}

export default UserHome;
