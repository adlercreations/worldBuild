import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ProjectCarousel({ projects }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 2;  // Changed from 3 to 2 for projects

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex + itemsPerView >= projects.length ? 0 : prevIndex + itemsPerView
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex - itemsPerView < 0 ? Math.max(0, projects.length - itemsPerView) : prevIndex - itemsPerView
        );
    };

    const visibleProjects = projects.slice(currentIndex, currentIndex + itemsPerView);

    return (
        <div className="carousel-container">
            <button className="carousel-button prev" onClick={prevSlide}>
                &#8249;
            </button>
            
            <div className="carousel-content">
                {visibleProjects.map(project => (
                    <div key={project.id} className="project-card">
                        <h3>{project.project_title}</h3>
                        <p>{project.description.substring(0, 100)}...</p>
                        <Link to={`/projects/${project.id}`}>
                            <button className="view-button">View Project</button>
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

export default ProjectCarousel;
