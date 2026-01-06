import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <button
                    className={`nav-button ${isActive('/')}`}
                    onClick={() => navigate('/')}
                >
                    Stock
                </button>
                <button
                    className={`nav-button ${isActive('/index')}`}
                    onClick={() => navigate('/index')}
                >
                    S&P 500
                </button>
                <button
                    className={`nav-button ${isActive('/ranklist')}`}
                    onClick={() => navigate('/ranklist')}
                >
                    Rank List
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
