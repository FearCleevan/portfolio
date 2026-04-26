import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiAward, FiBriefcase, FiCalendar, FiCheck, FiCode, FiCopy, FiMail, FiSend, FiUser, FiX } from 'react-icons/fi';
import profileImage from '../../assets/profile.png';
import { aiService } from '../../services/aiService';
import { trackChatOpen, trackMeetingClick, trackMeetingSubmit, trackQuickAction } from '../../services/analyticsService';
import { usePersonalDetails } from '../../hooks/usePersonalDetails';
import { useProjects } from '../../hooks/useProjects';
import { useExperience } from '../../hooks/useExperience';
import { useTechStack } from '../../hooks/useTechStack';
import { useCertifications } from '../../hooks/useCertifications';

const INITIAL_MESSAGE = {
  id: 'intro',
  text: "Hi! I'm Peter's AI assistant. Ask me about his credentials, projects, experience, or request code examples in any language.",
  sender: 'bot',
  timestamp: new Date(),
};

// Split AI response text on fenced code blocks and render them styled
function MessageContent({ text, copiedKey, onCopy }) {
  const parts = String(text || '').split(/```([\w+-]*)\n?([\s\S]*?)```/g);
  if (parts.length === 1) {
    return <span className="whitespace-pre-wrap break-words">{text}</span>;
  }

  const nodes = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) {
      nodes.push(<span key={`t-${i}`} className="whitespace-pre-wrap break-words">{parts[i]}</span>);
    }
    const lang = parts[i + 1];
    const code = parts[i + 2];
    if (typeof code === 'string') {
      const codeKey = `${lang}-${i}`;
      nodes.push(
        <div key={`c-${i}`} className="mt-2 overflow-hidden border border-gray-400 dark:border-gray-500">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 dark:bg-gray-950">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{lang || 'code'}</span>
            <button
              type="button"
              onClick={() => onCopy(code.trim(), codeKey)}
              aria-label="Copy code"
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors px-1.5 py-0.5"
            >
              {copiedKey === codeKey ? <FiCheck className="w-3 h-3" /> : <FiCopy className="w-3 h-3" />}
              {copiedKey === codeKey ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3 bg-gray-950 text-gray-200 text-[11px] overflow-x-auto leading-relaxed">
            <code>{code.trim()}</code>
          </pre>
        </div>
      );
    }
  }
  return <>{nodes}</>;
}

