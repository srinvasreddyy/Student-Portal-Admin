import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Hash, File, User, Image as ImageIcon } from 'lucide-react';
import { chatApi } from '../../services/api';
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3000';

const ChatInterface = () => {
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Fetch rooms on mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await chatApi.getRooms();
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

    // Handle Socket Connection & Room Change
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const newSocket = io(API_BASE_URL, {
            auth: { token: `Bearer ${token}` }
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('chat:receive_message', (msg) => {
            if (activeRoom && msg.projectRef === activeRoom._id) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => newSocket.close();
    }, [activeRoom]);

    // Fetch messages when activeRoom changes
    useEffect(() => {
        if (!activeRoom) return;

        const loadMessages = async () => {
            try {
                const res = await chatApi.getMessages(activeRoom._id);
                setMessages(res.data.data.reverse()); // Assuming backend returns chronologically descending (newest first). Wait, if backend returns newest first, we reverse to display newest at bottom.

                // Also tell socket to join this room if required by backend
                if (socket) {
                    socket.emit('chat:join_room', { projectId: activeRoom._id });
                }
            } catch (error) {
                console.error('Failed to load messages', error);
            }
        };
        loadMessages();
    }, [activeRoom, socket]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeRoom || !socket) return;

        const msgPayload = {
            projectId: activeRoom._id,
            text: newMessage
        };

        socket.emit('chat:send_message', msgPayload);

        // Optimistic UI update
        const optimisticMsg = {
            _id: Date.now().toString(),
            projectRef: activeRoom._id,
            senderType: 'User', // Simplified
            senderRef: { _id: 'me', name: 'You' },
            text: newMessage,
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);

        setNewMessage('');
    };

    const sidebarVariants = {
        hidden: { x: -20, opacity: 0 },
        show: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24, staggerChildren: 0.1 } }
    };

    const roomVariants = {
        hidden: { x: -20, opacity: 0 },
        show: { x: 0, opacity: 1 }
    };

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
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Chat Area */}
            {activeRoom ? (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'hsla(230, 25%, 12%, 0.6)' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <Hash size={20} color="var(--primary)" /> {activeRoom.title}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Secure Team Communication</p>
                        </div>
                    </div>

                    <div className="messages-area scrollbar-custom" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-gradient)' }}>
                        {messages.length === 0 ? (
                            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <MessagePlaceholder />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : messages.map(msg => {
                            const isMe = msg.senderRef?._id === 'me' || (msg.senderRef && !msg.senderRef.email); // very basic "me" check for optimistic UI
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={msg._id}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: isMe ? 'flex-end' : 'flex-start',
                                        maxWidth: '75%',
                                        alignSelf: isMe ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                                        {msg.senderRef?.name || 'Unknown'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div style={{
                                        padding: '0.8rem 1.2rem',
                                        borderRadius: '16px',
                                        background: isMe ? 'linear-gradient(135deg, var(--primary), hsl(240, 80%, 60%))' : 'var(--card-bg)',
                                        color: '#fff',
                                        border: isMe ? 'none' : '1px solid var(--glass-border)',
                                        borderBottomRightRadius: isMe ? '4px' : '16px',
                                        borderBottomLeftRadius: isMe ? '16px' : '4px',
                                        wordBreak: 'break-word',
                                        boxShadow: isMe ? '0 4px 15px var(--primary-glow)' : '0 4px 15px rgba(0,0,0,0.2)'
                                    }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'hsla(230, 25%, 10%, 0.8)', backdropFilter: 'blur(10px)' }}>
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', transition: 'border-color 0.2s', ':focus-within': { borderColor: 'var(--primary)' } }}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '0.5rem', outline: 'none' }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <motion.button whileHover={{ scale: 1.1, color: 'var(--primary)' }} type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}><File size={18} /></motion.button>
                                    <motion.button whileHover={{ scale: 1.1, color: 'var(--secondary)' }} type="button" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}><ImageIcon size={18} /></motion.button>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit" disabled={!newMessage.trim()} style={{
                                    background: newMessage.trim() ? 'var(--primary)' : 'var(--glass-border)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '16px',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: newMessage.trim() ? 'pointer' : 'default',
                                    transition: 'background 0.2s',
                                    boxShadow: newMessage.trim() ? '0 0 15px var(--primary-glow)' : 'none'
                                }}>
                                <Send size={20} />
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
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

const MessagePlaceholder = () => <div style={{ opacity: 0.2, margin: '0 auto 1rem', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)' }}></div>;
const MessageSquarePlaceholder = () => <div style={{ opacity: 0.2, margin: '0 auto 1rem', width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)' }}></div>;

export default ChatInterface;
