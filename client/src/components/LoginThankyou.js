// LoginThankyou.js
/*
In this file, we will create a component that will be displayed after a user logs in.
This component will check if the user is an admin or not and display the appropriate
link to the admin or user home page.
*/
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';

const CenteredDiv = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 5rem;
`;

const StyledLinkUser = Styled(Link)`
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

const StyledLinkAdmin = Styled(Link)`
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


function LoginThankYou() {
  //variables for user and setUser
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the 'user' item from localStorage
    const userItem = localStorage.getItem('user');
    console.log('userItem:', userItem);
  
    // Check if userItem is not null and not 'undefined'
    if (userItem !== null && userItem !== 'undefined') {
      try {
        // Parse the userItem and set it as the user state
        setUser(JSON.parse(userItem));
      } catch (err) {
        // Handle any parsing errors
        console.error('Error parsing userItem:', err);
      }
    } else {
      // Redirect to login page if userItem is undefined
      navigate('/login');
    }
  }, [navigate]);
  

  return (
    <CenteredDiv>
      <h1>You have been logged in...</h1>
      {user && user.isAdmin ? (
        <StyledLinkAdmin to="/admin-home">View Admin Home</StyledLinkAdmin>
      ) : (
        <StyledLinkUser to="/user-home">View User Home</StyledLinkUser>
      )}
    </CenteredDiv>
  );
}

export default LoginThankYou;
