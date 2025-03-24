import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <img
                src="/apple.jpg"
                alt="Apple Uniformm"
                className="header-image"
            />
            <h1>Apple Uniformm</h1>
        </header>

    );
};

export default Header;