// Register.js 
/* 
In this file we are going to create a form for the user to register.
The form will send the user's name, email, and password to the server.
If the user is successfully registered, the server will send back a token
that will be stored in the browser's local storage. The token will be used
to authenticate the user for all future requests to the server.
*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // new state for admin checkbox

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3042/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, isAdmin }) // include isAdmin in the request body
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/login-thankyou');
      } else {
        console.log('Response not OK:', response);
        const errorData = await response.json();
        console.log('Error data:', errorData);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <label>
          <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} /> Register as Admin
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
