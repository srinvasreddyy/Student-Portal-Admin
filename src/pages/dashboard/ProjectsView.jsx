import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Clock, Users, ArrowLeft, CheckCircle2, X, Briefcase, Code, Link as LinkIcon, AlertCircle, FileText, Trash2, Download } from 'lucide-react';
import { projectApi } from '../../services/api';
import StudentProfileModal from '../../components/StudentProfileModal';

const ProjectsView = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="projects-page">
            <div className="dashboard-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {viewMode === 'list' ? 'Projects Management' : selectedProject?.title || 'Project Details'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {viewMode === 'list' ? 'Manage your organization\'s projects and applicants.' : 'View project details and manage applicants.'}
                    </p>
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
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="stats-grid">
                    {projects.length === 0 ? (
                        <motion.div variants={itemVariants} className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', borderRadius: '16px' }}>
                            <FolderKanban size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-secondary)' }} />
                            <h3>No Projects Yet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Get started by posting your first project.</p>
                        </motion.div>
                    ) : (
                        projects.map(p => (
                            <motion.div key={p._id} variants={itemVariants} className="stat-card glass" style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }} onClick={() => fetchProjectDetails(p._id)} whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'var(--primary-glow)' }}>
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: p.status === 'open' ? 'var(--primary-glow)' : 'var(--glass-border)', filter: 'blur(30px)', borderRadius: '50%' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', zIndex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>{p.title}</h3>
                                    <span style={{ padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', background: p.status === 'open' ? 'var(--primary-glow)' : 'var(--glass-border)', color: p.status === 'open' ? '#fff' : 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                        {p.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', zIndex: 1, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {p.acceptedStudents?.length || 0}/{p.maxStudentsRequired || 0} Slots</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {p.durationInWeeks} Weeks</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
                    <ProjectDetails project={selectedProject} onUpdate={() => fetchProjectDetails(selectedProject._id)} />
                </motion.div>
            )}

            <AnimatePresence>
                {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchProjects(); }} />}
            </AnimatePresence>
        </motion.div>
    );
};

