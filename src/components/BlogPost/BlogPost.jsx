import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import { useBlogPosts } from '../../hooks/useBlogPosts';

// ── Markdown → HTML ──────────────────────────────────────────────────────────

const LANG_LABELS = {
  javascript: 'JavaScript', js: 'JavaScript',
  jsx: 'JSX', tsx: 'TSX',
  typescript: 'TypeScript', ts: 'TypeScript',
  python: 'Python', py: 'Python',
  java: 'Java', css: 'CSS',
  html: 'HTML', markup: 'HTML',
  bash: 'Bash', sh: 'Bash', shell: 'Shell',
  sql: 'SQL', json: 'JSON',
};

function renderMarkdown(md = '') {
  if (!md) return '';

  const lines = md.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fenceMatch = line.match(/^```(\w*)/);
    if (fenceMatch) {
      const lang = fenceMatch[1] || 'javascript';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      const code = codeLines.join('\n').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const label = LANG_LABELS[lang] || lang || 'Code';
      out.push(
        `<div class="md-code-wrapper" data-code-wrapper="true">` +
        `<div class="md-code-header" data-code-header="true">` +
        `<span class="md-code-lang" data-code-lang="true">${label}</span>` +
        `<button type="button" class="md-code-copy" data-copy-code="true" aria-label="Copy code">` +
        `<span data-copy-icon="true">⧉</span><span data-copy-text="true">Copy</span>` +
        `</button></div>` +
        `<pre class="language-${lang}" data-language="${lang}"><code class="language-${lang}">${code}</code></pre>` +
        `</div>`
      );
      i++;
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    if (h3) { out.push(`<h3>${inlineMarkdown(h3[1])}</h3>`); i++; continue; }
    const h2 = line.match(/^## (.+)/);
    if (h2) { out.push(`<h2>${inlineMarkdown(h2[1])}</h2>`); i++; continue; }
    const h1 = line.match(/^# (.+)/);
    if (h1) { out.push(`<h1>${inlineMarkdown(h1[1])}</h1>`); i++; continue; }

    // Blockquote
    if (line.startsWith('> ')) {
      out.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
      i++; continue;
    }

    // Unordered list item
    if (/^[-*+] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(lines[i].slice(2))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Ordered list item
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineMarkdown(lines[i].replace(/^\d+\. /, ''))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      out.push('<hr />'); i++; continue;
    }

    // Empty line → paragraph break
    if (!line.trim()) { out.push('<br />'); i++; continue; }

    // Paragraph
    out.push(`<p>${inlineMarkdown(line)}</p>`);
    i++;
  }

  return out.join('\n');
}

function inlineMarkdown(text = '') {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// ── Component ────────────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams();
  const { blogPosts } = useBlogPosts();
  const articleRef = useRef(null);

  const post = blogPosts.find((p) => p.slug === slug) || null;
  const html = useMemo(() => renderMarkdown(post?.content), [post?.content]);

  // PrismJS highlight + copy buttons
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    article.querySelectorAll('pre code').forEach((codeEl) => {
      Prism.highlightElement(codeEl);
    });

    article.querySelectorAll('[data-copy-code="true"]').forEach((btn) => {
      btn.onclick = async () => {
        const pre = btn.closest('[data-code-wrapper="true"]')?.querySelector('pre');
        const text = pre?.textContent || '';
        try {
          await navigator.clipboard.writeText(text);
          const label = btn.querySelector('[data-copy-text="true"]');
          if (label) {
            label.textContent = 'Copied';
            setTimeout(() => { label.textContent = 'Copy'; }, 1200);
          }
        } catch { /* clipboard blocked */ }
      };
    });
  }, [html]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">Post Not Found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">The blog post you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 group transition-colors"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
            <time>{post.date}</time>
            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 duration-300" />
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Article */}
        <article
          ref={articleRef}
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Share this post</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              title="Copy link"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy link
            </button>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.920-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}