// Animated typing indicator
function TypingDots() {
  return (
    <div className="flex items-end gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: 'Tech Skills', message: "What are Peter's technical skills and expertise?", icon: FiCode },
  { label: 'Projects', message: "Tell me about Peter's projects.", icon: FiBriefcase },
  { label: 'Experience', message: "What is Peter's professional experience?", icon: FiUser },
  { label: 'Certifications', message: "What certifications does Peter have?", icon: FiAward },
];

export default function ChatBox({ onClose }) {
  const { personalDetails } = usePersonalDetails();
  const { projects } = useProjects();
  const { experience } = useExperience();
  const { techStack } = useTechStack();
  const { certifications } = useCertifications();

  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ name: '', email: '', purpose: '', preferredTime: '', notes: '' });
  const [meetingBusy, setMeetingBusy] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const showQuickActions = messages.length <= 1 && !isTyping;

  useEffect(() => {
    setApiStatus(aiService.isReady() ? 'available' : 'unavailable');
    trackChatOpen();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = useCallback(async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? '' : k)), 1800);
    } catch { /* clipboard blocked */ }
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;
    setInput('');

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setMessages((prev) => [...prev, { id: `u-${id}`, text, sender: 'user', timestamp: new Date() }]);
    setIsTyping(true);

    try {
      const reply = await aiService.sendMessage(text);
      setMessages((prev) => [...prev, { id: `b-${id}`, text: reply, sender: 'bot', timestamp: new Date() }]);
      setApiStatus('available');

      if (aiService.hasMeetingIntent?.(text.toLowerCase())) {
        setMeetingOpen(true);
        trackMeetingClick();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `b-${id}`, text: "Sorry, I couldn't reach the AI right now. Please try again in a moment.", sender: 'bot', timestamp: new Date() },
      ]);
      setApiStatus('unavailable');
    } finally {
      setIsTyping(false);
    }
  }, [isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuick = (action) => {
    trackQuickAction(action.label);
    sendMessage(action.message);
  };

  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    if (!meetingForm.name || !meetingForm.email || !meetingForm.purpose || !meetingForm.preferredTime) return;
    setMeetingBusy(true);

    const meetingId = `mtg-${Date.now()}`;
    trackMeetingSubmit(meetingForm.purpose);

    setMessages((prev) => [
      ...prev,
      {
        id: `mtg-${meetingId}`,
        sender: 'bot',
        type: 'meetingConfirm',
        data: { ...meetingForm },
        text: '',
        timestamp: new Date(),
      },
    ]);

    setMeetingForm({ name: '', email: '', purpose: '', preferredTime: '', notes: '' });
    setMeetingOpen(false);
    setMeetingBusy(false);
  };

  const statusColor = apiStatus === 'available' ? 'bg-emerald-400' : apiStatus === 'unavailable' ? 'bg-red-400' : 'bg-amber-400';
  const statusLabel = apiStatus === 'available' ? 'AI Ready' : apiStatus === 'unavailable' ? 'Limited Mode' : 'Connecting…';

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-2xl overflow-hidden"
      style={{ width: 'min(370px, calc(100vw - 24px))', height: 'min(560px, calc(100dvh - 100px))' }}
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Peter's AI Assistant"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 overflow-hidden">
            <img src={profileImage} alt="Peter" className="w-full h-full object-cover" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 rounded-full border-white dark:border-gray-900 z-10 ${statusColor}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none transition-colors duration-300">Peter's AI Assistant</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 transition-colors duration-300">{statusLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

        {/* Quick action chips — shown only before any user message */}
        {showQuickActions && (
          <div className="mb-1">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Quick prompts</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => handleQuick(a)}
                    disabled={isTyping}
                    className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors text-left disabled:opacity-50"
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} gap-1`}>
              {isBot && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <img src={profileImage} alt="AI" className="w-5 h-5 object-cover" />
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">AI Assistant</span>
                </div>
              )}

              <div
                className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${isBot
                  ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  }`}
              >
                {msg.type === 'meetingConfirm' ? (
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">Meeting Request Received ✓</p>
                    <p><span className="font-medium text-gray-500 dark:text-gray-400">Name:</span> {msg.data.name}</p>
                    <p><span className="font-medium text-gray-500 dark:text-gray-400">Email:</span> {msg.data.email}</p>
                    <p><span className="font-medium text-gray-500 dark:text-gray-400">Purpose:</span> {msg.data.purpose}</p>
                    <p><span className="font-medium text-gray-500 dark:text-gray-400">Time:</span> {msg.data.preferredTime}</p>
                    {msg.data.notes && <p><span className="font-medium text-gray-500 dark:text-gray-400">Notes:</span> {msg.data.notes}</p>}
                    <p className="text-[10px] text-gray-400 mt-2">Peter will follow up within 24–48h.</p>
                  </div>
                ) : (
                  <MessageContent text={msg.text} copiedKey={copiedKey} onCopy={handleCopy} />
                )}
              </div>

              <span className="text-[10px] text-gray-300 dark:text-gray-600 px-1">
                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <img src={profileImage} alt="AI" className="w-5 h-5 object-cover" />
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">AI Assistant</span>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3.5 py-2.5">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Meeting form panel ── */}
      {meetingOpen && (
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4 overflow-y-auto max-h-72 transition-colors duration-300">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300">Schedule a Meeting</p>
            <button type="button" onClick={() => setMeetingOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <FiX className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleMeetingSubmit} className="space-y-2">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text" placeholder="Your Full Name *" required
                value={meetingForm.name} onChange={(e) => setMeetingForm((f) => ({ ...f, name: e.target.value }))}
                disabled={meetingBusy}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="email" placeholder="Your Email *" required
                value={meetingForm.email} onChange={(e) => setMeetingForm((f) => ({ ...f, email: e.target.value }))}
                disabled={meetingBusy}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              />
            </div>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <select
                required value={meetingForm.purpose} onChange={(e) => setMeetingForm((f) => ({ ...f, purpose: e.target.value }))}
                disabled={meetingBusy}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
              >
                <option value="">Meeting Purpose *</option>
                <option>Project Discussion</option>
                <option>Job Opportunity</option>
                <option>Technical Consultation</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <input
              type="text" placeholder="Preferred Date/Time *" required
              value={meetingForm.preferredTime} onChange={(e) => setMeetingForm((f) => ({ ...f, preferredTime: e.target.value }))}
              disabled={meetingBusy}
              className="w-full px-3 py-2 text-sm border border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
            />
            <textarea
              placeholder="Additional notes…" rows={2}
              value={meetingForm.notes} onChange={(e) => setMeetingForm((f) => ({ ...f, notes: e.target.value }))}
              disabled={meetingBusy}
              className="w-full px-3 py-2 text-sm border border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors resize-none"
            />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setMeetingOpen(false)} disabled={meetingBusy}
                className="flex-1 py-2 text-sm font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={meetingBusy}
                className="flex-1 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-50">
                {meetingBusy ? 'Sending…' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Input bar ── */}
      {!meetingOpen && (
        <form
          onSubmit={handleSubmit}
          className="shrink-0 flex items-center gap-2 px-3 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            placeholder="Ask about skills, projects, or book a call…"
            disabled={isTyping}
            className="flex-1 px-3.5 py-2 text-sm border border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="w-9 h-9 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isTyping ? (
              <span className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 animate-spin" />
            ) : (
              <FiSend className="w-4 h-4" />
            )}
          </button>
        </form>
      )}
    </div>
  );
}