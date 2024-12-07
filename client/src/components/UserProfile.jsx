import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

function UserProfile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchPortfolio();
        }
    }, [currentUser]);

    const fetchPortfolio = async () => {
        try {
            const response = await fetch(`http://localhost:5555/api/portfolios/user/${currentUser.id}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch portfolio');
            }
            const data = await response.json();
            console.log('Portfolio data before transform:', data);
            
            // Get the first portfolio since we're getting an array
            const userPortfolio = data[0];
            
            // Transform the image data to include an id if it doesn't exist
            if (userPortfolio && userPortfolio.images) {
                userPortfolio.images = userPortfolio.images.map((image, index) => ({
                    ...image,
                    id: image.id || index + 1
                }));
            }
            
            console.log('Portfolio data after transform:', userPortfolio);
            setPortfolio(userPortfolio);  // Set the single portfolio object
        } catch (error) {
            console.error('Error fetching portfolio:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newImage) {
            alert('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('image', newImage);
        formData.append('caption', caption);

        try {
            console.log('Sending request with:', {
                image: newImage,
                caption: caption
            });

            const response = await fetch(`/api/portfolios/user/${currentUser.id}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }

            const data = await response.json();
            console.log('Upload successful:', data);

            // Reset form
            setNewImage(null);
            setCaption('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchPortfolio();
            
            // Show success modal
            setShowModal(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            const response = await fetch(`/api/portfolios/images/${imageId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete image');
            }

            // Refresh portfolio after deletion
            fetchPortfolio();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="profile-header-wrapper">
                <div className="profile-header">
                    <div className="profile-info">
                        <h3>{currentUser?.username}'s Profile</h3>
                        <p>{currentUser?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
                <div className="profile-upload-section">
                    <h3>Add to Portfolio</h3>
                    <form onSubmit={handleSubmit} className="upload-form">
                        <div className="form-group">
                            <label>Choose Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                        </div>
                        <div className="form-group">
                            <label>Caption</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Enter image caption"
                            />
                        </div>
                        <button type="submit">Upload Image</button>
                    </form>
                </div>
            </div>

            <div className="profile-portfolio-images">
                {portfolio?.images?.map((image, index) => (
                    <div key={index} className="portfolio-image-container">
                        <img src={image.url} alt={image.caption || 'Portfolio Artwork'} />
                        {image.caption && <p>{image.caption}</p>}
                        {currentUser && portfolio.user_id === currentUser.id && (
                            <button 
                                className="delete-button"
                                onClick={() => handleDeleteImage(image.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <Modal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                message="Image uploaded successfully!"
            />
        </div>
    );
}

export default UserProfile;
