import React, { useState, useEffect } from 'react';

function ExplorePage() {
    const [artworks, setArtworks] = useState([]);

    useEffect(() => {
        fetch('https://www.artstation.com/api/v2/projects.json')
            .then(response => response.json())
            .then(data => setArtworks(data.data))
            .catch(error => console.error('Error fetching ArtStation data:', error));
    }, []);

    return (
        <div className="explore-page container">
            <h2>Explore Artwork</h2>
            <div className="art-list">
                {artworks.map(art => (
                    <div key={art.id} className="card">
                        <h3>{art.title}</h3>
                        <img src={art.cover.medium} alt={art.title} />
                        <a href={art.permalink} target="_blank" rel="noopener noreferrer">View on ArtStation</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExplorePage;