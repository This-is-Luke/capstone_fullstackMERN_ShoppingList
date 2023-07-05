// UserList.js
/*
In this file we will create a component that will display the user's list.
This component will fetch the user's list from the API and display it.
*/

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
`;

const StyledList = Styled.ul`
  list-style-type: none;
  font-size: 1.2rem;
  overflow: hidden;
  width: 90vw;
`;

const StyledListItemContainer = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.5rem; 

  li {
    margin: 0 1rem;
  }

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
  margin-left: 3.2rem;
`;

// main function for UserList
function UserList() {
	// variables for list, setList, isFetched, user, and navigate
	const [list, setList] = useState([]);
	const [isFetched, setIsFetched] = useState(false);
	const userItem = localStorage.getItem('user');
	const user =
		userItem && userItem !== 'undefined' ? JSON.parse(userItem) : null; // Parse the user item from JSON and set it as the user state
	const navigate = useNavigate();

	// useEffect to fetch the user's list
	useEffect(() => {
		if (!user || isFetched) return; // or if (!user || isFetched) return;

		const fetchList = async () => {
			// async function to fetch the user's list
			try {
				// try this code
				const response = await fetch(
					`http://localhost:3042/api/users/me/shoppinglist`,
					{
						// fetch the user's list
						headers: {
							'x-auth-token': localStorage.getItem('token'), // get the token from localStorage
						},
					}
				);

				if (response.ok) {
					// if try worked
					const data = await response.json(); // parse the response as JSON
					setList(data.shoppingList.items); // set the list state
					setIsFetched(true); // set the isFetched state
				} else {
					// if try didn't work
					console.log('Response not OK:', response); // log the response
				}
			} catch (err) {
				// catch any errors
				console.error('Error:', err); // log the error
			}
		};

		fetchList(); // call the async function
	}, [user, isFetched]); // dependency array, user and isFetched

	// function to handle navigating us to adding items
	const handleAddItems = () => {
		navigate('/user-add-items');
	};

	return (
		<div>
			<HeaderNav />
			<CenteredDiv>
				<StyledH1>My List</StyledH1>
				<StyledList>
					{list.map((item) => (
						<StyledListItemContainer>
							<li key={item._id}>
								{item.name} - {item.quantity}
							</li>
						</StyledListItemContainer>
					))}
				</StyledList>
				<StyledButton onClick={handleAddItems}>Add to My List</StyledButton>
			</CenteredDiv>
		</div>
	);
}

export default UserList;
