import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PortfolioDetail() {
    const { id } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5555/api/portfolios/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Portfolio data received:', data);
                if (data) {
                    setPortfolio(data);
                } else {
                    setErrorMessage('Artist name not found');
                }
            })
            .catch((error) => {
                console.error('Error fetching portfolio:', error);
                setErrorMessage('Error fetching portfolio data');
            });
    }, [id]);

    const handleImageUpload = (event) => {
        event.preventDefault();
        if (!newImage) {
            setErrorMessage('Please select an image to upload.');
            return;
        }

        const dataToSubmit = new FormData();
        dataToSubmit.append('portfolio_id', id);
        dataToSubmit.append('image', newImage);

        fetch(`http://localhost:5555/api/portfolios/${id}/images`, {
            method: 'POST',
            body: dataToSubmit,
        })
        .then(response => response.json())
        .then(data => {
            setPortfolio(prevState => ({
                ...prevState,
                images: [...prevState.images, data.image_url]
            }));
            setNewImage(null);
            setErrorMessage('');
        })
        .catch(error => setErrorMessage('Failed to upload image. Please try again.'));
    };

    if (!portfolio) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>
                {portfolio.artist_name ? `${portfolio.artist_name}'s Portfolio` : 'Artist Portfolio'}
            </h2>
            <p>{portfolio.bio || 'Bio information not available'}</p>

            <div className="portfolio-images">
                {portfolio.images && portfolio.images.length > 0 ? (
                    portfolio.images.map((image, index) => (
                        <img key={index} src={image} alt="Portfolio Artwork" className="portfolio-image" />
                    ))
                ) : (
                    <p>No images in this portfolio yet.</p>
                )}
            </div>

            <form onSubmit={handleImageUpload}>
                <input type="file" onChange={(event) => setNewImage(event.target.files[0])} />
                <button type="submit">Add Image</button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </div>
    );
}

export default PortfolioDetail;