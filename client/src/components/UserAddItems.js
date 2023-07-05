//UserAddItems.js is the file that contains the component for adding items to the user's shopping list
/*
In this file we will create a component that will allow the basic 
user to add items to their shopping list.
*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';

// Styled components

const CenteredDiv = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 90vw;
`;

const StyledListItemContainer = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.5rem;
  
`;

const StyledList = Styled.ul`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 1.2rem;
  overflow: hidden;
  padding: 2rem;
  margin-left: 2.2rem;
  width: 90vw;
`;

const StyledDeleteButtonContainer = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
`;

const StyledLi = Styled.li`
  margin: 0 1rem;
`;

const StyledH1 = Styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  margin-left: 2.2rem;
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
  margin-left: 2.6rem;
`;

const StyledForm = Styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  margin-left: 2rem;
`;

const StyledInput = Styled.input`
  border: 1px solid black;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 90vw;
  max-width: 500px;
`;

const StyledSubmitButton = Styled.button`
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

const StyledDeleteButton = Styled.button`
  background-color: red;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 5px 7px;
  margin: 0 1rem;
  text-align: center;
  text-decoration: none;
  aligh-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

// main function scope of the entire document
function UserAddItems() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [quantity, setQuantity] = useState('');
	const [shoppingList, setShoppingList] = useState(null);

	// useEffect hook to fetch the user's shopping list
	useEffect(() => {
		const fetchUserList = async () => {
			// async function expression
			try {
				const response = await fetch(
					`http://localhost:3042/api/users/me/shoppinglist`,
					{
						// fetch the user's shopping list
						headers: {
							'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
						},
					}
				);
				// check if the response is ok
				if (response.ok) {
					const data = await response.json(); // parse the response as JSON
					setShoppingList(data.shoppingList); // set the shopping list state
				} else {
					console.log('Response not OK:', response); // log the response if not ok
				}
			} catch (err) {
				console.error('Error:', err); // error handling
			}
		};

		fetchUserList(); // call the async function
	}, []); // empty dependency array

	// function to handle the form submission
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (shoppingList) {
			// check if the shopping list exists
			const { _id: listId, items: list } = shoppingList; // destructure the shopping list

			try {
				// try block statement
				const response = await fetch(
					`http://localhost:3042/api/users/me/shoppinglists/${listId}`,
					{
						// fetch the shopping list
						method: 'PUT', // set the HTTP request method to PUT
						headers: {
							'Content-Type': 'application/json', // set the content type header
							'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
						},
						body: JSON.stringify({
							items: [...list, { name, quantity }],
						}),
					}
				); // fetch the updated shopping list

				if (response.ok) {
					// Item added successfully, fetch the updated list
					const updatedResponse = await fetch(
						`http://localhost:3042/api/users/me/shoppinglist`,
						{
							headers: {
								'x-auth-token': localStorage.getItem('token'),
							},
						}
					);

					if (updatedResponse.ok) {
						// check if the response is ok
						const data = await updatedResponse.json();
						setShoppingList(data.shoppingList); // set the updated shopping list state
					} else {
						// else block statement
						console.log('Updated list response not OK:', updatedResponse); // log the response if not ok
					}
				} else {
					console.log('Response not OK:', response);
				}
			} catch (err) {
				// catch block statement
				console.error('Error:', err);
			}
		} else {
			// else block statement
			console.log(
				`No shopping list found for user ${localStorage.getItem('user')}`
			);
		}
	};

	// function to handle the removal of an item from the shopping list
	const handleRemoveItem = async (itemId) => {
		if (shoppingList) {
			// check if the shopping list exists
			const { _id: listId, items: list } = shoppingList; // grab the shopping list

			try {
				// try this block statement
				const response = await fetch(
					`http://localhost:3042/api/users/me/shoppinglists/${listId}`,
					{
						// fetch the shopping list and input the ID
						method: 'PUT', // again, set the HTTP request method to PUT
						headers: {
							'Content-Type': 'application/json', // again, set the content type header
							'x-auth-token': localStorage.getItem('token'), // again, get the token from localStorage
						},
						body: JSON.stringify({
							items: list.filter((item) => item._id !== itemId),
						}), // filter out the item to be removed
					}
				);

				if (response.ok) {
					// check if the response is ok
					// Item removed successfully, fetch the updated list
					const updatedResponse = await fetch(
						`http://localhost:3042/api/users/me/shoppinglist`,
						{
							headers: {
								'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
							},
						}
					);
					// check if the response is ok, if it is, parse the response as JSON
					if (updatedResponse.ok) {
						const data = await updatedResponse.json();
						setShoppingList(data.shoppingList); // set the updated shopping list state
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

	// simply navigate back to the UserList component
	const handleGoBack = () => {
		navigate('/user-list'); // Navigate to UserList component
	};

	return (
		<CenteredDiv>
			<StyledH1>Add Item</StyledH1>
			<StyledListItemContainer>
				{shoppingList && (
					<StyledList>
						{shoppingList.items.map((item) => (
							<StyledLi key={item._id}>
								{item.name}
								<StyledDeleteButtonContainer>
									<StyledDeleteButton
										onClick={() => handleRemoveItem(item._id)}
									>
										Remove Item
									</StyledDeleteButton>
								</StyledDeleteButtonContainer>
							</StyledLi>
						))}
					</StyledList>
				)}
			</StyledListItemContainer>
			<StyledForm onSubmit={handleSubmit}>
				<StyledInput
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Item Name"
					required
				/>
				<StyledInput
					type="number"
					value={quantity}
					onChange={(e) => setQuantity(e.target.value)}
					placeholder="Quantity"
					required
				/>
				<StyledSubmitButton type="submit">Add Item</StyledSubmitButton>
			</StyledForm>
			<StyledButton onClick={handleGoBack}>
				Go Back to User List
			</StyledButton>
		</CenteredDiv>
	);
}

export default UserAddItems;
