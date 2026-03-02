import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Clock, Users, ArrowLeft, CheckCircle2, X, Briefcase, Code, Link as LinkIcon, AlertCircle, FileText, Trash2, Download, Video, Edit3, FileCheck2 } from 'lucide-react';
import { projectApi } from '../../services/api';
import StudentProfileModal from '../../components/StudentProfileModal';

const ProjectsView = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateMediaModal, setShowUpdateMediaModal] = useState(false);

    useEffect(() => {
        if (viewMode === 'list') fetchProjects();
    }, [viewMode]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await projectApi.getMyProjects();
            setProjects(res.data.data || []);
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

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.95, y: 20 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="projects-page">
            <style>{`
                @media (max-width: 768px) {
                    .header-actions { flex-direction: column; align-items: stretch !important; gap: 1rem; }
                    .header-actions button { width: 100% !important; justify-content: center; }
                    .stats-grid-custom { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div className="dashboard-header-section header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                        {viewMode === 'list' ? 'Projects Management' : selectedProject?.title || 'Project Details'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {viewMode === 'list' ? 'Manage your organization\'s projects and applicants.' : 'View project details and manage applicants.'}
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: '1rem' }}>
                    {viewMode === 'list' ? (
                        <button className="btn-auth" style={{ width: 'auto', padding: '0.75rem 1.5rem', boxShadow: '0 4px 14px var(--primary-glow)' }} onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} /> Post New Project
                        </button>
                    ) : (
                        <>
                            {selectedProject?.status !== 'cancelled' && selectedProject?.status !== 'completed' && (
                                <button className="btn-auth" style={{ width: 'auto', padding: '0.75rem 1.5rem', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }} onClick={() => setShowUpdateMediaModal(true)}>
                                    <Edit3 size={18} /> Edit Resources
                                </button>
                            )}
                            <button className="btn-auth" style={{ width: 'auto', padding: '0.75rem 1.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', color: 'var(--text-primary)' }} onClick={() => setViewMode('list')}>
                                <ArrowLeft size={18} /> Back
                            </button>
                        </>
                    )}
                </motion.div>
            </div>

            {loading && viewMode === 'list' ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #e0f2fe', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                    Loading projects...
                </div>
            ) : viewMode === 'list' ? (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="stats-grid stats-grid-custom" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {projects.length === 0 ? (
                        <motion.div variants={itemVariants} className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', gridColumn: '1 / -1', borderRadius: '16px', background: '#ffffff' }}>
                            <FolderKanban size={56} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>No Projects Yet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Get started by posting your first project.</p>
                        </motion.div>
                    ) : (
                        projects.map(p => (
                            <motion.div key={p._id} variants={itemVariants} className="stat-card glass" style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden', background: '#ffffff', border: '1px solid #e2e8f0' }} onClick={() => fetchProjectDetails(p._id)} whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(14, 165, 233, 0.1)', borderColor: 'rgba(14, 165, 233, 0.3)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', zIndex: 1, gap: '1rem' }}>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.3', flex: 1, fontFamily: 'Outfit, sans-serif' }}>{p.title}</h3>
                                    <span style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', background: p.status === 'open' ? '#e0f2fe' : '#f1f5f9', color: p.status === 'open' ? '#0284c7' : '#475569', textTransform: 'uppercase', flexShrink: 0 }}>
                                        {p.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                                    {p.description}
                                </p>
                                <div style={{ display: 'flex', gap: '1.25rem', marginTop: 'auto', zIndex: 1, fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500', width: '100%', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={16} color="var(--primary)" /> {p.acceptedStudents?.length || 0}/{p.maxStudentsRequired || 0} Slots</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} color="#8b5cf6" /> {p.durationInWeeks} Weeks</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                    <ProjectDetails project={selectedProject} onUpdate={() => fetchProjectDetails(selectedProject._id)} />
                </motion.div>
            )}

            <AnimatePresence>
                {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchProjects(); }} />}
                {showUpdateMediaModal && selectedProject && (
                    <UpdateMediaModal project={selectedProject} onClose={() => setShowUpdateMediaModal(false)} onSuccess={() => { setShowUpdateMediaModal(false); fetchProjectDetails(selectedProject._id); }} />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ----------------------------------------------------------------------------------------------------
// PROJECT DETAILS COMPONENT
// ----------------------------------------------------------------------------------------------------
const ProjectDetails = ({ project, onUpdate }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    if (!project) return <div>Loading project details...</div>;

    const handleAction = async (action, studentRef) => {
        try {
            if (action === 'accept') {
                await projectApi.acceptStudent(project._id, studentRef);
            } else if (action === 'reject') {
                await projectApi.rejectApplicant(project._id, studentRef, 'Not a fit at this time');
            } else if (action === 'remove') {
                if (window.confirm('Are you sure you want to remove this user from the project?')) {
                    await projectApi.removeStudent(project._id, studentRef);
                } else return;
            }
            onUpdate();
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || `Failed to ${action} student.`}`);
        }
    };

    const handleComplete = async () => {
        if(window.confirm('Are you sure you want to mark this project as completed? This will grant portfolio entries to all active participants.')) {
            try {
                await projectApi.completeProject(project._id);
                onUpdate();
            } catch (err) {
                alert(`Error: ${err.response?.data?.message || 'Failed to complete project'}`);
            }
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const res = await projectApi.downloadDocument(fileId);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Failed to download file.');
        }
    };

    const applicants = project.appliedStudents || [];
    const acceptedStudents = project.acceptedStudents || [];
    const videoUrlToUse = project.video?.url || project.videoUrl;
    const videoTagToUse = project.video?.tag || 'Project Video';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <style>{`
                .details-grid { grid-template-columns: 1fr 1fr; }
                @media (max-width: 1024px) { .details-grid { grid-template-columns: 1fr; } }
            `}</style>
            
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.75rem', fontFamily: 'Outfit, sans-serif' }}>{project.title}</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600', background: project.status === 'open' ? '#e0f2fe' : '#f1f5f9', color: project.status === 'open' ? '#0284c7' : '#475569', textTransform: 'uppercase' }}>
                            {project.status.replace('_', ' ')}
                        </span>
                        {project.status !== 'completed' && project.status !== 'cancelled' && (
                            <button onClick={handleComplete} style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', background: 'var(--success)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                                <CheckCircle2 size={16} /> Mark Completed
                            </button>
                        )}
                    </div>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem', whiteSpace: 'pre-wrap', fontSize: '1rem' }}>{project.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '10px', color: '#0ea5e9' }}><Clock size={24} /></div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Duration</div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{project.durationInWeeks} Weeks</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ background: '#f3e8ff', padding: '0.75rem', borderRadius: '10px', color: '#8b5cf6' }}><Users size={24} /></div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Capacity Filled</div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{acceptedStudents.length} / {project.maxStudentsRequired}</div>
                        </div>
                    </div>
                    {videoUrlToUse && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ background: '#ffedd5', padding: '0.75rem', borderRadius: '10px', color: '#f97316' }}><LinkIcon size={24} /></div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>{videoTagToUse}</div>
                                <a href={videoUrlToUse} target="_blank" rel="noopener noreferrer" style={{ fontWeight: '700', color: '#f97316', textDecoration: 'none', fontSize: '1.1rem' }}>Watch Media</a>
                            </div>
                        </div>
                    )}
                </div>

                {project.projectDocuments && project.projectDocuments.length > 0 && (
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            <FileText size={18} color="#10b981" /> Reference Documents & Resources
                        </strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {project.projectDocuments.map((doc, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: '600' }}>{doc.tag || `Document ${idx + 1}`}</span>
                                    <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }}></div>
                                    {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0ea5e9', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                                            <LinkIcon size={14} /> Open Link
                                        </a>
                                    ) : (
                                        <button onClick={() => handleDownload(doc.fileId, doc.fileName)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', padding: 0 }}>
                                            <Download size={14} /> Download File
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {project.roles && project.roles.length > 0 && (
                        <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}><Briefcase size={16} /> Required Roles</strong>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {project.roles.map((role, idx) => (
                                    <span key={idx} style={{ padding: '0.4rem 1rem', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>{role}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {project.techStack && project.techStack.length > 0 && (
                        <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}><Code size={16} /> Tech Stack</strong>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {project.techStack.map((tech, idx) => (
                                    <span key={idx} style={{ padding: '0.4rem 1rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500' }}>{tech}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="details-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                        <Users size={20} color="#64748b" /> Pending Applicants ({applicants.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {applicants.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}><AlertCircle size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} /><p style={{ fontSize: '0.9rem' }}>No pending applicants.</p></div>
                        ) : applicants.map(app => (
                            <div key={app.studentRef._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', flexWrap: 'wrap', gap: '1rem' }}>
                                <div onClick={() => setSelectedStudent(app.studentRef._id)} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{app.studentRef.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{app.studentRef.email}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleAction('accept', app.studentRef._id)} style={{ padding: '0.5rem 1rem', background: 'var(--success)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Accept</button>
                                    <button onClick={() => handleAction('reject', app.studentRef._id)} style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                        <CheckCircle2 size={20} color="var(--success)" /> Accepted Students ({acceptedStudents.length}/{project.maxStudentsRequired})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {acceptedStudents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}><Users size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} /><p style={{ fontSize: '0.9rem' }}>No accepted students yet.</p></div>
                        ) : acceptedStudents.map(acc => (
                            <div key={acc.studentRef._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '12px', flexWrap: 'wrap', gap: '1rem' }}>
                                <div onClick={() => setSelectedStudent(acc.studentRef._id)} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 600, color: '#047857', fontSize: '1rem' }}>{acc.studentRef.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '0.25rem' }}>{acc.studentRef.email}</div>
                                </div>
                                {project.status !== 'completed' && project.status !== 'cancelled' && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleAction('remove', acc.studentRef._id)} style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Remove</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedStudent && <StudentProfileModal studentId={selectedStudent} onClose={() => setSelectedStudent(null)} />}
            </AnimatePresence>
        </div>
    );
};

// ----------------------------------------------------------------------------------------------------
// SHARED STYLES FOR MODALS
// ----------------------------------------------------------------------------------------------------
const inputStyle = { width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s' };
const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' };

// ----------------------------------------------------------------------------------------------------
// CREATE PROJECT MODAL
// ----------------------------------------------------------------------------------------------------
const CreateProjectModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ title: '', description: '', roles: '', techStack: '', maxStudents: 1, durationWeeks: 1, videoTag: '', videoUrl: '' });
    const [docs, setDocs] = useState([{ tag: '', type: 'link', url: '', file: null }]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleAddDoc = () => setDocs([...docs, { tag: '', type: 'link', url: '', file: null }]);
    const handleRemoveDoc = (idx) => setDocs(docs.filter((_, i) => i !== idx));
    const handleDocChange = (idx, field, val) => { const newDocs = [...docs]; newDocs[idx][field] = val; setDocs(newDocs); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setErrorMsg(''); setLoading(true);
        try {
            const finalDocuments = [];
            for (let doc of docs) {
                if (!doc.tag.trim()) continue;
                if (doc.type === 'upload' && doc.file) {
                    const fd = new FormData(); fd.append('file', doc.file);
                    const res = await projectApi.uploadDocument(fd);
                    finalDocuments.push({ tag: doc.tag, fileId: res.data.fileId, fileName: res.data.filename });
                } else if (doc.type === 'link' && doc.url.trim()) {
                    finalDocuments.push({ tag: doc.tag, url: doc.url });
                }
            }

            const payload = {
                title: formData.title.trim(), description: formData.description.trim(),
                roles: formData.roles.split(',').map(s => s.trim()).filter(Boolean),
                maxStudents: Number(formData.maxStudents), durationWeeks: Number(formData.durationWeeks)
            };

            const techArr = formData.techStack.split(',').map(s => s.trim()).filter(Boolean);
            if (techArr.length > 0) payload.techStack = techArr;

            if (formData.videoUrl.trim() !== '') {
                payload.video = { tag: formData.videoTag.trim() || 'Demo Video', url: formData.videoUrl.trim() };
            }
            if (finalDocuments.length > 0) payload.projectDocuments = finalDocuments;

            await projectApi.create(payload);
            onSuccess();
        } catch (error) { setErrorMsg(error.response?.data?.message || error.message || 'Failed to create project'); } 
        finally { setLoading(false); }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
            <style>{`.modal-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; } @media (max-width: 640px) { .modal-grid-2 { grid-template-columns: 1fr; } } .form-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15); }`}</style>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass" style={{ width: '100%', maxWidth: '750px', padding: '0', borderRadius: '16px', background: '#ffffff', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '92vh', boxShadow: '0 24px 50px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Post New Project</h2>
                    <button onClick={onClose} style={{ background: '#e2e8f0', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '50%', padding: '0.4rem', display: 'flex' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }} className="scrollbar-custom">
                    {errorMsg && <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}><AlertCircle size={18} /> {errorMsg}</div>}
                    <form id="create-project-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div>
                            <label style={labelStyle}>Project Title <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input className="form-input" type="text" style={inputStyle} required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. AI-Powered Prediction System" />
                        </div>
                        <div>
                            <label style={labelStyle}>Description <span style={{ color: 'var(--error)' }}>*</span></label>
                            <textarea className="form-input" style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the project goals and requirements..." />
                        </div>
                        <div className="modal-grid-2">
                            <div>
                                <label style={labelStyle}>Required Roles <span style={{ color: 'var(--error)' }}>*</span></label>
                                <input className="form-input" type="text" placeholder="e.g. Frontend, Backend" style={inputStyle} required value={formData.roles} onChange={e => setFormData({ ...formData, roles: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Tech Stack</label>
                                <input className="form-input" type="text" placeholder="e.g. React, Node.js" style={inputStyle} value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })} />
                            </div>
                        </div>
                        <div className="modal-grid-2">
                            <div>
                                <label style={labelStyle}>Max Students Needed <span style={{ color: 'var(--error)' }}>*</span></label>
                                <input className="form-input" type="number" min="1" style={inputStyle} required value={formData.maxStudents} onChange={e => setFormData({ ...formData, maxStudents: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Duration (1-4 Weeks) <span style={{ color: 'var(--error)' }}>*</span></label>
                                <input className="form-input" type="number" min="1" max="4" style={inputStyle} required value={formData.durationWeeks} onChange={e => setFormData({ ...formData, durationWeeks: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={18} color="var(--primary)" /> Video Resource <span style={{ color: '#94a3b8', fontWeight: 'normal', fontSize: '0.85rem' }}>(Optional)</span></h4>
                            <div className="modal-grid-2">
                                <div>
                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>Tag / Label</label>
                                    <input className="form-input" type="text" placeholder="e.g. Overview Demo" style={{...inputStyle, padding: '0.6rem 0.8rem'}} value={formData.videoTag} onChange={e => setFormData({ ...formData, videoTag: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>Video URL</label>
                                    <input className="form-input" type="url" placeholder="https://youtube.com/..." style={{...inputStyle, padding: '0.6rem 0.8rem'}} value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} color="#10b981" /> Documents <span style={{ color: '#94a3b8', fontWeight: 'normal', fontSize: '0.85rem' }}>(Optional)</span></h4>
                                <button type="button" onClick={handleAddDoc} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)' }}><Plus size={14} /> Add Resource</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {docs.map((doc, idx) => (
                                    <div key={idx} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                        <button type="button" onClick={() => handleRemoveDoc(idx)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#ef4444', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}><Trash2 size={16} /></button>
                                        <div className="modal-grid-2" style={{ marginBottom: '1rem', paddingRight: '3rem' }}>
                                            <div>
                                                <label style={{...labelStyle, fontSize: '0.8rem'}}>Resource Tag</label>
                                                <input className="form-input" type="text" placeholder="e.g. API Docs" style={{ ...inputStyle, padding: '0.6rem 0.8rem' }} value={doc.tag} onChange={e => handleDocChange(idx, 'tag', e.target.value)} />
                                            </div>
                                            <div>
                                                <label style={{...labelStyle, fontSize: '0.8rem'}}>Resource Type</label>
                                                <select className="form-input" style={{ ...inputStyle, padding: '0.6rem 0.8rem', cursor: 'pointer' }} value={doc.type} onChange={e => handleDocChange(idx, 'type', e.target.value)}>
                                                    <option value="link">External Link</option>
                                                    <option value="upload">File Upload</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            {doc.type === 'link' ? (
                                                <>
                                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>Link URL</label>
                                                    <input className="form-input" type="url" placeholder="https://..." style={{ ...inputStyle, padding: '0.6rem 0.8rem' }} value={doc.url} onChange={e => handleDocChange(idx, 'url', e.target.value)} />
                                                </>
                                            ) : (
                                                <>
                                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>File Attachment</label>
                                                    <input type="file" style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }} onChange={e => handleDocChange(idx, 'file', e.target.files[0])} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {docs.length === 0 && <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No documents added.</p>}
                            </div>
                        </div>
                    </form>
                </div>
                <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                    <button type="submit" form="create-project-form" className="btn-auth" disabled={loading} style={{ margin: 0, width: 'auto', padding: '0.75rem 2rem', fontSize: '0.95rem' }}>{loading ? 'Posting...' : 'Post Project'}</button>
                </div>
            </motion.div>
        </div>
    );
};

// ----------------------------------------------------------------------------------------------------
// UPDATE MEDIA MODAL (Fully Restyled & Professional)
// ----------------------------------------------------------------------------------------------------
const UpdateMediaModal = ({ project, onClose, onSuccess }) => {
    const [videoTag, setVideoTag] = useState(project.video?.tag || project.videoUrl ? 'Project Video' : '');
    const [videoUrl, setVideoUrl] = useState(project.video?.url || project.videoUrl || '');
    
    const [docs, setDocs] = useState(
        (project.projectDocuments || []).map(doc => ({
            tag: doc.tag || '',
            type: doc.url ? 'link' : 'upload',
            url: doc.url || '',
            fileId: doc.fileId,
            fileName: doc.fileName,
            file: null 
        }))
    );
    
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleAddDoc = () => setDocs([...docs, { tag: '', type: 'link', url: '', file: null }]);
    const handleRemoveDoc = (idx) => setDocs(docs.filter((_, i) => i !== idx));
    const handleDocChange = (idx, field, val) => { const newDocs = [...docs]; newDocs[idx][field] = val; setDocs(newDocs); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setErrorMsg(''); setLoading(true);
        try {
            const finalDocuments = [];
            for (let doc of docs) {
                if (!doc.tag.trim()) continue;
                if (doc.type === 'upload' && doc.file) {
                    const fd = new FormData(); fd.append('file', doc.file);
                    const res = await projectApi.uploadDocument(fd);
                    finalDocuments.push({ tag: doc.tag, fileId: res.data.fileId, fileName: res.data.filename });
                } else if (doc.type === 'upload' && doc.fileId) {
                    finalDocuments.push({ tag: doc.tag, fileId: doc.fileId, fileName: doc.fileName });
                } else if (doc.type === 'link' && doc.url.trim()) {
                    finalDocuments.push({ tag: doc.tag, url: doc.url });
                }
            }

            const payload = { projectDocuments: finalDocuments };
            if (videoUrl.trim() !== '') {
                payload.video = { tag: videoTag.trim() || 'Demo Video', url: videoUrl.trim() };
            } else {
                payload.video = null;
            }

            await projectApi.updateMedia(project._id, payload);
            onSuccess();
        } catch (error) { setErrorMsg(error.response?.data?.message || error.message || 'Failed to update resources'); } 
        finally { setLoading(false); }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
            <style>{`.modal-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; } @media (max-width: 640px) { .modal-grid-2 { grid-template-columns: 1fr; } } .form-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15); }`}</style>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass" style={{ width: '100%', maxWidth: '750px', padding: '0', borderRadius: '16px', background: '#ffffff', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '92vh', boxShadow: '0 24px 50px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Edit Project Resources</h2>
                    <button onClick={onClose} style={{ background: '#e2e8f0', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '50%', padding: '0.4rem', display: 'flex' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }} className="scrollbar-custom">
                    {errorMsg && <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}><AlertCircle size={18} /> {errorMsg}</div>}
                    
                    <form id="update-media-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        
                        {/* Video Editing Card */}
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={18} color="var(--primary)" /> Video Resource</h4>
                            <div className="modal-grid-2">
                                <div>
                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>Tag / Label</label>
                                    <input className="form-input" type="text" placeholder="e.g. Overview Demo" style={{ ...inputStyle, padding: '0.6rem 0.8rem' }} value={videoTag} onChange={e => setVideoTag(e.target.value)} />
                                </div>
                                <div>
                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>Video URL</label>
                                    <input className="form-input" type="url" placeholder="https://youtube.com/..." style={{ ...inputStyle, padding: '0.6rem 0.8rem' }} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Document Editing Cards */}
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={18} color="#10b981" /> Documents</h4>
                                <button type="button" onClick={handleAddDoc} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)' }}><Plus size={14} /> Add Resource</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {docs.map((doc, idx) => (
                                    <div key={idx} style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                        <button type="button" onClick={() => handleRemoveDoc(idx)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#ef4444', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}><Trash2 size={16} /></button>
                                        
                                        <div className="modal-grid-2" style={{ marginBottom: '1rem', paddingRight: '3rem' }}>
                                            <div>
                                                <label style={{...labelStyle, fontSize: '0.8rem'}}>Resource Tag</label>
                                                <input className="form-input" type="text" placeholder="e.g. API Docs" style={{ ...inputStyle, padding: '0.6rem 0.8rem' }} value={doc.tag} onChange={e => handleDocChange(idx, 'tag', e.target.value)} />
                                            </div>
                                            <div>
                                                <label style={{...labelStyle, fontSize: '0.8rem'}}>Resource Type</label>
                                                <select className="form-input" style={{ ...inputStyle, padding: '0.6rem 0.8rem', cursor: 'pointer' }} value={doc.type} onChange={e => handleDocChange(idx, 'type', e.target.value)} disabled={doc.fileId}>
                                                    <option value="link">External Link</option>
                                                    <option value="upload">File Upload</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            {doc.type === 'link' ? (
                                                <>
                                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>Link URL</label>
                                                    <input className="form-input" type="url" placeholder="https://..." style={{ ...inputStyle, padding: '0.6rem 0.8rem' }} value={doc.url} onChange={e => handleDocChange(idx, 'url', e.target.value)} />
                                                </>
                                            ) : (
                                                <>
                                                    <label style={{...labelStyle, fontSize: '0.8rem'}}>File Attachment</label>
                                                    {doc.fileId ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#047857' }}>
                                                            <FileCheck2 size={20} color="#10b981" />
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Existing File Attached</span>
                                                                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{doc.fileName || 'Document.pdf'}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <input type="file" style={{ width: '100%', padding: '0.6rem 0.8rem', border: '1px dashed #cbd5e1', borderRadius: '8px', background: '#f8fafc', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }} onChange={e => handleDocChange(idx, 'file', e.target.files[0])} />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {docs.length === 0 && <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No documents currently attached.</p>}
                            </div>
                        </div>
                    </form>
                </div>
                <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                    <button type="submit" form="update-media-form" className="btn-auth" disabled={loading} style={{ margin: 0, width: 'auto', padding: '0.75rem 2rem', fontSize: '0.95rem' }}>{loading ? 'Saving...' : 'Save Resources'}</button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectsView;