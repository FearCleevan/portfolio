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

const BLOCK_BREAK_TAGS = new Set(['DIV', 'P', 'LI', 'TR']);

const extractCodeText = (node) => {
  if (!node) return '';

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  if (node.tagName === 'BR') {
    return '\n';
  }

  const content = Array.from(node.childNodes).map(extractCodeText).join('');
  if (BLOCK_BREAK_TAGS.has(node.tagName)) {
    return `${content}\n`;
  }

  return content;
};

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
    javascript: 'JavaScript ',
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
      const existingCodeNode = preBlock.querySelector('code');
      const existingLangMatch =
        existingCodeNode?.className?.match(/language-([a-z0-9-]+)/i) ||
        preBlock.className?.match(/language-([a-z0-9-]+)/i);

      const normalizedCodeText = (extractCodeText(existingCodeNode || preBlock) || '')
        .replace(/\u00a0/g, ' ')
        .replace(/\n{3,}/g, '\n\n');

      preBlock.textContent = '';
      const codeNode = document.createElement('code');
      codeNode.textContent = normalizedCodeText;
      preBlock.appendChild(codeNode);

      const language = existingLangMatch?.[1] || detectLanguage(codeNode.textContent || '');
      codeNode.className = `language-${language}`;
      preBlock.className = `language-${language}`;
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

      Prism.highlightElement(codeNode);
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                className={styles.shareIcon}
                fill="currentColor"
              >
                <path d="M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z" />
              </svg>
              <span className={styles.tooltip}>Copy link</span>
            </button>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareButton} ${isDarkMode ? styles.darkShareButton : ''}`}
              title="Share on LinkedIn"
            >
              <svg className={styles.shareIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.920-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
              </svg>
              <span className={styles.tooltip}>Share on LinkedIn</span>
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareButton} ${isDarkMode ? styles.darkShareButton : ''}`}
              title="Share on Instagram"
            >
              <svg className={styles.shareIcon} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.630c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.630zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
              </svg>
              <span className={styles.tooltip}>Share on Instagram</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.shareButton} ${isDarkMode ? styles.darkShareButton : ''}`}
              title="Share on Facebook"
            >
              <svg className={styles.shareIcon} fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className={styles.tooltip}>Share on Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
