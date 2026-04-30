import { FaMapMarkerAlt } from 'react-icons/fa';
import PageLayout from '../shared/PageLayout';
import { useExperience } from '../../hooks/useExperience';

export default function FullExperience() {
  const { experience } = useExperience();

  return (
    <PageLayout
      title="Experience"
      subtitle="2+ years of hands-on experience across full-stack development, mobile DevOps, and IT systems administration."
    >
      <div className="relative pl-6 space-y-6">
        {/* Vertical timeline line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800" />

        {experience.map((item) => (
          <div key={item.id} className="relative">
            {/* Timeline dot */}
            <div className={`
              absolute -left-6 top-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-950 shadow
              ${item.current
                ? 'bg-gray-900 dark:bg-white ring-4 ring-gray-900/15 dark:ring-white/15'
                : 'bg-gray-300 dark:bg-gray-600'
              }
            `} />

            {/* Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6">

              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`text-base font-bold leading-snug ${item.current ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                      {item.title}
                    </h2>
                    {item.current && (
                      <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.company}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <span>{item.period}</span>
                    {item.type && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 shrink-0 duration-300" />
                        <span>{item.type}</span>
                      </>
                    )}
                    {item.location && (
                      <>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 shrink-0 duration-300" />
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          {item.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Responsibilities */}
              {item.responsibilities?.length > 0 && (
                <ul className="space-y-2 mb-5">
                  {item.responsibilities.map((point, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tags */}
              {item.tags?.length > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                    Technologies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}