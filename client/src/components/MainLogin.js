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
  //variables for email and password
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    try {
      const response = await fetch('http://localhost:3042/api/users/auth', {
        method: 'POST', // Use the POST method
        headers: {
          'Content-Type': 'application/json' // Set the request content type to JSON
        },
        body: JSON.stringify({ email, password }) // Convert the email and password to a JSON string and set it as the request body
      });
  
      console.log('Login.js - Response:', response); // Log the response object to the console
  
      if (response.ok) {
        // If the response status is within the 200-299 range (indicating success)
        const data = await response.json(); // Parse the response body as JSON
        localStorage.setItem('token', data.token); // Store the token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user)); // Store the user object in localStorage
        navigate('/login-thankyou'); // Redirect to the '/login-thankyou' page
      } else {
        // If the response status is not within the 200-299 range (indicating an error)
        console.error('Login.js - Error: Response not OK'); // Log an error message to the console
        const errorData = await response.text(); // Get the error response body as text
        console.error('Login.js - Error Data:', errorData); // Log the error response body to the console
        alert('Error: ' + errorData); // Display an alert with the error message
      }
    } catch (err) {
      // If an error occurs during the fetch request or parsing the response
      console.error('Login.js - Error:', err); // Log the error to the console
      alert('Error: ' + err.message); // Display an alert with the error message
    }
  };
  
  // simply handle the click to move use to the register page if they are not registered
  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegisterClick}>Register</button> {/* New Register button */}
      </form>
    </div>
  );
}

export default Login;
