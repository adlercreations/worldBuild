import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Modal from './Modal';

function PortfolioList() {
    const [portfolios, setPortfolios] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [caption, setCaption] = useState('');
    const { currentUser } = useAuth();
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        try {
            const response = await fetch('/api/portfolios');
            if (response.ok) {
                const data = await response.json();
                setPortfolios(data);
            }
        } catch (error) {
            console.error('Error fetching portfolios:', error);
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

            // Reset form and refresh portfolios
            setNewImage(null);
            setCaption('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchPortfolios();
            setShowModal(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Artist Portfolios</h2>
            
            {currentUser && (
                <div className="upload-section">
                    <h3>Add to Your Portfolio</h3>
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
            )}

            <div className="portfolio-list">
                {portfolios.map(portfolio => (
                    <div key={portfolio.id} className="portfolio-card">
                        <h3>{portfolio.username ? `${portfolio.username}'s Portfolio` : 'Artist Portfolio'}</h3>
                        <div className="portfolio-preview">
                            {portfolio.images?.slice(0, 4).map((image, index) => (
                                <div key={index} className="preview-image">
                                    <img src={image.url} alt={image.caption} />
                                    <p>{image.caption}</p>
                                </div>
                            ))}
                        </div>
                        <Link to={`/portfolios/${portfolio.id}`}>
                            <button className="view-button">View Full Portfolio</button>
                        </Link>
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

export default PortfolioList;