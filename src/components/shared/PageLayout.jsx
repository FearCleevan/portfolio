import { Link } from 'react-router-dom';

/**
 * Shared full-page layout used by FullExperience, FullTechStack,
 * AllProjects, AllCertifications.
 */
export default function PageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Back + title row */}
        <div className="space-y-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <svg
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}