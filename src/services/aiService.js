// src/services/aiService.js
import { personalDetails, experience, projects, skills, techStack, certifications, blogPosts } from '../data/index.js';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODELS = (
  import.meta.env.VITE_GEMINI_MODELS
    ? import.meta.env.VITE_GEMINI_MODELS.split(',').map((m) => m.trim()).filter(Boolean)
    : ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash']
);

const REQUEST_TIMEOUT_MS = 30000;
const RATE_LIMIT_COOLDOWN_MS = 45000;

const POPULAR_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'c', 'cpp', 'csharp', 'go',
  'rust', 'php', 'ruby', 'kotlin', 'swift', 'sql', 'bash',
];

// Static portfolio context built once from JSON data
const PORTFOLIO_CONTEXT = {
  personalDetails: {
    name: personalDetails.name,
    title: personalDetails.title,
    email: personalDetails.email,
    phone: personalDetails.phone,
    location: personalDetails.location,
    summary: personalDetails.summary,
    calendlyUrl: personalDetails.calendlyUrl,
    linkedinUrl: personalDetails.linkedinUrl,
    githubUrl: personalDetails.githubUrl,
  },
  experience: experience.map((e) => ({
    role: e.title,
    company: e.company,
    period: e.period,
    tags: e.tags,
    highlights: e.responsibilities.slice(0, 3),
  })),
  projects: projects.map((p) => ({
    title: p.title,
    description: p.description,
    techStack: p.techStack,
    url: p.liveUrl || p.url,
    featured: p.featured,
  })),
  techStack: techStack.flatMap((group) =>
    group.items.map((item) => item.name)
  ),
  certifications: certifications.map((c) => ({
    title: c.title,
    issuer: c.issuer,
  })),
  skills: {
    technical: [
      ...skills.technical.languages,
      ...skills.technical.frontend,
      ...skills.technical.backend,
      ...skills.technical.databases,
    ],
    professional: skills.professional,
    soft: skills.soft,
  },
  blogPosts: blogPosts.map((p) => ({
    title: p.title,
    slug: p.slug,
    date: p.date,
    tags: p.tags,
  })),
};

export class AIService {
  constructor() {
    this.isInitialized = true;
    this.conversationHistory = [];
    this.unavailableModels = new Set();
    this.rateLimitedUntil = 0;
  }

  hasMeetingIntent(msg) {
    return /\b(meeting|schedule|book|appointment|call|hire|interview|contact|talk)\b/i.test(msg);
  }
  hasProjectIntent(msg) {
    return /\b(project|portfolio|work|built|build|app|website|demo|github)\b/i.test(msg);
  }
  hasExperienceIntent(msg) {
    return /\b(experience|career|background|resume|cv|job|company|role)\b/i.test(msg);
  }
  hasSkillIntent(msg) {
    return /\b(skill|skills|tech|technology|stack|framework|language|expertise)\b/i.test(msg);
  }
  hasCertificationIntent(msg) {
    return /\b(certification|certificate|credential|qualification|course|award|achievement)\b/i.test(msg);
  }
  hasAboutIntent(msg) {
    return /\b(who are you|about|introduce|bio|profile|summary)\b/i.test(msg);
  }
  hasGreetingIntent(msg) {
    return /\b(hello|hi|hey|yo|good morning|good afternoon|good evening)\b/i.test(msg);
  }
  hasCodeIntent(msg) {
    return /\b(code|snippet|function|algorithm|debug|refactor|example|implement|write)\b/i.test(msg);
  }
  hasJokeIntent(msg) {
    return /\b(joke|funny|humor|laugh)\b/i.test(msg);
  }
  hasEducationIntent(msg) {
    return /\b(education|study|degree|university|college|school|bachelor)\b/i.test(msg);
  }

  extractLanguagePreference(msg) {
    const lower = msg.toLowerCase();
    return POPULAR_LANGUAGES.find((lang) => lower.includes(lang)) || null;
  }

  buildDynamicContext(userMessage) {
    const q = userMessage.toLowerCase();
    const ctx = PORTFOLIO_CONTEXT;
    const sections = [];

    sections.push(
      `PERSONAL\nName: ${ctx.personalDetails.name}\nTitle: ${ctx.personalDetails.title}\nEmail: ${ctx.personalDetails.email}\nPhone: ${ctx.personalDetails.phone}\nLocation: ${ctx.personalDetails.location}\nCalendly: ${ctx.personalDetails.calendlyUrl}\nLinkedIn: ${ctx.personalDetails.linkedinUrl}\nGitHub: ${ctx.personalDetails.githubUrl}`
    );

    if (this.hasAboutIntent(q) || this.hasGreetingIntent(q)) {
      sections.push(`SUMMARY\n${ctx.personalDetails.summary}`);
    }

    if (this.hasExperienceIntent(q)) {
      const expRows = ctx.experience.map((e) =>
        `- ${e.role} at ${e.company} (${e.period})\n  Tags: ${e.tags.join(', ')}`
      );
      sections.push(`EXPERIENCE\n${expRows.join('\n')}`);
    }

    if (this.hasProjectIntent(q) || this.hasSkillIntent(q)) {
      const projRows = ctx.projects.slice(0, 8).map((p) =>
        `- ${p.title}: ${p.description} | Stack: ${p.techStack.join(', ')} | URL: ${p.url || 'N/A'}`
      );
      sections.push(`PROJECTS\n${projRows.join('\n')}`);
    }

    if (this.hasSkillIntent(q) || this.hasCodeIntent(q)) {
      sections.push(`TECH STACK\n${ctx.techStack.join(', ')}`);
      sections.push(`TECHNICAL SKILLS\n${ctx.skills.technical.join(', ')}`);
      sections.push(`PROFESSIONAL SKILLS\n${ctx.skills.professional.join(', ')}`);
    }

    if (this.hasCertificationIntent(q)) {
      const certRows = ctx.certifications.map((c) => `- ${c.title} (${c.issuer})`);
      sections.push(`CERTIFICATIONS & ACHIEVEMENTS\n${certRows.join('\n')}`);
    }

    if (/\b(blog|article|post|writing)\b/i.test(q)) {
      const blogRows = ctx.blogPosts.map((p) => `- ${p.title} (${p.date}) | Tags: ${p.tags.join(', ')}`);
      sections.push(`BLOG POSTS\n${blogRows.join('\n')}`);
    }

    return sections.join('\n\n');
  }

  buildSystemInstruction(userMessage) {
    const langPref = this.extractLanguagePreference(userMessage);
    return [
      "You are Peter Paul Lazan's AI portfolio assistant — friendly, concise, and technically sharp.",
      'Primary rule: use only the provided context for personal credentials, projects, or claims about Peter.',
      'If requested information is not in context, say you do not have that data.',
      'You may answer general software engineering questions using standard knowledge.',
      'When the user asks for code, return a runnable block in markdown fences.',
      langPref
        ? `Preferred code language: ${langPref}.`
        : 'If language is unspecified, choose the most appropriate one and state your choice.',
      'Structure: short intro → answer → optional next step. Keep responses focused.',
      'You can be warm and occasionally use light developer humor.',
      `For meeting/contact requests, share: ${PORTFOLIO_CONTEXT.personalDetails.calendlyUrl}`,
    ].join(' ');
  }

  async callGemini(model, prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 1200,
              temperature: 0.7,
              topP: 0.9,
              topK: 40,
            },
          }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`Gemini ${model} error: ${response.status} ${errorText}`);
        error.status = response.status;
        error.model = model;
        throw error;
      }
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  buildLocalFallback(message) {
    const lower = message.toLowerCase();
    const ctx = PORTFOLIO_CONTEXT;

    if (this.hasJokeIntent(lower)) {
      return 'Why do developers love dark mode? Because light attracts bugs.';
    }
    if (this.hasMeetingIntent(lower)) {
      return `You can book a call with Peter here: ${ctx.personalDetails.calendlyUrl} or email ${ctx.personalDetails.email}.`;
    }
    if (this.hasProjectIntent(lower)) {
      const top = ctx.projects.filter((p) => p.featured).slice(0, 3).map((p) => `- ${p.title}: ${p.description}`).join('\n');
      return `Here are some of Peter's featured projects:\n${top}`;
    }
    if (this.hasSkillIntent(lower)) {
      return `Peter's core stack: ${ctx.techStack.slice(0, 15).join(', ')}.`;
    }
    if (this.hasExperienceIntent(lower)) {
      const exp = ctx.experience.slice(0, 2).map((e) => `- ${e.role} at ${e.company} (${e.period})`).join('\n');
      return exp;
    }
    if (this.hasCertificationIntent(lower)) {
      const certs = ctx.certifications.map((c) => `- ${c.title} from ${c.issuer}`).join('\n');
      return `Peter's achievements:\n${certs}`;
    }
    if (this.hasCodeIntent(lower)) {
      return "Sure — tell me the language and problem, and I'll return a full code snippet in a proper code block.";
    }
    if (this.hasGreetingIntent(lower)) {
      return `Hi! I'm Peter's AI assistant. I can tell you about his experience, projects, skills, or help with coding questions. What would you like to know?`;
    }
    return "I can help with Peter's portfolio info, coding questions, architecture, and debugging. What would you like to know?";
  }

  async sendMessage(message) {
    const context = this.buildDynamicContext(message);
    const systemInstruction = this.buildSystemInstruction(message);

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
      'Assistant:',
    ].join('\n');

    if (!GEMINI_API_KEY) {
      const local = this.buildLocalFallback(message);
      this.conversationHistory.push({ role: 'assistant', text: local });
      return local;
    }

    if (Date.now() < this.rateLimitedUntil) {
      const fallback = this.buildLocalFallback(message);
      this.conversationHistory.push({ role: 'assistant', text: fallback });
      return `${fallback}\n\n_(Rate limit cooldown active — retrying in under a minute.)_`;
    }

    for (const model of GEMINI_MODELS) {
      if (this.unavailableModels.has(model)) continue;
      try {
        const result = await this.callGemini(model, fullPrompt);
        if (result) {
          this.conversationHistory.push({ role: 'assistant', text: result });
          this.conversationHistory = this.conversationHistory.slice(-8);
          return result;
        }
      } catch (error) {
        if (error?.status === 404) this.unavailableModels.add(model);
        if (error?.status === 429) {
          this.rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
          break;
        }
      }
    }

    const fallback = this.buildLocalFallback(message);
    this.conversationHistory.push({ role: 'assistant', text: fallback });
    return fallback;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return [...this.conversationHistory];
  }

  isReady() {
    return this.isInitialized && Boolean(GEMINI_API_KEY);
  }
}

export const aiService = new AIService();
export const isAIServiceAvailable = () => Boolean(GEMINI_API_KEY);
