import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, FolderKanban, CheckCircle2, Clock } from 'lucide-react';
import { projectApi } from '../../services/api';

const Overview = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all projects for the logged-in organization
                const res = await projectApi.getMyProjects();
                setProjects(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch overview data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // --------------------------------------------------------
    // Calculate Real-Time Statistics
    // --------------------------------------------------------
    const activeProjectsCount = projects.filter(p => p.status === 'open' || p.status === 'in_progress').length;
    const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
    const openProjectsCount = projects.filter(p => p.status === 'open').length;
    
    // Sum up all pending applicants across all projects
    const totalApplicantsCount = projects.reduce((sum, p) => sum + (p.appliedStudents?.length || 0), 0);

    const stats = [
        { title: "Active Projects", value: activeProjectsCount, icon: <Activity />, color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.1)" }, 
        { title: "Pending Applicants", value: totalApplicantsCount, icon: <Users />, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" }, 
        { title: "Completed", value: completedProjectsCount, icon: <CheckCircle2 />, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" }, 
        { title: "Open (Recruiting)", value: openProjectsCount, icon: <FolderKanban />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" } 
    ];

    // Get the 4 most recently created projects
    const recentProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #e0f2fe', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    Loading Overview...
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-page"
        >
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here is a real-time look at your organization's activity.</p>
            </div>

            {/* Statistics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {stats.map((stat, idx) => (
                    <motion.div 
                        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                        key={idx} 
                        style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
                    >
                        <div style={{ backgroundColor: stat.bg, color: stat.color, width: '54px', height: '54px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {React.cloneElement(stat.icon, { size: 28 })}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', margin: 0, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{stat.value}</h3>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600' }}>{stat.title}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Feed */}
            <div style={{ marginTop: '2.5rem', padding: '2rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>Recent Projects</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your most recently created projects and their current statuses.</p>
                
                {recentProjects.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentProjects.map(project => (
                            <div key={project._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '600' }}>{project.title}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Clock size={14} /> {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Users size={14} /> {project.appliedStudents?.length || 0} Applicants
                                        </span>
                                    </div>
                                </div>
                                <span style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', background: project.status === 'open' ? '#e0f2fe' : (project.status === 'completed' ? '#dcfce7' : '#f1f5f9'), color: project.status === 'open' ? '#0284c7' : (project.status === 'completed' ? '#15803d' : '#475569') }}>
                                    {project.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ marginTop: '1rem', padding: '3rem 1rem', textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: '12px', color: '#94a3b8', background: '#f8fafc' }}>
                        <Activity size={32} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                        <p>No projects created yet. Head to the Projects tab to post your first one!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Overview;