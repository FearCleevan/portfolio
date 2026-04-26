import { usePersonalDetails } from '../../hooks/usePersonalDetails';
import { FaGithub, FaLinkedin, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
import { trackSocialClick } from '../../services/analyticsService';

export default function Footer() {
  const { personalDetails } = usePersonalDetails();
  const year = new Date().getFullYear();

  const socials = [
    {
      label: 'GitHub',
      href: personalDetails?.githubUrl,
      icon: <FaGithub className="w-4 h-4" />,
    },
    {
      label: 'LinkedIn',
      href: personalDetails?.linkedinUrl,
      icon: <FaLinkedin className="w-4 h-4" />,
    },
    {
      label: 'Facebook',
      href: personalDetails?.facebookUrl,
      icon: <FaFacebook className="w-4 h-4" />,
    },
    {
      label: 'Instagram',
      href: personalDetails?.instagramUrl,
      icon: <FaInstagram className="w-4 h-4" />,
    },
    {
      label: 'Email',
      href: `mailto:${personalDetails?.email}`,
      icon: <FaEnvelope className="w-4 h-4" />,
    },
  ].filter((s) => s.href);

  return (
    <footer className="w-full bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm px-6 py-5 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Copyright */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
          © {year}{' '}
          <span className="text-gray-900 dark:text-white font-medium duration-300">
            {personalDetails?.name || 'Peter Paul Abillar Lazan'}
          </span>
          . All rights reserved.
        </p>

        {/* Social icons */}
        {socials.length > 0 && (
          <div className="flex items-center gap-2">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                onClick={() => trackSocialClick(label.toLowerCase())}
                className="flex items-center justify-center w-10 h-10 bg-gray-50 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white transition-colors duration-300"
              >
                {icon}
              </a>
            ))}
          </div>
        )}

        {/* Built with */}
        <p className="text-xs text-gray-400 dark:text-gray-500 duration-300">
          Built with{' '}
          <span className="text-gray-900 dark:text-white font-medium duration-300">React</span>
          {' + '}
          <span className="text-gray-900 dark:text-white font-medium duration-300">Tailwind</span>
        </p>
      </div>
    </footer>
  );
}