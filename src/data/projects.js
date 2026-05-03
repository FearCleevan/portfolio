// ── HRIS Landing Page (proj-1) ──
import hrisLanding1 from '../assets/projectImages/hris-landing-page/image1.png';
import hrisLanding2 from '../assets/projectImages/hris-landing-page/image2.png';
import hrisLanding3 from '../assets/projectImages/hris-landing-page/image3.png';
import hrisLanding4 from '../assets/projectImages/hris-landing-page/image4.png';
import hrisLanding5 from '../assets/projectImages/hris-landing-page/image5.png';
import hrisLanding6 from '../assets/projectImages/hris-landing-page/image6.png';

// ── HRIS Admin Dashboard (proj-15) ──
import hrisAdmin1 from '../assets/projectImages/hris-admin-dashboard/image1.png';
import hrisAdmin2 from '../assets/projectImages/hris-admin-dashboard/image2.png';
import hrisAdmin3 from '../assets/projectImages/hris-admin-dashboard/image3.png';
import hrisAdmin4 from '../assets/projectImages/hris-admin-dashboard/image4.png';
import hrisAdmin5 from '../assets/projectImages/hris-admin-dashboard/image5.png';
import hrisAdmin6 from '../assets/projectImages/hris-admin-dashboard/image6.png';

// ── My AI Assistant (proj-2) ──
import aiAssistant1 from '../assets/projectImages/my-ai-assistant/image1.png';
import aiAssistant2 from '../assets/projectImages/my-ai-assistant/image2.png';
import aiAssistant3 from '../assets/projectImages/my-ai-assistant/image3.png';
import aiAssistant4 from '../assets/projectImages/my-ai-assistant/image4.png';
import aiAssistant5 from '../assets/projectImages/my-ai-assistant/image5.png';
import aiAssistant6 from '../assets/projectImages/my-ai-assistant/image6.png';

// ── Vyralyx (proj-4) ──
import vyralyx1 from '../assets/projectImages/vyralyx/image1.jpg';
import vyralyx2 from '../assets/projectImages/vyralyx/image2.jpg';
import vyralyx3 from '../assets/projectImages/vyralyx/image3.jpg';
import vyralyx4 from '../assets/projectImages/vyralyx/image4.jpg';
import vyralyx5 from '../assets/projectImages/vyralyx/image5.jpg';
import vyralyx6 from '../assets/projectImages/vyralyx/image6.jpg';

// ── Gooey Toast (proj-5) ──
import gooey1 from '../assets/projectImages/gooey/gooey1.png';
import gooey2 from '../assets/projectImages/gooey/gooey2.png';
import gooey3 from '../assets/projectImages/gooey/gooey3.png';
import gooey4 from '../assets/projectImages/gooey/gooey4.png';
import gooey5 from '../assets/projectImages/gooey/gooey5.png';
import gooey6 from '../assets/projectImages/gooey/gooey6.png';

// ── Rent App (proj-6) ──
import rentUp1 from '../assets/projectImages/rentUp/1a.jpg';
import rentUp2 from '../assets/projectImages/rentUp/2a.jpg';
import rentUp3 from '../assets/projectImages/rentUp/3a.jpg';
import rentUp4 from '../assets/projectImages/rentUp/4a.jpg';
import rentUp5 from '../assets/projectImages/rentUp/5a.jpg';
import rentUp6 from '../assets/projectImages/rentUp/6a.jpg';

// ── Project Management (proj-7) ──
import pm1 from '../assets/projectImages/projectManagement/image1.png';
import pm2 from '../assets/projectImages/projectManagement/image2.png';
import pm3 from '../assets/projectImages/projectManagement/image3.png';
import pm4 from '../assets/projectImages/projectManagement/image4.png';
import pm5 from '../assets/projectImages/projectManagement/image5.png';
import pm6 from '../assets/projectImages/projectManagement/image6.png';

