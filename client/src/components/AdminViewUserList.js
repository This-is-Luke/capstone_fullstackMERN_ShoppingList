//AdminViewUserList.js
/*
This file will be the admin view user list page. It will display a welcome message
and a button to view a user's shopping list.
*/

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
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
  padding: 15px 32px;
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

const StyledH2 = Styled.h2`
  font-size: 2rem;
`;

const StyledP = Styled.p`
  font-size: 1.2rem;
`;

const StyledUl = Styled.ul`
  list-style-type: none;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  margin-top: 5rem;
  margin-right: 3rem;
`;

const StyledLi = Styled.li`
  font-size: 1.2rem;
`;


// main function component for AdminViewUserList
function AdminViewUserList() {
  // variables for user, shoppingList, and error state
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // useEffect hook to fetch user and shopping list
  useEffect(() => {
    const fetchUser = async () => {
      try { // try to fetch user
        const response = await fetch(`http://localhost:3042/api/admin/users/${userId}`, { //grab user from the database passing in the userId
          headers: {
            'x-auth-token': localStorage.getItem('token') // get the token from localStorage
          }
        });
        // if response is ok, parse the response as JSON and set the user state
        if (response.ok) {
          const data = await response.json();// parse the response as JSON
          setUser(data);// set the user state
        } else {
          setError('Failed to fetch user');// error handling
        }
      } catch (err) { // error handling
        setError('Error fetching user');
        console.error('Error:', err);
      }
    };

    // async try function to fetch shopping list
    const fetchShoppingList = async () => {
      try { // try to fetch shopping list
        const response = await fetch(`http://localhost:3042/api/admin/users/${userId}/shoppinglist`, { // grab shopping list from the database passing in the userId
          headers: { // get the token from localStorage
            'x-auth-token': localStorage.getItem('token') // get the token from localStorage
          }
        });
        // if response is ok, parse the response as JSON and set the shoppingList state
        if (response.ok) {
          const data = await response.json();// parse the response as JSON
          setShoppingList(data); // set the shoppingList state
        } else {
          setError('Failed to fetch shopping list'); // error handling
        }
      } catch (err) { // error handling
        setError('Error fetching shopping list');
        console.error('Error:', err);
      }
    };

    fetchUser(); // call fetchUser function
    fetchShoppingList(); // call fetchShoppingList function
  }, [userId]); // useEffect hook will run when userId changes

  // function to handle edit button click to navigate to admin-edit-list page
  const handleEditClick = () => {
    navigate(`/admin-edit-list/${userId}`);
  };

  // if error, display error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CeneteredDiv>
      <HeaderNav />
      <StyledH1>User List</StyledH1>
      {user && (
        <div>
          <StyledH2>User Details</StyledH2>
          <StyledP>Name: {user.name}</StyledP>
          <StyledP>Email: {user.email}</StyledP>
        </div>
      )}
      {shoppingList && (
        <div>
          <StyledH2>Shopping List</StyledH2>
          <StyledUl>
            {shoppingList.items.map(item => (
              <StyledLi key={item._id}>
                {item.name} - Quantity: {item.quantity}
              </StyledLi>
            ))}
          </StyledUl>
          <StyledButton onClick={handleEditClick}>Edit List</StyledButton>
        </div>
      )}
    </CeneteredDiv>
  );
}

export default AdminViewUserList;
