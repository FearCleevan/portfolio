// src/components/RecentBlogs/RecentBlogs.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../../firebase/services/contentService';
import styles from './RecentBlogs.module.css';

const stripHtml = (value = '') =>
  value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const getExcerpt = (post) => {
  const rawExcerpt = stripHtml(post?.excerpt || '');
  if (rawExcerpt) return rawExcerpt;
  return stripHtml(post?.content || '').slice(0, 170);
};

export default function RecentBlogs({ isDarkMode }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return (
      <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.allBlogsContainer} ${isDarkMode ? styles.darkMode : ''}`}>
          <div className={styles.loadingOverlay}>
            <div className={`${styles.spinner} ${isDarkMode ? styles.darkSpinner : ''}`}></div>
            <p className={isDarkMode ? styles.darkText : ''}>Loading blog posts...</p>
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
            <button className={isDarkMode ? styles.darkButton : ''} onClick={() => window.location.reload()}>
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
        </div>

        {blogPosts.length === 0 ? (
          <div className={`${styles.emptyState} ${isDarkMode ? styles.darkEmptyState : ''}`}>
            <p className={isDarkMode ? styles.darkText : ''}>No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.blogGrid}>
            {blogPosts.map((post) => (
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
