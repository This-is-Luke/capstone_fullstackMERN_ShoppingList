// AdminEditList.js
/*
In this file, we will create a component that will display the shopping list of a user.
This component will be used by the admin to edit the shopping list of a user.
*/
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from './HeaderNav';
import Styled from 'styled-components';

// Styled components

const CenteredDiv = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 90vw;
  margin-left: 2.5rem;
`;

const StyledList = Styled.ul`
  list-style-type: none;
  font-size: 1.2rem;
  overflow: hidden;
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


// main function component for AdminEditList
function AdminEditList() {
	// variables for user, shoppingList, and error state
	const { userId } = useParams();
	const [editedShoppingList, setEditedShoppingList] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	// useEffect hook to fetch shopping list
	useEffect(() => {
		const fetchShoppingList = async () => {
			try {
				// try to fetch shopping list
				const response = await fetch(
					`http://localhost:3042/api/admin/users/${userId}/shoppinglist`,
					{
						// grab shopping list from the database passing in the userId
						headers: {
							'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
						},
					}
				);

				// if response is ok, parse the response as JSON and set the shoppingList state
				if (response.ok) {
					const data = await response.json(); // parse the response as JSON
					setEditedShoppingList(data); // Initialize editedShoppingList with the fetched shopping list
				} else {
					// error handling
					setError('Failed to fetch shopping list');
				}
			} catch (err) {
				// error handling
				setError('Error fetching shopping list');
				console.error('Error:', err);
			}
		};

		fetchShoppingList(); // call fetchShoppingList function
	}, [userId]); // useEffect hook dependency array

	const handleInputChange = (index, field, value) => {
		// Create a new copy of the edited shopping list
		const newShoppingList = { ...editedShoppingList };

		// Update the specified field with the new value
		newShoppingList.items[index][field] = value;

		// Update the state
		setEditedShoppingList(newShoppingList);
	};

	// function to handle save click
	const handleSaveClick = async () => {
		try {
			// try to save shopping list by making a PUT request to the server
			const response = await fetch(
				`http://localhost:3042/api/admin/shoppinglist/${editedShoppingList._id}`, // grab shopping list from the database passing in the editedShoppingList._id
				{
					method: 'PUT', // use PUT method
					headers: {
						'Content-Type': 'application/json', // set content type to JSON
						'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
					},
					body: JSON.stringify(editedShoppingList), // send the editedShoppingList as the request body
				}
			);

			if (response.ok) {
				// if response is ok, navigate to the admin-view-user-list page
				navigate(`/admin-view-user-list/${userId}`); // Navigate to the admin-view-user-list page after saving the shopping list successfully and passing in the userId
			} else {
				setError('Failed to save shopping list');
			}
		} catch (err) {
			setError('Error saving shopping list');
			console.error('Error:', err);
		}
	};

	const handleAddItemClick = () => {
		// Create a new copy of the edited shopping list
		const newShoppingList = { ...editedShoppingList };

		// Add a new item to the items array
		newShoppingList.items.push({ name: '', quantity: 1 });

		// Update the state
		setEditedShoppingList(newShoppingList);
	};

	// function to handle cancel click and navigate to admin-view-user-list page
	const handleCancelClick = () => {
		navigate(`/admin-view-user-list/${userId}`);
	};

	// if error, display error message
	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<HeaderNav />
      <CenteredDiv>
			<StyledH1>Edit Shopping List</StyledH1>
			{editedShoppingList && (
				<div>
					<StyledList>
						{editedShoppingList.items.map((item, index) => (
							<li key={item._id}>
								<StyledInput
									type="text"
									value={item.name}
									onChange={(e) =>
										handleInputChange(index, 'name', e.target.value)
									}
								/>
								{' '} - Quantity - {' '}
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
							</li>
						))}
					</StyledList>
					<StyledButtonAdd onClick={handleAddItemClick}>Add New Item</StyledButtonAdd>
					<StyledButtonSave onClick={handleSaveClick}>Save</StyledButtonSave>
					<StyledButtonCancel onClick={handleCancelClick}>Cancel</StyledButtonCancel>
				</div>
			)}
      </CenteredDiv>
		</div>
	);
}

export default AdminEditList;
