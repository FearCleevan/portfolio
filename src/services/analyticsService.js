import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/config';

const track = (eventName, params = {}) => {
    if (!analytics) return;
    try {
        logEvent(analytics, eventName, params);
    } catch { /* noop — analytics must never break the app */ }
};

export const trackChatOpen = () => track('chat_opened');
export const trackMessageSent = () => track('chat_message_sent');
export const trackMeetingSubmit = (purpose) => track('meeting_submitted', { purpose });
export const trackQuickAction = (label) => track('quick_action_clicked', { label });
