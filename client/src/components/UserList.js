// UserList.js
/*
In this file we will create a component that will display the user's list.
This component will fetch the user's list from the API and display it.
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from './HeaderNav';

// main function for UserList
function UserList() {
  // variables for list, setList, isFetched, user, and navigate
  const [list, setList] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const userItem = localStorage.getItem('user');
  const user = userItem && userItem !== 'undefined' ? JSON.parse(userItem) : null; // Parse the user item from JSON and set it as the user state
  const navigate = useNavigate();

  // useEffect to fetch the user's list
  useEffect(() => {
    if (!user || isFetched) return;// or if (!user || isFetched) return;
  
    const fetchList = async () => { // async function to fetch the user's list
      try { // try this code
        const response = await fetch(`http://localhost:3042/api/users/me/shoppinglist`, { // fetch the user's list
          headers: {
            'x-auth-token': localStorage.getItem('token') // get the token from localStorage
          }
        });
  
        if (response.ok) {// if try worked
          const data = await response.json();// parse the response as JSON
          setList(data.shoppingList.items);// set the list state
          setIsFetched(true);// set the isFetched state
        } else { // if try didn't work
          console.log('Response not OK:', response);// log the response
        }
      } catch (err) { // catch any errors
        console.error('Error:', err);// log the error
      }
    };
  
    fetchList(); // call the async function
  }, [user, isFetched]);// dependency array, user and isFetched

  // function to handle navigating us to adding items
  const handleAddItems = () => {
    navigate('/user-add-items');
  };

  return (
    <div>
      <HeaderNav />
      <h1>My List</h1>
      <ul>
        {list.map(item => (
          <li key={item._id}>{item.name} - Quantity: {item.quantity}</li> // Display the quantity
        ))}
      </ul>
      <button onClick={handleAddItems}>Add to My List</button>
    </div>
  );
}

export default UserList;
