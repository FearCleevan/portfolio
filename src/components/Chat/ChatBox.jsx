import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import styles from './ChatBox.module.css';
import profileImage from '../../assets/profile.png';

const ChatBox = ({ onClose, isDarkMode }) => {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: "Hi there! 👋 I'm your AI assistant. How can I help you today?", 
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            const aiResponse = await getAIResponse([...messages, userMessage]);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'bot',
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('AI API error:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I encountered an error. Please try again later.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getAIResponse = async (messageHistory) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const lastMessage = messageHistory[messageHistory.length - 1].text.toLowerCase();
                
                if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
                    resolve("Hello! How can I assist you today?");
                } else if (lastMessage.includes('help')) {
                    resolve("I'm here to help! What do you need assistance with?");
                } else if (lastMessage.includes('website')) {
                    resolve("This website is built with React. Would you like to know more about its features?");
                } else if (lastMessage.includes('thank')) {
                    resolve("You're welcome! Is there anything else I can help with?");
                } else {
                    const responses = [
                        "I understand you're asking about: " + lastMessage + ". Can you elaborate?",
                        "That's an interesting point. What specifically would you like to know?",
                        "I'd be happy to help with that. Could you provide more details?",
                        "Thanks for sharing that. How can I assist you further with this topic?"
                    ];
                    resolve(responses[Math.floor(Math.random() * responses.length)]);
                }
            }, 1000);
        });
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={`${styles.chatBox} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={`${styles.chatHeader} ${isDarkMode ? styles.darkHeader : ''}`}>
                <div className={styles.headerContent}>
                    <div className={styles.profileImage}>
                        <img src={profileImage} alt="AI Assistant" />
                    </div>
                    <div className={styles.headerText}>
                        <h3>AI Assistant</h3>
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
                {messages.map(message => (
                    <div 
                        key={message.id} 
                        className={`${styles.message} ${
                            message.sender === 'bot' 
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
                            {message.text}
                            {message.sender === 'bot' && isLoading && message.id === messages[messages.length - 1]?.id && (
                                <span className={styles.typingIndicator}>
                                    <span>.</span><span>.</span><span>.</span>
                                </span>
                            )}
                        </div>
                        <div className={`${styles.messageTime} ${isDarkMode ? styles.darkTime : ''}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <form className={`${styles.messageForm} ${isDarkMode ? styles.darkForm : ''}`} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`${styles.messageInput} ${isDarkMode ? styles.darkInput : ''}`}
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    className={`${styles.sendButton} ${isDarkMode ? styles.darkSendButton : ''}`}
                    disabled={!newMessage.trim() || isLoading}
                >
                    {isLoading ? (
                        <div className={styles.spinner}></div>
                    ) : (
                        <FiSend className={styles.sendIcon} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChatBox;