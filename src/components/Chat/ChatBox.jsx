import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiAward, FiBriefcase, FiCalendar, FiCode, FiMail, FiMessageCircle, FiSend, FiUser } from 'react-icons/fi';
import styles from './ChatBox.module.css';
import profileImage from '../../assets/profile.png';
import { aiService } from '../../services/aiService';

import { usePersonalDetails } from '../../firebase/hooks/usePersonalDetails';
import { useProjects } from '../../firebase/hooks/useProjects';
import { useExperience } from '../../firebase/hooks/useExperience';
import { useTechStack } from '../../firebase/hooks/useTechStack';
import { useCertifications } from '../../firebase/hooks/useCertifications';
import { useBlogPosts } from '../../firebase/hooks/useBlogPosts';
import { useAboutContent } from '../../firebase/hooks/useFirestore';

const INITIAL_MESSAGE = {
    id: 'intro',
    text: "Hi! I'm Peter's AI assistant. Ask me about his credentials, projects, experience, or request code examples in any popular language.",
    sender: 'bot',
    timestamp: new Date(),
    type: 'text'
};

const ChatBox = ({ onClose, isDarkMode }) => {
    const { personalDetails, loading: personalLoading } = usePersonalDetails();
    const { projects, loading: projectsLoading } = useProjects();
    const { experience, loading: experienceLoading } = useExperience();
    const { techStack, loading: techStackLoading } = useTechStack();
    const { certifications, loading: certsLoading } = useCertifications();
    const { blogPosts, loading: blogLoading } = useBlogPosts();
    const { aboutContent, loading: aboutLoading } = useAboutContent();

    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSchedulingMeeting, setIsSchedulingMeeting] = useState(false);
    const [meetingForm, setMeetingForm] = useState({
        name: '',
        email: '',
        purpose: '',
        preferredTime: '',
        notes: ''
    });
    const [apiStatus, setApiStatus] = useState('checking');

    const messagesEndRef = useRef(null);
    const isDataLoading = personalLoading || projectsLoading || experienceLoading || techStackLoading || certsLoading || blogLoading || aboutLoading;

    const userData = useMemo(() => ({
        personalDetails,
        projects: projects || [],
        experience: experience || [],
        techStack: techStack || [],
        certifications: certifications || [],
        blogPosts: blogPosts || [],
        aboutContent: aboutContent || []
    }), [personalDetails, projects, experience, techStack, certifications, blogPosts, aboutContent]);

    const renderMessageWithCodeBlocks = (text) => {
        const parts = String(text).split(/```([\w+-]*)\n?([\s\S]*?)```/g);
        if (parts.length === 1) {
            return <span>{text}</span>;
        }

        const rendered = [];
        for (let i = 0; i < parts.length; i += 3) {
            const plain = parts[i];
            if (plain) {
                rendered.push(<span key={`plain-${i}`}>{plain}</span>);
            }

            const language = parts[i + 1];
            const code = parts[i + 2];
            if (typeof code === 'string') {
                rendered.push(
                    <div key={`code-${i}`} className={styles.codeBlockWrap}>
                        <div className={styles.codeLang}>{language || 'text'}</div>
                        <pre className={styles.codeBlock}><code>{code.trim()}</code></pre>
                    </div>
                );
            }
        }

        return rendered;
    };

    const testAPIConnection = useCallback(async () => {
        try {
            setApiStatus('checking');
            const response = await aiService.sendMessage('hello', userData);
            if (response) {
                setApiStatus('available');
            } else {
                setApiStatus('unavailable');
            }
        } catch {
            setApiStatus('unavailable');
        }
    }, [userData]);

    useEffect(() => {
        testAPIConnection();
    }, [testAPIConnection]);

    const sendUserMessage = useCallback(async (text) => {
        if (!text.trim() || isLoading) return;

        const idBase = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const userMessage = {
            id: `u-${idBase}`,
            text,
            sender: 'user',
            timestamp: new Date(),
            type: 'text'
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const aiResponse = await aiService.sendMessage(text, userData);

            if (aiService.hasMeetingIntent(text.toLowerCase())) {
                setIsSchedulingMeeting(true);
            }

            setMessages((prev) => [...prev, {
                id: `b-${idBase}`,
                text: aiResponse,
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);

            setApiStatus('available');
        } catch {
            setMessages((prev) => [...prev, {
                id: `b-${idBase}`,
                text: 'I could not reach the model right now. I can still help using cached portfolio context. Please try again.',
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);
            setApiStatus('unavailable');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, userData]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const messageToSend = newMessage;
        setNewMessage('');
        await sendUserMessage(messageToSend);
    };

    const handleMeetingSubmit = async (e) => {
        e.preventDefault();

        if (!meetingForm.name || !meetingForm.email || !meetingForm.purpose || !meetingForm.preferredTime) {
            setMessages((prev) => [...prev, {
                id: `bot-validate-${Date.now()}`,
                text: 'Please fill in Name, Email, Purpose, and Preferred Time.',
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);
            return;
        }

        const summary = `Meeting Request Submitted:\n\nName: ${meetingForm.name}\nEmail: ${meetingForm.email}\nPurpose: ${meetingForm.purpose}\nPreferred Time: ${meetingForm.preferredTime}\nNotes: ${meetingForm.notes || 'None'}`;

        setMessages((prev) => [...prev, {
            id: `meeting-${Date.now()}`,
            text: summary,
            sender: 'user',
            timestamp: new Date(),
            type: 'meeting'
        }]);

        const contactEmail = personalDetails?.email || 'fearcleevan123@gmail.com';

        setMessages((prev) => [...prev, {
            id: `meeting-confirm-${Date.now()}`,
            text: `Thanks ${meetingForm.name}. Your request is noted. Peter can follow up at ${meetingForm.email}. Direct contact: ${contactEmail}`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
        }]);

        setMeetingForm({ name: '', email: '', purpose: '', preferredTime: '', notes: '' });
        setIsSchedulingMeeting(false);
    };

    const quickActions = useMemo(() => {
        const actions = [];
        if ((techStack || []).length) {
            actions.push({ label: 'Technical Skills', message: "What are Peter's technical skills and expertise?", icon: <FiCode /> });
        }
        if ((projects || []).length) {
            actions.push({ label: 'Projects', message: "Can you show me Peter's projects and stack?", icon: <FiBriefcase /> });
        }
        if ((experience || []).length) {
            actions.push({ label: 'Experience', message: "What is Peter's professional experience?", icon: <FiUser /> });
        }
        if ((certifications || []).length) {
            actions.push({ label: 'Certifications', message: 'What certifications does Peter have?', icon: <FiAward /> });
        }
        if (!actions.length) {
            actions.push({ label: 'Book Meeting', message: "I'd like to schedule a meeting with Peter", icon: <FiCalendar /> });
            actions.push({ label: 'Blog', message: 'What blog posts has Peter written?', icon: <FiMessageCircle /> });
        }
        return actions.slice(0, 4);
    }, [techStack, projects, experience, certifications]);

    const handleQuickAction = (message) => {
        sendUserMessage(message);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isDataLoading && messages.length === 1) {
        return (
            <div className={`${styles.chatBox} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={`${styles.chatHeader} ${isDarkMode ? styles.darkHeader : ''}`}>
                    <div className={styles.headerContent}>
                        <div className={styles.profileImage}><img src={profileImage} alt="AI Assistant" /></div>
                        <div className={styles.headerText}><h3>Peter's AI Assistant</h3><div className={styles.status}><span className={styles.statusIndicator}></span><span>Preparing context...</span></div></div>
                    </div>
                    <button onClick={onClose} className={`${styles.closeButton} ${isDarkMode ? styles.darkCloseButton : ''}`}>×</button>
                </div>
                <div className={`${styles.messagesContainer} ${isDarkMode ? styles.darkMessages : ''}`}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading portfolio context...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.chatBox} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={`${styles.chatHeader} ${isDarkMode ? styles.darkHeader : ''}`}>
                <div className={styles.headerContent}>
                    <div className={styles.profileImage}><img src={profileImage} alt="AI Assistant" /></div>
                    <div className={styles.headerText}>
                        <h3>Peter's AI Assistant</h3>
                        <div className={styles.status}>
                            <span className={`${styles.statusIndicator} ${apiStatus === 'available' ? styles.statusOnline : apiStatus === 'unavailable' ? styles.statusOffline : styles.statusChecking}`}></span>
                            <span>{apiStatus === 'available' ? 'AI Ready' : apiStatus === 'unavailable' ? 'Limited Mode' : 'Checking AI...'}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className={`${styles.closeButton} ${isDarkMode ? styles.darkCloseButton : ''}`} aria-label="Close chat">×</button>
            </div>

            <div className={`${styles.messagesContainer} ${isDarkMode ? styles.darkMessages : ''}`}>
                {apiStatus === 'unavailable' && (
                    <div className={styles.apiWarning}><span>AI endpoint is unavailable. Responses may be reduced.</span></div>
                )}

                {messages.length <= 2 && !isDataLoading && quickActions.length > 0 && (
                    <div className={styles.quickActions}>
                        <p>Quick prompts</p>
                        <div className={styles.quickActionsGrid}>
                            {quickActions.map((action, index) => (
                                <button key={`${action.label}-${index}`} className={`${styles.quickActionBtn} ${isDarkMode ? styles.darkQuickAction : ''}`} onClick={() => handleQuickAction(action.message)} disabled={isLoading}>
                                    <span className={styles.actionIcon}>{action.icon}</span>
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${message.sender === 'bot' ? `${styles.botMessage} ${isDarkMode ? styles.darkBotMessage : ''}` : `${styles.userMessage} ${isDarkMode ? styles.darkUserMessage : ''}`}`}
                    >
                        {message.sender === 'bot' && (
                            <div className={styles.messageHeader}>
                                <img src={profileImage} alt="AI Assistant" className={styles.messageAvatar} />
                                <span className={`${styles.messageSender} ${isDarkMode ? styles.darkSender : ''}`}>AI Assistant</span>
                            </div>
                        )}
                        <div className={`${styles.messageContent} ${isDarkMode ? styles.darkContent : ''}`}>
                            {message.type === 'meeting' ? (
                                <div className={styles.meetingSummary}>
                                    <h4>Meeting Request Submitted</h4>
                                    <div className={styles.meetingDetails}>
                                        <p><strong>Name:</strong> {message.text.split('\n')[2]?.split(': ')[1]}</p>
                                        <p><strong>Email:</strong> {message.text.split('\n')[3]?.split(': ')[1]}</p>
                                        <p><strong>Purpose:</strong> {message.text.split('\n')[4]?.split(': ')[1]}</p>
                                        <p><strong>Preferred Time:</strong> {message.text.split('\n')[5]?.split(': ')[1]}</p>
                                    </div>
                                </div>
                            ) : (
                                renderMessageWithCodeBlocks(message.text)
                            )}
                        </div>
                        <div className={`${styles.messageTime} ${isDarkMode ? styles.darkTime : ''}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {isSchedulingMeeting && (
                <div className={`${styles.meetingForm} ${isDarkMode ? styles.darkMeetingForm : ''}`}>
                    <h4>Schedule a Meeting with Peter</h4>
                    <form onSubmit={handleMeetingSubmit}>
                        <div className={styles.formGroup}><FiUser className={styles.formIcon} /><input type="text" placeholder="Your Full Name *" value={meetingForm.name} onChange={(e) => setMeetingForm((prev) => ({ ...prev, name: e.target.value }))} required className={isDarkMode ? styles.darkInput : ''} disabled={isLoading} /></div>
                        <div className={styles.formGroup}><FiMail className={styles.formIcon} /><input type="email" placeholder="Your Email *" value={meetingForm.email} onChange={(e) => setMeetingForm((prev) => ({ ...prev, email: e.target.value }))} required className={isDarkMode ? styles.darkInput : ''} disabled={isLoading} /></div>
                        <div className={styles.formGroup}><FiCalendar className={styles.formIcon} /><select value={meetingForm.purpose} onChange={(e) => setMeetingForm((prev) => ({ ...prev, purpose: e.target.value }))} required className={isDarkMode ? styles.darkInput : ''} disabled={isLoading}><option value="">Meeting Purpose *</option><option value="Project Discussion">Project Discussion</option><option value="Job Opportunity">Job Opportunity</option><option value="Technical Consultation">Technical Consultation</option><option value="Partnership">Partnership</option><option value="Other">Other</option></select></div>
                        <div className={styles.formGroup}><input type="text" placeholder="Preferred Date/Time *" value={meetingForm.preferredTime} onChange={(e) => setMeetingForm((prev) => ({ ...prev, preferredTime: e.target.value }))} required className={isDarkMode ? styles.darkInput : ''} disabled={isLoading} /></div>
                        <div className={styles.formGroup}><textarea placeholder="Additional notes..." value={meetingForm.notes} onChange={(e) => setMeetingForm((prev) => ({ ...prev, notes: e.target.value }))} rows="3" className={isDarkMode ? styles.darkInput : ''} disabled={isLoading} /></div>
                        <div className={styles.formActions}><button type="button" onClick={() => setIsSchedulingMeeting(false)} className={styles.cancelButton} disabled={isLoading}>Cancel</button><button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Submitting...' : 'Schedule Meeting'}</button></div>
                    </form>
                </div>
            )}

            {!isSchedulingMeeting && (
                <form className={`${styles.messageForm} ${isDarkMode ? styles.darkForm : ''}`} onSubmit={handleSendMessage}>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask about credentials, projects, code examples, or book a meeting..." className={`${styles.messageInput} ${isDarkMode ? styles.darkInput : ''}`} disabled={isLoading || isDataLoading} />
                    <button type="submit" className={`${styles.sendButton} ${isDarkMode ? styles.darkSendButton : ''}`} disabled={!newMessage.trim() || isLoading || isDataLoading} title="Send message">
                        {isLoading ? <div className={styles.spinner}></div> : <FiSend className={styles.sendIcon} />}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChatBox;
