// components/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import Login from './Login';
import Register from './Register'; // New registration form component
import PortfolioCarousel from './PortfolioCarousel';
import ProjectCarousel from './ProjectCarousel';

function HomePage() {
  const { currentUser } = useContext(AuthContext); // Access current user from context
  const [portfolios, setPortfolios] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch portfolios
    // fetch('http://localhost:5555/api/portfolios', { credentials: 'include' })
    fetch('/api/portfolios', { credentials: 'include' })
    // fetch('/api/portfolios')
      .then(response => response.json())
      .then(data => setPortfolios(data))
      .catch(error => console.error('Error fetching portfolios:', error));

    // Fetch projects
    // fetch('http://localhost:5555/api/projects', { credentials: 'include' })
    fetch('/api/projects', { credentials: 'include' })
    // fetch('/api/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <div className="home-page">
      <h2>Welcome to WorldBuild</h2>

      {/* Display Login and Registration Forms if user is not logged in */}
      {!currentUser ? (
        <div className="home-auth-forms" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <Login isHomePage={true} /> {/* Pass prop to Login component */}
          </div>
          <div>
            <Register /> {/* Render the Registration component */}
          </div>
        </div>
      ) : (
        <p>Welcome back, {currentUser.username}!</p>
      )}

      {/* Display portfolios and projects */}
      <h2>Artist Portfolios</h2>
      <PortfolioCarousel portfolios={portfolios} />

      <h2 className="creator-projects-heading">Creator Projects</h2>
      <ProjectCarousel projects={projects} />
    </div>
  );
}

export default HomePage;