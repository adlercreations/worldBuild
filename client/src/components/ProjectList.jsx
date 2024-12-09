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
            const response = await fetch('http://localhost:5555/api/projects', {
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

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.error || 'Failed to create project');
            }

            const data = await response.json();
            setProjects([...projects, data]);
            setNewProject({ project_title: '', description: '', keywords: '' });
        } catch (error) {
            console.error('Error creating project:', error);
            alert(error.message || 'Failed to create project. Please try again.');
        }
    };

    const handleDelete = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:5555/api/projects/${projectId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete project');
            }

            // Remove the deleted project from state
            setProjects(projects.filter(project => project.id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        }
    };

    return (
        <div className="project-container">
            <h2>Projects</h2>
            
            {/* Create form only shows when logged in */}
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

            {/* Projects grid always shows */}
            <div className="projects-grid">
                {projects.map(project => (
                    <div key={project.id} className="project-card">
                        <h3>{project.project_title}</h3>
                        <p>{project.description}</p>
                        <div className="project-card-actions">
                            <Link to={`/projects/${project.id}`}>
                                <button>View Project</button>
                            </Link>
                            {currentUser && currentUser.id === project.user_id && (
                                <button 
                                    onClick={() => handleDelete(project.id)}
                                    className="delete-button"
                                >
                                    Delete Project
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectList;