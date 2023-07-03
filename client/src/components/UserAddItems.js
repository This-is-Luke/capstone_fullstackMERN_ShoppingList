//UserAddItems.js is the file that contains the component for adding items to the user's shopping list
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserAddItems() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shoppingList, setShoppingList] = useState(null);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch(`http://localhost:3042/api/users/me/shoppinglist`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });

        if (response.ok) {
          const data = await response.json();
          setShoppingList(data.shoppingList); // set the shopping list state
        } else {
          console.log('Response not OK:', response);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchUserList();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (shoppingList) {
      const { _id: listId, items: list } = shoppingList;
  
      try {
        const response = await fetch(`http://localhost:3042/api/users/me/shoppinglists/${listId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ items: [...list, { name, quantity }] })
        });
  
        if (response.ok) {
          // Item added successfully, fetch the updated list
          const updatedResponse = await fetch(`http://localhost:3042/api/users/me/shoppinglist`, {
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          });
  
          if (updatedResponse.ok) {
            const data = await updatedResponse.json();
            setShoppingList(data.shoppingList); // set the updated shopping list state
          } else {
            console.log('Updated list response not OK:', updatedResponse);
          }
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

  const handleRemoveItem = async (itemId) => {
    if (shoppingList) {
      const { _id: listId, items: list } = shoppingList;

      try {
        const response = await fetch(`http://localhost:3042/api/users/me/shoppinglists/${listId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({ items: list.filter(item => item._id !== itemId) }) // filter out the item to be removed
        });

        if (response.ok) {
          // Item removed successfully, fetch the updated list
          const updatedResponse = await fetch(`http://localhost:3042/api/users/me/shoppinglist`, {
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          });

          if (updatedResponse.ok) {
            const data = await updatedResponse.json();
            setShoppingList(data.shoppingList); // set the updated shopping list state
          } else {
            console.log('Updated list response not OK:', updatedResponse);
          }
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

  const handleGoBack = () => {
    navigate('/user-list'); // Navigate to UserList component
  };

  return (
    <div>
      <h1>Add Item</h1>
      {shoppingList && (
        <ul>
          {shoppingList.items.map(item => (
            <li key={item._id}>
              {item.name}
              <button onClick={() => handleRemoveItem(item._id)}>Remove Item</button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item Name" required />
        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" required />
        <button type="submit">Add Item</button>
      </form>
      <button onClick={handleGoBack}>Go Back to User List</button>
    </div>
  );
}

export default UserAddItems;
