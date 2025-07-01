import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="logo-container">
                        <img
                            src="/apple.jpg"
                            alt="Apple Uniformm"
                            className="header-logo"
                        />
                        <div className="brand-text">
                            <h1>Apple Uniformm</h1>
                            <span className="tagline">Staff Management Portal</span>
                        </div>
                    </div>

                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="nav-container">
                    <ul className="nav-links">
                        <li className={isActive('/')}>
                            <Link to="/">
                                <i className="nav-icon home-icon"></i>
                                <span>Home</span>
                            </Link>
                        </li>
                        <li className={isActive('/job-card')}>
                            <Link to="/job-card">
                                <i className="nav-icon job-icon"></i>
                                <span>Job Card</span>
                            </Link>
                        </li>
                        <li className={isActive('/modify-rates')}>
                            <Link to="/modify-rates">
                                <i className="nav-icon rates-icon"></i>
                                <span>Modify Rates</span>
                            </Link>
                        </li>
                        <li className={isActive('/bills')}>
                            <Link to="/bills">
                                <i className="nav-icon bills-icon"></i>
                                <span>Bills</span>
                            </Link>
                        </li>
                        <li className={isActive('/shift-summary')}>
                            <Link to="/shift-summary">
                                <i className="nav-icon summary-icon"></i>
                                <span>Shift Summary</span>
                            </Link>
                        </li>
                        <li className={isActive('/workers')}>
                            <Link to="/workers">
                                <i className="nav-icon workers-icon"></i>
                                <span>Workers</span>
                            </Link>
                        </li>
                        <li className={isActive('/add-styles')}>
                            <Link to="/add-styles">
                                <i className="nav-icon styles-icon"></i>
                                <span>Styles</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Header;