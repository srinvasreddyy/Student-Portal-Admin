import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, Window, ChannelHeader, MessageList, MessageInput, Thread } from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { projectApi } from '../../services/api';
import { Hash } from 'lucide-react';
import { motion } from 'framer-motion';

const apiKey = import.meta.env.VITE_STREAM_API_KEY || 'your_stream_api_key_here';
const chatClient = StreamChat.getInstance(apiKey);

const ChatInterface = () => {
    const [clientReady, setClientReady] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            const streamToken = localStorage.getItem('streamToken');
            const userStr = localStorage.getItem('user');

            if (!streamToken || !userStr) {
                console.error("No stream token or user info found in local storage.");
                return;
            }

            let user = {};
            try { user = JSON.parse(userStr); } catch (e) { console.error("Invalid user JSON"); }

            try {
                await chatClient.connectUser(
                    { id: user.id || 'unknown_user', name: user.email || 'User' },
                    streamToken
                );
                setClientReady(true);
            } catch (err) {
                console.error("Stream connection error", err);
            }
        };

        if (!clientReady) {
            initChat();
        }

        return () => {
            if (clientReady) {
                // Only disconnect on true unmount if necessary, but fast refresh might cause issues
            }
        };
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await projectApi.getMyProjects();
                setRooms(res.data.data);
                if (res.data.data.length > 0) {
                    setActiveRoom(res.data.data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch rooms', error);
            }
        };
        fetchRooms();
    }, []);

    const sidebarVariants = {
        hidden: { x: -20, opacity: 0 },
        show: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24, staggerChildren: 0.1 } }
    };

    const roomVariants = {
        hidden: { x: -20, opacity: 0 },
        show: { x: 0, opacity: 1 }
    };

    const channelObj = (clientReady && activeRoom && activeRoom.streamChannelId)
        ? chatClient.channel('messaging', activeRoom.streamChannelId)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="chat-container glass"
            style={{ display: 'flex', height: 'calc(100vh - 120px)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 40px rgba(0,0,0,0.5)' }}
        >
            {/* Rooms Sidebar */}
            <motion.div
                variants={sidebarVariants}
                initial="hidden"
                animate="show"
                style={{ width: '280px', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', background: 'hsla(230, 25%, 10%, 0.4)' }}
            >
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Project Channels</h3>
                </div>
                <div className="scrollbar-custom" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {rooms.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', marginTop: '2rem' }}>No active projects.</p>
                    ) : rooms.map(room => (
                        <motion.div
                            variants={roomVariants}
                            key={room._id}
                            onClick={() => setActiveRoom(room)}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: activeRoom?._id === room._id ? 'hsla(240, 100%, 70%, 0.15)' : 'transparent',
                                borderLeft: activeRoom?._id === room._id ? '4px solid var(--primary)' : '4px solid transparent',
                                transition: 'background 0.2s ease, border-color 0.2s ease'
                            }}
                        >
                            <Hash size={18} color={activeRoom?._id === room._id ? 'var(--primary)' : 'var(--text-secondary)'} />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: activeRoom?._id === room._id ? 'var(--text-primary)' : 'inherit' }}>{room.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status: {room.status}</div>
                                {!room.streamChannelId && <div style={{ fontSize: '0.65rem', color: 'var(--danger)' }}>Legacy (No Stream)</div>}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Chat Area */}
            {activeRoom ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-gradient)' }}>
                    {clientReady && channelObj ? (
                        <Chat client={chatClient} theme="str-chat__theme-dark">
                            <Channel channel={channelObj}>
                                <Window>
                                    <ChannelHeader />
                                    <MessageList />
                                    <MessageInput />
                                </Window>
                                <Thread />
                            </Channel>
                        </Chat>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                            <div style={{ textAlign: 'center' }}>
                                {!clientReady ? "Connecting to chat..." : "This channel is not initialized with Stream.io."}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', background: 'var(--bg-gradient)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <MessageSquarePlaceholder />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Select a Channel</h3>
                        <p style={{ marginTop: '0.5rem' }}>Choose a project from the left to view messages.</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

const MessageSquarePlaceholder = () => <div style={{ opacity: 0.2, margin: '0 auto 1rem', width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)' }}></div>;

export default ChatInterface;
