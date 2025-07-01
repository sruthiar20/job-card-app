import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <>
            <header className="header">
                <img
                    src="/apple.jpg"
                    alt="Apple Uniformm"
                    className="header-image"
                />
                <h1>Apple Uniformm</h1>
            </header>
            <nav className="main-nav">
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/job-card">Job Card</Link></li>
                    <li><Link to="/modify-rates">Modify Rates</Link></li>
                    <li><Link to="/bills">Bills</Link></li>
                    <li><Link to="/shift-summary">Shift Summary</Link></li>
                </ul>
            </nav>
        </>
    );
};

export default Header;