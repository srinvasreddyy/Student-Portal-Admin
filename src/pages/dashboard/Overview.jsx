import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, FolderKanban, CheckCircle2 } from 'lucide-react';

const Overview = () => {
    // Placeholder stats
    const stats = [
        { title: "Active Projects", value: "12", icon: <Activity />, color: "hsl(217, 91%, 60%)" },
        { title: "Total Applicants", value: "48", icon: <Users />, color: "hsl(199, 89%, 48%)" },
        { title: "Completed", value: "5", icon: <CheckCircle2 />, color: "hsl(142, 71%, 45%)" },
        { title: "Drafts", value: "2", icon: <FolderKanban />, color: "hsl(215, 25%, 72%)" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overview-page"
        >
            <div className="dashboard-header-section">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here's a quick look at your organization's activity.</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card glass">
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-details">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="recent-activity glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px' }}>
                <h3>Recent Activity</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your recent projects and applicant activity will appear here.</p>
            </div>
        </motion.div>
    );
};

export default Overview;
