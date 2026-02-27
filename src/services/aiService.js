// src/services/aiService.js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];

const REQUEST_TIMEOUT_MS = 30000;

const POPULAR_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift', 'sql', 'bash'
];

export class AIService {
  constructor() {
    this.isInitialized = true;
    this.conversationHistory = [];
  }

  mapFirebaseDataToAIContext(firebaseData) {
    if (!firebaseData) return null;

    const personal = firebaseData.personalDetails || {};
    const aboutContent = Array.isArray(firebaseData.aboutContent) ? firebaseData.aboutContent : [];

    return {
      personalDetails: {
        name: personal.fullName || 'Peter Paul Abillar Lazan',
        title: personal.jobTitle || 'Web Developer',
        email: personal.email || 'fearcleevan123@gmail.com',
        phone: personal.phone || '+63 951 537 9127',
        location: personal.address || 'Davao City, Philippines',
        calendlyUrl: personal.calendlyUrl || 'https://calendly.com/fearcleevan/30min',
        linkedinUrl: personal.linkedinUrl || '',
        githubUrl: personal.githubUrl || '',
        bio: aboutContent.join(' ').trim() || 'Passionate developer focused on modern web engineering.'
      },
      projects: Array.isArray(firebaseData.projects)
        ? firebaseData.projects.map((project) => ({
            id: project.id,
            title: project.title || 'Untitled Project',
            description: project.description || 'No description provided.',
            url: project.url || '',
            domain: project.domain || '',
            technologies: Array.isArray(project.technologies) ? project.technologies : []
          }))
        : [],
      experience: Array.isArray(firebaseData.experience)
        ? firebaseData.experience.map((exp) => ({
            role: exp.role || 'Developer',
            company: exp.company || '',
            year: exp.year || '',
            status: exp.status || 'active'
          }))
        : [],
      techStack: Array.isArray(firebaseData.techStack) ? firebaseData.techStack : [],
      certifications: Array.isArray(firebaseData.certifications) ? firebaseData.certifications : [],
      blogPosts: Array.isArray(firebaseData.blogPosts) ? firebaseData.blogPosts : [],
      aboutContent
    };
  }

  hasMeetingIntent(message) {
    return /\b(meeting|schedule|book|appointment|call|hire|interview|contact|talk)\b/i.test(message);
  }

  hasProjectIntent(message) {
    return /\b(project|portfolio|work|built|build|app|website|demo|github)\b/i.test(message);
  }

  hasExperienceIntent(message) {
    return /\b(experience|career|background|resume|cv|job|company|role)\b/i.test(message);
  }

  hasSkillIntent(message) {
    return /\b(skill|skills|tech|technology|stack|framework|language|expertise)\b/i.test(message);
  }

  hasCertificationIntent(message) {
    return /\b(certification|certificate|credential|qualification|course)\b/i.test(message);
  }

  hasAboutIntent(message) {
    return /\b(who are you|about|introduce|bio|profile)\b/i.test(message);
  }

  hasGreetingIntent(message) {
    return /\b(hello|hi|hey|yo|good morning|good afternoon|good evening)\b/i.test(message);
  }

  hasCodeIntent(message) {
    return /\b(code|snippet|function|algorithm|debug|refactor|example|implement|write)\b/i.test(message);
  }

  hasJokeIntent(message) {
    return /\b(joke|funny|humor|laugh)\b/i.test(message);
  }

  extractLanguagePreference(message) {
    const lower = message.toLowerCase();
    const match = POPULAR_LANGUAGES.find((lang) => lower.includes(lang));
    return match || null;
  }

  flattenTechStack(techStack) {
    return techStack
      .flatMap((group) => (Array.isArray(group.items) ? group.items : []))
      .map((item) => (typeof item === 'string' ? item : item?.name || ''))
      .filter(Boolean);
  }

  buildDynamicContext(userData, userMessage) {
    const mapped = this.mapFirebaseDataToAIContext(userData);
    if (!mapped) return this.getFallbackContext();

    const sections = [];
    const q = userMessage.toLowerCase();

    sections.push(`PERSONAL\nName: ${mapped.personalDetails.name}\nTitle: ${mapped.personalDetails.title}\nEmail: ${mapped.personalDetails.email}\nPhone: ${mapped.personalDetails.phone}\nLocation: ${mapped.personalDetails.location}\nCalendly: ${mapped.personalDetails.calendlyUrl}\nLinkedIn: ${mapped.personalDetails.linkedinUrl}\nGitHub: ${mapped.personalDetails.githubUrl}`);

    if (this.hasAboutIntent(q) || this.hasGreetingIntent(q)) {
      sections.push(`ABOUT\n${mapped.personalDetails.bio}`);
    }

    if (this.hasProjectIntent(q) || this.hasSkillIntent(q)) {
      const projectRows = mapped.projects.slice(0, 8).map((project) =>
        `- ${project.title}: ${project.description} | Technologies: ${(project.technologies || []).join(', ') || 'N/A'} | URL: ${project.url || 'N/A'}`
      );
      sections.push(`PROJECTS\n${projectRows.join('\n') || 'No project data available.'}`);
    }

    if (this.hasExperienceIntent(q)) {
      const expRows = mapped.experience.map((exp) => `- ${exp.role} at ${exp.company} (${exp.year || 'N/A'})`);
      sections.push(`EXPERIENCE\n${expRows.join('\n') || 'No experience data available.'}`);
    }

    if (this.hasSkillIntent(q) || this.hasCodeIntent(q)) {
      const technologies = this.flattenTechStack(mapped.techStack);
      sections.push(`TECH STACK\n${technologies.length ? technologies.join(', ') : 'No stack data available.'}`);
    }

    if (this.hasCertificationIntent(q)) {
      const certRows = mapped.certifications.map((cert) => `- ${cert.title || cert.name || 'Certification'} (${cert.issuer || 'Unknown issuer'})`);
      sections.push(`CERTIFICATIONS\n${certRows.join('\n') || 'No certifications data available.'}`);
    }

    if (/\b(blog|article|post)\b/i.test(q)) {
      const blogRows = mapped.blogPosts.map((post) => `- ${post.title || 'Blog Post'} (${post.slug || post.date || 'No date'})`);
      sections.push(`BLOG POSTS\n${blogRows.join('\n') || 'No blog posts available.'}`);
    }

    return sections.join('\n\n');
  }

