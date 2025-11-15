// src/services/aiService.js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBm6hjZtO5UXECsPwa4sOG3FDupZA-ZM9w';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export class AIService {
  constructor() {
    this.isInitialized = true;
    this.conversationHistory = [];
  }

  // SMART DATA MAPPING - Converts your Firebase structure to AI-expected format
  mapFirebaseDataToAIContext(firebaseData) {
    if (!firebaseData) {
      console.log('No Firebase data provided to mapper');
      return null;
    }

    console.log('🔍 Raw Firebase Data Received:', firebaseData);
    
    const {
      personalDetails,
      projects,
      experience,
      techStack,
      certifications,
      blogPosts,
      aboutContent
    } = firebaseData;

    // Map personal details with proper fallbacks
    const mappedPersonalDetails = personalDetails ? {
      name: personalDetails.fullName || 'Peter Paul Abillar Lazan',
      title: personalDetails.jobTitle || 'Junior Web Developer',
      email: personalDetails.email || 'fearcleevan123@gmail.com',
      phone: personalDetails.phone || '+63 951 537 9127',
      location: personalDetails.address || 'Davao City, Philippines',
      bio: aboutContent && aboutContent.length > 0 ? aboutContent[0] : 'Passionate developer specializing in modern web technologies and creating innovative solutions',
      availability: 'Available for new projects and opportunities',
      calendlyUrl: personalDetails.calendlyUrl || 'https://calendly.com/fearcleevan/30min',
      linkedinUrl: personalDetails.linkedinUrl || 'https://linkedin.com/in/peterpaullazan',
      githubUrl: personalDetails.githubUrl || 'https://github.com/FearCleevan',
      instagramUrl: personalDetails.instagramUrl || 'https://www.instagram.com/fearcleevan12345/',
      facebookUrl: personalDetails.facebookUrl || 'https://www.facebook.com/FearCleevan'
    } : {
      name: 'Peter Paul Abillar Lazan',
      title: 'Junior Web Developer',
      email: 'fearcleevan123@gmail.com',
      phone: '+63 951 537 9127',
      location: 'Davao City, Philippines',
      bio: 'Passionate developer specializing in modern web technologies',
      availability: 'Available for new projects and opportunities',
      calendlyUrl: 'https://calendly.com/fearcleevan/30min',
      linkedinUrl: 'https://linkedin.com/in/peterpaullazan',
      githubUrl: 'https://github.com/FearCleevan'
    };

    // Map projects with validation
    const mappedProjects = (projects && Array.isArray(projects)) ? projects.map(project => ({
      title: project.title || 'Untitled Project',
      description: project.description || 'A web development project',
      technologies: project.domain ? [project.domain] : ['Web Technologies'],
      githubUrl: project.url || '',
      liveUrl: project.url || '',
      category: project.category || 'Web Development'
    })) : [
      {
        title: 'Portfolio Website',
        description: 'Personal portfolio website built with React and Firebase',
        technologies: ['React', 'Firebase', 'CSS'],
        githubUrl: 'https://github.com/FearCleevan',
        liveUrl: window.location.origin,
        category: 'Web Development'
      }
    ];

    // Map experience with date parsing
    const mappedExperience = (experience && Array.isArray(experience)) ? experience.map(exp => ({
      title: exp.role || 'Developer',
      company: exp.company || 'Technology Company',
      startDate: this.extractYearFromExperience(exp.year) || '2022',
      endDate: exp.status === 'active' || exp.status === 'current' ? 'Present' : this.extractEndYear(exp.year) || '2023',
      description: `${exp.role} at ${exp.company} from ${exp.year}`,
      technologies: exp.technologies || []
    })) : [
      {
        title: 'Web Developer',
        company: 'Various Projects',
        startDate: '2022',
        endDate: 'Present',
        description: 'Working on various web development projects and building portfolio',
        technologies: ['React', 'JavaScript', 'Firebase']
      }
    ];

    // Map tech stack with grouping
    const mappedTechStack = (techStack && Array.isArray(techStack)) ? techStack.map(group => ({
      category: group.title || 'Technologies',
      items: (group.items && Array.isArray(group.items)) ? group.items.map(item => ({
        name: typeof item === 'string' ? item : item.name || 'Technology',
        level: 'Proficient',
        description: ''
      })) : []
    })) : [
      {
        category: 'Frontend',
        items: [
          { name: 'React', level: 'Proficient', description: '' },
          { name: 'JavaScript', level: 'Proficient', description: '' },
          { name: 'HTML5', level: 'Proficient', description: '' },
          { name: 'CSS3', level: 'Proficient', description: '' }
        ]
      },
      {
        category: 'Backend',
        items: [
          { name: 'Node.js', level: 'Proficient', description: '' },
          { name: 'Firebase', level: 'Proficient', description: '' },
          { name: 'Express', level: 'Proficient', description: '' }
        ]
      }
    ];

    // Map certifications
    const mappedCertifications = (certifications && Array.isArray(certifications)) ? certifications.map(cert => ({
      name: cert.title || 'Web Development Certification',
      issuer: cert.issuer || 'Online Platform',
      date: 'Completed',
      description: cert.description || '',
      url: cert.url || ''
    })) : [
      {
        name: 'Full Stack Development',
        issuer: 'Online Learning Platform',
        date: '2023',
        description: 'Comprehensive web development certification',
        url: ''
      }
    ];

    // Map blog posts
    const mappedBlogPosts = (blogPosts && Array.isArray(blogPosts)) ? blogPosts.map(post => ({
      title: post.title || 'Blog Post',
      publishDate: 'Recent',
      excerpt: post.description || post.excerpt || 'Read more about web development topics',
      tags: post.tags || []
    })) : [];

    // Map about content
    const mappedAboutContent = (aboutContent && Array.isArray(aboutContent)) ? aboutContent.map((content, index) => ({
      title: `About Peter ${index + 1}`,
      content: content
    })) : [
      {
        title: 'About Peter',
        content: 'Passionate web developer with experience in modern technologies and a focus on creating user-friendly applications.'
      }
    ];

    const mappedData = {
      personalDetails: mappedPersonalDetails,
      projects: mappedProjects,
      experience: mappedExperience,
      techStack: mappedTechStack,
      certifications: mappedCertifications,
      blogPosts: mappedBlogPosts,
      aboutContent: mappedAboutContent
    };

    console.log('✅ Mapped AI Data:', mappedData);
    return mappedData;
  }

  // Helper methods for date extraction
  extractYearFromExperience(yearString) {
    if (!yearString) return '2022';
    const match = yearString.match(/\d{4}/);
    return match ? match[0] : '2022';
  }

  extractEndYear(yearString) {
    if (!yearString) return '2023';
    const matches = yearString.match(/\d{4}/g);
    return matches && matches.length > 1 ? matches[1] : '2023';
  }

  // SMART CONTEXT FILTERING - Only includes relevant data based on user query
  generateSmartContext(userData, userMessage) {
    const mappedData = this.mapFirebaseDataToAIContext(userData);
    if (!mappedData) {
      console.log('🚨 Using fallback context - no mapped data available');
      return this.getFallbackContext();
    }

    const lowerMessage = userMessage.toLowerCase();
    const contextParts = [];

    console.log(`🎯 Analyzing user intent for: "${userMessage}"`);

    // Always include personal details for contact info
    contextParts.push(this.getPersonalDetailsContext(mappedData.personalDetails));

    // Add relevant sections based on user intent
    if (this.hasSkillIntent(lowerMessage) || this.hasTechIntent(lowerMessage)) {
      console.log('🎯 Including tech stack context');
      contextParts.push(this.getTechStackContext(mappedData.techStack));
    }

    if (this.hasProjectIntent(lowerMessage)) {
      console.log('🎯 Including projects context');
      contextParts.push(this.getProjectsContext(mappedData.projects));
    }

    if (this.hasExperienceIntent(lowerMessage)) {
      console.log('🎯 Including experience context');
      contextParts.push(this.getExperienceContext(mappedData.experience));
    }

    if (this.hasCertificationIntent(lowerMessage)) {
      console.log('🎯 Including certifications context');
      contextParts.push(this.getCertificationsContext(mappedData.certifications));
    }

    if (this.hasAboutIntent(lowerMessage)) {
      console.log('🎯 Including about context');
      contextParts.push(this.getAboutContext(mappedData.aboutContent));
    }

    // If no specific intent detected or it's a greeting, include condensed version of all data
    if (contextParts.length === 1 || this.hasGreetingIntent(lowerMessage)) {
      console.log('🎯 Including comprehensive context (general query)');
      contextParts.push(
        this.getCondensedTechContext(mappedData.techStack),
        this.getCondensedProjectsContext(mappedData.projects),
        this.getCondensedExperienceContext(mappedData.experience)
      );
    }

    const fullContext = `
# PERSONAL AI ASSISTANT FOR PETER LAZAN

You are Peter Lazan's AI assistant for his portfolio website. Your role is to help visitors learn about Peter's skills, projects, experience, and facilitate meetings.

## CRITICAL INSTRUCTIONS:
- Use ONLY the information provided below
- DO NOT make up or assume any information not present in the data
- If information is missing, politely say "I don't have that specific information in my database"
- Be professional, friendly, and engaging
- Always maintain a helpful, solution-oriented approach

## AVAILABLE INFORMATION:
${contextParts.join('\n\n')}

## RESPONSE GUIDELINES:
1. Use natural, conversational language with occasional emojis 🚀💻👨‍💻
2. Break complex information into readable chunks
3. Be enthusiastic about Peter's work and achievements
4. Encourage further engagement and questions
5. For meeting requests, direct to Calendly: ${mappedData.personalDetails.calendlyUrl}
6. If asked about something not in the data, redirect to what you do know
7. Always be truthful about what information is available

## MEETING BOOKING:
- Primary: Use Calendly: ${mappedData.personalDetails.calendlyUrl}
- Alternative: Email: ${mappedData.personalDetails.email}
- Phone: ${mappedData.personalDetails.phone}
`;

    console.log('📝 Generated smart context with', contextParts.length, 'sections');
    return fullContext;
  }

  // Individual context generators for smart filtering
  getPersonalDetailsContext(personalDetails) {
    return `## PERSONAL DETAILS 👨‍💼
**Name:** ${personalDetails.name}
**Title:** ${personalDetails.title}
**Email:** ${personalDetails.email}
**Phone:** ${personalDetails.phone}
**Location:** ${personalDetails.location}
**Bio:** ${personalDetails.bio}
**Availability:** ${personalDetails.availability}

**Contact Links:**
- 📅 Schedule Meeting: ${personalDetails.calendlyUrl}
- 💼 LinkedIn: ${personalDetails.linkedinUrl}
- 💻 GitHub: ${personalDetails.githubUrl}
- 📷 Instagram: ${personalDetails.instagramUrl}
- 👥 Facebook: ${personalDetails.facebookUrl}`;
  }

  getTechStackContext(techStack) {
    const techContent = techStack && techStack.length > 0 ? techStack.map(group => `
**${group.category}:**
${group.items && group.items.length > 0 ? group.items.map(item => `• ${item.name}`).join('\n') : '• No specific technologies listed'}`).join('\n') : '• Technical skills information not currently available';

    return `## TECHNICAL SKILLS 🛠️
${techContent}`;
  }

  getCondensedTechContext(techStack) {
    if (!techStack || techStack.length === 0) return '';

    const mainTech = techStack.flatMap(group => 
      group.items ? group.items.slice(0, 3).map(item => item.name) : []
    ).filter(Boolean);

    return `## KEY TECHNOLOGIES 💻
${mainTech.length > 0 ? mainTech.map(tech => `• ${tech}`).join('\n') : 'Technical details available in Skills section'}`;
  }

  getProjectsContext(projects) {
    const projectsContent = projects && projects.length > 0 ? projects.map(project => `
**${project.title}** ${project.category ? `(${project.category})` : ''}
${project.description ? `📝 ${project.description}` : ''}
${project.technologies && project.technologies.length > 0 ? `🛠️ Technologies: ${project.technologies.join(', ')}` : ''}
${project.liveUrl ? `🌐 Live Demo: ${project.liveUrl}` : ''}
${project.githubUrl ? `📂 GitHub: ${project.githubUrl}` : ''}`).join('\n\n') : '• Project details not currently available';

    return `## PROJECTS PORTFOLIO 🚀
${projectsContent}`;
  }

  getCondensedProjectsContext(projects) {
    if (!projects || projects.length === 0) return '';

    const recentProjects = projects.slice(0, 2);
    return `## RECENT PROJECTS 📂
${recentProjects.map(project => `• **${project.title}**: ${project.description || 'Web development project'}`).join('\n')}`;
  }

  getExperienceContext(experience) {
    const experienceContent = experience && experience.length > 0 ? experience.map(exp => `
**${exp.title}** at **${exp.company}**
⏰ ${exp.startDate} - ${exp.endDate}
${exp.description ? `📋 ${exp.description}` : ''}
${exp.technologies && exp.technologies.length > 0 ? `🛠️ Technologies: ${exp.technologies.join(', ')}` : ''}`).join('\n\n') : '• Experience details not currently available';

    return `## PROFESSIONAL EXPERIENCE 👨‍💻
${experienceContent}`;
  }

  getCondensedExperienceContext(experience) {
    if (!experience || experience.length === 0) return '';

    const recentExp = experience.slice(0, 2);
    return `## WORK EXPERIENCE 💼
${recentExp.map(exp => `• **${exp.title}** at ${exp.company} (${exp.startDate}-${exp.endDate})`).join('\n')}`;
  }

  getCertificationsContext(certifications) {
    const certsContent = certifications && certifications.length > 0 ? certifications.map(cert => `
**${cert.name}** from ${cert.issuer}
📅 ${cert.date}
${cert.description ? `📋 ${cert.description}` : ''}
${cert.url ? `🔗 ${cert.url}` : ''}`).join('\n\n') : '• Certification details not currently available';

    return `## CERTIFICATIONS 🏆
${certsContent}`;
  }

  getAboutContext(aboutContent) {
    const aboutContentText = aboutContent && aboutContent.length > 0 ? aboutContent.map(section => section.content).join('\n\n') : 'About information not currently available';

    return `## ABOUT PETER 📖
${aboutContentText}`;
  }

  // Enhanced context generator (fallback to full context)
  generateContext(userData) {
    const mappedData = this.mapFirebaseDataToAIContext(userData);
    
    if (!mappedData) {
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
    } = mappedData;

    return `
You are Peter Lazan's AI assistant for his portfolio website. You help visitors learn about Peter's skills, projects, experience, and facilitate meetings.

CRITICAL: Use ONLY the information provided below. Do not make up or assume any information not present in the data.

PERSONAL DETAILS:
- Name: ${personalDetails.name}
- Title: ${personalDetails.title}
- Email: ${personalDetails.email}
- Phone: ${personalDetails.phone}
- Location: ${personalDetails.location}
- Bio: ${personalDetails.bio}
- Availability: ${personalDetails.availability}
- Calendly: ${personalDetails.calendlyUrl}
- LinkedIn: ${personalDetails.linkedinUrl}
- GitHub: ${personalDetails.githubUrl}

TECHNICAL SKILLS & EXPERTISE:
${techStack && techStack.length > 0 ? techStack.map(group => `
${group.category}:
${group.items && group.items.length > 0 ? group.items.map(item => `- ${item.name}`).join('\n') : '- No specific technologies listed'}
`).join('\n') : 'Technical skills information not currently available'}

PROFESSIONAL EXPERIENCE:
${experience && experience.length > 0 ? experience.map(exp => `
- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.description ? `Description: ${exp.description}` : ''}
  ${exp.technologies && exp.technologies.length > 0 ? `Technologies: ${exp.technologies.join(', ')}` : ''}
