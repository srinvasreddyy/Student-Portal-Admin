import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, ArrowRight, ShieldCheck, Mail, Globe, Search, UserCircle, CheckCircle2, Briefcase, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import { universityApi, authApi } from '../services/api';

const UniversityAuth = () => {
    return (
        <div className="auth-page">
            <Routes>
                <Route path="/" element={<UniversityLanding />} />
                <Route path="/register" element={<UniversityRegister />} />
                <Route path="/login" element={<UniversityLogin />} />
            </Routes>
        </div>
    );
};

const UniversityLanding = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="auth-card glass">
        <div className="auth-header">
            <div className="auth-icon-bg"><GraduationCap size={32} /></div>
            <h2>University Portal</h2>
            <p>Connect your institution and manage academic projects.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="register" className="btn-auth">Register Institution</Link>
            <Link to="login" className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>Sign In to Account</Link>
        </div>
    </motion.div>
);

const UniversityRegister = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        country: 'United Kingdom',
        organizationName: '',
        website: '',
        officialEmail: '',
        repName: '',
        repRole: '',
        repDob: '',
        repLocation: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Domain Check States
    const [domainVerified, setDomainVerified] = useState(false);
    const [needsManualVerification, setNeedsManualVerification] = useState(false);
    const [domainCheckMessage, setDomainCheckMessage] = useState('');
    
    // For Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isManualEntry, setIsManualEntry] = useState(false);

    const navigate = useNavigate();

    const handleSearchUk = async () => {
        setLoading(true); setError('');
        try {
            const res = await universityApi.searchUk();
            if (res.data.success) {
                setSearchResults(res.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to lookup universities');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchGlobal = async (q) => {
        setSearchQuery(q);
        if (q.length < 3) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await universityApi.getGlobalList(q);
            if (res.data.success) setSearchResults(res.data.data);
        } catch (err) {
            console.error('Global search error', err);
        }
    };

    const handleVerifyDomain = async () => {
        if (!formData.website || !formData.officialEmail) return setError('Website and Email required');
        setLoading(true); setError('');
        try {
            const res = await universityApi.verifyDomain({ website: formData.website, email: formData.officialEmail });
            if (res.data.success) {
                setDomainVerified(true);
                setNeedsManualVerification(res.data.data.needsDomainManualVerification);
                setDomainCheckMessage(res.data.data.message);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Domain verification failed');
            setDomainVerified(false);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!domainVerified) return setError('Please verify your domain first');
        setLoading(true); setError('');
        try {
            const result = await universityApi.register(formData);
            if (result.data.success) {
                // Bypass auto-login to prevent the "Contact Super Admin" 403 error page.
                // Redirect user to the Success UI.
                setStep(6);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-card glass">
            <div className="auth-header">
                <div className="auth-icon-bg"><GraduationCap size={32} /></div>
                <h2>
                    {step === 1 && 'Select Jurisdiction'}
                    {step === 2 && 'Find Institution'}
                    {step === 3 && 'Representative Details'}
                    {step === 4 && 'Domain Verification'}
                    {step === 6 && 'Registration Complete'}
                </h2>
            </div>

            {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="form-group">
                            <label>Country of Registration</label>
                            <div className="input-wrapper">
                                <Globe size={18} />
                                <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={() => {
                            setStep(2);
                            if (formData.country === 'United Kingdom') handleSearchUk();
                        }} className="btn-auth">Continue <ArrowRight size={18} /></button>
                    </motion.div>
                )}

                {step === 2 && formData.country === 'United Kingdom' && (
                    <motion.div key="s2uk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="form-group">
                            <label>Select UK University</label>
                            {loading && <p>Loading UK universities...</p>}
                            {!loading && searchResults.length > 0 && (
                                <div style={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {searchResults.map((res, i) => (
                                        <div key={i} onClick={() => {
                                            setFormData({ ...formData, organizationName: res.universityName, website: res.website || '' });
                                            setStep(3);
                                        }} style={{ padding: '0.8rem', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)' }}>
                                            {res.universityName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => setStep(1)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>Back</button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && formData.country !== 'United Kingdom' && (
                    <motion.div key="s2global" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {!isManualEntry ? (
                            <>
                                <div className="form-group">
                                    <label>Search Institution Name</label>
                                    <div className="input-wrapper">
                                        <Search size={18} />
                                        <input type="text" placeholder="Type to search..." value={searchQuery} onChange={(e) => handleSearchGlobal(e.target.value)} />
                                    </div>
                                    {searchResults.length > 0 && (
                                        <div style={{ background: 'var(--bg-color)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginTop: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                            {searchResults.map((res, i) => (
                                                <div key={i} onClick={() => {
                                                    setFormData({ ...formData, organizationName: res.universityName, website: res.website || '' });
                                                    setStep(3);
                                                }} style={{ padding: '0.8rem', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)' }}>
                                                    {res.universityName} <span style={{ fontSize: '0.8em', color: 'gray' }}>({res.country})</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button onClick={() => setStep(1)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>Back</button>
                                    <button onClick={() => setIsManualEntry(true)} className="btn-auth">Not Listed</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Manual Institution Name</label>
                                    <div className="input-wrapper">
                                        <GraduationCap size={18} />
                                        <input type="text" placeholder="Official Name" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} required />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setIsManualEntry(false)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>Back</button>
                                    <button onClick={() => { if (formData.organizationName) setStep(3); else setError('Name required') }} className="btn-auth">Continue</button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.form key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
                        <div className="form-group">
                            <label>Representative Name</label>
                            <div className="input-wrapper">
                                <UserCircle size={18} />
                                <input type="text" placeholder="Full Name" value={formData.repName} onChange={(e) => setFormData({ ...formData, repName: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Representative Role</label>
                            <div className="input-wrapper">
                                <Briefcase size={18} />
                                <input type="text" placeholder="e.g. Dean, Admissions Officer" value={formData.repRole} onChange={(e) => setFormData({ ...formData, repRole: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <div className="input-wrapper">
                                <Calendar size={18} />
                                <input type="date" value={formData.repDob} onChange={(e) => setFormData({ ...formData, repDob: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <div className="input-wrapper">
                                <MapPin size={18} />
                                <input type="text" placeholder="City, Country" value={formData.repLocation} onChange={(e) => setFormData({ ...formData, repLocation: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Official Institutional Email (Login)</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input type="email" placeholder="admin@university.edu" value={formData.officialEmail} onChange={(e) => { setFormData({ ...formData, officialEmail: e.target.value }); setDomainVerified(false); }} required />
                            </div>
                            <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>Must be an organization email (no Gmail/Yahoo).</small>
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-wrapper">
                                <Search size={18} />
                                <input type="tel" placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Create Password</label>
                            <div className="input-wrapper">
                                <ShieldCheck size={18} />
                                <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => setStep(2)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>Back</button>
                            <button type="submit" className="btn-auth">Continue</button>
                        </div>
                    </motion.form>
                )}

                {step === 4 && (
                    <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="form-group">
                            <label>Official Website</label>
                            <div className="input-wrapper">
                                <Globe size={18} />
                                <input type="url" placeholder="https://university.edu" value={formData.website} onChange={(e) => { setFormData({ ...formData, website: e.target.value }); setDomainVerified(false); }} required />
                            </div>
                        </div>

                        {domainVerified && needsManualVerification && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', backgroundColor: '#fef3c7', padding: '12px', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem', border: '1px solid #fde68a' }}>
                                <AlertTriangle size={20} />
                                <span>{domainCheckMessage}</span>
                            </div>
                        )}

                        {domainVerified && !needsManualVerification && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', backgroundColor: '#dcfce7', padding: '12px', borderRadius: '8px', marginTop: '1rem', fontSize: '0.9rem', border: '1px solid #bbf7d0' }}>
                                <CheckCircle2 size={20} />
                                <span>{domainCheckMessage}</span>
                            </div>
                        )}

                        <div style={{ margin: '1.5rem 0' }}>
                            <button onClick={handleVerifyDomain} disabled={loading || domainVerified} className="btn-auth" style={{ background: domainVerified ? (needsManualVerification ? '#f59e0b' : 'var(--success)') : 'var(--primary)' }}>
                                {loading ? 'Verifying...' : domainVerified ? 'Domain Checked ✓' : 'Verify Domain Match'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(3)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>Back</button>
                            <button onClick={handleRegister} className="btn-auth" disabled={!domainVerified || loading}>
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 6 && (
                    <motion.div key="s6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--success)', marginBottom: '1.5rem' }}><CheckCircle2 size={64} style={{ margin: '0 auto' }} /></div>
                        <h3>Registration Submitted</h3>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            Your institution's registration has been securely processed. It is currently pending Super Admin review. You will receive an email once approved.
                        </p>
                        <button onClick={() => navigate('/')} className="btn-auth" style={{ marginTop: '2rem' }}>Return to Home</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {step !== 6 && (
                <div className="auth-footer">
                    Already registered? <Link to="/university/login">Sign In</Link>
                </div>
            )}
        </motion.div>
    );
};

const UniversityLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authApi.login(formData);
            const { user, tokens } = res.data;

            if (user?.status === 'pending') {
                setError('Your account is pending Super Admin approval. Please check back later.');
                return;
            }
            if (user?.status === 'rejected') {
                setError('Your account registration has been rejected.');
                return;
            }

            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            if (tokens.streamToken) {
                localStorage.setItem('streamToken', tokens.streamToken);
                localStorage.setItem('user', JSON.stringify(user));
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-card glass">
            <div className="auth-header">
                <div className="auth-icon-bg"><GraduationCap size={32} /></div>
                <h2>University Sign In</h2>
            </div>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Institutional Email</label>
                    <div className="input-wrapper">
                        <Mail size={18} />
                        <input type="email" placeholder="admin@university.edu" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                        <ShieldCheck size={18} />
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                </div>
                <button type="submit" className="btn-auth" disabled={loading}>{loading ? 'Authenticating...' : 'Sign In'}</button>
            </form>
            <div className="auth-footer">
                New institution? <Link to="/university/register">Register</Link>
            </div>
        </motion.div>
    );
};

export default UniversityAuth;