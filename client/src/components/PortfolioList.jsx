import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PortfolioList() {
    const [portfolios, setPortfolios] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [caption, setCaption] = useState('');
    const { currentUser } = useAuth();

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

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

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
                fetchPortfolios(); // Refresh the portfolios list
                setNewImage(null);
                setCaption('');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="container">
            <h2>Artist Portfolios</h2>
            
            {currentUser && (
                <div className="upload-section">
                    <h3>Add to Your Portfolio</h3>
                    <form onSubmit={handleImageUpload} className="upload-form">
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
                </div>
            )}

            <div className="portfolios-grid">
                {portfolios.map(portfolio => (
                    <div key={portfolio.id} className="portfolio-card">
                        <h3>{portfolio.artist_name}</h3>
                        <div className="portfolio-preview">
                            {portfolio.images?.slice(0, 4).map(image => (
                                <div key={image.id} className="preview-image">
                                    <img src={image.url} alt={image.caption} />
                                </div>
                            ))}
                        </div>
                        <Link to={`/portfolios/${portfolio.id}`}>
                            <button className="view-button">View Full Portfolio</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PortfolioList;