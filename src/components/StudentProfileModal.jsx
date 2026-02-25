import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Briefcase, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { studentApi } from '../services/api';

const StudentProfileModal = ({ studentId, onClose }) => {
    const [data, setData] = [useState(null)];
    const [loading, setLoading] = [useState(true)];
    const [error, setError] = [useState(null)];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await studentApi.getPublicProfile(studentId);
                setData(res.data.data);
            } catch (err) {
                setError('Failed to load student profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [studentId]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="glass scrollbar-custom"
                style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '0', borderRadius: '24px', background: 'var(--bg-color)', border: '1px solid hsla(0,0%,100%,0.1)' }}
            >
                {/* Decorative header gradient */}
                <div style={{ height: '120px', background: 'linear-gradient(135deg, hsla(240, 100%, 70%, 0.2), hsla(280, 100%, 65%, 0.2))', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '-40px', left: '2rem', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: '6px solid var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        {data?.profile?.userRef?.name?.charAt(0) || 'S'}
                    </div>
                    <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', padding: '0.5rem', backdropFilter: 'blur(5px)' }}><X size={20} /></button>
                </div>

                <div style={{ padding: '4rem 2rem 2rem 2rem' }}>
                    {loading ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading profile...</div>
                    ) : error ? (
                        <div style={{ color: 'var(--error)', textAlign: 'center', padding: '2rem' }}>{error}</div>
                    ) : data && data.profile ? (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            {/* Header Info */}
                            <motion.div variants={itemVariants}>
                                <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontWeight: 700 }}>{data.profile.userRef?.name}</h1>
                                <p style={{ color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldCheck size={16} /> Verified Student Applicant
                                </p>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{data.profile.userRef?.email}</p>
                                <p style={{ marginTop: '1.5rem', lineHeight: '1.6', fontSize: '1.05rem', color: 'hsla(0,0%,100%,0.9)' }}>{data.profile.bio || 'No bio provided.'}</p>
                            </motion.div>

                            {/* Tech Stack Tags */}
                            {data.profile.techStack && data.profile.techStack.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>Skills & Expertise</h3>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {data.profile.techStack.map((tech, i) => (
                                            <motion.span
                                                whileHover={{ scale: 1.05, y: -2, boxShadow: '0 5px 15px var(--primary-glow)' }}
                                                key={i}
                                                style={{ padding: '0.5rem 1rem', background: 'hsla(240, 100%, 70%, 0.15)', color: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, border: '1px solid hsla(240, 100%, 70%, 0.3)' }}
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Experience & Education Grid */}
                            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <motion.div whileHover={{ y: -5 }} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid hsla(0,0%,100%,0.05)' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                        <div style={{ padding: '0.5rem', background: 'hsla(280, 100%, 65%, 0.2)', borderRadius: '8px', color: 'var(--secondary)' }}><Briefcase size={20} /></div>
                                        Experience
                                    </h3>
                                    {data.profile.experience?.length > 0 ? data.profile.experience.map((exp, i) => (
                                        <div key={i} style={{ marginBottom: '1.5rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid hsla(0,0%,100%,0.1)' }}>
                                            <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }} />
                                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{exp.title}</div>
                                            <div style={{ color: 'var(--secondary)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{exp.company}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}</div>
                                            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'hsla(0,0%,100%,0.8)', lineHeight: '1.5' }}>{exp.description}</p>
                                        </div>
                                    )) : <p style={{ color: 'var(--text-secondary)' }}>None listed.</p>}
                                </motion.div>

                                <motion.div whileHover={{ y: -5 }} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid hsla(0,0%,100%,0.05)' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                        <div style={{ padding: '0.5rem', background: 'hsla(200, 100%, 55%, 0.2)', borderRadius: '8px', color: 'var(--accent)' }}><GraduationCap size={20} /></div>
                                        Education
                                    </h3>
                                    {data.profile.education?.length > 0 ? data.profile.education.map((edu, i) => (
                                        <div key={i} style={{ marginBottom: '1.5rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid hsla(0,0%,100%,0.1)' }}>
                                            <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{edu.institution}</div>
                                            <div style={{ color: 'var(--accent)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{edu.degree} in {edu.fieldOfStudy}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class of {edu.graduationYear}</div>
                                        </div>
                                    )) : <p style={{ color: 'var(--text-secondary)' }}>None listed.</p>}
                                </motion.div>
                            </motion.div>

                            {/* Highlighted Portfolio */}
                            <motion.div variants={itemVariants}>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ padding: '0.5rem', background: 'hsla(240, 100%, 70%, 0.2)', borderRadius: '8px', color: 'var(--primary)' }}><FileText size={20} /></div>
                                    Highlighted Portfolio
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {data.portfolio && data.portfolio.length > 0 ? data.portfolio.map(item => (
                                        <a key={item._id} href={item.type === 'link' ? item.url : `http://localhost:3000/api/v1/students/portfolio/${item._id}/download`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <motion.div
                                                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', borderColor: 'var(--primary)' }}
                                                style={{ padding: '1.5rem', background: 'hsla(0,0%,100%,0.03)', borderRadius: '16px', border: '1px solid hsla(0,0%,100%,0.08)', transition: 'border-color 0.3s' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                    <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>{item.title}</div>
                                                    <div style={{ background: 'hsla(0,0%,100%,0.1)', padding: '0.4rem', borderRadius: '50%' }}><ExternalLink size={16} color="#fff" /></div>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>{item.description}</p>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {item.tags?.map(t => <span key={t} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', background: 'rgba(0,0,0,0.3)', color: 'var(--text-secondary)', borderRadius: '6px' }}>{t}</span>)}
                                                </div>
                                            </motion.div>
                                        </a>
                                    )) : <p style={{ color: 'var(--text-secondary)' }}>No public portfolio items.</p>}
                                </div>
                            </motion.div>

                        </motion.div>
                    ) : null}
                </div>
            </motion.div>
        </div>
    );
};

export default StudentProfileModal;
