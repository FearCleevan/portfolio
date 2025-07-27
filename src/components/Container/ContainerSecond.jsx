// src/components/ContainerSecond/ContainerSecond.jsx
import React from 'react';
import styles from './ContainerSecond.module.css';
import { Link } from 'react-router-dom';

export default function ContainerSecond({ isDarkMode }) {
    return (
        <div className={styles.container}>
            {/* Connect Section */}
            <div className={`${styles.bentoCard} ${styles.connectCard}`}>
                <div className={styles.cardHeader}>
                    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <h2 className={styles.cardTitle}>Connect</h2>
                </div>

                <div className={styles.cardContent}>
                    {/* Email */}
                    <a className={`${styles.linkCard} ${isDarkMode ? styles.darkLinkCard : ''}`} href="mailto:bryllim@gmail.com">
                        <p className={styles.linkLabel}>Email</p>
                        <p className={styles.linkText}>bryllim@gmail.com</p>
                    </a>

                    {/* Schedule a Call */}
                    <div className={styles.linkGroup}>
                        <p className={styles.linkLabel}>Let's Talk</p>
                        <a className={`${styles.linkCard} ${isDarkMode ? styles.darkLinkCard : ''}`} href="https://calendly.com/bryllim/consultation" target="_blank" rel="noopener noreferrer">
                            <div className={styles.linkWithIcon}>
                                <span className={styles.linkText}>Schedule a Call</span>
                                <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </a>
                    </div>

                    {/* Speaking Engagements */}
                    <div className={styles.linkGroup}>
                        <p className={styles.linkLabel}>Speaking Engagements</p>
                        <div className={`${styles.infoCard} ${isDarkMode ? styles.darkInfoCard : ''}`}>
                            <p className={styles.infoText}>Available for speaking at events about software development and emerging technologies.</p>
                            <a className={`${styles.infoLink} ${isDarkMode ? styles.darkInfoLink : ''}`} href="mailto:bryllim@gmail.com">
                                Get in touch
                                <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className={styles.linkGroup}>
                        <p className={styles.linkLabel}>Social Links</p>
                        <div className={styles.socialGrid}>
                            <a className={`${styles.socialLink} ${isDarkMode ? styles.darkSocialLink : ''}`} href="https://linkedin.com/in/bryllim" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile" title="Visit LinkedIn profile">
                                <svg className={styles.socialIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                </svg>
                            </a>
                            <a className={`${styles.socialLink} ${isDarkMode ? styles.darkSocialLink : ''}`} href="https://github.com/bryllim" target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub profile" title="Visit GitHub profile">
                                <svg className={styles.socialIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                            <a className={`${styles.socialLink} ${isDarkMode ? styles.darkSocialLink : ''}`} href="https://www.instagram.com/bryl.lim/" target="_blank" rel="noopener noreferrer" aria-label="Visit Instagram profile" title="Visit Instagram profile">
                                <svg className={styles.socialIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Member Of */}
                    <div className={styles.linkGroup}>
                        <div className={styles.memberHeader}>
                            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            <p className={styles.linkLabel}>A member of</p>
                        </div>
                        <div className={styles.orgLinks}>
                            <a className={`${styles.orgLink} ${isDarkMode ? styles.darkOrgLink : ''}`} href="https://www.aap.ph" target="_blank" rel="noopener noreferrer">
                                <div className={styles.linkWithIcon}>
                                    <p className={styles.orgText}>Analytics & Artificial Intelligence Association of the Philippines (AAP)</p>
                                    <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                </div>
                            </a>
                            <a className={`${styles.orgLink} ${isDarkMode ? styles.darkOrgLink : ''}`} href="https://www.psia.org.ph" target="_blank" rel="noopener noreferrer">
                                <div className={styles.linkWithIcon}>
                                    <p className={styles.orgText}>Philippine Software Industry Association</p>
                                    <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Posts Section */}
            <div className={`${styles.bentoCard} ${styles.blogCard}`}>
                <div className={styles.blogHeader}>
                    <h2 className={styles.cardTitle}>Recent Blog Posts</h2>
                    <Link to="/blog" className={`${styles.viewAllLink} ${isDarkMode ? styles.darkViewAllLink : ''}`}>
                        View All
                    </Link>
                </div>

                <div className={styles.blogPosts}>
                    {/* Blog Post 1 */}
                    <div className={`${styles.blogPost} ${isDarkMode ? styles.darkBlogPost : ''}`}>
                        <Link to="/blog/navigating-the-startup-jungle-building-a-productive-and-positive-culture" className={styles.blogLink}>
                            <h3 className={`${styles.blogTitle} ${isDarkMode ? styles.darkBlogTitle : ''}`}>Navigating the Startup Jungle: Building a Productive and Positive Culture</h3>
                            <div className={styles.blogMeta}>
                                <time className={styles.blogDate}>July 3, 2025</time>
                                <span className={styles.blogSeparator}>•</span>
                                <span className={styles.blogReadTime}>3 min read</span>
                            </div>
                            <p className={`${styles.blogExcerpt} ${isDarkMode ? styles.darkBlogExcerpt : ''}`}>
                                This post explores the key elements of a successful startup culture, offering practical tips and examples for fostering a productive and positive environment.
                            </p>
                            <div className={styles.blogTags}>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Startup Culture</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Programming</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Web Development</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Tutorial</span>
                            </div>
                        </Link>
                    </div>

                    {/* Blog Post 2 */}
                    <div className={`${styles.blogPost} ${isDarkMode ? styles.darkBlogPost : ''}`}>
                        <Link to="/blog/prompt-engineering-getting-the-most-out-of-large-language-models" className={styles.blogLink}>
                            <h3 className={`${styles.blogTitle} ${isDarkMode ? styles.darkBlogTitle : ''}`}>Prompt Engineering: Getting the Most Out of Large Language Models</h3>
                            <div className={styles.blogMeta}>
                                <time className={styles.blogDate}>July 1, 2025</time>
                                <span className={styles.blogSeparator}>•</span>
                                <span className={styles.blogReadTime}>3 min read</span>
                            </div>
                            <p className={`${styles.blogExcerpt} ${isDarkMode ? styles.darkBlogExcerpt : ''}`}>
                                This post dives into prompt engineering, the art of crafting effective prompts to get the desired output from large language models (LLMs). We'll explore practical examples and best p
                            </p>
                            <div className={styles.blogTags}>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>LLMs</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Programming</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Web Development</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Tutorial</span>
                            </div>
                        </Link>
                    </div>

                    {/* Blog Post 3 */}
                    <div className={`${styles.blogPost} ${isDarkMode ? styles.darkBlogPost : ''}`}>
                        <Link to="/blog/laravel-eloquent-beyond-the-basics-efficient-data-retrieval-and-manipulation" className={styles.blogLink}>
                            <h3 className={`${styles.blogTitle} ${isDarkMode ? styles.darkBlogTitle : ''}`}>Laravel Eloquent: Beyond the Basics - Efficient Data Retrieval and Manipulation</h3>
                            <div className={styles.blogMeta}>
                                <time className={styles.blogDate}>June 26, 2025</time>
                                <span className={styles.blogSeparator}>•</span>
                                <span className={styles.blogReadTime}>3 min read</span>
                            </div>
                            <p className={`${styles.blogExcerpt} ${isDarkMode ? styles.darkBlogExcerpt : ''}`}>
                                This post dives into some lesser-known but incredibly useful features of Laravel's Eloquent ORM, going beyond basic CRUD operations. Learn how to optimize your queries, leverage acces
                            </p>
                            <div className={styles.blogTags}>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Laravel</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Programming</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Web Development</span>
                                <span className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>Tutorial</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}