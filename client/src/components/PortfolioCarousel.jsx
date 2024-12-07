import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PortfolioCarousel({ portfolios }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 3;

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex + itemsPerView >= portfolios.length ? 0 : prevIndex + itemsPerView
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex - itemsPerView < 0 ? Math.max(0, portfolios.length - itemsPerView) : prevIndex - itemsPerView
        );
    };

    const visiblePortfolios = portfolios.slice(currentIndex, currentIndex + itemsPerView);

    return (
        <div className="carousel-container">
            <button className="carousel-button prev" onClick={prevSlide}>
                &#8249;
            </button>
            
            <div className="carousel-content">
                {visiblePortfolios.map(portfolio => (
                    <div key={portfolio.id} className="portfolio-card">
                        <h3>{portfolio.username ? `${portfolio.username}'s Portfolio` : 'Artist Portfolio'}</h3>
                        <div className="portfolio-preview">
                            {portfolio.images?.slice(0, 4).map((image, index) => (
                                <div key={index} className="preview-image">
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

            <button className="carousel-button next" onClick={nextSlide}>
                &#8250;
            </button>
        </div>
    );
}

export default PortfolioCarousel;
