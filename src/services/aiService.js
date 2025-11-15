import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBm6hjZtO5UXECsPwa4sOG3FDupZA-ZM9w';

// Initialize with error handling
let genAI;
try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  console.log('GoogleGenerativeAI initialized successfully');
} catch (error) {
  console.error('Failed to initialize GoogleGenerativeAI:', error);
  genAI = null;
}

export class AIService {
  constructor() {
    this.model = null;
    this.chat = null;
    this.userData = null;
    this.isInitialized = false;
    
    if (!genAI) {
      console.error('GoogleGenerativeAI not available');
      return;
    }

    try {
      // Use the correct model name - try both common variants
      this.model = genAI.getGenerativeModel({ 
        model: "gemini-1.0-pro", // Primary model name
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });
      this.isInitialized = true;
      console.log('Gemini AI model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI model:', error);
      this.isInitialized = false;
    }
  }

  // Enhanced context generator that uses real Firebase data
  generateContext(userData) {
    if (!userData) {
      return this.getFallbackContext();
    }

    const {
      personalDetails,
      projects,
      experience,
      techStack,
      certifications,
      blogPosts,
      aboutContent
    } = userData;

    return `
You are Peter Lazan's AI assistant for his portfolio website. You help visitors learn about Peter's skills, projects, experience, and facilitate meetings.

CRITICAL: Use ONLY the information provided below. Do not make up or assume any information not present in the data.

PERSONAL DETAILS:
${personalDetails ? `
- Name: ${personalDetails.name || 'Peter Lazan'}
- Title: ${personalDetails.title || 'Full Stack Developer'}
- Email: ${personalDetails.email || 'Not specified'}
- Phone: ${personalDetails.phone || 'Not specified'}
- Location: ${personalDetails.location || 'Not specified'}
- Bio: ${personalDetails.bio || 'Professional developer specializing in modern web technologies'}
- Availability: ${personalDetails.availability || 'Available for new projects and opportunities'}
` : 'Personal details not available'}

TECHNICAL SKILLS & EXPERTISE:
${techStack && techStack.length > 0 ? techStack.map(group => `
${group.category}:
${group.items ? group.items.map(item => `- ${item.name}${item.level ? ` (${item.level})` : ''}${item.description ? ` - ${item.description}` : ''}`).join('\n') : 'No items'}
`).join('\n') : 'Frontend: React, JavaScript, TypeScript, HTML5, CSS3\nBackend: Node.js, Express, Firebase\nDatabase: MongoDB, PostgreSQL\nTools: Git, Docker, AWS'}

PROFESSIONAL EXPERIENCE:
${experience && experience.length > 0 ? experience.map(exp => `
- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})
  ${exp.description ? `Description: ${exp.description}` : ''}
  ${exp.technologies ? `Technologies: ${exp.technologies.join(', ')}` : ''}
`).join('\n') : 'Experience details not available'}

PROJECTS PORTFOLIO:
${projects && projects.length > 0 ? projects.map(project => `
- ${project.title}${project.category ? ` (${project.category})` : ''}
  ${project.description ? `Description: ${project.description}` : ''}
  ${project.technologies ? `Technologies: ${project.technologies.join(', ')}` : ''}
  ${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''}
  ${project.liveUrl ? `Live Demo: ${project.liveUrl}` : ''}
`).join('\n') : 'Project details not available'}

CERTIFICATIONS:
${certifications && certifications.length > 0 ? certifications.map(cert => `
- ${cert.name} from ${cert.issuer} (${cert.date})
  ${cert.description ? `Details: ${cert.description}` : ''}
  ${cert.url ? `URL: ${cert.url}` : ''}
`).join('\n') : 'Certification details not available'}

BLOG POSTS/ARTICLES:
${blogPosts && blogPosts.length > 0 ? blogPosts.map(post => `
- ${post.title} (${post.publishDate})
  ${post.excerpt ? `Excerpt: ${post.excerpt}` : ''}
  ${post.tags ? `Tags: ${post.tags.join(', ')}` : ''}