`).join('\n') : 'Experience details not available'}

PROJECTS PORTFOLIO:
${projects && projects.length > 0 ? projects.map(project => `
- ${project.title}${project.category ? ` (${project.category})` : ''}
  ${project.description ? `Description: ${project.description}` : ''}
  ${project.technologies && project.technologies.length > 0 ? `Technologies: ${project.technologies.join(', ')}` : ''}
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
  ${post.tags && post.tags.length > 0 ? `Tags: ${post.tags.join(', ')}` : ''}
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
6. For meeting requests, guide users to the Calendly link
7. Always maintain a helpful, solution-oriented approach
8. If someone asks about something not in the data, politely redirect to what you do know

MEETING BOOKING PROCESS:
When someone wants to schedule a meeting:
1. Direct them to Peter's Calendly: ${personalDetails.calendlyUrl}
2. Alternatively, provide Peter's email: ${personalDetails.email}
3. Understand the purpose (project discussion, job opportunity, consultation)
4. Confirm they can use the provided scheduling options

RESPONSE STYLE:
- Use natural, conversational language
- Include emojis occasionally to keep it friendly 🚀💻👨‍💻
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
- Meeting scheduling assistance using Calendly: https://calendly.com/fearcleevan/30min
- Directing to portfolio sections
- Being transparent about data limitations

