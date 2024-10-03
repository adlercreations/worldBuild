import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

function ProjectList() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
    // Fetch the list of projects from the API
        fetch('http://localhost:5555/api/projects')
            .then((response) => response.json())
            .then((data) => setProjects(data))
            .catch((error) => console.error('Error fetching projects:', error));
    }, []);

    return (
        <div className='container'>
            <h2>Available Projects</h2>
            <div className='project-list'>
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project.id} className='project-card'>
                            <h3>{project.project_title}</h3>
                            <p>{project.description.substring(0, 50)}...</p>
                            <Link to={`/projects/${project.id}`}>
                                <button>View Project</button>
                            </Link>
                        </div>
                    ))
                ) : (
                <p>No projects available. Be the first to <Link to="/create-project">create one</Link>.</p>
                )}
            </div>
        </div>
    );
}

export default ProjectList;