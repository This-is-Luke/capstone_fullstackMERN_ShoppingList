// AdminViewAllUsers.js
/*
This file will be the admin view all users page. It will display a list of all users
and a button to view a user's shoppin list.
*/
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';

// main function component for AdminViewAllUsers
function AdminViewAllUsers() { 
  // variables for users and setUsers state
  const [users, setUsers] = useState([]);
  const [error] = useState(null);

  // useEffect hook to fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  // function to fetch users
  const fetchUsers = async () => {
    try { // try to fetch users
      const response = await fetch('http://localhost:3042/api/admin/users', { //grab users from the database
        headers: {
          'x-auth-token': localStorage.getItem('token') // get the token from localStorage
        }
      });
      
      // if response is ok, parse the response as JSON and set the users state
      if (response.ok) {
        const data = await response.json();// parse the response as JSON
        const filteredUsers = data.filter(user => !user.isAdmin); // Filter out admin user
        setUsers(filteredUsers);// set the users state
      } else {// error handling
        console.log('Response not OK:', response);// log the response
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
   // error handling return to display error 
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <HeaderNav />
      <h1>All Users</h1>
      <ul>
        {users.length > 0 ? (
          users.map(user => (
            <li key={user._id}>
              {user.name}
              <Link to={`/admin-view-user-list/${user._id}`}>
                <button>View User's List</button>
              </Link>
            </li>
          ))
        ) : (
          <li>Loading Users...</li>
        )}
      </ul>
    </div>
  );
}
  
export default AdminViewAllUsers;
