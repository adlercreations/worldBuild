import React, { useState } from 'react';

function CreateProject({ userId }) {
    const [formData, setFormData] = useState({
        project_title: '',
        description: '',
        keywords: ''
    });

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

    return (
        <div className='container'>
            <h2>Create a New Project</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Project Title"
                    value={formData.project_title}
                    onChange={(event) => setFormData({ ...formData, project_title: event.target.value })}
                    required
                />
                <textarea
                    placeholder="Project Description"
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                    required
                ></textarea>
                <input
                    type="text"
                    placeholder="Keywords (optional)"
                    value={formData.keywords}
                    onChange={(event) => setFormData({ ...formData, keywords: event.target.value })}
                />
                <button type="submit">Create Project</button>
            </form>
        </div>
    );
}

export default CreateProject;