import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the users from the Flask API
    fetch('http://localhost:5555/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className='container'>
        <h2>Users List</h2>
        <ul>
            {users.map((user) => (
                <li key={user.id}>
                    <Link to={`/user/${user.id}`}>{user.username}</Link>
                </li>
            ))}
        </ul>
        <Link to="/create-user">
            <button>Create  a New User</button>
        </Link>
    </div>
  );
}

export default UserList;