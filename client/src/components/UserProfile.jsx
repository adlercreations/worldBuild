import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function UserProfile({ userId }) {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
    // Fetch a single user by ID
        fetch(`http://localhost:5555/api/users/${id}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error('Error fetching user:', error));
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container'>
            <h2>{user.username}'s Profile</h2>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
            <Link to="/">Back to Home</Link>
        </div>
    );
}

export default UserProfile;
