import React, { useState } from 'react';

function CreateProject({ userId }) {
    const [formData, setFormData] = useState({
        project_title: '',
        description: '',
        keywords: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSubmit = {
            ...formData,
            user_id: userId 
        };

        fetch('http://localhost:5555/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Project created:', data);
            
            setFormData({
                project_title: '',
                description: '',
                keywords: ''
            });
        })
        .catch((error) => console.error('Error creating project:', error));
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