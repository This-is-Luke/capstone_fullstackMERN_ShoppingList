//home.js is the file that contains the home page
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 5rem;
`;

const StyledLinkLogin = styled(Link)`
	text-decoration: none;
  background-color: blue;
	color: white;
	font-weight: bold;
	font-size: 1.7rem;
	margin: 0 1rem;
  border: 1px solid #000;
  padding: 0.2rem 1rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
`;

const StyledLinkRegister = styled(Link)`
	text-decoration: none;
  background-color: green;
	color: white;
	font-weight: bold;
	font-size: 1.7rem;
	margin: 0 1rem;
  border: 1px solid #000;
  padding: 0.2rem 1rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
`;

const StyledH1 = styled.h1`
	font-size: 2.5rem;
	margin-bottom: 1rem;
`;

const StyledP = styled.p`
	font-size: 1.2rem;
`;

function Home() {
	return (
		<CenteredDiv>
			<StyledH1>Shopping List</StyledH1>
			<StyledP>
				<StyledLinkLogin to="/login">Login</StyledLinkLogin> or{' '}
				<StyledLinkRegister to="/register">Register</StyledLinkRegister>
			</StyledP>
		</CenteredDiv>
	);
}

export default Home;
