import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // import useNavigate
import HeaderNav from './HeaderNav';

function AdminViewUserList() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // initialize useNavigate

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3042/api/admin/users/${userId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError('Failed to fetch user');
        }
      } catch (err) {
        setError('Error fetching user');
        console.error('Error:', err);
      }
    };

    const fetchShoppingList = async () => {
      try {
        const response = await fetch(`http://localhost:3042/api/admin/users/${userId}/shoppinglist`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });

        if (response.ok) {
          const data = await response.json();
          setShoppingList(data);
        } else {
          setError('Failed to fetch shopping list');
        }
      } catch (err) {
        setError('Error fetching shopping list');
        console.error('Error:', err);
      }
    };

    fetchUser();
    fetchShoppingList();
  }, [userId]);

  const handleEditClick = () => {
    // navigate to the AdminEditList component
    navigate(`/admin-edit-list/${userId}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <HeaderNav />
      <h1>User List</h1>
      {user && (
        <div>
          <h2>User Details</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      {shoppingList && (
        <div>
          <h2>Shopping List</h2>
          <ul>
            {shoppingList.items.map(item => (
              <li key={item._id}>
                {item.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
          <button onClick={handleEditClick}>Edit List</button>
        </div>
      )}
    </div>
  );
}

export default AdminViewUserList;
