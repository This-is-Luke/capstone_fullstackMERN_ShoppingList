import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginThankYou() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userItem = localStorage.getItem('user');
    console.log('userItem:', userItem);
    if (userItem !== null && userItem !== 'undefined') {
      try {
        setUser(JSON.parse(userItem));
      } catch (err) {
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