// ── Launchpad (proj-8) ──
import launchpad1 from '../assets/projectImages/theLaunchpad/image1.png';
import launchpad2 from '../assets/projectImages/theLaunchpad/image2.png';
import launchpad3 from '../assets/projectImages/theLaunchpad/image3.png';
import launchpad4 from '../assets/projectImages/theLaunchpad/image4.png';
import launchpad5 from '../assets/projectImages/theLaunchpad/image5.png';
import launchpad6 from '../assets/projectImages/theLaunchpad/image6.png';

const projects = [
  {
    id: 'proj-1',
    title: 'HRIS SaaS Platform',
    description:
      'A comprehensive HR platform handling employee management, payroll tracking, and attendance — built for multi-role access with a responsive web and mobile interface.',
    currentlyBuilding: true,
    techStack: [
      'Next.js', 'React', 'Vite', 'React Native', 'Tailwind CSS',
      'CSS Modules', 'TypeScript', 'Supabase', 'PostgreSQL',
    ],
    category: 'Web & Mobile',
    type: 'SaaS',
    featured: true,
    sampleImages: [
      { url: hrisLanding1, alt: 'HRIS Landing Page 1' },
      { url: hrisLanding2, alt: 'HRIS Landing Page 2' },
      { url: hrisLanding3, alt: 'HRIS Landing Page 3' },
      { url: hrisLanding4, alt: 'HRIS Landing Page 4' },
      { url: hrisLanding5, alt: 'HRIS Landing Page 5' },
      { url: hrisLanding6, alt: 'HRIS Landing Page 6' },
    ],
    links: [
      { label: 'Landing Page', url: 'https://hrisph.vercel.app/' },
      { label: 'GitHub', url: 'https://github.com/FearCleevan/hris-saas-platform' },
    ],
  },
  {
    id: 'proj-15',
    title: 'HRIS Admin Dashboard',
    description:
      'Admin dashboard for the HRIS platform — manage employees, payroll, attendance, and analytics. Integrated with the same Supabase backend for real-time data.',
    currentlyBuilding: true,
    techStack: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    category: 'Web',
    type: 'Dashboard',
    featured: true,
    sampleImages: [
      { url: hrisAdmin1, alt: 'Admin Dashboard 1' },
      { url: hrisAdmin2, alt: 'Admin Dashboard 2' },
      { url: hrisAdmin3, alt: 'Admin Dashboard 3' },
      { url: hrisAdmin4, alt: 'Admin Dashboard 4' },
      { url: hrisAdmin5, alt: 'Admin Dashboard 5' },
      { url: hrisAdmin6, alt: 'Admin Dashboard 6' },
    ],
    links: [
      { label: 'Admin Dashboard', url: 'https://adminhrisph.vercel.app/' },
      { label: 'GitHub', url: 'https://github.com/FearCleevan/hris-saas-platform' },
    ],
  },
  {
    id: 'proj-2',
    title: 'My AI Assistant (Local LLM, RAG System)',
    description:
      'A fully offline AI assistant that reads private documents and answers questions with context — no API keys, no cloud. Built with Ollama, ChromaDB, and FastAPI.',
    techStack: [
      'Python', 'Ollama', 'ChromaDB', 'sentence-transformers', 'FastAPI',
      'PyQt6', 'Textual', 'BeautifulSoup', 'pypdf', 'TypeScript',
    ],
    category: 'AI / ML',
    type: 'Tool',
    featured: true,
    sampleImages: [
      { url: aiAssistant1, alt: 'AI Assistant 1' },
      { url: aiAssistant2, alt: 'AI Assistant 2' },
      { url: aiAssistant3, alt: 'AI Assistant 3' },
      { url: aiAssistant4, alt: 'AI Assistant 4' },
      { url: aiAssistant5, alt: 'AI Assistant 5' },
      { url: aiAssistant6, alt: 'AI Assistant 6' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/FearCleevan/My-AI-Assistant' },
    ],
  },
  {
    id: 'proj-3',
    title: 'PayUp — Late Payment Escalator',
    description:
      'A mobile app that automates payment reminders and escalation workflows for businesses — reducing manual follow-ups with push notifications and payment tracking.',
    techStack: ['React Native', 'Expo Router', 'TypeScript', 'NativeWind', 'Supabase'],
    category: 'Mobile',
    type: 'Mobile App',
    featured: true,
    sampleImages: [],
    links: [
      { label: 'GitHub', url: 'https://github.com/FearCleevan/Payup' },
    ],
  },
  {
    id: 'proj-4',
    title: 'Vyralyx — AI-Powered Fitness',
    description:
      'An AI-powered fitness mobile app that generates personalized workout plans, tracks progress, and provides real-time coaching feedback. Built with React Native and Supabase for real-time data sync.',
    techStack: ['React Native', 'Expo Router', 'TypeScript', 'NativeWind', 'Supabase'],
    category: 'Mobile',
    type: 'Mobile App',
    featured: true,
    sampleImages: [
      { url: vyralyx1, alt: 'Vyralyx 1' },
      { url: vyralyx2, alt: 'Vyralyx 2' },
      { url: vyralyx3, alt: 'Vyralyx 3' },
      { url: vyralyx4, alt: 'Vyralyx 4' },
      { url: vyralyx5, alt: 'Vyralyx 5' },
      { url: vyralyx6, alt: 'Vyralyx 6' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/FearCleevan/vyralyx-fitness-app' },
    ],
  },
  {
    id: 'proj-5',
    title: 'Gooey-Toast (React Native UI Library)',
    description:
      'A React Native UI component library featuring animated toast notifications with a gooey morphing effect. Built as a Turborepo monorepo with CLI tooling for easy integration.',
    techStack: [
      'React Native', 'Expo', 'TypeScript', 'Reanimated',
      'React Native SVG', 'React Native Gesture Handler', 'Turborepo', 'pnpm',
    ],
    category: 'Open Source',
    type: 'Library',
    featured: false,
    sampleImages: [
      { url: gooey1, alt: 'Gooey Toast 1' },
      { url: gooey2, alt: 'Gooey Toast 2' },
      { url: gooey3, alt: 'Gooey Toast 3' },
      { url: gooey4, alt: 'Gooey Toast 4' },
      { url: gooey5, alt: 'Gooey Toast 5' },
      { url: gooey6, alt: 'Gooey Toast 6' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/FearCleevan/rentapp' },
    ],
  },
  {
    id: 'proj-6',
    title: 'Rent App',
    description:
      'A mobile app for managing rental properties — listing units, tracking payments, generating receipts, and managing tenant records. Uses Supabase for real-time data and authentication.',
    techStack: ['React Native', 'TypeScript', 'Supabase', 'JavaScript'],
    category: 'Mobile',
    type: 'Mobile App',
    featured: false,
    sampleImages: [
      { url: rentUp1, alt: 'Rent App 1' },
      { url: rentUp2, alt: 'Rent App 2' },
      { url: rentUp3, alt: 'Rent App 3' },
      { url: rentUp4, alt: 'Rent App 4' },
      { url: rentUp5, alt: 'Rent App 5' },
      { url: rentUp6, alt: 'Rent App 6' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/FearCleevan/rentapp' },
    ],
  },
  {
    id: 'proj-7',
    title: 'Internal Project Management',
    description:
      'A web-based project management tool for internal team use. Features Kanban boards, sprint planning, task assignments, and progress tracking inspired by Plane.so and Jira.',
    techStack: ['Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
    category: 'Web',
    type: 'Web App',
    featured: false,
    sampleImages: [
      { url: pm1, alt: 'Project Management 1' },
      { url: pm2, alt: 'Project Management 2' },
      { url: pm3, alt: 'Project Management 3' },
      { url: pm4, alt: 'Project Management 4' },
      { url: pm5, alt: 'Project Management 5' },
      { url: pm6, alt: 'Project Management 6' },
    ],
    links: [
      { label: 'Live App', url: 'https://projectmanagement-smoky.vercel.app/login' },
      { label: 'GitHub', url: 'https://github.com/FearCleevan/projectmanagement' },
    ],
  },
  {
    id: 'proj-8',
    title: 'The Launchpad Inc — Company Landing Page',
    description:
      'Official company website for The Launchpad Inc with automated lead capture. Form submissions are routed to Google Sheets via Google Apps Script for CRM pipeline integration.',
    techStack: ['React.js', 'Google Apps Script', 'Google Sheets'],
    category: 'Web',
    type: 'Landing Page',
    featured: false,
    sampleImages: [
      { url: launchpad1, alt: 'The Launchpad Inc 1' },
      { url: launchpad2, alt: 'The Launchpad Inc 2' },
      { url: launchpad3, alt: 'The Launchpad Inc 3' },
      { url: launchpad4, alt: 'The Launchpad Inc 4' },
      { url: launchpad5, alt: 'The Launchpad Inc 5' },
      { url: launchpad6, alt: 'The Launchpad Inc 6' },
    ],
    links: [
      { label: 'Website', url: 'https://www.thelaunchpadteam.com/' },
      { label: 'GitHub', url: 'https://github.com/FearCleevan/prospect' },
    ],
  },
  {
    id: 'proj-9',
    title: 'Chat System — Company Internal Chat',
    description:
      'A real-time internal chat system with role-based access control, file/image sharing via Cloudinary, and read receipts — deployed for a live company.',
    techStack: ['React.js', 'Firebase', 'Firestore', 'Authentication', 'Cloudinary'],
    category: 'Web',
    type: 'Web App',
    featured: true,
    sampleImages: [],
    links: [],
  },
  {
    id: 'proj-10',
    title: 'LP CRM — Customer Relationship Management',
    description:
      'A full-stack CRM for a real sales team — managing leads, pipeline stages, customer profiles, and activity logs across the organization.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MySQL'],
    category: 'Web',
    type: 'Web App',
    featured: true,
    sampleImages: [],
    links: [],
  },
  {
    id: 'proj-11',
    title: 'TechnoBuild V2 — E-commerce with PC Builder & AI',
    description:
      'E-commerce platform for PC components with an intelligent PC builder tool and an AI assistant (Gemini API) that recommends compatible parts based on budget and use case.',
    techStack: ['React.js', 'Firebase', 'Gemini API', 'Cloudinary'],
    category: 'Web',
    type: 'E-commerce',
    featured: true,
    sampleImages: [],
    links: [],
  },
  {
    id: 'proj-12',
    title: 'School Management System',
    description:
      'Comprehensive school management system with student enrollment, grade management, attendance tracking, and teacher/parent portals. Built with React.js and Firebase Firestore.',
    techStack: ['React.js', 'Firebase', 'Firestore', 'Authentication', 'Cloudinary'],
    category: 'Web',
    type: 'Web App',
    featured: false,
    sampleImages: [],
    links: [],
  },
  {
    id: 'proj-13',
    title: 'ScapeDBM — Landscaping Services Landing Page',
    description:
      'Professional landing page for a landscaping services company. Features service catalog, portfolio gallery, contact form, and quote request system with responsive design.',
    techStack: ['React.js', 'CSS3', 'Cloudinary'],
    category: 'Web',
    type: 'Landing Page',
    featured: false,
    sampleImages: [],
    links: [],
  },
  {
    id: 'proj-14',
    title: 'Personal Portfolio',
    description:
      'My personal developer portfolio showcasing projects, experience, skills, and a built-in AI chatbot (Chat with Peter) powered by Google Gemini. Built with React.js and Tailwind CSS.',
    techStack: ['React.js', 'Tailwind CSS', 'Google Gemini API'],
    category: 'Web',
    type: 'Portfolio',
    featured: false,
    sampleImages: [],
    links: [],
  },
];

export default projects;