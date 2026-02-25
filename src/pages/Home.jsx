import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    ShieldCheck,
    Rocket,
    Users,
    Search,
    CheckCircle2,
    Building,
    MailCheck,
    ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 12 } }
};

const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 50, damping: 15 } }
};

const Home = () => {
    const [demoStep, setDemoStep] = useState(0);
    const { scrollYProgress } = useScroll();

    // Parallax background elements
    const yBg1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const yBg2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const rotateBg = useTransform(scrollYProgress, [0, 1], [0, 180]);

    const demoSteps = [
        {
            title: "1. Smart Search",
            desc: "Instantly lookup your organization through our official database integrations.",
            icon: <Search className="step-icon" />,
            color: "hsl(240, 100%, 70%)"
        },
        {
            title: "2. Verify Identity",
            desc: "Our automated system verifies your domain and official documentation in seconds.",
            icon: <ShieldCheck className="step-icon" />,
            color: "hsl(280, 100%, 65%)"
        },
        {
            title: "3. Direct Contact",
            desc: "We reach out to your official representative to secure your workspace.",
            icon: <MailCheck className="step-icon" />,
            color: "hsl(200, 100%, 55%)"
        },
        {
            title: "4. Done!",
            desc: "Launch your projects and start recruiting top student talent immediately.",
            icon: <Rocket className="step-icon" />,
            color: "hsl(150, 80%, 50%)"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setDemoStep((prev) => (prev + 1) % demoSteps.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-container" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Parallax ambient blobs */}
            <motion.div
                style={{
                    position: 'absolute', top: '-10%', left: '-10%',
                    width: '500px', height: '500px',
                    background: 'var(--primary-glow)',
                    filter: 'blur(100px)', borderRadius: '50%', zIndex: 0,
                    y: yBg1, rotate: rotateBg
                }}
            />
            <motion.div
                style={{
                    position: 'absolute', bottom: '0%', right: '-5%',
                    width: '600px', height: '600px',
                    background: 'var(--secondary-glow)',
                    filter: 'blur(120px)', borderRadius: '50%', zIndex: 0,
                    y: yBg2
                }}
            />

            {/* Hero Section */}
            <section className="hero-section" style={{ position: 'relative', zIndex: 10 }}>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="hero-content"
                >
                    <motion.div variants={fadeUpVariant} className="badge animate-glow" style={{ border: '1px solid var(--primary)', background: 'hsla(240, 100%, 70%, 0.1)' }}>Platform for Future Leaders</motion.div>
                    <motion.h1 variants={fadeUpVariant}>Connect Organizations with <span className="gradient-text">Exceptional Talent</span></motion.h1>
                    <motion.p variants={fadeUpVariant} className="hero-desc">
                        A robust, secure, and streamlined portal for Companies and Universities to manage projects,
                        verify registrations, and collaborate with the next generation of professionals.
                    </motion.p>

                    <motion.div variants={fadeUpVariant} className="hero-cta">
                        <Link to="/company" className="btn btn-primary" style={{ boxShadow: '0 0 20px var(--primary-glow)' }}>
                            <Building size={20} />
                            <span>Company Admin</span>
                        </Link>
                        <Link to="/university" className="btn btn-outline" style={{ borderColor: 'var(--secondary)', color: 'var(--text-primary)' }}>
                            <Users size={20} />
                            <span>University Admin</span>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Interactive Story Demo */}
                <motion.div
                    variants={scaleUpVariant}
                    initial="hidden"
                    animate="show"
                    className="demo-visual"
                    style={{ position: 'relative', zIndex: 10 }}
                >
                    <div className="demo-card glass animate-float">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={demoStep}
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ duration: 0.6, type: 'spring' }}
                                className="step-content"
                            >
                                <div className="step-icon-wrapper" style={{ backgroundColor: `${demoSteps[demoStep].color}20`, color: demoSteps[demoStep].color, boxShadow: `0 0 15px ${demoSteps[demoStep].color}40` }}>
                                    {demoSteps[demoStep].icon}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{demoSteps[demoStep].title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{demoSteps[demoStep].desc}</p>

                                <div className="step-indicators" style={{ marginTop: '2rem' }}>
                                    {demoSteps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`dot ${i === demoStep ? 'active' : ''}`}
                                            onClick={() => setDemoStep(i)}
                                            style={{ background: i === demoStep ? demoSteps[i].color : 'var(--glass-border)' }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Surrounding decorative orbit particles could be added here */}
                </motion.div>
            </section>

            {/* Features Grid */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
                className="features-section"
                style={{ position: 'relative', zIndex: 10, padding: '6rem 2rem' }}
            >
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.h2 variants={fadeUpVariant} style={{ fontSize: '3rem', marginBottom: '1rem' }}>Why Choose <span className="accent gradient-text" style={{ background: 'linear-gradient(90deg, var(--secondary), var(--accent))', WebkitBackgroundClip: 'text' }}>AdminConnect?</span></motion.h2>
                    <motion.p variants={fadeUpVariant} style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Everything you need to manage collaborative projects effectively.</motion.p>
                </div>

                <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {[
                        { icon: <ShieldCheck size={32} color="var(--primary)" />, title: "Secure Authentication", desc: "Military-grade JWT-based security with brute-force protection to ensure your data is safe.", color: "var(--primary)" },
                        { icon: <ClipboardList size={32} color="var(--secondary)" />, title: "Project Lifecycle", desc: "Seamlessly track project performance from initial proposal through active development to completion.", color: "var(--secondary)" },
                        { icon: <CheckCircle2 size={32} color="var(--accent)" />, title: "Automated Verification", desc: "Instant trust established through our official institution and company data lookups.", color: "var(--accent)" }
                    ].map((f, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUpVariant}
                            whileHover={{ y: -15, scale: 1.02, boxShadow: `0 20px 40px ${f.color}20` }}
                            className="feature-card glass"
                            style={{ padding: '2.5rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}
                        >
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: `${f.color}20`, filter: 'blur(30px)', borderRadius: '50%' }} />
                            <div className="feature-icon" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: `${f.color}15`, borderRadius: '16px' }}>{f.icon}</div>
                            <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{f.title}</h4>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
