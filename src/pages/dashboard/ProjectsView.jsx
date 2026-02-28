import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Clock, Users, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { projectApi } from '../../services/api';
import StudentProfileModal from '../../components/StudentProfileModal';

const ProjectsView = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'detail'
    const [selectedProject, setSelectedProject] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (viewMode === 'list') {
            fetchProjects();
        }
    }, [viewMode]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Using getMyProjects as it returns projects where user is author
            const res = await projectApi.getMyProjects();
            setProjects(res.data.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectDetails = async (id) => {
        setLoading(true);
        try {
            const res = await projectApi.getOne(id);
            setSelectedProject(res.data.data);
            setViewMode('detail');
        } catch (error) {
            console.error('Failed to fetch project details', error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="projects-page"
        >
            <div className="dashboard-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{viewMode === 'list' ? 'Projects Management' : selectedProject?.title || 'Project Details'}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{viewMode === 'list' ? 'Manage your organization\'s projects and applicants.' : 'View project details and manage applicants.'}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    {viewMode === 'list' ? (
                        <button className="btn-auth" style={{ width: 'auto', padding: '0.75rem 1.5rem', boxShadow: '0 0 20px var(--primary-glow)' }} onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} /> Post Project
                        </button>
                    ) : (
                        <button className="btn-auth" style={{ width: 'auto', padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} onClick={() => setViewMode('list')}>
                            <ArrowLeft size={18} /> Back to List
                        </button>
                    )}
                </motion.div>
            </div>

            {loading && viewMode === 'list' ? (
                <div style={{ color: 'var(--text-secondary)' }}>Loading projects...</div>
            ) : viewMode === 'list' ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="stats-grid"
                >
                    {projects.length === 0 ? (
                        <motion.div variants={itemVariants} className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', borderRadius: '16px' }}>
                            <FolderKanban size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
                            <h3>No Projects Yet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Get started by posting your first project.</p>
                        </motion.div>
                    ) : (
                        projects.map(p => (
                            <motion.div
                                key={p._id}
                                variants={itemVariants}
                                className="stat-card glass"
                                style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
                                onClick={() => fetchProjectDetails(p._id)}
                                whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'var(--primary-glow)' }}
                            >
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: p.status === 'open' ? 'var(--primary-glow)' : 'var(--glass-border)', filter: 'blur(30px)', borderRadius: '50%' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', zIndex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>{p.title}</h3>
                                    <span style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        background: p.status === 'open' ? 'var(--primary-glow)' : 'var(--glass-border)',
                                        color: p.status === 'open' ? '#fff' : 'var(--text-secondary)'
                                    }}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', zIndex: 1 }}>Click to view details & manage applicants</p>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                    <ProjectDetails project={selectedProject} onUpdate={() => fetchProjectDetails(selectedProject._id)} />
                </motion.div>
            )}

            <AnimatePresence>
                {showCreateModal && (
                    <CreateProjectModal
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={() => { setShowCreateModal(false); fetchProjects(); }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ProjectDetails = ({ project, onUpdate }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    if (!project) return <div>Loading...</div>;

    const handleAction = async (action, studentRef) => {
        try {
            if (action === 'accept') {
                await projectApi.acceptStudent(project._id, studentRef);
            } else if (action === 'reject') {
                await projectApi.rejectApplicant(project._id, studentRef, 'Not a fit at this time');
            }
            onUpdate();
        } catch (error) {
            console.error(`Failed to ${action} student`, error);
            alert(`Failed to ${action} student. Check console.`);
        }
    };

    const applicants = project.applicants || [];
    const acceptedStudents = project.acceptedStudents || [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                <h3>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <Clock size={16} color="var(--primary)" /> {project.duration} Days
                    </div>
                    {project.reward && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                            <CheckCircle2 size={16} color="var(--success)" /> Reward: {project.reward}
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {project.techStack?.map(tech => (
                        <span key={tech} style={{ padding: '0.2rem 0.6rem', background: 'var(--glass-border)', borderRadius: '12px', fontSize: '0.75rem' }}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> Applicants ({applicants.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {applicants.length === 0 ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No pending applicants.</p> : applicants.map(app => (
                            <div key={app.studentRef._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                                <div onClick={() => setSelectedStudent(app.studentRef._id)} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{app.studentRef.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{app.studentRef.email}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleAction('accept', app.studentRef._id)} style={{ padding: '0.4rem 0.8rem', background: 'var(--success)', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Accept</button>
                                    <button onClick={() => handleAction('reject', app.studentRef._id)} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={20} color="var(--success)" /> Accepted Students ({acceptedStudents.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {acceptedStudents.length === 0 ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No accepted students yet.</p> : acceptedStudents.map(acc => (
                            <div key={acc.studentRef._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'hsla(142, 71%, 45%, 0.1)', borderRadius: '8px' }}>
                                <div onClick={() => setSelectedStudent(acc.studentRef._id)} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--success)' }}>{acc.studentRef.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{acc.studentRef.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedStudent && (
                    <StudentProfileModal
                        studentId={selectedStudent}
                        onClose={() => setSelectedStudent(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const CreateProjectModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        techStack: '',
        duration: '',
        reward: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                ...formData,
                techStack: formData.techStack.split(',').map(s => s.trim()),
                duration: Number(formData.duration)
            };
            await projectApi.create(data);
            onSuccess();
        } catch (error) {
            console.error('Failed to create project', error);
            alert('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '12px', background: 'var(--card-bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Post New Project</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Project Title</label>
                        <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} required
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff', minHeight: '100px' }} required
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tech Stack (comma separated)</label>
                            <input type="text" placeholder="React, Node, MongoDB" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} required
                                value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Duration (days)</label>
                            <input type="number" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} required
                                value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Reward / Compensation</label>
                        <input type="text" placeholder="e.g. $500, Certificate, Course Credit" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                            value={formData.reward} onChange={e => setFormData({ ...formData, reward: e.target.value })} />
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading} style={{ marginTop: '1rem' }}>
                        {loading ? 'Posting...' : 'Post Project'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ProjectsView;
