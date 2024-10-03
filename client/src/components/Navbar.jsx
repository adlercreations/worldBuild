import React from 'react';
import { Link } from 'react-router-dom';  // Use Link for navigation
import '../styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/">Home</Link> 
                </li>
                <li>
                    <Link to="/explore">Explore</Link>
                </li>
                <li>
                    <Link to="/portfolios">Portfolios</Link>
                </li>
                <li>
                    <Link to="/projects">Projects</Link>
                </li>
                <li>
                    <Link to="/my-profile">My Profile</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
