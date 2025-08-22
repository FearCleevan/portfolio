// src/data/blogPosts.jsx
import styles from '../components/BlogPost/BlogPost.module.css';

export const blogPosts = [
  {
    id: 1,
    slug: "navigating-the-startup-jungle-building-a-productive-and-positive-culture",
    title: "Navigating the Startup Jungle: Building a Productive and Positive Culture",
    date: "July 3, 2025",
    readTime: "3 min read",
    excerpt: "This post explores the key elements of a successful startup culture, offering practical tips and examples for fostering a productive and positive environment.",
    tags: ["Startup Culture", "Programming", "Web Development", "Tutorial"],
    content: (
      <div className={styles.postContent}>
        <hr />
        <p>
          JavaScript, the language of the web, continues to evolve. While frameworks and libraries often dominate the conversation, understanding the core principles of JavaScript is crucial for any web developer. This post provides practical tips and best practices to help you write better JavaScript code.
        </p>
        
        <h2>1. Embracing const and let</h2>
        <p>
          Forget about var! Modern JavaScript offers const and let for variable declaration.
        </p>
        
        {/* Add more content as needed */}
      </div>
    )
  },
  {
    id: 4,
    slug: "mastering-javascript-practical-tips-and-best-practices",
    title: "Mastering JavaScript: Practical Tips and Best Practices",
    date: "August 5, 2025",
    readTime: "3 min read",
    excerpt: "JavaScript, the language of the web, continues to evolve. This post provides practical tips and best practices to help you write better JavaScript code.",
    tags: ["JavaScript", "Programming", "Web Development", "Tutorial"],
    content: (
      <div className={styles.postContent}>
        <hr />
        <p>
          JavaScript, the language of the web, continues to evolve. While frameworks and libraries often dominate the conversation, understanding the core principles of JavaScript is crucial for any web developer. This post provides practical tips and best practices to help you write better JavaScript code.
        </p>
        
        <h2>1. Embracing const and let</h2>
        <p>
          Forget about var! Modern JavaScript offers const and let for variable declaration.
        </p>
        <ul>
          <li><strong>const</strong>: Use this for variables that should not be reassigned. This helps prevent accidental changes and improves code readability.</li>
          <li><strong>let</strong>: Use this for variables that may be reassigned within their scope.</li>
        </ul>
        
        <div className={styles.codeBlock}>
          <div className={styles.codeContainer}>
            <div className={styles.codeCopy}>
              <button title="Copy code">Copy</button>
            </div>
            <pre>
              <code className="language-javascript">
                {`// Good:
const apiKey = "YOUR_API_KEY";
let counter = 0;

// Bad:
var outdatedVariable = "This is bad practice.";`}
              </code>
            </pre>
          </div>
        </div>
        
        <p>
          Using const and let promotes immutability and helps avoid common scoping issues associated with var.
        </p>
        
        <h2>2. Leverage Arrow Functions</h2>
        <p>
          Arrow functions provide a more concise syntax for writing functions, especially for simple, inline functions.
        </p>
        
        {/* Add more content sections as needed */}
        
        <h2>Conclusion</h2>
        <p>
          By incorporating these simple yet powerful techniques, you can write cleaner, more efficient, and maintainable JavaScript code. Continuously learning and applying best practices is key to becoming a proficient JavaScript developer.
        </p>
      </div>
    )
  },
  // Add other blog posts with full content
];

export const getBlogPosts = () => {
  return blogPosts;
};

export const getBlogPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};