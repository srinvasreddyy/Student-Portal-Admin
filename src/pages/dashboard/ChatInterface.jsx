import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StreamChat } from 'stream-chat';
import {
    Chat,
    Channel,
    ChannelList,
    Window,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    useChatContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { projectApi } from '../../services/api';
import { FileText, Link as LinkIcon, Download, Info, X, Briefcase, Code, PlaySquare, LayoutTemplate, ArrowLeft } from 'lucide-react';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

// ----------------------------------------------------------------------
// 1. Error Boundary
// ----------------------------------------------------------------------
class ChatErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', margin: '1rem', border: '1px solid #fca5a5' }}>
                    <h2 style={{ marginTop: 0 }}>Chat Component Error</h2>
                    <p style={{ fontWeight: '500' }}>{this.state.error?.toString()}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

// ----------------------------------------------------------------------
// 2. Project Details Sidebar Component
// ----------------------------------------------------------------------
const ProjectDetailsSidebar = ({ project, isMobile, onClose }) => {
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
            alert('Failed to download file. It may have been removed.');
        }
    };

    const videoUrlToUse = project?.video?.url || project?.videoUrl;
    const videoTagToUse = project?.video?.tag || project?.videoTag || 'Project Video';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>
                    <LayoutTemplate size={18} color="var(--primary)" />
                    Project Details
                </h3>
                {isMobile && (
                    <button onClick={onClose} style={{ background: '#e2e8f0', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}>
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="scrollbar-custom" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: '1.3', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>
                        {project.title}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        {project.description}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {project.roles?.length > 0 && (
                        <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <Briefcase size={14} color="var(--primary)" /> Required Roles
                            </strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {project.roles.map((r, i) => (
                                    <span key={i} style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', border: '1px solid #bae6fd', fontWeight: '600' }}>{r}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.techStack?.length > 0 && (
                        <div>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <Code size={14} color="var(--primary)" /> Tech Stack
                            </strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {project.techStack.map((t, i) => (
                                    <span key={i} style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: '#f1f5f9', color: '#475569', borderRadius: '6px', border: '1px solid #e2e8f0', fontWeight: '500' }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {videoUrlToUse && (
                    <div>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <PlaySquare size={14} color="#0ea5e9" /> Video Resource
                        </strong>
                        <a href={videoUrlToUse} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s ease' }}>
                            <span style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '600' }}>{videoTagToUse}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#0284c7', fontWeight: '700' }}><LinkIcon size={12} /> Watch URL</span>
                        </a>
                    </div>
                )}

                {project.projectDocuments?.length > 0 && (
                    <div>
                        <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <FileText size={14} color="#10b981" /> Attached Documents
                        </strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {project.projectDocuments.map((doc, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.8rem 1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{doc.tag || `Resource ${i + 1}`}</span>
                                    {doc.url ? (
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', width: 'fit-content' }}>
                                            <LinkIcon size={12} /> Open External Link
                                        </a>
                                    ) : (
                                        <button onClick={() => handleDownload(doc.fileId, doc.fileName)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--success)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600', width: 'fit-content' }}>
                                            <Download size={12} /> Download Document
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// 3. WhatsApp Style Layout Core
// ----------------------------------------------------------------------
const WhatsappChatLayout = ({ projects, filters, sort }) => {
    const { channel, setActiveChannel } = useChatContext();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showDetails, setShowDetails] = useState(window.innerWidth >= 1024);

    // CRITICAL MOBILE FIX: Force clear the active channel on initial mount if on a small screen
    // This stops it from remembering a previous session and jumping into a chat
    useEffect(() => {
        if (window.innerWidth < 768) {
            setActiveChannel(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (window.innerWidth >= 1024) setShowDetails(true);
            else setShowDetails(false);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const activeProject = useMemo(() => {
        if (!channel || !projects) return null;
        return projects.find(p => p.streamChannelId === channel.id);
    }, [channel, projects]);

    const showChannelList = !isMobile || (isMobile && !channel);
    const showChannel = !isMobile || (isMobile && channel);

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff' }}>

            {/* 1. Groups List Sidebar */}
            {showChannelList && (
                <div style={{
                    width: isMobile ? '100%' : '320px',
                    borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
                    background: '#f8fafc',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>Groups</h2>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <ChannelList
                            filters={filters}
                            sort={sort}
                            // Stream Prop Fix: Prevent it from aggressively auto-selecting the first chat on mobile devices
                            setActiveChannelOnMount={!isMobile}
                        />
                    </div>
                </div>
            )}

            {/* 2. Main Chat Area */}
            {showChannel && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
                    <Channel>
                        <Window>
                            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', background: '#ffffff', padding: isMobile ? '0 0.5rem' : '0' }}>
                                {/* Mobile Back Arrow to clear the active channel and return to Groups */}
                                {isMobile && (
                                    <button
                                        onClick={() => setActiveChannel(null)}
                                        style={{ padding: '0.5rem', marginRight: '0.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                    >
                                        <ArrowLeft size={24} />
                                    </button>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <ChannelHeader />
                                </div>
                                {activeProject && (
                                    <button
                                        onClick={() => setShowDetails(!showDetails)}
                                        style={{
                                            marginRight: '1rem', padding: '0.5rem 0.8rem',
                                            background: showDetails ? 'var(--primary)' : '#f0f9ff',
                                            border: '1px solid var(--primary)',
                                            color: showDetails ? '#ffffff' : 'var(--primary)',
                                            borderRadius: '8px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            transition: 'all 0.2s ease', fontWeight: '600', fontSize: '0.8rem'
                                        }}
                                    >
                                        <Info size={18} />
                                        {!isMobile && <span>Details</span>}
                                    </button>
                                )}
                            </div>
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread />
                    </Channel>

                    {/* Mobile Project Details Overlay */}
                    {isMobile && showDetails && activeProject && (
                        <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }}>
                            <div style={{ width: '85%', maxWidth: '340px', background: '#fff', height: '100%', boxShadow: '-10px 0 25px rgba(0,0,0,0.1)' }}>
                                <ProjectDetailsSidebar project={activeProject} isMobile={true} onClose={() => setShowDetails(false)} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. Desktop Project Details Sidebar */}
            {!isMobile && showDetails && activeProject && showChannel && (
                <div style={{ width: '340px', flexShrink: 0, borderLeft: '1px solid #e2e8f0', background: '#fff' }}>
                    <ProjectDetailsSidebar project={activeProject} isMobile={false} onClose={() => setShowDetails(false)} />
                </div>
            )}
        </div>
    );
};

// ----------------------------------------------------------------------
// 4. Main Interface Wrapper Component
// ----------------------------------------------------------------------
const ChatInterface = () => {
    const [client, setClient] = useState(null);
    const [userId, setUserId] = useState(null);
    const [initError, setInitError] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!apiKey) {
            setInitError("VITE_STREAM_API_KEY is not defined.");
            return;
        }

        let isMounted = true;
        const chatClient = StreamChat.getInstance(apiKey);

        const initChat = async () => {
            try {
                const streamToken = localStorage.getItem('streamToken');
                const userStr = localStorage.getItem('user');

                if (!streamToken || !userStr) {
                    if (isMounted) setInitError("Missing Stream credentials. Please log out and log back in.");
                    return;
                }

                const user = JSON.parse(userStr);
                const currentUserId = String(user.id || user._id);
                if (isMounted) setUserId(currentUserId);

                try {
                    const projRes = await projectApi.getMyProjects();
                    if (isMounted) setProjects(projRes.data.data || []);
                } catch (e) {
                    console.warn('Failed to load projects for chat', e);
                }

                if (chatClient.userID && chatClient.userID !== currentUserId) {
                    await chatClient.disconnectUser();
                }

                if (!chatClient.userID) {
                    await chatClient.connectUser(
                        { id: currentUserId, name: user.name || user.email || 'Admin', role: 'user' },
                        streamToken
                    );
                }

                if (isMounted) {
                    setClient(chatClient);
                }
            } catch (err) {
                console.error('Admin chat init error:', err);
                if (isMounted) setInitError(err.message || "Failed to initialize workspace chat.");
            }
        };

        initChat();

        return () => {
            isMounted = false;
            if (chatClient) {
                chatClient.disconnectUser();
            }
        };
    }, []);

    const filters = useMemo(() => {
        if (!userId) return null;
        return { type: 'messaging', members: { $in: [userId] } };
    }, [userId]);

    const sort = useMemo(() => ({ last_message_at: -1 }), []);

    if (initError) {
        return (
            <div style={{ padding: '2rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', border: '1px solid #fca5a5' }}>
                <h3 style={{ marginTop: 0 }}>Chat Initialization Failed</h3>
                <p>{initError}</p>
            </div>
        );
    }

    if (!client || !filters) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #e0f2fe', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span style={{ fontWeight: '500' }}>Loading Workspace...</span>
                </div>
            </div>
        );
    }

    return (
        <ChatErrorBoundary>
            <style>{`
                .str-chat {
                    --str-chat__font-family: 'Inter', sans-serif;
                    --str-chat__primary-color: #0ea5e9;
                    --str-chat__active-primary-color: #0284c7;
                    --str-chat__surface-color: #ffffff;
                    --str-chat__background-color: #f8fafc;
                    --str-chat__message-repiles-bg-color: #f0f9ff;
                }
                .str-chat__header-hamburger {
                    display: none !important; 
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>

            <div style={{ height: 'calc(100vh - 120px)', width: '100%', display: 'flex', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)', background: '#ffffff' }}>
                <Chat client={client} theme="str-chat__theme-light">
                    <WhatsappChatLayout projects={projects} filters={filters} sort={sort} />
                </Chat>
            </div>
        </ChatErrorBoundary>
    );
};

export default ChatInterface;