const ProjectDetails = ({ project, onUpdate }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    if (!project) return <div>Loading project details...</div>;

    const handleAction = async (action, studentRef) => {
        try {
            if (action === 'accept') {
                await projectApi.acceptStudent(project._id, studentRef);
            } else if (action === 'reject') {
                await projectApi.rejectApplicant(project._id, studentRef, 'Not a fit at this time');
            }
            onUpdate();
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || `Failed to ${action} student.`}`);
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

    // Fallbacks for legacy projects
    const videoUrlToUse = project.video?.url || project.videoUrl;
    const videoTagToUse = project.video?.tag || 'Project Video';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h2>{project.title}</h2>
                    <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: '600', background: project.status === 'open' ? 'var(--primary-glow)' : 'var(--glass-border)', color: '#fff' }}>
                        {project.status.toUpperCase()}
                    </span>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>{project.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={20} color="var(--primary)" />
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Duration</div>
                            <div style={{ fontWeight: '500' }}>{project.durationInWeeks} Weeks</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users size={20} color="var(--primary)" />
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capacity</div>
                            <div style={{ fontWeight: '500' }}>{acceptedStudents.length} / {project.maxStudentsRequired} Filled</div>
                        </div>
                    </div>
                    {videoUrlToUse && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <LinkIcon size={20} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{videoTagToUse}</div>
                                <a href={videoUrlToUse} target="_blank" rel="noopener noreferrer" style={{ fontWeight: '500', color: 'var(--primary)', textDecoration: 'none' }}>Watch Video</a>
                            </div>
                        </div>
                    )}
                </div>

                {project.projectDocuments && project.projectDocuments.length > 0 && (
                    <div style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <FileText size={16} /> Reference Documents & Resources
                        </strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {project.projectDocuments.map((doc, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', width: 'fit-content' }}>
                                    <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: '500', marginRight: '0.5rem' }}>{doc.tag || `Document ${idx + 1}`}</span>
                                    {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#60A5FA', textDecoration: 'none', fontSize: '0.875rem' }}>
                                            <LinkIcon size={14} /> Open Link
                                        </a>
                                    ) : (
                                        <button onClick={() => handleDownload(doc.fileId, doc.fileName)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'transparent', border: 'none', color: '#60A5FA', cursor: 'pointer', fontSize: '0.875rem', padding: 0 }}>
                                            <Download size={14} /> Download File
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {project.roles && project.roles.length > 0 && (
                        <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}><Briefcase size={16} /> Required Roles</strong>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {project.roles.map((role, idx) => (
                                    <span key={idx} style={{ padding: '0.3rem 0.8rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', fontSize: '0.875rem' }}>{role}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {project.techStack && project.techStack.length > 0 && (
                        <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}><Code size={16} /> Tech Stack</strong>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {project.techStack.map((tech, idx) => (
                                    <span key={idx} style={{ padding: '0.3rem 0.8rem', background: 'var(--glass-border)', borderRadius: '8px', fontSize: '0.875rem' }}>{tech}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                        <Users size={20} /> Pending Applicants ({applicants.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {applicants.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}><AlertCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} /><p style={{ fontSize: '0.875rem' }}>No pending applicants.</p></div>
                        ) : applicants.map(app => (
                            <div key={app.studentRef._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                                <div onClick={() => setSelectedStudent(app.studentRef._id)} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.studentRef.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.studentRef.email}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleAction('accept', app.studentRef._id)} style={{ padding: '0.4rem 0.8rem', background: 'var(--success)', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Accept</button>
                                    <button onClick={() => handleAction('reject', app.studentRef._id)} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                        <CheckCircle2 size={20} color="var(--success)" /> Accepted Students ({acceptedStudents.length}/{project.maxStudentsRequired})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {acceptedStudents.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}><Users size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} /><p style={{ fontSize: '0.875rem' }}>No accepted students yet.</p></div>
                        ) : acceptedStudents.map(acc => (
                            <div key={acc.studentRef._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'hsla(142, 71%, 45%, 0.1)', border: '1px solid hsla(142, 71%, 45%, 0.3)', borderRadius: '12px' }}>
                                <div onClick={() => setSelectedStudent(acc.studentRef._id)} style={{ cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--success)' }}>{acc.studentRef.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{acc.studentRef.email}</div>
                                </div>
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

const CreateProjectModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        roles: '',
        techStack: '',
        maxStudents: 1,
        durationWeeks: 1,
        videoTag: '',
        videoUrl: ''
    });
    
    // Dynamic array supporting both File uploads and Link strings with tags
    const [docs, setDocs] = useState([{ tag: '', type: 'link', url: '', file: null }]);
    
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleAddDoc = () => setDocs([...docs, { tag: '', type: 'link', url: '', file: null }]);
    const handleRemoveDoc = (idx) => setDocs(docs.filter((_, i) => i !== idx));
    const handleDocChange = (idx, field, val) => {
        const newDocs = [...docs];
        newDocs[idx][field] = val;
        setDocs(newDocs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            // 1. Upload any physical files first
            const finalDocuments = [];
            for (let doc of docs) {
                if (!doc.tag.trim()) continue; // Skip if tag is missing
                
                if (doc.type === 'upload' && doc.file) {
                    const fd = new FormData();
                    fd.append('file', doc.file);
                    const res = await projectApi.uploadDocument(fd);
                    finalDocuments.push({ tag: doc.tag, fileId: res.data.fileId, fileName: res.data.filename });
                } else if (doc.type === 'link' && doc.url.trim()) {
                    finalDocuments.push({ tag: doc.tag, url: doc.url });
                }
            }

            // 2. Prepare JSON payload
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                roles: formData.roles.split(',').map(s => s.trim()).filter(Boolean),
                maxStudents: Number(formData.maxStudents),
                durationWeeks: Number(formData.durationWeeks)
            };

            const techArr = formData.techStack.split(',').map(s => s.trim()).filter(Boolean);
            if (techArr.length > 0) payload.techStack = techArr;

            if (formData.videoUrl.trim() !== '') {
                payload.video = {
                    tag: formData.videoTag.trim() || 'Demo Video',
                    url: formData.videoUrl.trim()
                };
            }

            if (finalDocuments.length > 0) {
                payload.projectDocuments = finalDocuments;
            }

            if (payload.roles.length === 0) throw new Error("At least one role is required.");
            if (payload.durationWeeks < 1 || payload.durationWeeks > 4) throw new Error("Duration must be between 1 and 4 weeks.");
            if (payload.maxStudents < 1) throw new Error("Max students must be at least 1.");

            await projectApi.create(payload);
            onSuccess();
        } catch (error) {
            console.error('Failed to create project', error);
            setErrorMsg(error.response?.data?.message || error.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="glass" style={{ width: '100%', maxWidth: '650px', padding: '0', borderRadius: '16px', background: 'var(--card-bg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Post New Project</h2>
                    <button onClick={onClose} style={{ background: 'var(--glass-border)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '50%', padding: '0.4rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '2rem', overflowY: 'auto' }}>
                    {errorMsg && (
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={16} /> {errorMsg}
                        </div>
                    )}

                    <form id="create-project-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Project Title <span style={{ color: 'var(--error)' }}>*</span></label>
                            <input type="text" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Description <span style={{ color: 'var(--error)' }}>*</span></label>
                            <textarea style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff', minHeight: '120px' }} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Required Roles <span style={{ color: 'var(--error)' }}>*</span></label>
                                <input type="text" placeholder="Frontend, Backend" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} required value={formData.roles} onChange={e => setFormData({ ...formData, roles: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Tech Stack</label>
                                <input type="text" placeholder="React, Node.js" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={formData.techStack} onChange={e => setFormData({ ...formData, techStack: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Max Students Needed <span style={{ color: 'var(--error)' }}>*</span></label>
                                <input type="number" min="1" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} required value={formData.maxStudents} onChange={e => setFormData({ ...formData, maxStudents: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Duration (1-4 Weeks) <span style={{ color: 'var(--error)' }}>*</span></label>
                                <input type="number" min="1" max="4" style={{ width: '100%', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} required value={formData.durationWeeks} onChange={e => setFormData({ ...formData, durationWeeks: e.target.value })} />
                            </div>
                        </div>

                        {/* Video Section */}
                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Video Resource (Optional)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                <input type="text" placeholder="Tag (e.g. Overview Video)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem' }} value={formData.videoTag} onChange={e => setFormData({ ...formData, videoTag: e.target.value })} />
                                <input type="url" placeholder="Video URL (YouTube/Drive)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.9rem' }} value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} />
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: '1.25rem', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Documents (Optional)</h4>
                                <button type="button" onClick={handleAddDoc} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Plus size={14} /> Add Resource</button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {docs.map((doc, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 2fr auto', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                        <input type="text" placeholder="Tag (e.g. Design Doc)" style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem' }} value={doc.tag} onChange={e => handleDocChange(idx, 'tag', e.target.value)} />
                                        
                                        <select style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem' }} value={doc.type} onChange={e => handleDocChange(idx, 'type', e.target.value)}>
                                            <option value="link">Link</option>
                                            <option value="upload">Upload</option>
                                        </select>

                                        {doc.type === 'link' ? (
                                            <input type="url" placeholder="URL" style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '0.85rem' }} value={doc.url} onChange={e => handleDocChange(idx, 'url', e.target.value)} />
                                        ) : (
                                            <input type="file" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} onChange={e => handleDocChange(idx, 'file', e.target.files[0])} />
                                        )}

                                        <button type="button" onClick={() => handleRemoveDoc(idx)} style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer', padding: '0.25rem' }}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                    <button type="submit" form="create-project-form" className="btn-auth" disabled={loading} style={{ margin: 0, width: 'auto', padding: '0.75rem 2rem' }}>
                        {loading ? 'Posting Project...' : 'Post Project'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectsView;