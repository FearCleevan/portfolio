import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ChatButton.module.css';
import { FaCommentDots } from 'react-icons/fa';
import ChatBox from './ChatBox';

const ChatButton = ({ isDarkMode }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [portalElement, setPortalElement] = useState(null);

    useEffect(() => {
        // Create portal element on mount
        const element = document.createElement('div');
        element.id = 'chat-portal';
        document.body.appendChild(element);
        setPortalElement(element);

        // Clean up on unmount
        return () => {
            document.body.removeChild(element);
        };
    }, []);

    return (
        <>
            {!isChatOpen && (
                <button
                    className={`${styles.chatButton} ${isDarkMode ? styles.dark : ''}`}
                    onClick={() => setIsChatOpen(true)}
                    aria-label="Chat with Peter"
                >
                    <FaCommentDots className={styles.chatIcon} />
                    <span className={styles.chatText}>Chat with Peter</span>
                </button>
            )}
            
            {isChatOpen && portalElement && createPortal(
                <div className={styles.chatBoxContainer}>
                    <ChatBox onClose={() => setIsChatOpen(false)} isDarkMode={isDarkMode} />
                </div>,
                portalElement
            )}
        </>
    );
};

export default ChatButton;