import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCalendar, FiUser, FiMail, FiBriefcase, FiCode, FiAward, FiMessageCircle } from 'react-icons/fi';
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
    const [apiStatus, setApiStatus] = useState('checking'); // checking, available, unavailable
    const messagesEndRef = useRef(null);

    // Combine all loading states
    const isDataLoading = personalLoading || projectsLoading || experienceLoading ||
        techStackLoading || certsLoading || blogLoading || aboutLoading;

    // Prepare user data for AI context
    // In your ChatBox component
    const getUserData = () => {
        if (isDataLoading) return null;

        // Log raw data for debugging
        console.log('Raw Firebase Data:', {
            personalDetails,
            projects,
            experience,
            techStack,
            certifications,
            blogPosts,
            aboutContent
        });

        return {
            personalDetails,
            projects: projects || [],
            experience: experience || [],
            techStack: techStack || [],
            certifications: certifications || [],
            blogPosts: blogPosts || [],
            aboutContent: aboutContent || [],
            lastUpdated: new Date().toISOString()
        };
    };

    // Test API connection on component mount
    useEffect(() => {
        testAPIConnection();
    }, []);

    const testAPIConnection = async () => {
        try {
            setApiStatus('checking');
            // Send a test message to check API connectivity
            const testResponse = await aiService.sendMessage('Hello', getUserData());
            if (testResponse && !testResponse.includes('configuration error')) {
                setApiStatus('available');
            } else {
                setApiStatus('unavailable');
            }
        } catch (error) {
            console.error('API connection test failed:', error);
            setApiStatus('unavailable');
        }
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
            console.log('Sending message with user data');

            // Use the real Gemini AI service with Firebase data
            const aiResponse = await aiService.sendMessage(newMessage, userData);

            // Check if the response suggests meeting scheduling
            if (aiService.hasMeetingIntent(newMessage.toLowerCase())) {
                setIsSchedulingMeeting(true);
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);

            // Update API status if successful
            if (apiStatus !== 'available') {
                setApiStatus('available');
            }

        } catch (error) {
            console.error('AI API error:', error);

            let errorMessage = "I apologize, but I'm having trouble connecting to the AI service right now. ";

            if (error.message.includes('API key') || error.message.includes('quota') || error.message.includes('403')) {
                errorMessage += "There seems to be an issue with the service configuration or quota.";
                setApiStatus('unavailable');
            } else if (error.message.includes('Rate limit') || error.message.includes('429')) {
                errorMessage += "The service is currently busy. Please try again in a moment.";
            } else if (error.message.includes('Model not found') || error.message.includes('404')) {
                errorMessage += "The AI model is currently unavailable.";
                setApiStatus('unavailable');
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

        // Validate form
        if (!meetingForm.name || !meetingForm.email || !meetingForm.purpose || !meetingForm.preferredTime) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: "Please fill in all required fields (Name, Email, Purpose, and Preferred Time) to schedule the meeting.",
                sender: 'bot',
                timestamp: new Date(),
                type: 'text'
            }]);
            return;
        }

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
            const userEmail = userData?.personalDetails?.email || 'peter@example.com';
            const userName = userData?.personalDetails?.name || 'Peter';

            const confirmationMessage = `✅ Thank you ${meetingForm.name}! Your meeting request has been received. ${userName} will contact you at ${meetingForm.email} within 24 hours to confirm the schedule. \n\nYou can also reach out directly at: ${userEmail}`;

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
                text: "There was an issue submitting your meeting request. Please try again or contact Peter directly via email.",
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
                icon: <FiMessageCircle />
            });
        }

        return actions.slice(0, 4); // Limit to 4 actions
    };

    const handleQuickAction = (message) => {
        setNewMessage(message);
        // Auto-send the quick action message after a short delay
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => { } };
            handleSendMessage(fakeEvent);
        }, 100);
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

    // Show loading state while data is being fetched
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
                            <span className={`${styles.statusIndicator} ${apiStatus === 'available' ? styles.statusOnline :
                                    apiStatus === 'unavailable' ? styles.statusOffline :
                                        styles.statusChecking
                                }`}></span>
                            <span>
                                {apiStatus === 'available' ? 'AI Online' :
                                    apiStatus === 'unavailable' ? 'AI Offline' :
                                        'Checking AI...'}
                            </span>
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

                {/* API Status Warning */}
                {apiStatus === 'unavailable' && (
                    <div className={styles.apiWarning}>
                        <span>⚠️ AI service is currently offline. Using basic responses.</span>
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
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about skills, projects, experience, or book a meeting..."
                        className={`${styles.messageInput} ${isDarkMode ? styles.darkInput : ''}`}
                        disabled={isLoading || isDataLoading}
                    />
                    <button
                        type="submit"
                        className={`${styles.sendButton} ${isDarkMode ? styles.darkSendButton : ''} ${apiStatus === 'unavailable' ? styles.sendButtonDisabled : ''
                            }`}
                        disabled={!newMessage.trim() || isLoading || isDataLoading || apiStatus === 'unavailable'}
                        title={apiStatus === 'unavailable' ? 'AI service is currently unavailable' : 'Send message'}
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