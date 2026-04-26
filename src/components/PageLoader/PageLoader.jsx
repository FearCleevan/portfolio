import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';

const ROUTE_LABELS = {
  '/': 'Portfolio',
  '/tech-stack': 'Tech Stack',
  '/experience': 'Experience',
  '/projects': 'Projects',
  '/certifications': 'Certifications',
  '/blog': 'Blog',
};

function getLabelFromPath(pathname) {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  if (pathname.startsWith('/blog/')) return 'Blog Post';
  return 'Loading';
}

// ─── Thin top progress bar — shown on every route change ─────────────────────
export function NavigationBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(0);
    setVisible(true);

    const t1 = setTimeout(() => setWidth(70), 50);
    const t2 = setTimeout(() => setWidth(95), 400);
    const t3 = setTimeout(() => setWidth(100), 700);
    const t4 = setTimeout(() => setVisible(false), 950);

    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none">
      <div
        className="h-full bg-gray-900 dark:bg-white transition-all ease-out shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgba(255,255,255,0.2)]"
        style={{ width: `${width}%`, transitionDuration: width === 70 ? '350ms' : '250ms' }}
      />
    </div>
  );
}

// ─── Full-screen overlay — used as Suspense fallback ─────────────────────────
export default function PageLoader({ label }) {
  const location = useLocation();
  const displayLabel = label || getLabelFromPath(location?.pathname || '/');

  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-white dark:bg-gray-950 select-none">

      {/* Animated brackets */}
      <div className="relative flex items-center gap-6 mb-8">
        <span className="text-6xl font-thin text-gray-200 dark:text-gray-700 animate-[bracketLeft_1.6s_ease-in-out_infinite]">
          {'{'}
        </span>

        {/* Core pulse icon */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <div className="absolute inset-0 rounded-full bg-gray-900/10 dark:bg-white/10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-gray-900/20 dark:bg-white/20 animate-ping [animation-delay:0.2s]" />
          <div className="relative w-8 h-8 rounded-full bg-gray-900 dark:bg-white shadow-lg shadow-gray-900/30 dark:shadow-white/30" />
        </div>

        <span className="text-6xl font-thin text-gray-200 dark:text-gray-700 animate-[bracketRight_1.6s_ease-in-out_infinite]">
          {'}'}
        </span>
      </div>

      {/* Route label */}
      <p className="text-sm font-medium tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-6">
        {displayLabel}
      </p>

      {/* Animated loading dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-gray-900/60 dark:bg-white/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
          />
        ))}
      </div>

      {/* Bottom progress shimmer */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-900/40 dark:via-white/40 to-transparent animate-[shimmerBar_2s_ease-in-out_infinite]" />
    </div>
  );
}