// AdminViewAllUsers.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderNav from './HeaderNav';

function AdminViewAllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3042/api/users', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
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
      <h1>All Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name}
            <Link to={`/admin-view-user-list/${user._id}`}>
              <button>View User's List</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminViewAllUsers;
