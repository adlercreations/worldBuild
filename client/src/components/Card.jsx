import React from 'react';
import { Link } from 'react-router-dom';

function Card({ title, description, image, link }) {
    return (
        <div className="card">
            {image && <img src={image} alt={title} className="portfolio-image" />}
            <h3>{title}</h3>
            <p>{description}</p>
            <Link to={link}>
                <button>View Details</button>
            </Link>
        </div>
    );
}

export default Card;