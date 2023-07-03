import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userItem = localStorage.getItem('user');
    if (userItem !== null && userItem !== 'undefined') {
      setUser(JSON.parse(userItem));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
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
