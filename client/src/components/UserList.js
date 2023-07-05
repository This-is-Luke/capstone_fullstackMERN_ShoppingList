import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNav from './HeaderNav';

function UserList() {
  const [list, setList] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const userItem = localStorage.getItem('user');
  const user = userItem && userItem !== 'undefined' ? JSON.parse(userItem) : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || isFetched) return;
  
    const fetchList = async () => {
      try {
        const response = await fetch(`http://localhost:3042/api/users/me/shoppinglist`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setList(data.shoppingList.items);
          setIsFetched(true);
        } else {
          console.log('Response not OK:', response);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };
  
    fetchList();
  }, [user, isFetched]);

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
