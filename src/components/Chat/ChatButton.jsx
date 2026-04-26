import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import ChatBox from './ChatBox';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [portal, setPortal] = useState(null);

  useEffect(() => {
    const el = document.createElement('div');
    el.id = 'chat-portal';
    document.body.appendChild(el);
    setPortal(el);
    return () => document.body.removeChild(el);
  }, []);

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Chat with Peter'}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 shadow-lg transition-all duration-200 font-medium text-sm border
          ${isOpen
            ? 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-400 dark:border-gray-500'
            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 border-gray-900 dark:border-white'
          }`}
      >
        {isOpen
          ? <FiX className="w-4 h-4 shrink-0" />
          : <FiMessageSquare className="w-4 h-4 shrink-0" />
        }
        {!isOpen && <span>Chat with Peter</span>}
      </button>

      {/* Chat panel rendered into portal */}
      {isOpen && portal && createPortal(
        <ChatBox onClose={() => setIsOpen(false)} />,
        portal
      )}
    </>
  );
}