// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

function Login({ isHomePage }) {
  const { setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        navigate('/'); // Redirect to home or dashboard
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={isHomePage ? "home-login-container" : "login-page-container"}>
      <h3>Login</h3>
      <form onSubmit={handleLogin} className={isHomePage ? "home-auth-form" : "auth-form"}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Login;