`).join('\n') : 'Blog posts not available'}

ABOUT CONTENT:
${aboutContent && aboutContent.length > 0 ? aboutContent.map(section => `
${section.title}:
${section.content}
`).join('\n') : 'About information not available'}

CONVERSATION GUIDELINES:
1. Be professional, friendly, and engaging
2. Use ONLY the information provided above - do not invent or assume details
3. If information is missing, say "I don't have that specific information in my database"
4. For technical questions, provide detailed explanations based on the skills listed
5. When discussing projects, highlight relevant technologies and achievements
6. For meeting requests, guide users through the booking process
7. Always maintain a helpful, solution-oriented approach
8. If someone asks about something not in the data, politely redirect to what you do know

MEETING BOOKING PROCESS:
When someone wants to schedule a meeting:
1. Ask for their name and email
2. Understand the purpose (project discussion, job opportunity, consultation)
3. Discuss preferred timeline
4. Provide Peter's contact information from personal details
5. Confirm next steps

RESPONSE STYLE:
- Use natural, conversational language
- Include emojis occasionally to keep it friendly
- Break complex information into readable chunks
- Be enthusiastic about Peter's work
- Encourage further engagement and questions
- Always be truthful about what information is available
`;
  }

  getFallbackContext() {
    return `
You are Peter Lazan's AI assistant. Since I cannot access the current portfolio data, please:

1. Be helpful and professional
2. Let users know you're experiencing technical difficulties with data access
3. Suggest they check the main portfolio sections for detailed information
4. Still help with general inquiries about web development, projects, or scheduling meetings
5. Direct them to contact Peter directly for specific information

For now, focus on:
- General web development discussions
- Meeting scheduling assistance
- Directing to portfolio sections
- Being transparent about data limitations
`;
  }

  async initializeChat(userData = null) {
    if (!this.isInitialized) {
      throw new Error('AI service not properly initialized');
    }

    try {
      this.userData = userData;
      const context = this.generateContext(userData);
      
      // Start a new chat session WITH THE CONTEXT
      this.chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: context }] // NOW USING THE CONTEXT
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'm ready to assist visitors with accurate information about Peter's portfolio based on the provided data. I'll be truthful about what information is available and maintain a professional, helpful conversation." }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw new Error('Failed to initialize chat session');
    }
  }

  async sendMessage(message, userData = null) {
    // If AI service is not initialized, return fallback response
    if (!this.isInitialized) {
      console.warn('AI service not initialized, using fallback response');
      return this.getFallbackResponse(message);
    }

    try {
      if (!this.chat || userData !== this.userData) {
        await this.initializeChat(userData);
      }

      console.log('Sending message to Gemini AI...');
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      console.log('Successfully received AI response');
      return text;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // More specific error handling
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
        throw new Error('AI service configuration error. Please check the API key.');
      } else if (error.message?.includes('QUOTA') || error.message?.includes('quota')) {
        throw new Error('AI service quota exceeded. Please try again later.');
      } else if (error.message?.includes('model') || error.message?.includes('not found')) {
        // Try with alternative model name
        return this.tryAlternativeModel(message, userData);
      } else {
        return this.getFallbackResponse(message);
      }
    }
  }

  async tryAlternativeModel(message, userData) {
    console.log('Trying alternative model...');
    try {
      // Try with gemini-pro instead
      const alternativeModel = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });
      
      const context = this.generateContext(userData);
      const chat = alternativeModel.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: context }]
          },
          {
            role: "model", 
            parts: [{ text: "I understand and will help visitors with Peter's portfolio information based on the provided data." }]
          }
        ]
      });
      
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (fallbackError) {
      console.error('Alternative model also failed:', fallbackError);
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (this.hasMeetingIntent(lowerMessage)) {
      return "I'd be happy to help you schedule a meeting with Peter! Please provide your name, email, and preferred time, and I'll help coordinate a meeting.";
    }
    
    if (this.hasSkillIntent(lowerMessage)) {
      return "Peter is a skilled full-stack developer with expertise in modern web technologies including React, Node.js, Firebase, and cloud platforms. You can check the Skills section for detailed information.";
    }
    
    if (this.hasProjectIntent(lowerMessage)) {
      return "Peter has worked on various web development projects. Please visit the Projects section to see his work with technologies used and live demos.";
    }
    
    if (this.hasExperienceIntent(lowerMessage)) {
      return "Peter has professional experience in web development. The Experience section contains detailed information about his work history and achievements.";
    }
    
    return "Hello! I'm Peter's AI assistant. I can help you learn about his skills, projects, experience, or schedule a meeting. What would you like to know?";
  }

  // Enhanced intent detection
  hasMeetingIntent(message) {
    const meetingKeywords = [
      'meeting', 'schedule', 'book', 'call', 'discuss', 'consultation',
      'interview', 'appointment', 'connect', 'talk', 'demo', 'hire'
    ];
    return meetingKeywords.some(keyword => message.includes(keyword));
  }

  hasSkillIntent(message) {
    const skillKeywords = [
      'skill', 'expertise', 'technology', 'tech stack', 'framework',
      'language', 'tool', 'what can you do', 'experience', 'proficient'
    ];
    return skillKeywords.some(keyword => message.includes(keyword));
  }

  hasProjectIntent(message) {
    const projectKeywords = [
      'project', 'work', 'portfolio', 'what have you built',
      'examples', 'case study', 'github', 'build'
    ];
    return projectKeywords.some(keyword => message.includes(keyword));
  }

  hasExperienceIntent(message) {
    const experienceKeywords = [
      'experience', 'work history', 'career', 'background',
      'professional', 'job', 'position', 'employed'
    ];
    return experienceKeywords.some(keyword => message.includes(keyword));
  }
}

// Create singleton instance with better error handling
export const aiService = new AIService();

// Export a function to check if AI service is available
export const isAIServiceAvailable = () => {
  return aiService.isInitialized;
};