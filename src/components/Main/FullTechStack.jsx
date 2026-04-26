import PageLayout from '../shared/PageLayout';
import { useTechStack } from '../../hooks/useTechStack';
import { useSkills } from '../../hooks/useSkills';
import {
  SiJavascript, SiTypescript, SiHtml5, SiCss3, SiMysql, SiPython,
  SiReact, SiNextdotjs, SiExpo, SiTailwindcss, SiVite,
  SiNodedotjs, SiExpress, SiFastapi, SiGoogleappsscript,
  SiSupabase, SiFirebase, SiPostgresql,
  SiVercel, SiHostinger, SiApple, SiGoogleplay,
  SiGit, SiGithub, SiFigma, SiPostman, SiCloudinary, SiStripe,
} from 'react-icons/si';
import { FiCode, FiLayout, FiServer, FiDatabase, FiCloud, FiTool } from 'react-icons/fi';

// Map icon strings from JSON to actual components
const ICON_MAP = {
  SiJavascript, SiTypescript, SiHtml5, SiCss3, SiMysql, SiPython,
  SiReact, SiNextdotjs, SiExpo, SiTailwindcss, SiVite,
  SiNodedotjs, SiExpress, SiFastapi, SiGoogleappsscript,
  SiSupabase, SiFirebase, SiPostgresql,
  SiVercel, SiHostinger, SiApple, SiGoogleplay,
  SiGit, SiGithub, SiFigma, SiPostman, SiCloudinary, SiStripe,
};

// Category icon mapping based on JSON "icon" field
const CATEGORY_ICONS = {
  code: FiCode,
  layout: FiLayout,
  server: FiServer,
  database: FiDatabase,
  cloud: FiCloud,
  tool: FiTool,
};

function getTechIcon(iconName) {
  if (!iconName) return null;
  const Icon = ICON_MAP[iconName];
  return Icon ? <Icon className="w-3.5 h-3.5 shrink-0" /> : null;
}

function getCategoryIcon(iconName) {
  const Icon = CATEGORY_ICONS[iconName] || FiCode;
  return <Icon className="w-4 h-4" />;
}

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
            className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300"
          >
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
              <span className="text-gray-700 dark:text-gray-300">
                {getCategoryIcon(group.icon)}
              </span>
              {group.category}
            </h2>

            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {item.icon && getTechIcon(item.icon)}
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Professional skills ── */}
      {skills.professional?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
            <span className="text-gray-700 dark:text-gray-300">
              <FiTool className="w-4 h-4" />
            </span>
            Professional Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.professional.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Soft skills ── */}
      {skills.soft?.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 transition-colors duration-300">
            <span className="text-gray-700 dark:text-gray-300">
              <FiCode className="w-4 h-4" />
            </span>
            Soft Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.soft.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
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