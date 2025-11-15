import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCalendar, FiUser, FiMail, FiBriefcase, FiCode, FiAward } from 'react-icons/fi';
import styles from './ChatBox.module.css';
import profileImage from '../../assets/profile.png';
import { aiService } from '../../services/aiService';

// Import all Firebase hooks
import { usePersonalDetails } from '../../firebase/hooks/usePersonalDetails';
import { useProjects } from '../../firebase/hooks/useProjects';
import { useExperience } from '../../firebase/hooks/useExperience';
import { useTechStack } from '../../firebase/hooks/useTechStack';
import { useCertifications } from '../../firebase/hooks/useCertifications';
import { useBlogPosts } from '../../firebase/hooks/useBlogPosts';
import { useAboutContent } from '../../firebase/hooks/useFirestore';

const ChatBox = ({ onClose, isDarkMode }) => {
    // Use all Firebase hooks to get real data
    const { personalDetails, loading: personalLoading } = usePersonalDetails();
    const { projects, loading: projectsLoading } = useProjects();
    const { experience, loading: experienceLoading } = useExperience();
    const { techStack, loading: techStackLoading } = useTechStack();
    const { certifications, loading: certsLoading } = useCertifications();
    const { blogPosts, loading: blogLoading } = useBlogPosts();
    const { aboutContent, loading: aboutLoading } = useAboutContent();

    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: "Hi there! 👋 I'm Peter's AI assistant. I have access to all his portfolio data and can help you learn about his skills, projects, experience, and schedule meetings. What would you like to know?", 
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
        }
    ]);
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
    const messagesEndRef = useRef(null);

    // Combine all loading states
    const isDataLoading = personalLoading || projectsLoading || experienceLoading || 
                         techStackLoading || certsLoading || blogLoading || aboutLoading;

    // Prepare user data for AI context
    const getUserData = () => {
        if (isDataLoading) return null;
        
        return {
            personalDetails,
            projects,
            experience,
            techStack,
            certifications,
            blogPosts,
            aboutContent,
            lastUpdated: new Date().toISOString()
        };
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date(),
            type: 'text'
        };
        
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            // Get current user data from Firebase
            const userData = getUserData();
            console.log('Sending message with user data:', userData);

            // Use the real Gemini AI service with Firebase data
            const aiResponse = await aiService.sendMessage(newMessage, userData);
            
            // Check if the response suggests meeting scheduling
            if (aiService.hasMeetingIntent(newMessage)) {
                setIsSchedulingMeeting(true);
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);
        } catch (error) {
            console.error('AI API error:', error);
            
            // More user-friendly error messages
            let errorMessage = "I apologize, but I'm having trouble connecting to the AI service right now. ";
            
            if (error.message.includes('API key')) {
                errorMessage += "There seems to be an issue with the service configuration.";
            } else if (error.message.includes('quota')) {
                errorMessage += "The AI service is currently at capacity. Please try again later.";
            } else {
                errorMessage += "Please try again in a moment or check the other portfolio sections for information.";
            }
            
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: errorMessage,
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMeetingSubmit = async (e) => {
        e.preventDefault();
        
        const meetingMessage = {
            id: Date.now(),
            text: `Meeting Request Submitted:\n\nName: ${meetingForm.name}\nEmail: ${meetingForm.email}\nPurpose: ${meetingForm.purpose}\nPreferred Time: ${meetingForm.preferredTime}\nNotes: ${meetingForm.notes || 'None'}`,
            sender: 'user',
            timestamp: new Date(),
            type: 'meeting'
        };

        setMessages(prev => [...prev, meetingMessage]);
        setIsLoading(true);

        try {
            // Get user data for personalized response
            const userData = getUserData();
            const userEmail = userData?.personalDetails?.email || 'his contact email';
            
            const confirmationMessage = `✅ Meeting request received! Peter will contact you at ${meetingForm.email} within 24 hours to confirm the schedule. \n\nYou can also reach out directly at: ${userEmail}`;
            
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: confirmationMessage,
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);

            // Here you would typically send this data to your backend
            console.log('Meeting scheduled details:', meetingForm);
            console.log('User data context:', userData);
            
            // Reset form and state
            setMeetingForm({
                name: '',
                email: '',
                purpose: '',
                preferredTime: '',
                notes: ''
            });
            setIsSchedulingMeeting(false);
            
        } catch (error) {
            console.error('Meeting scheduling error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "There was an issue submitting your meeting request. Please try again or contact Peter directly.",
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate dynamic quick actions based on available data
    const getQuickActions = () => {
        const actions = [];
        
        if (techStack && techStack.length > 0) {
            actions.push({
                label: "💻 Technical Skills",
                message: "What are Peter's technical skills and expertise?",
                icon: <FiCode />
            });
        }
        
        if (projects && projects.length > 0) {
            actions.push({
                label: "🚀 Projects",
                message: "Can you show me some of Peter's projects?",
                icon: <FiBriefcase />
            });
        }
        
        actions.push({
            label: "📅 Book Meeting",
            message: "I'd like to schedule a meeting with Peter",
            icon: <FiCalendar />
        });
        
        if (experience && experience.length > 0) {
            actions.push({
                label: "👨‍💻 Experience",
                message: "What is Peter's professional experience?",
                icon: <FiUser />
            });
        }
        
        if (certifications && certifications.length > 0) {
            actions.push({
                label: "🏆 Certifications",
                message: "What certifications does Peter have?",
                icon: <FiAward />
            });
        }

        if (blogPosts && blogPosts.length > 0) {
            actions.push({
                label: "📝 Blog Posts",
                message: "What blog posts has Peter written?",
                icon: <FiAward />
            });
        }

        return actions.slice(0, 4); // Limit to 4 actions
    };

    const handleQuickAction = (message) => {
        setNewMessage(message);
        // Auto-send the quick action message
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            handleSendMessage(fakeEvent);
        }, 100);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Show loading state while data is being fetched - ALL HOOKS LOADING STATES ARE USED
    if (isDataLoading && messages.length === 1) {
        return (
            <div className={`${styles.chatBox} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={`${styles.chatHeader} ${isDarkMode ? styles.darkHeader : ''}`}>
                    <div className={styles.headerContent}>
                        <div className={styles.profileImage}>
                            <img src={profileImage} alt="AI Assistant" />
                        </div>
                        <div className={styles.headerText}>
                            <h3>Peter's AI Assistant</h3>
                            <div className={styles.status}>
                                <span className={styles.statusIndicator}></span>
                                <span>Loading data...</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className={`${styles.closeButton} ${isDarkMode ? styles.darkCloseButton : ''}`}>
                        &times;
                    </button>
                </div>
                <div className={`${styles.messagesContainer} ${isDarkMode ? styles.darkMessages : ''}`}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading portfolio data from Firebase...</p>
                    </div>
                </div>
            </div>
        );
    }

    const quickActions = getQuickActions();

    return (
        <div className={`${styles.chatBox} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={`${styles.chatHeader} ${isDarkMode ? styles.darkHeader : ''}`}>
                <div className={styles.headerContent}>
                    <div className={styles.profileImage}>
                        <img src={profileImage} alt="AI Assistant" />
                    </div>
                    <div className={styles.headerText}>
                        <h3>Peter's AI Assistant</h3>
                        <div className={styles.status}>
                            <span className={styles.statusIndicator}></span>
                            <span>{isLoading ? 'Typing...' : 'Online'}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className={`${styles.closeButton} ${isDarkMode ? styles.darkCloseButton : ''}`} aria-label="Close chat">
                    &times;
                </button>
            </div>

            <div className={`${styles.messagesContainer} ${isDarkMode ? styles.darkMessages : ''}`}>
                {/* Data Status Indicator */}
                {!isDataLoading && (
                    <div className={styles.dataStatus}>
                        <span className={styles.dataIndicator}></span>
                        <span>Connected to Firebase • {new Date().toLocaleTimeString()}</span>
                    </div>
                )}

                {/* Quick Actions */}
                {messages.length <= 2 && !isDataLoading && quickActions.length > 0 && (
                    <div className={styles.quickActions}>
                        <p>Quick questions based on Peter's portfolio:</p>
                        <div className={styles.quickActionsGrid}>
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className={`${styles.quickActionBtn} ${isDarkMode ? styles.darkQuickAction : ''}`}
                                    onClick={() => handleQuickAction(action.message)}
                                    disabled={isLoading}
                                >
                                    <span className={styles.actionIcon}>{action.icon}</span>
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`${styles.message} ${message.sender === 'bot'
                                ? `${styles.botMessage} ${isDarkMode ? styles.darkBotMessage : ''}`
                                : `${styles.userMessage} ${isDarkMode ? styles.darkUserMessage : ''}`
                            }`}
                    >
                        {message.sender === 'bot' && (
                            <div className={styles.messageHeader}>
                                <img src={profileImage} alt="AI Assistant" className={styles.messageAvatar} />
                                <span className={`${styles.messageSender} ${isDarkMode ? styles.darkSender : ''}`}>
                                    AI Assistant
                                </span>
                            </div>
                        )}
                        <div className={`${styles.messageContent} ${isDarkMode ? styles.darkContent : ''}`}>
                            {message.type === 'meeting' ? (
                                <div className={styles.meetingSummary}>
                                    <h4>📅 Meeting Request Submitted</h4>
                                    <div className={styles.meetingDetails}>
                                        <p><strong>Name:</strong> {message.text.split('\n')[2]?.split(': ')[1]}</p>
                                        <p><strong>Email:</strong> {message.text.split('\n')[3]?.split(': ')[1]}</p>
                                        <p><strong>Purpose:</strong> {message.text.split('\n')[4]?.split(': ')[1]}</p>
                                        <p><strong>Preferred Time:</strong> {message.text.split('\n')[5]?.split(': ')[1]}</p>
                                        {message.text.split('\n')[6] && message.text.split('\n')[6].includes('Notes:') && (
                                            <p><strong>Notes:</strong> {message.text.split('\n')[6]?.split(': ')[1]}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {message.text}
                                    {message.sender === 'bot' && isLoading && message.id === messages[messages.length - 1]?.id && (
                                        <span className={styles.typingIndicator}>
                                            <span>.</span><span>.</span><span>.</span>
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                        <div className={`${styles.messageTime} ${isDarkMode ? styles.darkTime : ''}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Meeting Scheduling Form */}
            {isSchedulingMeeting && (
                <div className={`${styles.meetingForm} ${isDarkMode ? styles.darkMeetingForm : ''}`}>
                    <h4>📅 Schedule a Meeting with Peter</h4>
                    <form onSubmit={handleMeetingSubmit}>
                        <div className={styles.formGroup}>
                            <FiUser className={styles.formIcon} />
                            <input
                                type="text"
                                placeholder="Your Full Name *"
                                value={meetingForm.name}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, name: e.target.value }))}
                                required
                                className={isDarkMode ? styles.darkInput : ''}
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <FiMail className={styles.formIcon} />
                            <input
                                type="email"
                                placeholder="Your Email *"
                                value={meetingForm.email}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, email: e.target.value }))}
                                required
                                className={isDarkMode ? styles.darkInput : ''}
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <FiCalendar className={styles.formIcon} />
                            <select
                                value={meetingForm.purpose}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, purpose: e.target.value }))}
                                required
                                className={isDarkMode ? styles.darkInput : ''}
                                disabled={isLoading}
                            >
                                <option value="">Meeting Purpose *</option>
                                <option value="Project Discussion">Project Discussion</option>
                                <option value="Job Opportunity">Job Opportunity</option>
                                <option value="Technical Consultation">Technical Consultation</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                placeholder="Preferred Date/Time (e.g., Next Monday 2 PM) *"
                                value={meetingForm.preferredTime}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                                required
                                className={isDarkMode ? styles.darkInput : ''}
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <textarea
                                placeholder="Additional notes or specific topics you'd like to discuss..."
                                value={meetingForm.notes}
                                onChange={(e) => setMeetingForm(prev => ({ ...prev, notes: e.target.value }))}
                                rows="3"
                                className={isDarkMode ? styles.darkInput : ''}
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={() => setIsSchedulingMeeting(false)}
                                className={styles.cancelButton}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Schedule Meeting'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Message Input Form */}
            {!isSchedulingMeeting && (
                <form className={`${styles.messageForm} ${isDarkMode ? styles.darkForm : ''}`} onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ask about skills, projects, experience, or book a meeting..."
                        className={`${styles.messageInput} ${isDarkMode ? styles.darkInput : ''}`}
                        disabled={isLoading || isDataLoading}
                    />
                    <button
                        type="submit"
                        className={`${styles.sendButton} ${isDarkMode ? styles.darkSendButton : ''}`}
                        disabled={!newMessage.trim() || isLoading || isDataLoading}
                    >
                        {isLoading ? (
                            <div className={styles.spinner}></div>
                        ) : (
                            <FiSend className={styles.sendIcon} />
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChatBox;