// Login.js
/*
In this file we are going to create a login form that will send the user's email and 
password to the server for authentication. If the user is authenticated, the
server will send back a token that will be stored in the browser's local storage. 
The token will be used to authenticate the user for all future requests to the server.
*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3042/api/users/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login.js - Response:', response);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // store only the user ID in local storage
        navigate('/login-thankyou');
      } else {
        console.error('Login.js - Error: Response not OK');
        const errorData = await response.text();
        console.error('Login.js - Error Data:', errorData);
        alert('Error: ' + errorData);
      }
    } catch (err) {
      console.error('Login.js - Error:', err);
      alert('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
