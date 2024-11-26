import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const { currentUser } = useAuth();
    const [newProject, setNewProject] = useState({
        project_title: '',
        description: '',
        keywords: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...newProject,
                    user_id: currentUser.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                setProjects([...projects, data]);
                setNewProject({ project_title: '', description: '', keywords: '' });
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div className="container">
            <h2>Projects</h2>
            
            {currentUser && (
                <div className="create-form">
                    <h3>Create New Project</h3>
                    <form onSubmit={handleSubmit} className="project-form">
                        <div className="form-group">
                            <label htmlFor="project_title">Project Title:</label>
                            <input
                                id="project_title"
                                type="text"
                                placeholder="Project Title"
                                value={newProject.project_title}
                                onChange={(e) => setNewProject({
                                    ...newProject,
                                    project_title: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                placeholder="Description"
                                value={newProject.description}
                                onChange={(e) => setNewProject({
                                    ...newProject,
                                    description: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="keywords">Keywords:</label>
                            <input
                                id="keywords"
                                type="text"
                                placeholder="Keywords (comma-separated)"
                                value={newProject.keywords}
                                onChange={(e) => setNewProject({
                                    ...newProject,
                                    keywords: e.target.value
                                })}
                            />
                        </div>
                        <button type="submit" className="submit-button">Create Project</button>
                    </form>
                </div>
            )}

            <div className="projects-grid">
                {projects.map(project => (
                    <div key={project.id} className="project-card">
                        <h3>{project.project_title}</h3>
                        <p>{project.description}</p>
                        <Link to={`/projects/${project.id}`}>
                            <button>View Project</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectList;