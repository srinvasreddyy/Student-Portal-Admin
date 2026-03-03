import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Rocket, Users, Search, CheckCircle2,
    Building, MailCheck, ClipboardList, ArrowRight,
    TrendingUp, Award, Globe, Zap, Network, PieChart,
    ChevronRight, Server, Lock, Fingerprint, Activity
} from 'lucide-react';

// ==========================================
// 1. DATA & CONFIGURATION (ENTERPRISE FOCUSED)
// ==========================================

const DEMO_STEPS = [
    {
        id: 0,
        title: "1. Smart Search",
        desc: "Instantly lookup your organization through our official, globally synchronized database integrations.",
        icon: <Search size={28} strokeWidth={1.5} />,
        color: "#0ea5e9", // Primary Blue
        bg: "rgba(14, 165, 233, 0.1)",
        mockupType: "search"
    },
    {
        id: 1,
        title: "2. Verify Identity",
        desc: "Our automated system verifies your institutional domain, tax IDs, and official documentation in seconds.",
        icon: <ShieldCheck size={28} strokeWidth={1.5} />,
        color: "#2563eb", // Deep Blue
        bg: "rgba(37, 99, 235, 0.1)",
        mockupType: "verify"
    },
    {
        id: 2,
        title: "3. Direct Contact",
        desc: "We establish a secure, encrypted communication channel with your official representative to secure the workspace.",
        icon: <MailCheck size={28} strokeWidth={1.5} />,
        color: "#0284c7", // Darker Blue
        bg: "rgba(2, 132, 199, 0.1)",
        mockupType: "contact"
    },
    {
        id: 3,
        title: "4. Done & Deployed",
        desc: "Launch your collaborative projects, set up your admin portal, and start recruiting top-tier student talent immediately.",
        icon: <Rocket size={28} strokeWidth={1.5} />,
        color: "#10b981", // Success Green for completion
        bg: "rgba(16, 185, 129, 0.1)",
        mockupType: "deploy"
    }
];

const FEATURES_DATA = [
    {
        title: "Military-Grade Security",
        desc: "JWT-based authentication, AES-256 encryption, and strict role-based access controls ensure your corporate data remains impenetrable.",
        icon: <Lock size={32} strokeWidth={1.5} />,
        color: "#0ea5e9"
    },
    {
        title: "Complete Project Lifecycle",
        desc: "Seamlessly track project performance, manage applicant funnels, and monitor deliverables from proposal to final execution.",
        icon: <ClipboardList size={32} strokeWidth={1.5} />,
        color: "#2563eb"
    },
    {
        title: "Automated Trust Verification",
        desc: "Instant credibility established through automated cross-referencing of official institutional and company registry data.",
        icon: <CheckCircle2 size={32} strokeWidth={1.5} />,
        color: "#0284c7"
    },
    {
        title: "Global Talent Network",
        desc: "Gain unrestricted access to a curated, pre-verified pool of the brightest minds from top universities worldwide.",
        icon: <Globe size={32} strokeWidth={1.5} />,
        color: "#3b82f6"
    },
    {
        title: "Advanced Analytics",
        desc: "Generate comprehensive reports on talent acquisition ROI, project engagement rates, and university partnership metrics.",
        icon: <PieChart size={32} strokeWidth={1.5} />,
        color: "#0369a1"
    },
    {
        title: "High-Availability Infrastructure",
        desc: "Built on a scalable microservices architecture guaranteeing 99.99% uptime for your critical recruitment operations.",
        icon: <Server size={32} strokeWidth={1.5} />,
        color: "#0c4a6e"
    }
];

const METRICS_DATA = [
    { value: "500+", label: "Verified Universities" },
    { value: "2,000+", label: "Partner Companies" },
    { value: "100k+", label: "Successful Matches" },
    { value: "99.9%", label: "Platform Uptime" }
];

// ==========================================
// 2. GLOBAL STYLES (Injected via Style Tag)
// ==========================================

const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

    :root {
        --bg-main: #ffffff;
        --bg-alt: #f8fafc;
        --bg-deep: #0f172a;
        
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-muted: #94a3b8;
        
        --color-primary: #0ea5e9;
        --color-primary-dark: #0284c7;
        --color-primary-light: #e0f2fe;
        --color-accent: #38bdf8;
        --color-success: #10b981;
        
        --glass-bg: rgba(255, 255, 255, 0.7);
        --glass-border: rgba(14, 165, 233, 0.15);
        --shadow-soft: 0 20px 40px -15px rgba(14, 165, 233, 0.1);
        --shadow-strong: 0 30px 60px -15px rgba(14, 165, 233, 0.25);
    }

    body {
        margin: 0;
        padding: 0;
        background-color: var(--bg-main);
        color: var(--text-primary);
        font-family: 'Inter', sans-serif;
        overflow-x: hidden;
    }

    .outfit-font { font-family: 'Outfit', sans-serif; }

    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

    .text-gradient {
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .glass-panel {
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        box-shadow: var(--shadow-soft);
        border-radius: 24px;
    }

    .mesh-background {
        background-color: #ffffff;
        background-image: 
            radial-gradient(at 10% 20%, hsla(199,89%,95%,1) 0px, transparent 50%),
            radial-gradient(at 90% 10%, hsla(217,100%,96%,1) 0px, transparent 50%),
            radial-gradient(at 50% 50%, hsla(199,89%,94%,0.5) 0px, transparent 50%),
            radial-gradient(at 10% 90%, hsla(217,100%,95%,1) 0px, transparent 50%),
            radial-gradient(at 90% 90%, hsla(199,89%,95%,1) 0px, transparent 50%);
    }

    /* Mockup Animations */
    @keyframes pulse-ring {
        0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(14, 165, 233, 0); }
        100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
    }
    
    @keyframes scanline {
        0% { top: 0%; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }

    @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
    }
