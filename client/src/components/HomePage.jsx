// components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    const [portfolios, setPortfolios] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch portfolios
        fetch('http://localhost:5555/api/portfolios')
            .then(response => response.json())
            .then(data => setPortfolios(data))
            .catch(error => console.error('Error fetching portfolios:', error));

        // Fetch projects
        fetch('http://localhost:5555/api/projects')
            .then(response => response.json())
            .then(data => setProjects(data))
            .catch(error => console.error('Error fetching projects:', error));
    }, []);

    return (
        <div className="home-page container">
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