Peter's basic contact information:
- Email: fearcleevan123@gmail.com
- Phone: +63 951 537 9127
- Location: Davao City, Philippines
`;
  }

  async sendMessage(message, userData = null) {
    try {
      console.log('🤖 AI Service: Processing message:', message);
      console.log('📊 User Data Available:', !!userData);

      // Use smart context that filters data based on user query
      const context = userData 
        ? this.generateSmartContext(userData, message)
        : this.getFallbackContext();
      
      // Add to conversation history
      this.conversationHistory.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Prepare the full prompt with context and conversation history
      const conversationContext = this.conversationHistory
        .slice(-6) // Keep last 6 messages for context
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.parts[0].text}`)
        .join('\n');

      const fullPrompt = `${context}

Recent Conversation:
${conversationContext}

User: ${message}

Assistant:`;

      console.log('🚀 Sending request to Gemini API...');
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Response Error:', response.status, errorText);
        
        if (response.status === 404) {
          throw new Error('Model not found. Please check the model name.');
        } else if (response.status === 403) {
          throw new Error('API key invalid or quota exceeded.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Unexpected API response format:', data);
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add AI response to conversation history
      this.conversationHistory.push({
        role: "model",
        parts: [{ text: aiResponse }]
      });

      console.log('✅ Successfully received AI response');
      return aiResponse;

    } catch (error) {
      console.error('❌ AI Service Error:', error);
      
      // More specific error handling
      if (error.message.includes('API key') || error.message.includes('quota') || error.message.includes('403')) {
        throw new Error('AI service configuration error. Please check the API key and quota.');
      } else if (error.message.includes('404') || error.message.includes('Model not found')) {
        return this.tryFallbackModel(message, userData);
      } else if (error.message.includes('Rate limit') || error.message.includes('429')) {
        throw new Error('AI service is currently busy. Please try again in a moment.');
      } else {
        return this.getFallbackResponse(message);
      }
    }
  }

  async tryFallbackModel(message, userData) {
    console.log('🔄 Trying fallback model: gemini-1.5-flash');
    try {
      const fallbackUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      
      const context = userData ? this.generateSmartContext(userData, message) : this.getFallbackContext();
      const fullPrompt = `${context}\n\nUser: ${message}\n\nAssistant:`;

      const response = await fetch(`${fallbackUrl}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Fallback model also failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add to conversation history
      this.conversationHistory.push({
        role: "model",
        parts: [{ text: aiResponse }]
      });

      return aiResponse;

    } catch (fallbackError) {
      console.error('❌ Fallback model also failed:', fallbackError);
      return this.getFallbackResponse(message);
    }
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (this.hasMeetingIntent(lowerMessage)) {
      return "I'd be happy to help you schedule a meeting with Peter! 🗓️ You can book directly through his Calendly: https://calendly.com/fearcleevan/30min or email him at fearcleevan123@gmail.com. He's available for project discussions, job opportunities, or technical consultations!";
    }
    
    if (this.hasSkillIntent(lowerMessage)) {
      return "Peter is a skilled web developer with expertise in modern technologies including React, JavaScript, Node.js, and Firebase. He specializes in full-stack web development and creating responsive, user-friendly applications. You can check the Skills section for detailed information about his technical capabilities. 💻";
    }
    
    if (this.hasProjectIntent(lowerMessage)) {
      return "Peter has worked on various web development projects including his portfolio website, web applications, and other creative solutions. His projects typically use technologies like React, Firebase, and modern CSS. Please visit the Projects section to see his work with live demos and GitHub repositories. 🚀";
    }
    
    if (this.hasExperienceIntent(lowerMessage)) {
      return "Peter has experience in web development roles working with various technologies and frameworks. He's passionate about creating efficient and scalable web solutions. The Experience section contains detailed information about his work history and professional background. 👨‍💻";
    }
    
    if (this.hasGreetingIntent(lowerMessage)) {
      return "Hello! I'm Peter's AI assistant. 😊 I can help you learn about his technical skills, projects, work experience, or schedule a meeting. What would you like to know about Peter's portfolio?";
    }
    
    return "I'm here to help you learn about Peter's portfolio! I can tell you about his technical skills, projects, work experience, certifications, or help schedule a meeting. What would you like to know? 🤔";
  }

  // Enhanced intent detection
  hasSkillIntent(message) {
    const skillKeywords = [
      'skill', 'expertise', 'technology', 'tech stack', 'framework',
      'language', 'tool', 'what can you do', 'experience', 'proficient', 'technologies',
      'stack', 'programming', 'coding', 'develop'
    ];
    return skillKeywords.some(keyword => message.includes(keyword));
  }

  hasTechIntent(message) {
    const techKeywords = [
      'react', 'javascript', 'node', 'python', 'html', 'css', 'firebase',
      'database', 'frontend', 'backend', 'fullstack', 'web development',
      'typescript', 'mongodb', 'sql', 'api', 'git'
    ];
    return techKeywords.some(keyword => message.includes(keyword));
  }

  hasProjectIntent(message) {
    const projectKeywords = [
      'project', 'work', 'portfolio', 'what have you built',
      'examples', 'case study', 'github', 'build', 'application',
      'website', 'app', 'demo', 'show me your work'
    ];
    return projectKeywords.some(keyword => message.includes(keyword));
  }

  hasExperienceIntent(message) {
    const experienceKeywords = [
      'experience', 'work history', 'career', 'background',
      'professional', 'job', 'position', 'employed', 'work',
      'company', 'role', 'cv', 'resume'
    ];
    return experienceKeywords.some(keyword => message.includes(keyword));
  }

  hasCertificationIntent(message) {
    const certKeywords = [
      'certification', 'certificate', 'course', 'learning',
      'qualification', 'credential', 'certified'
    ];
    return certKeywords.some(keyword => message.includes(keyword));
  }

  hasAboutIntent(message) {
    const aboutKeywords = [
      'about', 'who are you', 'background', 'story',
      'introduce', 'tell me about', 'yourself'
    ];
    return aboutKeywords.some(keyword => message.includes(keyword));
  }

  hasMeetingIntent(message) {
    const meetingKeywords = [
      'meeting', 'schedule', 'book', 'call', 'discuss', 'consultation',
      'interview', 'appointment', 'connect', 'talk', 'demo', 'hire', 'meet',
      'contact', 'reach', 'available'
    ];
    return meetingKeywords.some(keyword => message.includes(keyword));
  }

  hasGreetingIntent(message) {
    const greetingKeywords = [
      'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon',
      'good evening', 'howdy', 'what\'s up', 'yo', 'hi there'
    ];
    return greetingKeywords.some(keyword => message.includes(keyword));
  }

  // Clear conversation history
  clearHistory() {
    this.conversationHistory = [];
    console.log('🗑️ Conversation history cleared');
  }

  // Get conversation history (for debugging)
  getHistory() {
    return this.conversationHistory;
  }

  // Check if service is ready
  isReady() {
    return this.isInitialized && GEMINI_API_KEY;
  }
}

// Create singleton instance
export const aiService = new AIService();

// Export a function to check if AI service is available
export const isAIServiceAvailable = () => {
  return aiService.isInitialized && GEMINI_API_KEY && GEMINI_API_KEY !== 'AIzaSyBm6hjZtO5UXECsPwa4sOG3FDupZA-ZM9w';
};

// Export for debugging
export const debugAIService = {
  getApiKey: () => GEMINI_API_KEY ? '✅ API Key Set' : '❌ API Key Missing',
  getApiUrl: () => GEMINI_API_URL,
  getHistory: () => aiService.getHistory(),
  clearHistory: () => aiService.clearHistory(),
  isReady: () => aiService.isReady()
};