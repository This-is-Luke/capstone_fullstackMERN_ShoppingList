// UserList.js
import React, { useEffect, useState } from 'react';
import HeaderNav from './HeaderNav';

function UserList() {
  const [list, setList] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const response = await fetch(`http://localhost:3042/api/users/${user._id}/list`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setList(data.list);
      } else {
        console.log('Response not OK:', response);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <HeaderNav />
      <h1>My List</h1>
      <ul>
        {list.map(item => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
      <button>Add to My List</button>
    </div>
  );
}

export default UserList;
