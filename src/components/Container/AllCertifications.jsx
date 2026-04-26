import PageLayout from '../shared/PageLayout';
import { useCertifications } from '../../hooks/useCertifications';
import { useEducation } from '../../hooks/useEducation';

// Real SVG icons
function TrophyIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3h14a2 2 0 012 2v2a2 2 0 01-2 2h-1.5M5 3a2 2 0 00-2 2v2a2 2 0 002 2h1.5M5 3v18m14-18v18M9 7h6m-6 4h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 15l2 2 4-4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15a7 7 0 100-14 7 7 0 000 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
    </svg>
  );
}

const ICON_MAP = {
  trophy: TrophyIcon,
  star: StarIcon,
  award: AwardIcon,
  education: EducationIcon,
};

export default function AllCertifications() {
  const { certifications } = useCertifications();
  const { education }      = useEducation();

  return (
    <PageLayout
      title="Certifications & Education"
      subtitle="Academic achievements and education background"
    >
      {/* ── Certifications ── */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert) => {
            const Icon = ICON_MAP[cert.icon] || AwardIcon;
            return (
              <div
                key={cert.id}
                className="flex flex-col bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 hover:border-gray-700 dark:hover:border-gray-300 transition-all duration-200"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300">
                  <Icon />
                </div>

                {/* Category badge */}
                <span className="inline-block mb-2 px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent self-start">
                  {cert.category}
                </span>

                <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-1 transition-colors duration-300">
                  {cert.title}
                </h3>

                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  {cert.issuer}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 transition-colors duration-300">
                  {cert.description}
                </p>

                {cert.year && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{cert.year}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Education ── */}
      {education?.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-700 dark:text-gray-300">
                        <EducationIcon />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white transition-colors duration-300">{edu.degree}</h3>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-8 transition-colors duration-300">{edu.school}</p>
                    <div className="flex flex-wrap items-center gap-2 ml-8 text-xs text-gray-400 dark:text-gray-500">
                      <span>{edu.period}</span>
                      <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 transition-colors duration-300" />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                </div>
                {edu.description && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}