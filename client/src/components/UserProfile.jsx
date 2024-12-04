import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            fetchPortfolio();
        }
    }, [currentUser]);

    const fetchPortfolio = async () => {
        try {
            const response = await fetch(`/api/portfolios/user/${currentUser.id}`);
            if (response.ok) {
                const data = await response.json();
                setPortfolio(data);
            }
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
            const response = await fetch(`/api/portfolios/user/${currentUser.id}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            // Reset form and refresh portfolio
            setNewImage(null);
            setCaption('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchPortfolio();
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

    return (
        <div className="container">
            <h2>My Profile</h2>
            {currentUser && (
                <>
                    <div className="profile-info">
                        <h3>{currentUser.username}'s Profile</h3>
                        <p>{currentUser.email}</p>
                    </div>

                    <div className="upload-section">
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

                    <div className="portfolio-grid">
                        {portfolio?.images?.map((image, index) => (
                            <div key={index} className="portfolio-card">
                                <img src={image.url} alt={image.caption} />
                                <p>{image.caption}</p>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </>
            )}
        </div>
    );
}

export default UserProfile;
