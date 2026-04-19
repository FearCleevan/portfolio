// src/components/RecentBlogs/RecentBlogs.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../../firebase/services/contentService';
import styles from './RecentBlogs.module.css';
import { useTheme } from '../../context/ThemeContext';

const stripHtml = (value = '') =>
  value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const getExcerpt = (post) => {
  const rawExcerpt = stripHtml(post?.excerpt || '');
  if (rawExcerpt) return rawExcerpt;
  return stripHtml(post?.content || '').slice(0, 170);
};

export default function RecentBlogs() {
  const { isDarkMode } = useTheme();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return blogPosts;
    const q = searchQuery.toLowerCase();
    return blogPosts.filter(post =>
      post.title?.toLowerCase().includes(q) ||
      (post.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      getExcerpt(post).toLowerCase().includes(q)
    );
  }, [blogPosts, searchQuery]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await getBlogPosts();
        const sortedPosts = [...posts].sort(
          (a, b) => new Date(b?.date || b?.createdAt || 0) - new Date(a?.date || a?.createdAt || 0)
        );
        setBlogPosts(sortedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    const skCls = `${styles.skeletonLine} ${isDarkMode ? styles.darkSkeleton : ''}`;
    return (
      <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.allBlogsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
          <div className={styles.header}>
            <div className={skCls} style={{ width: '110px', height: '14px', marginBottom: '20px', borderRadius: '6px' }} />
            <div className={skCls} style={{ width: '180px', height: '28px', borderRadius: '6px' }} />
            <div className={skCls} style={{ width: '60px', height: '12px', marginTop: '8px', borderRadius: '4px' }} />
          </div>
          <div className={skCls} style={{ width: '100%', height: '40px', borderRadius: '8px', marginBottom: '1.5rem' }} />
          <div className={styles.blogGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${styles.blogCard} ${isDarkMode ? styles.darkBlogCard : ''}`}>
                <div className={skCls} style={{ width: '85%', height: '18px', marginBottom: '8px' }} />
                <div className={skCls} style={{ width: '60%', height: '18px', marginBottom: '12px' }} />
                <div className={skCls} style={{ width: '50%', height: '12px', marginBottom: '12px' }} />
                <div className={skCls} style={{ width: '100%', height: '13px', marginBottom: '6px' }} />
                <div className={skCls} style={{ width: '90%', height: '13px', marginBottom: '6px' }} />
                <div className={skCls} style={{ width: '70%', height: '13px', marginBottom: '14px' }} />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div className={skCls} style={{ width: '52px', height: '22px', borderRadius: '4px' }} />
                  <div className={skCls} style={{ width: '60px', height: '22px', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.allBlogsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
          <div className={styles.errorOverlay}>
            <p className={isDarkMode ? styles.darkText : ''}>Error loading blog posts: {error}</p>
            <button type="button" className={isDarkMode ? styles.darkButton : ''} onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={`${styles.allBlogsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.header}>
          <Link to="/" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
            <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Home
          </Link>
          <h1 className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>All Blog Posts</h1>
          <p className={`${styles.pageSubtitle} ${isDarkMode ? styles.darkPageSubtitle : ''}`}>
            {blogPosts.length} {blogPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        <div className={styles.searchBar}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            className={`${styles.searchInput} ${isDarkMode ? styles.darkSearchInput : ''}`}
            placeholder="Search by title, tag, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search blog posts"
          />
          {searchQuery && (
            <button type="button" className={styles.searchClear} onClick={() => setSearchQuery('')} aria-label="Clear search">×</button>
          )}
        </div>

        {searchQuery && (
          <p className={`${styles.resultsCount} ${isDarkMode ? styles.darkResultsCount : ''}`}>
            {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
          </p>
        )}

        {filteredPosts.length === 0 && searchQuery ? (
          <p className={`${styles.noResults} ${isDarkMode ? styles.darkNoResults : ''}`}>No posts match &ldquo;{searchQuery}&rdquo;.</p>
        ) : blogPosts.length === 0 ? (
          <div className={`${styles.emptyState} ${isDarkMode ? styles.darkEmptyState : ''}`}>
            <p className={isDarkMode ? styles.darkText : ''}>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {filteredPosts.map((post) => (
              <div key={post.id} className={`${styles.blogCard} ${isDarkMode ? styles.darkBlogCard : ''}`}>
                <Link to={`/blog/${post.slug}`} className={styles.blogLink}>
                  <h3 className={`${styles.blogTitle} ${isDarkMode ? styles.darkText : ''}`}>{post.title}</h3>
                  <div className={styles.blogMeta}>
                    <time className={`${styles.blogDate} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{post.date || '-'}</time>
                    <span className={`${styles.blogSeparator} ${isDarkMode ? styles.darkSecondaryText : ''}`}>&bull;</span>
                    <span className={`${styles.blogReadTime} ${isDarkMode ? styles.darkSecondaryText : ''}`}>
                      {post.readTime || '-'}
                    </span>
                  </div>
                  <p className={`${styles.blogExcerpt} ${isDarkMode ? styles.darkSecondaryText : ''}`}>
                    {getExcerpt(post)}
                  </p>
                  <div className={styles.blogTags}>
                    {(post.tags || []).map((tag, index) => (
                      <span key={`${tag}-${index}`} className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
