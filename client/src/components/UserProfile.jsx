import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function UserProfile() {
    const { currentUser } = useAuth();
    const [portfolio, setPortfolio] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [caption, setCaption] = useState('');

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

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', newImage);
        formData.append('caption', caption);

        try {
            const response = await fetch('/api/portfolio/images', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setPortfolio(prev => ({
                    ...prev,
                    images: [...prev.images, data]
                }));
                setNewImage(null);
                setCaption('');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="container">
            <h2>My Profile</h2>
            {currentUser && (
                <>
                    <div className="profile-info create-form">
                        <h3>{currentUser.username}'s Profile</h3>
                        <p>{currentUser.email}</p>
                    </div>

                    <div className="portfolio-section create-form">
                        <h3>My Portfolio</h3>
                        <form onSubmit={handleImageUpload} className="project-form">
                            <div className="form-group">
                                <label htmlFor="image">Select Image:</label>
                                <input
                                    id="image"
                                    type="file"
                                    onChange={(e) => setNewImage(e.target.files[0])}
                                    accept="image/*"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="caption">Image Caption:</label>
                                <input
                                    id="caption"
                                    type="text"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Enter a caption for your image"
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-button">
                                Upload to Portfolio
                            </button>
                        </form>

                        <div className="portfolio-grid">
                            {portfolio?.images?.map(image => (
                                <div key={image.id} className="portfolio-item">
                                    <img src={image.url} alt={image.caption} />
                                    <p>{image.caption}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserProfile;
