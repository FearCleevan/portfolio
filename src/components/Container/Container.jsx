import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// Real SVG icons
function ProjectIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function CertificationIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3h14a2 2 0 012 2v2a2 2 0 01-2 2h-1.5M5 3a2 2 0 00-2 2v2a2 2 0 002 2h1.5M5 3v18m14-18v18M9 7h6m-6 4h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 15l2 2 4-4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15a7 7 0 100-14 7 7 0 000 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  );
}

const CERT_ICONS = {
  trophy: TrophyIcon,
  star: StarIcon,
  award: AwardIcon,
};

function SectionHeader({ emoji, title, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <span className="text-gray-700 dark:text-gray-300">{emoji}</span>
        {title}
      </h2>
      {to && (
        <Link
          to={to}
          className="flex items-center gap-1 text-xs font-medium text-gray-900 dark:text-white hover:underline"
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

export default function Container({ projects = [], certifications = [] }) {
  const { isDarkMode } = useTheme();

  const displayedProjects = projects.slice(0, 4);
  const displayedCertifications = certifications.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* ── Recent Projects ── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300">
        <SectionHeader emoji={<ProjectIcon />} title="Recent Projects" to="/projects" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayedProjects.map((project) => {
            const href = project.liveUrl || project.url;
            return (
              <a
                key={project.id}
                href={href || '#'}
                target={href ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 p-3.5 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-400 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  {href && (
                    <span className="shrink-0 mt-0.5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      <ExternalLinkIcon />
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed transition-colors duration-300">
                  {project.description}
                </p>
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-1.5 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent transition-colors duration-300">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Certifications & Achievements ── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300">
        <SectionHeader emoji={<CertificationIcon />} title="Certifications & Achievements" to="/certifications" />

        <div className="space-y-3">
          {displayedCertifications.map((cert) => {
            const Icon = CERT_ICONS[cert.icon] || AwardIcon;
            return (
              <div
                key={cert.id}
                className="flex items-start gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-400 dark:border-gray-700 transition-colors duration-300"
              >
                {/* Icon */}
                <div className="shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  <Icon />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug transition-colors duration-300">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">
                    {cert.issuer}
                  </p>
                  {cert.year && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent transition-colors duration-300">
                      {cert.year}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}