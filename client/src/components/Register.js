// Register.js
/* 
In this file we are going to create a form for the user to register.
The form will send the user's name, email, and password to the server.
If the user is successfully registered, the server will send back a token
that will be stored in the browser's local storage. The token will be used
to authenticate the user for all future requests to the server.
*/
// Import necessary libraries
import React, { useState } from 'react'; // useState is used to manage component state
import { useNavigate } from 'react-router-dom'; // useNavigate is a hook provided by react-router-dom to programmatically navigate

// Define the Register component
function Register() {
  // Initialize state variables using useState
  const navigate = useNavigate(); // This hook will be used to navigate after successful registration
  const [name, setName] = useState(''); // State variable for the name input field
  const [email, setEmail] = useState(''); // State variable for the email input field
  const [password, setPassword] = useState(''); // State variable for the password input field
  const [isAdmin, setIsAdmin] = useState(false); // State variable for the admin checkbox

  // Define the handleSubmit function that will be called when the form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Try to register the user using the fetch API
    try {
      // Send a POST request to the /api/users endpoint with the form data
      const response = await fetch('http://localhost:3042/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, isAdmin }), // Convert the form data to JSON
      });

      // If the request was successful
      if (response.ok) {
        const data = await response.json(); // Parse the JSON response body
        localStorage.setItem('token', data.token); // Store the token in local storage
        localStorage.setItem('user', JSON.stringify(data.user)); // Store the user data in local storage
        navigate('/login-thankyou'); // Navigate to the login thank you page
      } else {
        // If the request was not successful, log the response status
        console.error('Response not OK:', response);
        const errorData = await response.json(); // Parse the JSON response body
        console.error('Error data:', errorData); // Log the error data
      }
    } catch (err) {
      // If an error occurred while sending the request, log the error
      console.error('Error:', err);
    }
  };

  // Render the form
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />{' '}
          Register as Admin
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

// Export the Register component as the default export
export default Register;