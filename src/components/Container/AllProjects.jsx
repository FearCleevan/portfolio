import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiCode, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiFirebase, SiMysql, SiPostgresql,
  SiSupabase, SiPython, SiExpo,
} from 'react-icons/si';
import PageLayout from '../shared/PageLayout';
import { useProjects } from '../../hooks/useProjects';
import { trackProjectView } from '../../services/analyticsService';

const TECH_ICONS = {
  react: SiReact, 'react native': SiReact, 'react.js': SiReact,
  next: SiNextdotjs, 'next.js': SiNextdotjs,
  typescript: SiTypescript, javascript: SiJavascript,
  tailwind: SiTailwindcss, 'tailwind css': SiTailwindcss,
  node: SiNodedotjs, 'node.js': SiNodedotjs,
  express: SiExpress, 'express.js': SiExpress,
  firebase: SiFirebase, mysql: SiMysql,
  postgresql: SiPostgresql, postgres: SiPostgresql,
  supabase: SiSupabase, python: SiPython,
  expo: SiExpo,
};

function getTechIcon(name = '') {
  const key = name.toLowerCase();
  for (const [k, Icon] of Object.entries(TECH_ICONS)) {
    if (key.includes(k)) return Icon;
  }
  return FiCode;
}

const CATEGORIES = ['All', 'Web', 'Mobile', 'AI / ML', 'Open Source'];

export default function AllProjects() {
  const { projects } = useProjects();
  const [search, setSearch] = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [preview, setPreview] = useState({ projectId: null, imageIndex: 0 });

  const filtered = useMemo(() => {
    let list = projects;
    if (activeCategory !== 'All') list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.techStack?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [projects, search, activeCategory]);

  const selectedProject = projects.find((p) => p.id === preview.projectId);
  const selectedImages = selectedProject?.sampleImages || [];
  const activeImage = selectedImages[preview.imageIndex];
  const isPreviewOpen = Boolean(activeImage);

  const closePreview = useCallback(() => setPreview({ projectId: null, imageIndex: 0 }), []);
  const showNext = useCallback(() => setPreview((p) => ({ ...p, imageIndex: (p.imageIndex + 1) % selectedImages.length })), [selectedImages.length]);
  const showPrev = useCallback(() => setPreview((p) => ({ ...p, imageIndex: (p.imageIndex - 1 + selectedImages.length) % selectedImages.length })), [selectedImages.length]);

  const openPreview = useCallback((projectId, imageIndex = 0) => {
    setPreview({ projectId, imageIndex });
  }, []);

  useEffect(() => {
    if (!isPreviewOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') closePreview();
      else if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'ArrowLeft') showPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPreviewOpen, closePreview, showNext, showPrev]);

  return (
    <PageLayout title="All Projects" subtitle="14 projects built and shipped — from SaaS platforms and mobile apps to AI systems and internal tools.">

      {/* ── Search bar ── */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, description, or technology…"
          aria-label="Search projects"
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-500 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white hover:border-gray-900 dark:hover:border-white transition-colors duration-200"
        />
        {search && (
          <button onClick={() => setSearch('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Category filter ── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-medium transition-all duration-200 border ${activeCategory === cat
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
              : 'bg-transparent border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-white active:scale-95'
              }`}
          >
            {cat}
          </button>
        ))}
        {(search || activeCategory !== 'All') && (
          <span className="self-center text-xs text-gray-400 dark:text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Projects grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">No projects match your search.</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-3 text-xs text-gray-900 dark:text-white hover:underline transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const images = project.sampleImages || [];
            const showThumbnails = images.length > 0;
            const visibleCount = Math.min(images.length, 2);
            const hasMore = images.length > 2;

            // Determine links: use links array if present, else fallback to single link
            const links = project.links && project.links.length > 0
              ? project.links
              : (project.liveUrl || project.url)
                ? [{ label: 'Open', url: project.liveUrl || project.url }]
                : [];

            return (
              <div
                key={project.id}
                className="group flex flex-col bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-500 shadow-sm hover:border-gray-900 dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 overflow-hidden"
                onClick={() => trackProjectView(project.title)}
              >


                {/* Card body */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Category + featured + currently building badges */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent">
                      {project.category || 'Web'}
                    </span>
                    {project.featured && (
                      <span className="px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent">
                        Featured
                      </span>
                    )}
                    {project.currentlyBuilding && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Currently Building
                      </span>
                    )}
                  </div>

                  {/* Title + multiple links */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 shrink-0">
                        {links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 hover:border-gray-900 dark:hover:border-white transition-colors"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {project.techStack.slice(0, 5).map((tech) => {
                        const Icon = getTechIcon(tech);
                        return (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 bg-transparent hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <Icon className="w-2.5 h-2.5 shrink-0" />
                            {tech}
                          </span>
                        );
                      })}
                      {project.techStack.length > 5 && (
                        <span className="px-2 py-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                          +{project.techStack.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* ── Image thumbnails ── */}
                {showThumbnails && (
                  <div className="relative flex gap-1 p-4 pb-2">
                    {images.slice(0, visibleCount).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); openPreview(project.id, idx); }}
                        className="relative flex-1 aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `${project.title} preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Overlay badge on the second image when there are more */}
                        {hasMore && idx === 1 && (
                          <div
                            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPreview(project.id, 2); // first hidden image
                            }}
                          >
                            <span className="text-white text-lg font-bold drop-shadow-md">
                              +{images.length - 2}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Image preview overlay (unchanged functionality) ── */}
      {/* ── Image preview overlay (larger) ── */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button – top right */}
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Previous arrow */}
          {selectedImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Previous"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Image container – takes up available space */}
          <div
            className="max-w-[calc(100vw-6rem)] max-h-[calc(100vh-6rem)] w-auto h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={`${selectedProject?.title} preview`}
              className="max-w-full max-h-[calc(100vh-6rem)] object-contain"
            />
          </div>

          {/* Next arrow */}
          {selectedImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Next"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </PageLayout>
  );
}