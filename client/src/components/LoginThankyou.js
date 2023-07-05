// LoginThankyou.js
/*
In this file, we will create a component that will be displayed after a user logs in.
This component will check if the user is an admin or not and display the appropriate
link to the admin or user home page.
*/
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <div>
      <h1>You have been logged in...</h1>
      {user && user.isAdmin ? (
        <Link to="/admin-home">View Admin Home</Link>
      ) : (
        <Link to="/user-home">View User Home</Link>
      )}
    </div>
  );
}

export default LoginThankYou;
