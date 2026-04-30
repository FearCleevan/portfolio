import { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaDownload, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { usePersonalDetails } from '../../hooks/usePersonalDetails';
import { trackCVDownload, trackMeetingClick } from '../../services/analyticsService';
import profile from '../../assets/profile.png';

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      type="button"
      className={`
        relative flex items-center w-12 h-6 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 dark:focus-visible:ring-gray-400
        ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          absolute flex items-center justify-center w-5 h-5 shadow-sm transition-all duration-300
          ${isDarkMode
            ? 'translate-x-6 bg-gray-900'
            : 'translate-x-0.5 bg-white'
          }
        `}
      >
        {isDarkMode
          ? <FaMoon className="w-2.5 h-2.5 text-gray-400" />
          : <FaSun className="w-2.5 h-2.5 text-gray-700" />
        }
      </span>
    </button>
  );
}

export default function Header() {
  const { isDarkMode } = useTheme();
  const { personalDetails } = usePersonalDetails();

  const handleScheduleCall = () => {
    trackMeetingClick();
    window.open(
      personalDetails?.calendlyUrl || 'https://calendly.com/fearcleevan/30min',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleSendEmail = () => {
    const email = personalDetails?.email || 'jonathan.mauring17@gmail.com';
    const subject = 'Regarding your portfolio';
    const body = 'Hello,\n\nI came across your portfolio and...';
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <header className="w-full overflow-hidden bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm duration-300">
      <div className="p-6 sm:p-8">
        {/* Profile row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 overflow-hidden shadow-md">
              <img
                src={profile}
                alt="Peter Paul Abillar Lazan"
                className="w-full h-full object-cover"
                width={128}
                height={128}
                loading="eager"
              />
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900 shadow-sm duration-300" />
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            {/* Name + verified badge with theme toggle on the right */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate duration-300">
                  {personalDetails?.name || 'Peter Paul Abillar Lazan'}
                </h1>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-label="Verified">
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0" />
                </svg>
                {/* Open to Work badge */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open to Work
                </span>
              </div>
              <ThemeToggle />
            </div>

            {/* Value proposition tagline */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-snug duration-300">
              I build fast, scalable web and mobile apps — and I ship on time.
            </p>

            {/* Open for tags */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-3">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 self-center duration-300">Open for:</span>
              {[
                'Full-Stack Web Development',
                'Mobile App Development',
                'Full-Time & Remote Roles',
                'Freelance & Project-Based',
                'IT Systems & DevOps',
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-transparent duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-5 duration-300">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 shrink-0 duration-300" />
              <span>{personalDetails?.location || 'Davao City, Philippines'}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <button
                onClick={handleScheduleCall}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-gray-900 dark:border-white text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 active:scale-95 transition-all duration-300"
              >
                <FaPhone className="w-3 h-3" />
                Schedule a Call
              </button>

              <button
                onClick={handleSendEmail}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white active:scale-95 transition-all duration-300"
              >
                <FaEnvelope className="w-3 h-3" />
                Send Email
              </button>

              <a
                href="/LazanPeterPaul_CV.pdf"
                download="Peter-Paul-Lazan-Resume.pdf"
                onClick={trackCVDownload}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-gray-900 dark:border-white text-gray-900 dark:text-white bg-white dark:bg-gray-900 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 active:scale-95 transition-all duration-300"
              >
                <FaDownload className="w-3 h-3" />
                Download CV
              </a>
            </div>

            {/* Response time note */}
            <p className="mt-2 text-center sm:text-left text-[10px] text-gray-400 dark:text-gray-500 duration-300">
              Usually responds within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}