import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Container from '../Container/Container';
import ContainerSecond from '../Container/ContainerSecond';
import Footer from '../Footer/Footer';
import GitHubCalendar from '../Container/GitHubCalendar';
import { useTheme } from '../../context/ThemeContext';
import { usePersonalDetails } from '../../hooks/usePersonalDetails';
import { useTechStack } from '../../hooks/useTechStack';
import { useExperience } from '../../hooks/useExperience';
import { useProjects } from '../../hooks/useProjects';
import { useCertifications } from '../../hooks/useCertifications';

// Real SVG icons
function AboutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function TechStackIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function ExperienceIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  );
}

const HOW_I_BUILD_STEPS = [
  {
    step: 'Plan',
    desc: 'Define scope, tech stack & architecture using AI-assisted research',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    step: 'Design',
    desc: 'Wireframe with Figma or sketch out component structure',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    step: 'Build',
    desc: 'Develop with React / Next.js / React Native + Supabase backend',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    step: 'Test',
    desc: 'Manual + automated checks, cross-device & cross-browser QA',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    step: 'Deploy',
    desc: 'CI/CD via Vercel, Expo EAS, or GitHub Actions — ship to production',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.98 14.98 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
];

// Shared bento card shell
function Card({ children, className = '' }) {
  return (
    <section className={`bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300 ${className}`}>
      {children}
    </section>
  );
}

// Section title row with optional "View All" link
function SectionHeader({ icon, title, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white duration-300">
        <span className="text-gray-700 dark:text-gray-300 duration-300">{icon}</span>
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="flex items-center gap-1 text-xs font-medium text-gray-900 dark:text-white hover:underline transition-colors duration-300"
        >
          View All
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

export default function Main() {
  const { personalDetails } = usePersonalDetails();
  const { techStack } = useTechStack();
  const { experience } = useExperience();
  const { projects } = useProjects();
  const { certifications } = useCertifications();

  // First 3 groups, max 6 items each for the home preview
  const previewStack = techStack.slice(0, 3).map((g) => ({
    ...g,
    items: g.items.slice(0, 6),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        <Header />

        {/* ── Two-column bento grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* ── Left column ── */}
          <div className="space-y-4">

            {/* About */}
            <Card>
              <SectionHeader icon={<AboutIcon />} title="About" />
              <div className="space-y-3">
                {(personalDetails?.summary || '').split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                    {para}
                  </p>
                ))}
              </div>
            </Card>

            {/* Tech Stack preview */}
            <Card>
              <SectionHeader icon={<TechStackIcon />} title="Tech Stack" to="/tech-stack" />
              <div className="space-y-4">
                {previewStack.map((group) => (
                  <div key={group.id}>
                    <p className="text-xs font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-2 transition-colors duration-300">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item.name}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent transition-colors duration-300"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* ── Right column ── */}
          <div>
            {/* Experience timeline */}
            <Card className="h-full">
              <SectionHeader icon={<ExperienceIcon />} title="Experience" to="/experience" />
              <div className="relative pl-5">
                {/* Vertical line */}
                <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-100 dark:bg-gray-800 transition-colors duration-300" />

                <div className="space-y-5">
                  {experience.map((item) => (
                    <div key={item.id} className="relative">
                      {/* Dot */}
                      <div className={`
                        absolute -left-4.25 top-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 shadow-sm transition-colors duration-300
                        ${item.current
                          ? 'bg-gray-900 dark:bg-white ring-2 ring-gray-900/20 dark:ring-white/20'
                          : 'bg-gray-300 dark:bg-gray-600'
                        }
                      `} />

                      <div className="space-y-0.5">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold leading-snug text-gray-900 dark:text-white transition-colors duration-300">
                            {item.title}
                          </h3>
                          {item.current && (
                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">{item.company}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-300">{item.period} · {item.location}</p>
                        {/* Tag preview */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent transition-colors duration-300">
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] text-gray-400 dark:text-gray-500">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ── How I Build ── */}
        <Card>
          <SectionHeader icon={<WorkflowIcon />} title="How I Build" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {HOW_I_BUILD_STEPS.map(({ step, desc, icon }, i) => (
              <div key={step} className="relative flex flex-col items-center text-center gap-3 p-4 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 transition-colors duration-300">
                {/* Step number */}
                <span className="absolute top-2 left-2 text-[10px] font-bold text-gray-300 dark:text-gray-600 select-none transition-colors duration-300">
                  0{i + 1}
                </span>
                {/* Icon */}
                <span className="mt-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  {icon}
                </span>
                {/* Step label */}
                <span className="text-xs font-semibold text-gray-900 dark:text-white tracking-wide transition-colors duration-300">
                  {step}
                </span>
                {/* Description */}
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                  {desc}
                </p>
                {/* Arrow connector — visible only on lg, positioned on right edge */}
                {/* {i < HOW_I_BUILD_STEPS.length - 1 && (
                  <span className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 items-center justify-center bg-white dark:bg-gray-900 text-gray-300 dark:text-gray-600 text-xs select-none transition-colors duration-300">
                    →
                  </span>
                )} */}
              </div>
            ))}
          </div>
        </Card>

        {/* ── Projects + Certifications ── */}
        <Container projects={projects} certifications={certifications} />

        {/* ── Connect + Blog ── */}
        <ContainerSecond />

        {/* ── GitHub Calendar ── */}
        <GitHubCalendar username={import.meta.env.VITE_GITHUB_USERNAME} />

        <Footer />
      </div>
    </div>
  );
}