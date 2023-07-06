// headerNav.js
/*
In this file we will create a component that will display the user's name and a sign out button.
This is intended as a head of most of the next components we will create.
*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';

const StyledNav = Styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #000;
  color: #fff;
  padding: 0 2rem;
  height: 5rem;
`;

const StyledH1 = Styled.h1`
  font-size: 2rem;
`;

const StyledButton = Styled.button`
  background-color: red;
  color: white;
  font-size: 1.1rem;
  padding: 0.2rem 1rem;
  border-radius: 5px;
  border: 1px solid #000;
  &:hover {
    cursor: pointer;
      }
   
`;

function HeaderNav() {
  const navigate = useNavigate(); // Hook to access the navigation functionality
  const [user, setUser] = useState(null); // State variable to store the user

  useEffect(() => {
    const userItem = localStorage.getItem('user'); // Retrieve the user item from localStorage
    if (userItem !== null && userItem !== 'undefined') {
      setUser(JSON.parse(userItem)); // Parse the user item from JSON and set it as the user state
    }
  }, []); // Empty dependency array ensures this effect only runs once, on component mount

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('user'); // Remove the user from localStorage
    setUser(null); // Set the user state to null
    navigate('/login'); // Redirect to the '/login' page
  };

  return (
    <StyledNav>
      <StyledH1>Hello, {user ? user.name : 'Guest'}</StyledH1>
      {user && <StyledButton onClick={handleSignOut}>Sign Out</StyledButton>}
    </StyledNav>
  );
}

export default HeaderNav;
