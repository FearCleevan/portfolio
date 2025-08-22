//src/components/RecentBlogs/RecentBlogs.jsx// src/components/RecentBlogs/RecentBlogs.jsx
import React from 'react';
import styles from './RecentBlogs.module.css';
import { Link } from 'react-router-dom';

// Mock data for blog posts (in a real app, this would come from an API)
const blogPosts = [
  {
    id: 1,
    slug: "navigating-the-startup-jungle-building-a-productive-and-positive-culture",
    title: "Navigating the Startup Jungle: Building a Productive and Positive Culture",
    date: "July 3, 2025",
    readTime: "3 min read",
    excerpt: "This post explores the key elements of a successful startup culture, offering practical tips and examples for fostering a productive and positive environment.",
    tags: ["Startup Culture", "Programming", "Web Development", "Tutorial"]
  },
  {
    id: 2,
    slug: "prompt-engineering-getting-the-most-out-of-large-language-models",
    title: "Prompt Engineering: Getting the Most Out of Large Language Models",
    date: "July 1, 2025",
    readTime: "3 min read",
    excerpt: "This post dives into prompt engineering, the art of crafting effective prompts to get the desired output from large language models (LLMs). We'll explore practical examples and best practices.",
    tags: ["LLMs", "Programming", "Web Development", "Tutorial"]
  },
  {
    id: 3,
    slug: "laravel-eloquent-beyond-the-basics-efficient-data-retrieval-and-manipulation",
    title: "Laravel Eloquent: Beyond the Basics - Efficient Data Retrieval and Manipulation",
    date: "June 26, 2025",
    readTime: "3 min read",
    excerpt: "This post dives into some lesser-known but incredibly useful features of Laravel's Eloquent ORM, going beyond basic CRUD operations. Learn how to optimize your queries, leverage accessors and mutators, and more.",
    tags: ["Laravel", "Programming", "Web Development", "Tutorial"]
  },
  {
    id: 4,
    slug: "mastering-javascript-practical-tips-and-best-practices",
    title: "Mastering JavaScript: Practical Tips and Best Practices",
    date: "August 5, 2025",
    readTime: "3 min read",
    excerpt: "JavaScript, the language of the web, continues to evolve. This post provides practical tips and best practices to help you write better JavaScript code.",
    tags: ["JavaScript", "Programming", "Web Development", "Tutorial"]
  },
  {
    id: 5,
    slug: "react-performance-optimization-techniques",
    title: "React Performance Optimization Techniques",
    date: "July 15, 2025",
    readTime: "4 min read",
    excerpt: "Learn how to optimize your React applications for better performance with these practical techniques and best practices.",
    tags: ["React", "Performance", "Web Development", "Tutorial"]
  },
  {
    id: 6,
    slug: "css-grid-vs-flexbox-when-to-use-which",
    title: "CSS Grid vs Flexbox: When to Use Which",
    date: "June 10, 2025",
    readTime: "5 min read",
    excerpt: "A comprehensive guide to understanding when to use CSS Grid and when to use Flexbox for your layout needs.",
    tags: ["CSS", "Web Development", "Design", "Tutorial"]
  }
];

export default function RecentBlogs({ isDarkMode }) {
  return (
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

      <div className={styles.blogGrid}>
        {blogPosts.map((post) => (
          <div key={post.id} className={`${styles.blogCard} ${isDarkMode ? styles.darkBlogCard : ''}`}>
            <Link to={`/blog/${post.slug}`} className={styles.blogLink}>
              <h3 className={`${styles.blogTitle} ${isDarkMode ? styles.darkText : ''}`}>{post.title}</h3>
              <div className={styles.blogMeta}>
                <time className={`${styles.blogDate} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{post.date}</time>
                <span className={`${styles.blogSeparator} ${isDarkMode ? styles.darkSecondaryText : ''}`}>•</span>
                <span className={`${styles.blogReadTime} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{post.readTime}</span>
              </div>
              <p className={`${styles.blogExcerpt} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{post.excerpt}</p>
              <div className={styles.blogTags}>
                {post.tags.map((tag, index) => (
                  <span key={index} className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>{tag}</span>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}