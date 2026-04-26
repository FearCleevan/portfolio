import PageLayout from '../shared/PageLayout';
import { useTechStack } from '../../hooks/useTechStack';
import { useSkills } from '../../hooks/useSkills';

export default function FullTechStack() {
  const { techStack } = useTechStack();
  const { skills } = useSkills();

  const totalItems = techStack.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <PageLayout
      title="Tech Stack"
      subtitle={`${totalItems} technologies across ${techStack.length} categories`}
    >
      {/* ── Category cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {techStack.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
          >
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-blue-500" />
              {group.category}
            </h2>

            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                >
                  {/* Brand colour dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#94a3b8' }}
                  />
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Professional skills ── */}
      {skills.professional?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-violet-500" />
            Professional Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.professional.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-800/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Soft skills ── */}
      {skills.soft?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-500" />
            Soft Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.soft.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
