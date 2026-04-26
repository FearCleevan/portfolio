// Analytics stubs — wired to GA4 in Phase 9
// All calls are no-ops until GA4 is configured so nothing breaks.

const track = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;
  try {
    if (window.gtag) window.gtag('event', eventName, params);
  } catch { /* analytics must never break the app */ }
};

export const trackPageView = (path) => track('page_view', { page_path: path });
export const trackChatOpen = () => track('chat_opened');
export const trackMessageSent = () => track('chat_message_sent');
export const trackCVDownload = () => track('cv_download');
export const trackSocialClick = (platform) => track('social_click', { platform });
export const trackMeetingClick = () => track('meeting_click');
export const trackProjectView = (title) => track('project_view', { project_title: title });
export const trackMeetingSubmit = (purpose) => track('meeting_submit', { purpose });
export const trackQuickAction = (label) => track('chat_quick_action', { label });
