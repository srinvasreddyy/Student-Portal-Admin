import React, { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ArrowRight, ShieldCheck, Mail, Briefcase, Globe, Hash, UserCircle, CheckCircle2 } from 'lucide-react';
import { companyApi, authApi } from '../services/api';

const CompanyAuth = () => {
    return (
        <div className="auth-page">
            <Routes>
                <Route path="/" element={<CompanyLanding />} />
                <Route path="/register" element={<CompanyRegister />} />
                <Route path="/login" element={<CompanyLogin />} />
            </Routes>
        </div>
    );
};

const CompanyLanding = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="auth-card glass">
        <div className="auth-header">
            <div className="auth-icon-bg"><Building2 size={32} /></div>
            <h2>Company Portal</h2>
            <p>Register your organization or sign in to manage projects.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="register" className="btn-auth">Register Organization</Link>
            <Link to="login" className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Sign In to Account</Link>
        </div>
    </motion.div>
);

const CompanyRegister = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        country: 'UK',
        companyNumber: '',
        organizationName: '',
        website: '',
        officialEmail: '',
        repName: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [domainVerified, setDomainVerified] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [registeredUserId, setRegisteredUserId] = useState(null);

    // For Global Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isManualEntry, setIsManualEntry] = useState(false);

    const navigate = useNavigate();

    const handleSearchUk = async () => {
        if (!formData.companyNumber) return setError('Company Number is required');
        setLoading(true); setError('');
        try {
            const res = await companyApi.searchUk({ companyNumber: formData.companyNumber });
            if (res.data.success && res.data.data) {
                setFormData(prev => ({ ...prev, organizationName: res.data.data.companyName }));
                setStep(3);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to lookup company');
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
            const res = await companyApi.getGlobalList(q);
            if (res.data.success) setSearchResults(res.data.data);
        } catch (err) {
            console.error('Global search error', err);
        }
    };

    const handleVerifyDomain = async () => {
        if (!formData.website || !formData.officialEmail) return setError('Website and Email required');
        setLoading(true); setError('');
        try {
            const res = await companyApi.verifyDomain({ website: formData.website, email: formData.officialEmail });
            if (res.data.success && res.data.data.verified) {
                setDomainVerified(true);
                setError(''); // clear errors
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
            const result = await companyApi.register(formData);
            if (result.data.success) {
                // Try logging the user in directly to obtain the token so we can hit /auth/verify-email
                const loginRes = await authApi.login({ email: formData.officialEmail, password: formData.password });
                localStorage.setItem('accessToken', loginRes.data.tokens.accessToken);
                localStorage.setItem('refreshToken', loginRes.data.tokens.refreshToken);
                setStep(5); // Move to OTP input step
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            // Need accessToken to hit /auth/verify-email natively
            const res = await companyApi.verifyDomain({ email: formData.officialEmail }); // Just dummy to show
            // The real route is authApi.verifyEmail which sends the header
            await authApi.verifyEmail({ code: otpCode });
            setStep(6); // Success page
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Incorrect OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="auth-card glass">
            <div className="auth-header">
                <div className="auth-icon-bg"><Building2 size={32} /></div>
                <h2>
                    {step === 1 && 'Select Jurisdiction'}
                    {step === 2 && 'Find Organization'}
                    {step === 3 && 'Representative Details'}
                    {step === 4 && 'Domain Verification'}
                    {step === 5 && 'Verify Email OTP'}
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
                                    <option value="UK">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="IN">India</option>
                                    <option value="FR">France</option>
                                    <option value="DE">Germany</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className="btn-auth">Continue <ArrowRight size={18} /></button>
                    </motion.div>
                )}

                {step === 2 && formData.country === 'UK' && (
                    <motion.div key="s2uk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="form-group">
                            <label>Companies House Number</label>
                            <div className="input-wrapper">
                                <Hash size={18} />
                                <input type="text" placeholder="e.g. 12345678" value={formData.companyNumber} onChange={(e) => setFormData({ ...formData, companyNumber: e.target.value })} required />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(1)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
                            <button onClick={handleSearchUk} className="btn-auth" disabled={loading}>{loading ? 'Searching...' : 'Find Company'}</button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && formData.country !== 'UK' && (
                    <motion.div key="s2global" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {!isManualEntry ? (
                            <>
                                <div className="form-group">
                                    <label>Search Organization Name</label>
                                    <div className="input-wrapper">
                                        <Building2 size={18} />
                                        <input type="text" placeholder="Type to search..." value={searchQuery} onChange={(e) => handleSearchGlobal(e.target.value)} />
                                    </div>
                                    {searchResults.length > 0 && (
                                        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginTop: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                            {searchResults.map((res, i) => (
                                                <div key={i} onClick={() => { setFormData({ ...formData, organizationName: res.companyName }); setStep(3); }} style={{ padding: '0.8rem', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)' }}>
                                                    {res.companyName}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button onClick={() => setStep(1)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
                                    <button onClick={() => setIsManualEntry(true)} className="btn-auth">Company Not Listed</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label>Manual Organization Name</label>
                                    <div className="input-wrapper">
                                        <Building2 size={18} />
                                        <input type="text" placeholder="Official Name" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} required />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => setIsManualEntry(false)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
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
                            <label>Phone Number</label>
                            <div className="input-wrapper">
                                <Hash size={18} />
                                <input type="tel" placeholder="+1 234 567 8900" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Official Work Email</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input type="email" placeholder="name@company.com" value={formData.officialEmail} onChange={(e) => { setFormData({ ...formData, officialEmail: e.target.value }); setDomainVerified(false); }} required />
                            </div>
                            <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>Must be an organization email (no Gmail/Yahoo).</small>
                        </div>
                        <div className="form-group">
                            <label>Create Password</label>
                            <div className="input-wrapper">
                                <ShieldCheck size={18} />
                                <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => setStep(2)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
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
                                <input type="url" placeholder="https://company.com" value={formData.website} onChange={(e) => { setFormData({ ...formData, website: e.target.value }); setDomainVerified(false); }} required />
                            </div>
                        </div>

                        <div style={{ margin: '1.5rem 0' }}>
                            <button onClick={handleVerifyDomain} disabled={loading || domainVerified} className="btn-auth" style={{ background: domainVerified ? 'var(--success)' : 'var(--primary)' }}>
                                {loading ? 'Verifying...' : domainVerified ? 'Domain Verified ✓' : 'Verify Domain Match'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setStep(3)} className="btn-auth" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
                            <button onClick={handleRegister} className="btn-auth" disabled={!domainVerified || loading}>
                                {loading ? 'Registering...' : 'Complete Registration'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.form key="s5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleVerifyOtp} style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Mail size={64} style={{ margin: '0 auto' }} /></div>
                        <h3>Check Your Email</h3>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            We sent a 6-digit confirmation code to <strong>{formData.officialEmail}</strong>.
                        </p>

                        <div className="form-group" style={{ marginTop: '2rem', textAlign: 'left' }}>
                            <label>Enter OTP Code</label>
                            <div className="input-wrapper">
                                <ShieldCheck size={18} />
                                <input type="text" placeholder="123456" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required maxLength={6} style={{ letterSpacing: '2px', fontSize: '1.2rem', textAlign: 'center' }} />
                            </div>
                        </div>

                        <button type="submit" className="btn-auth" disabled={loading} style={{ marginTop: '1rem' }}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </motion.form>
                )}

                {step === 6 && (
                    <motion.div key="s6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--success)', marginBottom: '1.5rem' }}><CheckCircle2 size={64} style={{ margin: '0 auto' }} /></div>
                        <h3>Registration Verified & Complete</h3>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                            Your company domain and email have been securely verified and your account is ready.
                        </p>
                        <button onClick={() => navigate('/dashboard')} className="btn-auth" style={{ marginTop: '2rem' }}>Proceed to Dashboard</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {step !== 5 && (
                <div className="auth-footer">
                    Already registered? <Link to="/company/login">Sign In</Link>
                </div>
            )}
        </motion.div>
    );
};

const CompanyLogin = () => {
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
                <div className="auth-icon-bg"><Building2 size={32} /></div>
                <h2>Welcome Back</h2>
                <p>Sign in to your company admin account.</p>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Work Email</label>
                    <div className="input-wrapper">
                        <Mail size={18} />
                        <input type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                        <ShieldCheck size={18} />
                        <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    </div>
                </div>
                <button type="submit" className="btn-auth" disabled={loading}>{loading ? 'Signing In...' : 'Login'}</button>
            </form>
            <div className="auth-footer">
                Don't have an account? <Link to="/company/register">Register Now</Link>
            </div>
        </motion.div>
    );
};

export default CompanyAuth;
