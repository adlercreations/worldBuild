import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import { useAuth } from './AuthContext';

function ProjectDetail() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [project, setProject] = useState(null);
    const [newContent, setNewContent] = useState({
        content_text: '',
        content_image: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5555/api/projects/${id}`)
            .then((response) => response.json())
            .then((data) => setProject(data))
            .catch((error) => {
                console.error('Error fetching project:', error);
                setError('Error loading project');
            });
    }, [id]);

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        if (newContent.content_text) {
            formData.append('content_text', newContent.content_text);
        }
        if (newContent.content_image) {
            formData.append('content_image', newContent.content_image);
        }

        try {
            const response = await fetch(`http://localhost:5555/api/projects/${id}/content`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to add content');
            
            // Refresh project data
            const updatedProject = await fetch(`http://localhost:5555/api/projects/${id}`)
                .then(res => res.json());
            setProject(updatedProject);
            setNewContent({ content_text: '', content_image: null });
        } catch (error) {
            console.error('Error:', error);
            setError('Error adding content');
        }
    };

    if (!project) return <div>Loading...</div>;

    return (
        <div className="project-detail-page">
            <div className="project-detail-header">
                <h2>{project.project_title}</h2>
                <p className="project-detail-description">{project.description}</p>
            </div>
            
            {project.content_text && (
                <div className="project-detail-content">
                    <h3>Additional Information</h3>
                    <p>{project.content_text}</p>
                </div>
            )}
            
            {project.reference_images && project.reference_images.length > 0 && (
                <div className="project-detail-images">
                    <h3>Reference Images</h3>
                    <div className="project-image-grid">
                        {project.reference_images.map(image => (
                            <img 
                                key={image.id} 
                                src={`http://localhost:5555${image.image_url}`} 
                                alt="Reference" 
                            />
                        ))}
                    </div>
                </div>
            )}

            {currentUser && currentUser.id === project.user_id && (
                <div className="project-detail-form">
                    <h3>Add Content</h3>
                    <form onSubmit={handleContentSubmit}>
                        <textarea
                            value={newContent.content_text}
                            onChange={(e) => setNewContent({
                                ...newContent,
                                content_text: e.target.value
                            })}
                            placeholder="Add additional information..."
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewContent({
                                ...newContent,
                                content_image: e.target.files[0]
                            })}
                        />
                        <button type="submit">Add Content</button>
                    </form>
                </div>
            )}
            
            {error && <p className="project-detail-error">{error}</p>}
        </div>
    );
}

export default ProjectDetail;