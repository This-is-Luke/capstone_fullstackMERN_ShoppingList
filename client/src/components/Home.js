//home.js is the file that contains the home page
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Shopping List</h1>
      <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Home;
