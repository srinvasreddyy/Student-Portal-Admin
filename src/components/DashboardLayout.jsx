import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { authApi } from '../services/api';

const DashboardLayout = () => {
    // Default open on desktop, closed on mobile
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) setSidebarOpen(true);
            else setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await authApi.logout(localStorage.getItem('refreshToken'));
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');
        }
    };

    const closeSidebarMobile = () => {
        if (isMobile) setSidebarOpen(false);
    };

    return (
        <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', overflow: 'hidden' }}>
            
            {/* Mobile Backdrop Overlay */}
            <AnimatePresence>
                {isMobile && sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="mobile-overlay" 
                        onClick={() => setSidebarOpen(false)} 
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}
            >
                <div className="sidebar-header" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'inline-flex' }}>
                        <ShieldCheck className="sidebar-logo-icon" size={32} />
                    </div>
                    {sidebarOpen && <span className="sidebar-logo-text">Admin<span style={{ color: 'var(--primary)' }}>Connect</span></span>}
                    {isMobile && (
                        <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-secondary)' }} onClick={() => setSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                    )}
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" end onClick={closeSidebarMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        {sidebarOpen && <span>Overview</span>}
                    </NavLink>
                    <NavLink to="/dashboard/projects" onClick={closeSidebarMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <FolderKanban size={20} />
                        {sidebarOpen && <span>Projects</span>}
                    </NavLink>
                    <NavLink to="/dashboard/chat" onClick={closeSidebarMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <MessageSquare size={20} />
                        {sidebarOpen && <span>Messages</span>}
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="sidebar-link logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
                <header className="dashboard-topbar">
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }} className="hide-on-mobile">
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Organization Admin</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dashboard Access</span>
                        </div>
                        <div className="avatar">A</div>
                    </div>
                </header>

                <div className="dashboard-content scrollbar-custom">
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </div>
            </main>

            <style>{`
                @media (max-width: 640px) {
                    .hide-on-mobile { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;