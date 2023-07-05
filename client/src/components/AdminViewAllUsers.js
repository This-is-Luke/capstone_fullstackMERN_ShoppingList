// AdminViewAllUsers.js
/*
This file will be the admin view all users page. It will display a list of all users
and a button to view a user's shoppin list.
*/
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import Styled from 'styled-components';

const CeneteredDiv = Styled.div`
  text-align: center;
`;

const StyledButton = Styled.button`
  background-color: green;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 10px 15px;
  margin: 0 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1.2rem;
`;

const StyledH1 = Styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin-top: 5rem;
`;

const StyledUl = Styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const StyledLi = Styled.li`
  margin: 1rem 0;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

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
    <CeneteredDiv>
      <HeaderNav />
      <StyledH1>All Users</StyledH1>
      <StyledUl>
        {users.length > 0 ? (
          users.map(user => (
            <StyledLi key={user._id}>
              {user.name}
              <Link to={`/admin-view-user-list/${user._id}`}>
                <StyledButton>View User's List</StyledButton>
              </Link>
            </StyledLi>
          ))
        ) : (
          <li>Loading Users...</li>
        )}
      </StyledUl>
    </CeneteredDiv>
  );
}
  
export default AdminViewAllUsers;
