import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Building2, GraduationCap } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar glass">
            <div className="nav-content">
                <Link to="/" className="nav-logo">
                    <Layout className="logo-icon" />
                    <span>Admin<span className="accent">Connect</span></span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>Home</Link>
                    <Link to="/company" className={`nav-item ${isActive('/company') ? 'active' : ''}`}>
                        <Building2 size={18} />
                        <span>Company</span>
                    </Link>
                    <Link to="/university" className={`nav-item ${isActive('/university') ? 'active' : ''}`}>
                        <GraduationCap size={18} />
                        <span>University</span>
                    </Link>
                </div>

                <div className="nav-actions">
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