`;

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

// --- Shared: Stagger Variants ---
const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 15 } }
};

// --- Navbar ---
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                padding: scrolled ? '1rem 5%' : '1.5rem 5%',
                background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(14, 165, 233, 0.1)' : '1px solid transparent',
                transition: 'all 0.4s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
        >
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                <div style={{ background: 'linear-gradient(135deg, #0f172a, #0ea5e9)', padding: '0.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(14,165,233,0.3)' }}>
                    <Building size={24} color="#ffffff" />
                </div>
                <span className="outfit-font" style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Admin<span style={{ color: '#0ea5e9' }}>Connect</span>
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'none', gap: '1.5rem', '@media (min-width: 768px)': { display: 'flex' } }}>
                    <a href="#features" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Features</a>
                    <a href="#process" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Workflow</a>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/login" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                        Portal Login
                    </Link>
                    <Link to="/company" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: '#0f172a', color: '#ffffff', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.3s', border: '1px solid #1e293b' }} onMouseEnter={e => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.borderColor = '#0ea5e9'; }} onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.borderColor = '#1e293b'; }}>
                        Partner With Us
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};

// --- Hero Section ---
const HeroSection = () => {
    return (
        <div className="mesh-background" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

                {/* Left Content */}
                <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ zIndex: 10 }}>
                    <motion.div variants={fadeUpVariant} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', background: '#ffffff', border: '1px solid #e0f2fe', borderRadius: '50px', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(14,165,233,0.1)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                        <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise Talent Portal</span>
                    </motion.div>

                    <motion.h1 variants={fadeUpVariant} className="outfit-font" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                        Empower Your <br />
                        <span className="text-gradient">Organization's Future.</span>
                    </motion.h1>

                    <motion.p variants={fadeUpVariant} style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '90%' }}>
                        A secure, centralized command center for Universities and Companies. Streamline project management, verify institutional identities, and seamlessly collaborate with the next generation of professionals.
                    </motion.p>

                    <motion.div variants={fadeUpVariant} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <Link to="/company" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.1rem 2.2rem', borderRadius: '14px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#ffffff', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 15px 30px -10px rgba(14, 165, 233, 0.5)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <Building size={20} /> Corporate Access
                        </Link>
                        <Link to="/university" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.1rem 2.2rem', borderRadius: '14px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.color = '#0ea5e9'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#0f172a'; }}>
                            <Users size={20} /> University Portal
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Visuals (Complex Abstract Dashboard UI) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    style={{ position: 'relative', height: '600px', width: '100%', perspective: '1000px' }}
                >
                    {/* Main Dashboard Panel */}
                    <motion.div
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="glass-panel"
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotateY(-15deg) rotateX(5deg)', width: '120%', maxWidth: '600px', height: 'auto', padding: '1.5rem', zIndex: 2, background: 'rgba(255,255,255,0.85)' }}
                    >
                        {/* Fake Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <div style={{ width: '40px', height: '40px', background: '#0f172a', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={20} color="#fff" /></div>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Global Operations</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Admin Command Center</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#cbd5e1' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#cbd5e1' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#cbd5e1' }} />
                            </div>
                        </div>

                        {/* Fake Charts Area */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {/* Bar Chart Mockup */}
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '1.5rem' }}>Active Projects</div>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.8rem', height: '80px' }}>
                                    {[40, 70, 45, 90, 60].map((h, i) => (
                                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.5 + (i * 0.1) }} style={{ flex: 1, background: i === 3 ? '#0ea5e9' : '#e2e8f0', borderRadius: '4px 4px 0 0' }} />
                                    ))}
                                </div>
                            </div>
                            {/* Stat Mockup */}
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>Talent Pipeline</div>
                                <div className="outfit-font" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>8,492</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                                    <TrendingUp size={14} /> +24% this month
                                </div>
                            </div>
                        </div>

                        {/* Fake List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {[
                                { name: "Stanford University", status: "Verified", color: "#10b981" },
                                { name: "TechNova Solutions", status: "Pending Review", color: "#f59e0b" },
                                { name: "MIT Engineering", status: "Verified", color: "#10b981" }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ShieldCheck size={16} color={item.color} />
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color, background: `${item.color}10`, padding: '0.3rem 0.8rem', borderRadius: '50px' }}>{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Floating Decorative Elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="glass-panel"
                        style={{ position: 'absolute', top: '10%', right: '-10%', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 3, background: '#ffffff' }}
                    >
                        <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '50%' }}><Lock size={24} color="#3b82f6" /></div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>System Status</p>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>Encrypted & Secure</p>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                        className="glass-panel"
                        style={{ position: 'absolute', bottom: '15%', left: '-5%', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 3, background: '#ffffff' }}
                    >
                        <div style={{ background: '#ecfdf5', padding: '0.6rem', borderRadius: '50%' }}><Network size={24} color="#10b981" /></div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>API Webhooks</p>
                            <p style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>Synchronized</p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
};

// --- SCROLL BOUND VIDEO SECTION ---
const ScrollVideoSection = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

    // Enterprise-focused abstract network video
    const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-loop-27361-large.mp4";

    useEffect(() => {
        let animationFrameId;
        const updateVideoTime = () => {
            if (videoRef.current && videoRef.current.duration) {
                const targetTime = scrollYProgress.get() * videoRef.current.duration;
                videoRef.current.currentTime = targetTime;
            }
            animationFrameId = requestAnimationFrame(updateVideoTime);
        };
        animationFrameId = requestAnimationFrame(updateVideoTime);
        return () => cancelAnimationFrame(animationFrameId);
    }, [scrollYProgress]);

    // Opacity and Y transforms for 3 distinct copy scenes
    const op1 = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.3], [0, 1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.1, 0.3], [50, 0, -50]);

    const op2 = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.35, 0.45, 0.65], [50, 0, -50]);

    const op3 = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.7, 0.8, 1], [50, 0, -50]);

    return (
        <div ref={sectionRef} style={{ height: '400vh', position: 'relative', background: '#020617' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Scrubbing Video */}
                <video
                    ref={videoRef} src={videoUrl} muted playsInline preload="auto"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, zIndex: 1, filter: 'grayscale(20%) hue-rotate(190deg) contrast(1.2)' }}
                />

                {/* Dark Blue Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,1) 0%, rgba(15,23,42,0.4) 50%, rgba(15,23,42,1) 100%)', zIndex: 2 }} />

                <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px', padding: '0 5%', textAlign: 'center', color: '#ffffff' }}>
                    
                    {/* Scene 1 */}
                    <motion.div style={{ position: 'absolute', width: '100%', left: 0, opacity: op1, y: y1 }}>
                        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(14, 165, 233, 0.2)', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '50px', marginBottom: '1.5rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Global Infrastructure</div>
                        <h2 className="outfit-font" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, margin: '0 0 1.5rem', lineHeight: 1.1 }}>
                            Analyze the <span style={{ color: '#38bdf8' }}>Ecosystem.</span>
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                            Scroll down to navigate the neural pathways of our platform. We map the intricate connections between world-class academic institutions and enterprise innovators.
                        </p>
                    </motion.div>

                    {/* Scene 2 */}
                    <motion.div style={{ position: 'absolute', width: '100%', left: 0, opacity: op2, y: y2 }}>
                        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '50px', marginBottom: '1.5rem', color: '#34d399', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Immutable Identity</div>
                        <h2 className="outfit-font" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, margin: '0 0 1.5rem', lineHeight: 1.1 }}>
                            Secure <span style={{ color: '#34d399' }}>Verification.</span>
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                            Every organization is cryptographically verified. Our rigorous vetting protocols ensure that you are collaborating within a completely trusted, enterprise-grade environment.
                        </p>
                    </motion.div>

                    {/* Scene 3 */}
                    <motion.div style={{ position: 'absolute', width: '100%', left: 0, opacity: op3, y: y3 }}>
                        <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '50px', marginBottom: '1.5rem', color: '#a78bfa', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Frictionless Operations</div>
                        <h2 className="outfit-font" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, margin: '0 0 1.5rem', lineHeight: 1.1 }}>
                            Seamless <span style={{ color: '#a78bfa' }}>Onboarding.</span>
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                            Bypass bureaucratic delays. From domain verification to full portal access, our automated pipelines get your administration team operational in minutes, not weeks.
                        </p>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <div style={{ position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7 }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem', fontWeight: 600 }}>System Initialization</span>
                    <div style={{ width: '2px', height: '60px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', borderRadius: '2px' }}>
                        <motion.div animate={{ y: [0, 60] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ width: '100%', height: '50%', background: 'linear-gradient(to bottom, transparent, #38bdf8)' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Interactive Story Demo (The Workflow) ---
// Renders the specific UI mockup based on the active step
const MockupRenderer = ({ type }) => {
    switch (type) {
        case 'search':
            return (
                <div style={{ width: '100%', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ width: '100%', height: '48px', background: '#f1f5f9', borderRadius: '12px', border: '2px solid #0ea5e9', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '1rem' }}>
                        <Search size={20} color="#0ea5e9" />
                        <span style={{ color: '#0f172a', fontWeight: 500 }}>Acme Corp International...</span>
                        <div style={{ marginLeft: 'auto', width: '2px', height: '20px', background: '#0ea5e9', animation: 'pulse 1s infinite' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ padding: '1rem', background: i === 1 ? '#e0f2fe' : '#ffffff', border: i === 1 ? '1px solid #bae6fd' : '1px solid #f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', background: i === 1 ? '#0ea5e9' : '#e2e8f0', borderRadius: '8px' }} />
                                <div>
                                    <div style={{ width: i === 1 ? '150px' : '120px', height: '12px', background: i === 1 ? '#0f172a' : '#cbd5e1', borderRadius: '4px', marginBottom: '8px' }} />
                                    <div style={{ width: '80px', height: '8px', background: i === 1 ? '#64748b' : '#e2e8f0', borderRadius: '4px' }} />
                                </div>
                                {i === 1 && <div style={{ marginLeft: 'auto', background: '#0ea5e9', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }}>MATCH</div>}
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'verify':
            return (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '2px', background: 'rgba(37,99,235,0.5)', animation: 'scanline 2s linear infinite', zIndex: 10, boxShadow: '0 0 10px #2563eb' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', zIndex: 2 }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-ring 2s infinite' }}>
                            <Fingerprint size={50} color="#2563eb" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Authenticating Domain</div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                <div style={{ width: '30px', height: '4px', background: '#2563eb', borderRadius: '2px' }} />
                                <div style={{ width: '30px', height: '4px', background: '#2563eb', borderRadius: '2px', opacity: 0.5 }} />
                                <div style={{ width: '30px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'contact':
            return (
                <div style={{ width: '100%', height: '100%', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '300px', background: '#ffffff', border: '1px solid #e0f2fe', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 20px 40px -10px rgba(2,132,199,0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#0284c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MailCheck size={20} color="#fff" /></div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Admin Invitation</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>To: admin@acmecorp.com</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }} />
                            <div style={{ width: '90%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }} />
                            <div style={{ width: '70%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem' }} />
                            <div style={{ width: '100%', padding: '0.8rem', background: '#0284c7', color: '#fff', textAlign: 'center', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>Accept Invitation</div>
                        </div>
                    </div>
                </div>
            );
        case 'deploy':
            return (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)' }}>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 30px rgba(16,185,129,0.3)' }}>
                            <CheckCircle2 size={40} color="#fff" />
                        </motion.div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>Workspace Active</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '250px' }}>Your enterprise environment is fully configured and ready.</p>
                    </div>
                </div>
            );
        default:
            return null;
    }
};

const WorkflowSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % DEMO_STEPS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div id="process" style={{ padding: '8rem 5%', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <span style={{ color: '#0ea5e9', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '1rem' }}>Automated Onboarding</span>
                    <h2 className="outfit-font" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                        From Registration to <span style={{ color: '#0ea5e9' }}>Operation.</span>
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'center' }}>
                    
                    {/* Left: Step List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {DEMO_STEPS.map((step, idx) => (
                            <div
                                key={step.id}
                                onClick={() => setActiveStep(idx)}
                                style={{
                                    padding: '1.5rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s ease',
                                    background: activeStep === idx ? '#ffffff' : 'transparent',
                                    border: activeStep === idx ? `1px solid ${step.color}40` : '1px solid transparent',
                                    boxShadow: activeStep === idx ? `0 20px 40px -10px ${step.color}20` : 'none',
                                    transform: activeStep === idx ? 'translateX(10px)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: activeStep === idx ? step.color : '#e2e8f0', color: activeStep === idx ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className="outfit-font" style={{ fontSize: '1.3rem', fontWeight: 700, color: activeStep === idx ? '#0f172a' : '#64748b', margin: '0 0 0.5rem', transition: 'color 0.3s' }}>{step.title}</h3>
                                        <AnimatePresence initial={false}>
                                            {activeStep === idx && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, overflow: 'hidden' }}
                                                >
                                                    {step.desc}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Dynamic Visual Mockup */}
                    <div style={{ position: 'relative', height: '500px', background: '#ffffff', borderRadius: '32px', border: '1px solid #e2e8f0', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                        {/* Mockup Browser/Window Header */}
                        <div style={{ height: '40px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f87171' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#34d399' }} />
                        </div>
                        
                        <div style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ position: 'absolute', inset: 0 }}
                                >
                                    <MockupRenderer type={DEMO_STEPS[activeStep].mockupType} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Features Grid ---
const FeaturesSection = () => {
    return (
        <div id="features" style={{ padding: '8rem 5%', background: '#ffffff', position: 'relative' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ color: '#0ea5e9', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.85rem', display: 'block', marginBottom: '1rem' }}>Platform Capabilities</motion.span>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="outfit-font" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                        Engineered for <span style={{ color: '#0ea5e9' }}>Enterprise.</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} style={{ color: '#475569', fontSize: '1.15rem', maxWidth: '750px', margin: '1.5rem auto 0', lineHeight: 1.6 }}>
                        A comprehensive, secure suite of tools designed to streamline institutional administration and corporate talent acquisition.
                    </motion.p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
                    {FEATURES_DATA.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -10, boxShadow: `0 25px 50px -12px ${feature.color}20`, borderColor: `${feature.color}50` }}
                            style={{ background: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '2.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}
                        >
                            {/* Decorative background flare */}
                            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: `${feature.color}10`, borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }} />
                            
                            <div style={{ position: 'relative', zIndex: 1, width: '64px', height: '64px', borderRadius: '16px', background: `${feature.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: feature.color }}>
                                {feature.icon}
                            </div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h3 className="outfit-font" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem' }}>{feature.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Statistics Section ---
