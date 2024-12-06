import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from './AuthContext';

function PortfolioDetail() {
    const { id } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { currentUser } = useAuth();

    const fetchPortfolio = async () => {
        try {
            const response = await fetch(`http://localhost:5555/api/portfolios/${id}`);
            if (!response.ok) {
                throw new Error('Portfolio not found');
            }
            const data = await response.json();
            console.log('Portfolio data:', data);
            
            if (data.images) {
                data.images = data.images.map((image, index) => ({
                    ...image,
                    id: image.id || index + 1
                }));
            }
            
            setPortfolio(data);
        } catch (error) {
            console.error('Error fetching portfolio:', error);
            setErrorMessage('Error loading portfolio');
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!imageId) {
            console.error('No image ID provided');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5555/api/portfolios/images/${imageId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            fetchPortfolio();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image. Please try again.');
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, [id]);

    if (!portfolio) {
        return <div>Loading...</div>;
    }

    return (
        <div className="portfolio-detail-container">
            <h2>{portfolio.username ? `${portfolio.username}'s Portfolio` : 'Artist Portfolio'}</h2>
            <p>{portfolio.bio || 'Bio information not available'}</p>

            <div className="portfolio-images">
                {portfolio.images && portfolio.images.length > 0 ? (
                    portfolio.images.map((image, index) => {
                        console.log('Image data:', image);
                        return (
                            <div key={index} className="portfolio-image-container">
                                <img src={image.url} alt={image.caption || 'Portfolio Artwork'} />
                                {image.caption && <p>{image.caption}</p>}
                                {currentUser && currentUser.id === portfolio.user_id && (
                                    <button 
                                        className="delete-button"
                                        onClick={() => {
                                            console.log('Deleting image with ID:', image.id);
                                            handleDeleteImage(image.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>No images in this portfolio yet.</p>
                )}
            </div>
        </div>
    );
}

export default PortfolioDetail;