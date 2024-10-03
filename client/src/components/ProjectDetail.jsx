import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
function ProjectDetail() {
    const { id } = useParams();  // Get the project ID from the URL
    const [project, setProject] = useState(null);
    const [submission, setSubmission] = useState({
        design_url: '',
        description: ''
    });

    useEffect(() => {
        // Fetch the project details by ID from the API
        fetch(`http://localhost:5555/api/projects/${id}`)
            .then((response) => response.json())
            .then((data) => setProject(data))
            .catch((error) => console.error('Error fetching project:', error));
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:5555/api/projects/${id}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submission),            
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Submission created:', data);
            setSubmission({
                design_url: '',
                description: ''
            });
        })
        .catch((error) => console.error('Error submitting project:', error));
    };

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container'>
            <h2>{project.project_title}</h2>
            <p>Description: {project.description}</p>

            <h3>Submit Your Design</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Design URL"
                    value={submission.design_url}
                    onChange={(event) => setSubmission({ ...submission, design_url: event.target.value })}
                    required
                />
                <textarea
                    placeholder="Design Description"
                    value={submission.description}
                    onChange={(event) => setSubmission({ ...submission, description: event.target.value })}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ProjectDetail;