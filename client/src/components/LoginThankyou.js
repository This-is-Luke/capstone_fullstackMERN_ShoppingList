import React from 'react';
import { Link } from 'react-router-dom';

function LoginThankYou() {
  const user = JSON.parse(localStorage.getItem('user'));

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
