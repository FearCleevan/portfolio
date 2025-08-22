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
        <p>
          Startup culture is often romanticized, but building a truly effective one requires more than just ping pong tables and free snacks. A strong culture is the backbone of a thriving startup, attracting talent, boosting productivity, and fostering innovation. This post outlines key aspects to consider when shaping your startup's cultural landscape.
        </p>
        
        <h2>1. Clearly Defined Values: Your Guiding Stars</h2>
        <p>
          Your values aren't just words on a wall; they should be the principles guiding every decision. Instead of generic pronouncements, define values that are specific, actionable, and genuinely reflect your mission.
        </p>
        
        <div className={styles.exampleBlock}>
          <h3>Example:</h3>
          <p>Instead of "Innovation," try "Embrace Experimentation: We encourage calculated risks and view failures as learning opportunities."</p>
        </div>
        
        <div className={styles.bestPractice}>
          <h3>Best Practice:</h3>
          <p>Involve the entire team in defining these values. This fosters ownership and ensures they resonate across the organization. Regularly revisit and reinforce these values through internal communications and team meetings.</p>
        </div>
        
        <h2>2. Open Communication: The Lifeblood of Collaboration</h2>
        <p>
          Transparency is crucial. Employees need to understand the "why" behind decisions. This builds trust and empowers them to contribute meaningfully.
        </p>
        
        <div className={styles.exampleBlock}>
          <h3>Example:</h3>
          <p>Implement regular all-hands meetings where company performance, challenges, and future plans are discussed openly. Encourage Q&A sessions to address employee concerns.</p>
        </div>
        
        <div className={styles.bestPractice}>
          <h3>Best Practice:</h3>
          <p>Utilize tools like Slack or Microsoft Teams to facilitate open communication and information sharing. Foster a culture where asking questions is encouraged, and feedback is valued.</p>
        </div>
        
        <h2>3. Empowerment and Ownership: Unleashing Potential</h2>
        <p>
          Give employees the autonomy to own their projects and make decisions. This not only boosts morale but also encourages creativity and problem-solving.
        </p>
        
        <div className={styles.exampleBlock}>
          <h3>Example:</h3>
          <p>Implement a "no-blame" culture where mistakes are seen as opportunities for learning and improvement, not as grounds for punishment.</p>
        </div>
        
        <div className={styles.bestPractice}>
          <h3>Best Practice:</h3>
          <p>Define clear roles and responsibilities, but encourage cross-functional collaboration. Provide opportunities for employees to take on new challenges and develop their skills.</p>
        </div>
        
        <h2>4. Recognition and Appreciation: Fueling Motivation</h2>
        <p>
          Recognizing and rewarding employees for their contributions is vital. This doesn't always require monetary rewards; sometimes, simple appreciation goes a long way.
        </p>
        
        <div className={styles.exampleBlock}>
          <h3>Example:</h3>
          <p>Implement a peer-to-peer recognition program where employees can publicly acknowledge each other's contributions.</p>
        </div>
        
        <div className={styles.bestPractice}>
          <h3>Best Practice:</h3>
          <p>Regularly celebrate team successes, both big and small. Recognize individual achievements publicly and provide opportunities for professional development.</p>
        </div>
        
        <h2>5. Work-Life Balance: Preventing Burnout</h2>
        <p>
          While startups often demand long hours, neglecting work-life balance can lead to burnout and decreased productivity. Promote a culture that respects personal time and encourages employees to disconnect.
        </p>
        
        <div className={styles.exampleBlock}>
          <h3>Example:</h3>
          <p>Enforce vacation time and encourage employees to take breaks throughout the day.</p>
        </div>
        
        <div className={styles.bestPractice}>
          <h3>Best Practice:</h3>
          <p>Lead by example. Encourage managers to take time off and discourage late-night emails or weekend work.</p>
        </div>
        
        <h2>Conclusion</h2>
        <p>
          Building a strong startup culture is an ongoing process that requires conscious effort and consistent reinforcement. By focusing on clearly defined values, open communication, empowerment, recognition, and work-life balance, you can create an environment where employees thrive, innovation flourishes, and your startup reaches its full potential.
        </p>
        
        <div className={styles.tagsSection}>
          <strong>Tags:</strong> #startupculture #companyculture #teambuilding #leadership
        </div>
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