  buildSystemInstruction(userMessage, userData) {
    const languagePref = this.extractLanguagePreference(userMessage);
    const mapped = this.mapFirebaseDataToAIContext(userData);

    return [
      'You are Peter Lazan\'s AI portfolio assistant.',
      'Primary rule: be accurate and use only the provided context for personal credentials, projects, or claims about Peter.',
      'If requested information is not in context, explicitly say you do not have that data.',
      'You may answer general software questions using standard engineering knowledge.',
      'When user asks for code, return a runnable code block in markdown fences.',
      languagePref ? `Preferred code language: ${languagePref}.` : 'If language is unspecified, choose a common language suited to the task and mention your choice.',
      'Use concise structure: short intro, answer, optional next step.',
      'You can be friendly and occasionally use light humor when appropriate.',
      mapped ? `Meeting link for contact requests: ${mapped.personalDetails.calendlyUrl}` : 'Meeting link for contact requests: https://calendly.com/fearcleevan/30min'
    ].join(' ');
  }

  async callGemini(model, prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.7,
            topP: 0.9,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini ${model} error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  buildLocalFallback(message, userData) {
    const mapped = this.mapFirebaseDataToAIContext(userData);
    const lower = message.toLowerCase();

    if (this.hasJokeIntent(lower)) {
      return 'Why do developers love dark mode? Because light attracts bugs.';
    }

    if (!mapped) {
      return 'I do not have portfolio context right now, but I can still help with general coding questions.';
    }

    if (this.hasMeetingIntent(lower)) {
      return `You can book a meeting with Peter here: ${mapped.personalDetails.calendlyUrl} or email ${mapped.personalDetails.email}.`;
    }

    if (this.hasProjectIntent(lower)) {
      if (!mapped.projects.length) return 'I do not have project data right now.';
      const top = mapped.projects.slice(0, 3).map((p) => `- ${p.title}: ${p.description}`).join('\n');
      return `Here are some of Peter's projects:\n${top}`;
    }

    if (this.hasSkillIntent(lower)) {
      const tech = this.flattenTechStack(mapped.techStack);
      return tech.length
        ? `Peter's known stack includes: ${tech.slice(0, 15).join(', ')}.`
        : 'I do not have detailed tech stack data right now.';
    }

    if (this.hasExperienceIntent(lower)) {
      const exp = mapped.experience.slice(0, 3).map((e) => `- ${e.role} at ${e.company} (${e.year || 'N/A'})`).join('\n');
      return exp || 'I do not have experience details right now.';
    }

    if (this.hasCodeIntent(lower)) {
      return "Sure. Tell me the language and problem, and I'll return a full code snippet in a proper code block.";
    }

    if (this.hasGreetingIntent(lower)) {
      return `Hi. I can help with Peter's credentials, projects, experience, and coding questions. You can also reach Peter at ${mapped.personalDetails.email}.`;
    }

    return 'I can help with portfolio info, coding, architecture, debugging, and interview prep. Ask anything specific.';
  }

  async sendMessage(message, userData = null) {
    const context = this.buildDynamicContext(userData, message);
    const systemInstruction = this.buildSystemInstruction(message, userData);

    this.conversationHistory.push({ role: 'user', text: message });
    this.conversationHistory = this.conversationHistory.slice(-8);

    const recentConversation = this.conversationHistory
      .slice(-6)
      .map((entry) => `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.text}`)
      .join('\n');

    const fullPrompt = [
      systemInstruction,
      '',
      'Context:',
      context,
      '',
      'Recent Conversation:',
      recentConversation,
      '',
      `User: ${message}`,
      'Assistant:'
    ].join('\n');

    if (!GEMINI_API_KEY) {
      const local = this.buildLocalFallback(message, userData);
      this.conversationHistory.push({ role: 'assistant', text: local });
      return local;
    }

    for (const model of GEMINI_MODELS) {
      try {
        const result = await this.callGemini(model, fullPrompt);
        if (result) {
          this.conversationHistory.push({ role: 'assistant', text: result });
          this.conversationHistory = this.conversationHistory.slice(-8);
          return result;
        }
      } catch {
        // Try next model.
      }
    }

    const fallback = this.buildLocalFallback(message, userData);
    this.conversationHistory.push({ role: 'assistant', text: fallback });
    return fallback;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }

  isReady() {
    return this.isInitialized;
  }

  getFallbackContext() {
    return 'No live portfolio context is available.';
  }
}

export const aiService = new AIService();

export const isAIServiceAvailable = () => {
  return Boolean(GEMINI_API_KEY);
};

export const debugAIService = {
  getApiKey: () => (GEMINI_API_KEY ? 'API Key Set' : 'API Key Missing'),
  getHistory: () => aiService.getHistory(),
  clearHistory: () => aiService.clearHistory(),
  isReady: () => aiService.isReady()
};
