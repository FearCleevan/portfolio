// src/components/BlogPost/BlogPost.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import styles from './BlogPost.module.css';
import { getBlogPostBySlug } from '../../firebase/services/contentService';

const detectLanguage = (code = '') => {
  const value = code.trim();
  if (!value) return 'javascript';

  if (/^\s*[{[]/.test(value) && /:\s*["[{0-9tfn-]/.test(value)) return 'javascript';
  if (/^\s*<(!doctype|html|[a-z][\w-]*)(\s|>)/i.test(value)) return 'markup';
  if (/(^|\n)\s*(def |import |from .+ import |if __name__ == ['"]__main__['"])/.test(value)) return 'python';
  if (/(^|\n)\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/i.test(value)) return 'javascript';
  if (/^\s*(npm|yarn|pnpm|git|cd|ls|mkdir|rm)\b/m.test(value)) return 'javascript';
  if (/(^|\n)\s*(const|let|var|function|=>|console\.log|import .+ from )/.test(value)) return 'javascript';
  if (/(^|\n)\s*([.#][\w-]+\s*\{|@media|\w+\s*:\s*[^;]+;)/.test(value)) return 'css';

  return 'javascript';
};

const getLanguageLabel = (language = 'javascript') => {
  const map = {
    javascript: 'JavaScript',
    jsx: 'JSX',
    typescript: 'TypeScript',
    python: 'Python',
    java: 'Java',
    css: 'CSS',
    markup: 'HTML'
  };
  return map[language] || 'Code';
};

export default function BlogPost({ isDarkMode }) {
  const { slug } = useParams();
  const articleRef = useRef(null);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const postData = await getBlogPostBySlug(slug);
        setPost(postData);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const sanitizedContent = useMemo(
    () =>
      DOMPurify.sanitize(post?.content || '', {
        ADD_TAGS: ['font'],
        ADD_ATTR: ['target', 'rel', 'class', 'spellcheck', 'size'],
        FORBID_TAGS: ['script', 'button']
      }),
    [post?.content]
  );

  useEffect(() => {
    const articleNode = articleRef.current;
    if (!articleNode) return;

    const preBlocks = articleNode.querySelectorAll('pre');

    preBlocks.forEach((preBlock) => {
      if (!preBlock.querySelector('code')) {
        const codeNode = document.createElement('code');
        codeNode.textContent = preBlock.textContent || '';
        preBlock.textContent = '';
        preBlock.appendChild(codeNode);
      }

      const codeNode = preBlock.querySelector('code');
      const existingLangMatch = codeNode?.className?.match(/language-([a-z0-9-]+)/i);
      const language = existingLangMatch?.[1] || detectLanguage(codeNode?.textContent || '');
      if (codeNode) {
        codeNode.className = `language-${language}`;
      }
      preBlock.setAttribute('data-language', language);

      let wrapper = preBlock.parentElement;
      if (!wrapper?.hasAttribute('data-code-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = styles.codeBlockWrapper;
        wrapper.setAttribute('data-code-wrapper', 'true');
        preBlock.parentNode?.insertBefore(wrapper, preBlock);
        wrapper.appendChild(preBlock);
      }
      wrapper = preBlock.parentElement;

      let header = wrapper.querySelector('[data-code-header="true"]');
      if (!header) {
        header = document.createElement('div');
        header.setAttribute('data-code-header', 'true');
        header.className = styles.codeHeader;
      }

      let languageBadge = header.querySelector('[data-code-lang="true"]');
      if (!languageBadge) {
        languageBadge = document.createElement('span');
        languageBadge.setAttribute('data-code-lang', 'true');
        languageBadge.className = styles.codeLanguage;
        header.appendChild(languageBadge);
      }
      languageBadge.textContent = getLanguageLabel(language);

      let copyButton = header.querySelector('button[data-copy-code="true"]');
      if (!copyButton) {
        copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.setAttribute('data-copy-code', 'true');
        copyButton.className = styles.codeCopyButton;
        copyButton.setAttribute('aria-label', 'Copy code');

        const copyIcon = document.createElement('span');
        copyIcon.setAttribute('data-copy-icon', 'true');
        copyIcon.className = styles.codeCopyIcon;
        copyIcon.textContent = '⧉';

        const copyText = document.createElement('span');
        copyText.setAttribute('data-copy-text', 'true');
        copyText.className = styles.codeCopyText;
        copyText.textContent = 'Copy';

        copyButton.appendChild(copyIcon);
        copyButton.appendChild(copyText);
        header.appendChild(copyButton);
      }
      const copyTextNode = copyButton.querySelector('[data-copy-text="true"]');
      if (copyTextNode) {
        copyTextNode.textContent = 'Copy';
      }
      copyButton.onclick = async () => {
        try {
          const codeText = preBlock.querySelector('code')?.innerText || preBlock.innerText || '';
          await navigator.clipboard.writeText(codeText);
          if (copyTextNode) {
            copyTextNode.textContent = 'Copied';
          }
          setTimeout(() => {
            if (copyTextNode) {
              copyTextNode.textContent = 'Copy';
            }
          }, 1200);
        } catch (copyError) {
          console.error('Failed to copy code:', copyError);
        }
      };

      if (header.parentElement !== wrapper) {
        wrapper.insertBefore(header, preBlock);
      } else if (wrapper.firstChild !== header) {
        wrapper.insertBefore(header, wrapper.firstChild);
      }

      if (codeNode) {
        Prism.highlightElement(codeNode);
      }
    });
  }, [sanitizedContent]);

  if (loading) {
    return (
      <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.blogPostContainer} ${isDarkMode ? styles.darkMode : ''}`}>
          <div className={styles.loadingOverlay}>
            <div className={`${styles.spinner} ${isDarkMode ? styles.darkSpinner : ''}`}></div>
            <p className={isDarkMode ? styles.darkText : ''}>Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={`${styles.blogPostContainer} ${isDarkMode ? styles.darkMode : ''}`}>
          <div className={`${styles.notFound} ${isDarkMode ? styles.darkNotFound : ''}`}>
            <h1 className={isDarkMode ? styles.darkText : ''}>Post Not Found</h1>
            <p className={isDarkMode ? styles.darkSecondaryText : ''}>
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link to="/blog" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pageWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={`${styles.blogPostContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <Link to="/blog" className={`${styles.backButton} ${isDarkMode ? styles.darkLink : ''}`}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Blog
        </Link>

        <header className={styles.postHeader}>
          <div className={styles.postMeta}>
            <time className={`${styles.postDate} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{post.date}</time>
            <span className={`${styles.postSeparator} ${isDarkMode ? styles.darkSecondaryText : ''}`}>&bull;</span>
            <span className={`${styles.postReadTime} ${isDarkMode ? styles.darkSecondaryText : ''}`}>
              {post.readTime}
            </span>
          </div>
          <h1 className={`${styles.postTitle} ${isDarkMode ? styles.darkText : ''}`}>{post.title}</h1>
          <div className={styles.postTags}>
            {(post.tags || []).map((tag, index) => (
              <span key={`${tag}-${index}`} className={`${styles.tag} ${isDarkMode ? styles.darkTag : ''}`}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        <article
          ref={articleRef}
          className={`${styles.postContent} ${isDarkMode ? styles.darkPostContent : ''}`}
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        <div className={styles.shareSection}>
          <h2 className={`${styles.shareTitle} ${isDarkMode ? styles.darkText : ''}`}>Share this post</h2>
          <div className={styles.shareButtons}>
            <button
              className={`${styles.shareButton} ${isDarkMode ? styles.darkShareButton : ''}`}
              title="Copy link"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              <svg className={styles.shareIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                ></path>
              </svg>
              <span className={styles.tooltip}>Copy link</span>
            </button>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareButton} ${isDarkMode ? styles.darkShareButton : ''}`}
              title="Share on Twitter"
            >
              <svg className={styles.shareIcon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span className={styles.tooltip}>Share on Twitter</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareButton} ${isDarkMode ? styles.darkShareButton : ''}`}
              title="Share on LinkedIn"
            >
              <svg className={styles.shareIcon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
              </svg>
              <span className={styles.tooltip}>Share on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
