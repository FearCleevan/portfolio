import { useEffect, useState } from 'react';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            type="button"
            className="fixed bottom-20 right-6 max-[480px]:bottom-[70px] max-[480px]:right-4 w-10 h-10 max-[480px]:w-9 max-[480px]:h-9 rounded-full bg-gray-900 dark:bg-gray-700 text-white flex items-center justify-center cursor-pointer z-[998] shadow-md transition-all duration-200 opacity-[0.85] hover:opacity-100 hover:-translate-y-0.5 hover:bg-gray-800 dark:hover:bg-gray-600"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    );
}
