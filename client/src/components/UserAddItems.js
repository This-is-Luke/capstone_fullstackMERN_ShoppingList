//UserAddItems.js is the file that contains the component for adding items to the user's shopping list
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserAddItems() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const fetchUserList = async () => {
    // Fetch the user's shopping list from your server
    const response = await fetch(`http://localhost:3042/api/users/me/shoppinglist`, {
      headers: {
        'x-auth-token': localStorage.getItem('token')
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.shoppingList; // return the shopping list from the response
    } else {
      console.log('Response not OK:', response);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Fetch the existing shopping list for the user
    const shoppingList = await fetchUserList();

    if (shoppingList) {
      const { _id: listId, items: list } = shoppingList; // extract the ID and the items from the shopping list

      try {
        const response = await fetch(`http://localhost:3042/api/users/me/shoppinglists/${listId}`, { // use the shopping list's ID in the URL
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ items: [...list, { name, quantity }] }) // add the new item to the existing list
        });

        if (response.ok) {
          navigate('/user-list');
        } else {
          console.log('Response not OK:', response);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    } else {
      console.log(`No shopping list found for user ${localStorage.getItem('user')}`);
    }
  };

  return (
    <div>
      <h1>Add Item</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item Name" required />
        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" required />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default UserAddItems;