const StatsSection = () => {
    return (
        <div style={{ padding: '6rem 5%', background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
            {/* Background Graphic */}
            <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231e293b\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
            
            <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                {METRICS_DATA.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1, type: "spring" }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '2rem', background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <span className="outfit-font text-gradient" style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1 }}>{stat.value}</span>
                        <span style={{ color: '#cbd5e1', fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- CTA Section ---
const CTASection = () => {
    return (
        <div style={{ padding: '8rem 5%', background: '#ffffff' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', borderRadius: '32px', padding: '5rem 3rem',
                        textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px -15px rgba(37, 99, 235, 0.5)'
                    }}
                >
                    {/* Shimmer Effect */}
                    <div style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-20deg)', animation: 'shimmer 3s infinite' }} />

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <h2 className="outfit-font" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1.5rem', lineHeight: 1.1 }}>
                            Modernize Your Institutional <br /> Administration Today.
                        </h2>
                        <p style={{ color: '#e0f2fe', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                            Join the world's leading universities and fortune 500 companies managing their talent pipelines and collaborative projects through AdminConnect.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <Link to="/company" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.2rem 2.5rem', borderRadius: '16px', background: '#0f172a', color: '#ffffff', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', transition: 'all 0.3s', boxShadow: '0 15px 30px rgba(15,23,42,0.3)' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(15,23,42,0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(15,23,42,0.3)'; }}>
                                Register as Company <ChevronRight size={22} />
                            </Link>
                            <Link to="/university" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1.2rem 2.5rem', borderRadius: '16px', background: '#ffffff', color: '#0ea5e9', textDecoration: 'none', fontWeight: 700, fontSize: '1.1rem', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                                Register as University <ChevronRight size={22} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// --- Footer ---
const Footer = () => {
    return (
        <footer style={{ background: '#f8fafc', paddingTop: '6rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                    
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
                            <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '12px', display: 'flex' }}>
                                <Building size={24} color="#0ea5e9" />
                            </div>
                            <span className="outfit-font" style={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a' }}>
                                Admin<span style={{ color: '#0ea5e9' }}>Connect</span>
                            </span>
                        </Link>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                            The enterprise standard for academic-industry collaboration, project tracking, and verified talent acquisition.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="outfit-font" style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Solutions</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['University Portals', 'Corporate Dashboards', 'Security & Compliance', 'API Integrations', 'Case Studies'].map(item => (
                                <li key={item}><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#0ea5e9'} onMouseLeave={e => e.target.style.color = '#64748b'}>{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="outfit-font" style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['About Us', 'Careers', 'Engineering Blog', 'Press Center', 'Contact Sales'].map(item => (
                                <li key={item}><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#0ea5e9'} onMouseLeave={e => e.target.style.color = '#64748b'}>{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="outfit-font" style={{ color: '#0f172a', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Enterprise Support</h4>
                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>Dedicated account managers available 24/7 for premium tier partners.</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                            <MailCheck size={20} color="#0ea5e9" /> support@adminconnect.io
                        </div>
                    </div>
                </div>

                <div style={{ padding: '2rem 0', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>&copy; {new Date().getFullYear()} AdminConnect Enterprise. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy Policy', 'Terms of Service', 'Security Overview'].map(item => (
                            <a key={item} href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }} onMouseEnter={e => e.target.style.color = '#0ea5e9'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>{item}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

// ==========================================
// 4. MAIN EXPORT COMPONENT
// ==========================================

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#ffffff' }}>
            <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
            <Navbar />
            <HeroSection />
            <WorkflowSection />
            <ScrollVideoSection />
            <FeaturesSection />
            <StatsSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default Home;