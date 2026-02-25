import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { authApi } from '../services/api';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

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

    return (
        <div className="dashboard-container" style={{ background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)' }}>
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`dashboard-sidebar glass ${sidebarOpen ? 'open' : 'closed'}`}
                style={{ zIndex: 100 }}
            >
                <div className="sidebar-header" style={{ marginBottom: '2rem' }}>
                    <motion.div whileHover={{ rotate: 15 }} style={{ display: 'inline-flex' }}>
                        <ShieldCheck className="sidebar-logo-icon" size={32} color="var(--primary)" />
                    </motion.div>
                    {sidebarOpen && <span className="sidebar-logo-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Admin<span className="accent">Connect</span></span>}
                    <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={({ isActive }) => isActive ? { background: 'hsla(240, 100%, 70%, 0.15)', borderRight: '3px solid var(--primary)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>
                        <motion.div whileHover={{ scale: 1.1 }}><LayoutDashboard size={20} /></motion.div>
                        {sidebarOpen && <span>Overview</span>}
                    </NavLink>
                    <NavLink to="/dashboard/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={({ isActive }) => isActive ? { background: 'hsla(280, 100%, 65%, 0.15)', borderRight: '3px solid var(--secondary)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>
                        <motion.div whileHover={{ scale: 1.1 }}><FolderKanban size={20} /></motion.div>
                        {sidebarOpen && <span>Projects</span>}
                    </NavLink>
                    <NavLink to="/dashboard/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} style={({ isActive }) => isActive ? { background: 'hsla(200, 100%, 55%, 0.15)', borderRight: '3px solid var(--accent)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }}>
                        <motion.div whileHover={{ scale: 1.1 }}><MessageSquare size={20} /></motion.div>
                        {sidebarOpen && <span>Messages</span>}
                    </NavLink>
                </nav>

                <div className="sidebar-footer" style={{ marginTop: 'auto', paddingBottom: '1rem' }}>
                    <motion.button whileHover={{ scale: 1.02, background: 'hsla(350, 80%, 65%, 0.15)', color: 'var(--error)' }} className="sidebar-link logout-btn" onClick={handleLogout} style={{ width: '100%', color: 'var(--text-secondary)' }}>
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </motion.button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="dashboard-main" style={{ display: 'flex', flexDirection: 'column' }}>
                <motion.header
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
                    className="dashboard-topbar glass"
                    style={{ borderBottom: '1px solid var(--glass-border)', background: 'hsla(230, 25%, 10%, 0.6)' }}
                >
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--text-primary)' }}>
                        <Menu size={24} />
                    </button>
                    <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Organization Admin</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dashboard Access</span>
                        </div>
                        <motion.div whileHover={{ scale: 1.1, boxShadow: '0 0 15px var(--primary-glow)' }} className="avatar" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#fff', fontWeight: 700, borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</motion.div>
                    </div>
                </motion.header>

                <div className="dashboard-content scrollbar-custom" style={{ flex: 1, padding: '2rem', position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
