import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
function ProjectDetail() {
    const { id } = useParams();  
    const [project, setProject] = useState(null);
    const [artistSubmission, setArtistSubmission] = useState({
        design_url: '',
        description: ''
    });

    const [newProjectContent, setNewProjectContent] = useState({
        content_text: '',
        content_image: null,
    });

    const[errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch the project details by ID from the API
        fetch(`http://localhost:5555/api/projects/${id}`)
            .then((response) => response.json())
            .then((data) => setProject(data))
            .catch((error) => console.error('Error fetching project:', error));
    }, [id]);

    const handleArtistSubmit = (event) => {
        event.preventDefault();
        console.log('Submitting Artist Submission:', artistSubmission);
        setArtistSubmission({
            design_url: '',
            description: ''
        });
    };

    const handleProjectContentSubmit = (event) => {
        event.preventDefault();
        const dataToSubmit = new FormData();
        dataToSubmit.append('content_text', newProjectContent.content_text);
        if (newProjectContent.content_image) {
            dataToSubmit.append('content_image', newProjectContent.content_image);
        }

        console.log('Submitting Project Content:', newProjectContent);

        setNewProjectContent({
            content_text: '',
            content_image: null,
        })
    };
    
    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div className="project-container">
            <h2>{project.project_title}</h2>
            <p>Description: {project.description}</p>
            <div className='project-content'>
                <h3>Project Content</h3>
                {project.content && (
                    <div>
                        {project.content.text && <p>{project.content.text}</p>}
                        {project.content.images && project.content.images.map((image, index) => (
                            <img key={index} src={image} alt="Project Content" />
                        ))}
                    </div>
                )}
            </div>
            <div className='creator-content-form'>
                <h3>Add Content to Project</h3>
                <form onSubmit={handleProjectContentSubmit}>
                    <textarea
                        placeholder="Add text content"
                        value={newProjectContent.content_text}
                        onChange={(event) => setNewProjectContent({ ...newProjectContent, content_text: event.target.value })}
                    />
                    <input
                        type="file"
                        onChange={(event) => setNewProjectContent({ ...newProjectContent, content_image: event.target.files[0] })}
                    />
                    <button type="submit">Add Content</button>
                </form>
            </div>
            <div className='artist-submission-form'>
                <h3>Submit Your Design</h3>
                <form onSubmit={handleArtistSubmit}>
                    <input
                        type="text"
                        placeholder="Design URL"
                        value={artistSubmission.design_url}
                        onChange={(event) => setArtistSubmission({ ...artistSubmission, design_url: event.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Description of your design"
                        value={artistSubmission.description}
                        onChange={(event) => setArtistSubmission({ ...artistSubmission, description: event.target.value })}
                        required
                    />
                    <button type="submit">Submit Design</button>
                </form>
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

export default ProjectDetail;