import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNav from './HeaderNav';

function AdminEditList() {
  const { userId } = useParams();
  const [editedShoppingList, setEditedShoppingList] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await fetch(`http://localhost:3042/api/admin/users/${userId}/shoppinglist`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEditedShoppingList(data); // Initialize editedShoppingList with the fetched shopping list
        } else {
          setError('Failed to fetch shopping list');
        }
      } catch (err) {
        setError('Error fetching shopping list');
        console.error('Error:', err);
      }
    };

    fetchShoppingList();
  }, [userId]);

  const handleInputChange = (index, field, value) => {
    // Create a new copy of the edited shopping list
    const newShoppingList = { ...editedShoppingList };

    // Update the specified field with the new value
    newShoppingList.items[index][field] = value;

    // Update the state
    setEditedShoppingList(newShoppingList);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:3042/api/admin/shoppinglist/${editedShoppingList._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(editedShoppingList)
      });
  
      if (response.ok) {
        navigate(`/admin-view-user-list/${userId}`);
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

  const handleCancelClick = () => {
    navigate(`/admin-view-user-list/${userId}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <HeaderNav />
      <h1>Edit Shopping List</h1>
      {editedShoppingList && (
        <div>
          <h2>Shopping List</h2>
          <ul>
            {editedShoppingList.items.map((item, index) => (
              <li key={item._id}>
                <input
                  type="text"
                  value={item.name}
                  onChange={e => handleInputChange(index, 'name', e.target.value)}
                />
                - Quantity:
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleInputChange(index, 'quantity', e.target.value)}
                />
              </li>
            ))}
          </ul>
          <button onClick={handleAddItemClick}>Add Item</button> {/* New Add Item button */}
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default AdminEditList;
