import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1a1a1a] p-8">
            <div className="text-center max-w-120">
                <p className="text-[clamp(6rem,20vw,9rem)] font-bold leading-none text-gray-200 dark:text-gray-700 mb-2">
                    404
                </p>
                <h1 className="text-[1.75rem] font-semibold text-gray-900 dark:text-[#f0f0f0] mb-3">
                    Page Not Found
                </h1>
                <p className="text-base text-gray-500 dark:text-[#a0a0a0] mb-8 leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800 dark:hover:bg-gray-600 no-underline"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
