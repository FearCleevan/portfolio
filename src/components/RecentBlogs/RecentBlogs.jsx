import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import PageLayout from '../shared/PageLayout';
import { useBlogPosts } from '../../hooks/useBlogPosts';

export default function RecentBlogs() {
  const { blogPosts } = useBlogPosts();
  const [search, setSearch] = useState('');

  const sorted = useMemo(
    () => [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [blogPosts]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [sorted, search]);

  return (
    <PageLayout title="All Blog Posts" subtitle={`${blogPosts.length} ${blogPosts.length === 1 ? 'post' : 'posts'}`}>

      {/* ── Search ── */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, tag, or content…"
          aria-label="Search blog posts"
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-500 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white hover:border-gray-900 dark:hover:border-white transition-colors duration-200"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {search && (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} {filtered.length === 1 ? 'post' : 'posts'} found
        </p>
      )}

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {search ? `No posts match "${search}"` : 'No blog posts yet. Check back soon!'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-gray-900 dark:text-white hover:underline transition-colors">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-500 shadow-sm hover:border-gray-900 dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 p-5"
            >
              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className="px-2 py-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2 mb-2">
                {post.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 mb-2">
                <time>{post.date}</time>
                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700" />
                <span>{post.readTime}</span>
              </div>

              {/* Excerpt */}
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                {post.excerpt}
              </p>

              {/* Read more */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Read more
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageLayout>
  );
}