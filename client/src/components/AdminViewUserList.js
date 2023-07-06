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
  margin-bottom: 1rem;
  &:hover {
    cursor: pointer;
      }
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

const StyledDeleteButton = Styled.button`
  background-color: red;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 5px 7px;
  font-size: 1rem;
  margin-left: 2rem;
  &:hover {
	cursor: pointer;
	  }

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
			try {
				// try to fetch user
				const response = await fetch(
					`http://localhost:3042/api/admin/users/${userId}`,
					{
						//grab user from the database passing in the userId
						headers: {
							'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
						},
					}
				);
				// if response is ok, parse the response as JSON and set the user state
				if (response.ok) {
					const data = await response.json(); // parse the response as JSON
					setUser(data); // set the user state
				} else {
					setError('Failed to fetch user'); // error handling
				}
			} catch (err) {
				// error handling
				setError('Error fetching user');
				console.error('Error:', err);
			}
		};

		// async try function to fetch shopping list
		const fetchShoppingList = async () => {
			try {
				// try to fetch shopping list
				const response = await fetch(
					`http://localhost:3042/api/admin/users/${userId}/shoppinglist`,
					{
						// grab shopping list from the database passing in the userId
						headers: {
							// get the token from localStorage
							'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
						},
					}
				);
				// if response is ok, parse the response as JSON and set the shoppingList state
				if (response.ok) {
					const data = await response.json(); // parse the response as JSON
					setShoppingList(data); // set the shoppingList state
				} else {
					setError('Failed to fetch shopping list'); // error handling
				}
			} catch (err) {
				// error handling
				setError('Error fetching shopping list');
				console.error('Error:', err);
			}
		};

		fetchUser(); // call fetchUser function
		fetchShoppingList(); // call fetchShoppingList function
	}, [userId]); // useEffect hook will run when userId changes

	const handleRemoveItem = async (itemId) => {
		if (shoppingList) {
			// check if the shopping list exists
			const { _id: listId, items: list } = shoppingList; // grab the shopping list

			try {
				// try this block statement
				const response = await fetch(
					`http://localhost:3042/api/admin/shoppinglist/${listId}/${itemId}`,
					{
						// fetch the shopping list and input the ID
						method: 'DELETE', // set the HTTP request method to DELETE
						headers: {
							'Content-Type': 'application/json', // set the content type header
							'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
						},
					}
				);

				if (response.ok) {
					// check if the response is ok
					// Item removed successfully, fetch the updated list
					const updatedResponse = await fetch(
						`http://localhost:3042/api/admin/users/${userId}/shoppinglist`,
						{
							headers: {
								'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
							},
						}
					);
					// check if the response is ok, if it is, parse the response as JSON
					if (updatedResponse.ok) {
						const data = await updatedResponse.json();
						setShoppingList(data); // set the updated shopping list state
					} else {
						console.log('Updated list response not OK:', updatedResponse); // error notice
					}
				} else {
					console.log('Response not OK:', response); // extra error notice
				}
			} catch (err) {
				console.error('Error:', err); // log the error
			}
		} else {
			console.log(
				`No shopping list found for user ${localStorage.getItem('user')}`
			); // detailed error notice
		}
	};

	// function to handle edit button click to navigate to admin-edit-list page
	const handleEditClick = () => {
		navigate(`/admin-edit-list/${userId}`);
	};

	// if error, display error message
	if (error) {
		return <div>Error: {error}</div>;
	}

	const handleNavigateToUsers = () => {
		navigate('/admin-view-all-users'); // Redirect to the '/users' page
	};

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
						{shoppingList.items.map((item) => (
							<StyledLi key={item._id}>
								{item.name} - Quantity: {item.quantity}
								<StyledDeleteButton
									onClick={() => handleRemoveItem(item._id)}
								>
									Remove Item
								</StyledDeleteButton>
							</StyledLi>
						))}
					</StyledUl>
					<StyledButton onClick={handleEditClick}>Edit List</StyledButton>
				</div>
			)}
			<StyledButton onClick={handleNavigateToUsers}>
				Back to Users
			</StyledButton>
		</CeneteredDiv>
	);
}

export default AdminViewUserList;
