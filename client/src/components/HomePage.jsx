// components/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import Login from './Login';
import Register from './Register'; // New registration form component

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
        <div className="auth-forms" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <Login /> {/* Render the Login component */}
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
      <div className="portfolio-list">
        {portfolios.map(portfolio => (
          <div key={portfolio.id} className="card">
            <h3>{portfolio.artist_name}</h3>
            <p>{portfolio.bio}</p>
            <Link to={`/portfolio/${portfolio.id}`}>View Portfolio</Link>
          </div>
        ))}
      </div>

      <h2>Creator Projects</h2>
      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="card">
            <h3>{project.project_title}</h3>
            <p>{project.description.substring(0, 100)}...</p>
            <Link to={`/projects/${project.id}`}>View Project</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;



// // components/HomePage.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// function HomePage() {
//     const [portfolios, setPortfolios] = useState([]);
//     const [projects, setProjects] = useState([]);

//     useEffect(() => {
//         // Fetch portfolios
//         fetch('http://localhost:5555/api/portfolios')
//             .then(response => response.json())
//             .then(data => setPortfolios(data))
//             .catch(error => console.error('Error fetching portfolios:', error));

//         // Fetch projects
//         fetch('http://localhost:5555/api/projects')
//             .then(response => response.json())
//             .then(data => setProjects(data))
//             .catch(error => console.error('Error fetching projects:', error));
//     }, []);

//     return (
//         <div className="home-page container">
//             <h2>Artist Portfolios</h2>
//             <div className="portfolio-list">
//                 {portfolios.map(portfolio => (
//                     <div key={portfolio.id} className="card">
//                         <h3>{portfolio.artist_name}</h3>
//                         <p>{portfolio.bio}</p>
//                         <Link to={`/portfolio/${portfolio.id}`}>View Portfolio</Link>
//                     </div>
//                 ))}
//             </div>

//             <h2>Creator Projects</h2>
//             <div className="project-list">
//                 {projects.map(project => (
//                     <div key={project.id} className="card">
//                         <h3>{project.project_title}</h3>
//                         <p>{project.description.substring(0, 100)}...</p>
//                         <Link to={`/projects/${project.id}`}>View Project</Link>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default HomePage;