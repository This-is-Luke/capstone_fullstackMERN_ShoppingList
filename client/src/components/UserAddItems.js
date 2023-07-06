//UserAddItems.js is the file that contains the component for adding items to the user's shopping list
/*
In this file we will create a component that will allow the basic 
user to add items to their shopping list.
*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Styled from 'styled-components';

// Styled components

const SaveNotification = Styled.div`
  position: fixed;
  bottom: 120px;
  right: 42%;
  align-items: center;
  justify-content: center;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  font-size: 2.2rem;
  border-radius: 5px;
  z-index: 1000;  
`;

const CenteredDiv = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 95vw;
  margin-left: 2.5rem;
`;

const StyledList = Styled.ul`
  list-style-type: none;
  font-size: 1.2rem;
  width: 100%;
`;

const StyledInput = Styled.input`
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
`;

const StyledH1 = Styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
`;

const ButtonContainer = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 3rem;
`;

const StyledButtonAdd = Styled.button`
  background-color: #008CBA;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 15px 32px;
  font-size: 1.2rem;
  margin: 0 1rem;
  margin-right: 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  &:hover {
	cursor: pointer;
	  }

`;

const StyledButtonSave = Styled.button`
  background-color: #4CAF50;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 15px 32px;
  font-size: 1.2rem;
  margin: 0 1rem;
  margin-right: 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  &:hover {
	cursor: pointer;
	  }
`;

const StyledButtonCancel = Styled.button`
  background-color: #f44336;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 15px 32px;
  font-size: 1.2rem;
  margin: 0 1rem;
  margin-right: 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  &:hover {
	cursor: pointer;
	  }
`;

const StyledLi = Styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
`;

const StyledDeleteButton = Styled.button`
  background-color: red;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 5px 7px;
  font-size: 1rem;
  &:hover {
	cursor: pointer;
	  }

`;

// main function scope of the entire document
function UserAddItems() {
	const navigate = useNavigate();
	const [shoppingList, setShoppingList] = useState(null);
	const [showSaveNotification, setShowSaveNotification] = useState(false);

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
							items: list,
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
					// Show the save notification
					setShowSaveNotification(true);

					// Hide the save notification after 3 seconds
					setTimeout(() => {
						setShowSaveNotification(false);
					}, 3000);
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
	// function to handle input change
	const handleInputChange = (index, field, value) => {
		// Create a new copy of the shopping list
		const newShoppingList = { ...shoppingList };

		// Update the specified field with the new value
		newShoppingList.items[index][field] = value;

		// Update the state
		setShoppingList(newShoppingList);
	};

	// function to handle add item click
	const handleAddItemClick = () => {
		// Create a new copy of the shopping list
		const newShoppingList = { ...shoppingList };

		// Add a new item to the items array
		newShoppingList.items.push({ name: '', quantity: 1 });

		// Update the state
		setShoppingList(newShoppingList);
	};

	// simply navigate back to the UserList component
	const handleGoBack = () => {
		navigate('/user-list'); // Navigate to UserList component
	};

	// Component
	return (
		<div>
			<CenteredDiv>
				<StyledH1>Edit Shopping List</StyledH1>
				{shoppingList && (
					<div>
						<StyledList>
							{shoppingList.items.map((item, index) => (
								<StyledLi key={item._id}>
									<StyledInput
										type="text"
										value={item.name}
										onChange={(e) =>
											handleInputChange(
												index,
												'name',
												e.target.value
											)
										}
									/>
									Quantity -
									<StyledInput
										type="number"
										value={item.quantity}
										onChange={(e) =>
											handleInputChange(
												index,
												'quantity',
												e.target.value
											)
										}
									/>
									<StyledDeleteButton
										onClick={() => handleRemoveItem(item._id)}
									>
										Remove Item
									</StyledDeleteButton>
								</StyledLi>
							))}
						</StyledList>
						<ButtonContainer>
							<StyledButtonAdd onClick={handleAddItemClick}>
								Add New Item
							</StyledButtonAdd>
							<StyledButtonSave onClick={handleSubmit}>
								Save
							</StyledButtonSave>
							<StyledButtonCancel onClick={handleGoBack}>
								Go Back to User List
							</StyledButtonCancel>
						</ButtonContainer>
						{showSaveNotification && (
							<SaveNotification>Shopping list saved!</SaveNotification>
						)}
					</div>
				)}
			</CenteredDiv>
		</div>
	);
}

export default UserAddItems;
