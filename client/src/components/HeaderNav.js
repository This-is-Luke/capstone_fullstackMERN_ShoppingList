import React from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderNav() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav>
      <h1>Hello, {user ? user.name : 'Guest'}</h1>
      {user && <button onClick={handleSignOut}>Sign Out</button>}
    </nav>
  );
}

export default HeaderNav;
