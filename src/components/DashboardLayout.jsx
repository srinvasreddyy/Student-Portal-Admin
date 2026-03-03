import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, MessageSquare, LogOut, Menu, X, ShieldCheck, Search, Bell } from 'lucide-react';
import { authApi, notificationApi } from '../services/api';

const DashboardLayout = () => {
    // Default open on desktop, closed on mobile
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [notifications, setNotifications] = useState([]);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await notificationApi.getNotifications({ limit: 10 });
                if (res.data?.success) {
                    setNotifications(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
        if (unreadIds.length === 0) return;

        try {
            await notificationApi.markAsRead({ ids: unreadIds });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark notifications as read:', err);
        }
    };

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
                    <NavLink to="/dashboard/talent" onClick={closeSidebarMobile} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <Search size={20} />
                        {sidebarOpen && <span>Talent Search</span>}
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

                        {/* Notifications */}
                        <div className="notification-wrapper" style={{ position: 'relative' }}>
                            <button
                                className="notification-btn"
                                onClick={() => {
                                    setIsNotificationMenuOpen(!isNotificationMenuOpen);
                                    if (!isNotificationMenuOpen) {
                                        handleMarkAsRead();
                                    }
                                }}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '0.5rem', borderRadius: '50%', color: 'var(--text-primary)',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '2px', right: '2px',
                                        background: 'var(--error)', color: 'white',
                                        fontSize: '0.65rem', fontWeight: 'bold',
                                        minWidth: '16px', height: '16px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="notification-dropdown glass"
                                    >
                                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ fontSize: '1rem', margin: 0 }}>Notifications</h3>
                                        </div>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }} className="scrollbar-custom">
                                            {notifications.length > 0 ? (
                                                notifications.map(notif => (
                                                    <div key={notif._id} style={{
                                                        padding: '1rem', borderBottom: '1px solid #f1f5f9',
                                                        background: notif.read ? 'transparent' : 'rgba(14, 165, 233, 0.05)',
                                                        transition: 'background 0.2s',
                                                        textAlign: 'left'
                                                    }}>
                                                        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{notif.title}</h4>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{notif.body}</p>
                                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem', display: 'block' }}>
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                    No notifications yet
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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