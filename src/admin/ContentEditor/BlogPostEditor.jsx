// src/admin/ContentEditor/BlogPostEditor.jsx
import React, { useState, useRef } from 'react';
import {
  FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiBold, FiItalic,
  FiList, FiCode, FiType, FiImage, FiVideo, FiUnderline,
  FiAlignLeft, FiMinus, FiLink
} from 'react-icons/fi';
import { useBlogPosts } from '../../firebase/hooks/useBlogPosts';
import styles from './BlogPostEditor.module.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaParagraph, FaListUl, FaListOl, FaHeading, FaListOl as FaListRoman,
} from "react-icons/fa";
import { MdFormatColorText, MdFormatSize } from 'react-icons/md';

Modal.setAppElement('#root');

const BlogPostEditor = () => {
  const { blogPosts, loading, error, addItem, updateItem, removeItem } = useBlogPosts();
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [newItem, setNewItem] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formattingToolbar, setFormattingToolbar] = useState(false);
  const [formatPosition, setFormatPosition] = useState({ top: 0, left: 0 });
  const [_selectedText, _setSelectedText] = useState('');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [codeBlockPosition, setCodeBlockPosition] = useState(0);
  const contentTextareaRef = useRef(null);

  // Programming languages and frameworks
  const programmingLanguages = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'C#', value: 'csharp' },
    { name: 'PHP', value: 'php' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'Go', value: 'go' },
    { name: 'Rust', value: 'rust' },
    { name: 'Swift', value: 'swift' },
    { name: 'Kotlin', value: 'kotlin' },
    { name: 'SQL', value: 'sql' },
    { name: 'Shell', value: 'shell' },
    { name: 'JSON', value: 'json' },
    { name: 'YAML', value: 'yaml' },
    { name: 'Markdown', value: 'markdown' },
  ];

  const frameworks = [
    { name: 'React', value: 'jsx' },
    { name: 'Vue', value: 'vue' },
    { name: 'Angular', value: 'typescript' },
    { name: 'Svelte', value: 'javascript' },
    { name: 'Next.js', value: 'jsx' },
    { name: 'Nuxt.js', value: 'vue' },
    { name: 'Express', value: 'javascript' },
    { name: 'Django', value: 'python' },
    { name: 'Flask', value: 'python' },
    { name: 'Laravel', value: 'php' },
    { name: 'Spring', value: 'java' },
    { name: '.NET', value: 'csharp' },
    { name: 'Flutter', value: 'dart' },
    { name: 'React Native', value: 'jsx' },
  ];

  // Format options
  const formatOptions = [
    { type: 'bold', icon: <FiBold />, tag: 'strong' },
    { type: 'italic', icon: <FiItalic />, tag: 'em' },
    { type: 'underline', icon: <FiUnderline />, tag: 'u' },
    { type: 'code', icon: <FiCode />, tag: 'code' },
    { type: 'paragraph', icon: <FaParagraph />, tag: 'p' },

    // Lists
    { type: 'bullet', icon: <FaListUl />, tag: 'ul' },
    { type: 'ordered', icon: <FaListOl />, tag: 'ol' },
    { type: 'roman', icon: <FaListRoman style={{ listStyleType: 'upper-roman' }} />, tag: 'ol-roman' },

    // Headings & Dividers
    { type: 'heading', icon: <FaHeading />, tag: 'h2' },
    { type: 'divider', icon: <FiMinus />, tag: 'hr' },

    // Links & Colors
    { type: 'link', icon: <FiLink />, tag: 'a' },
    { type: 'color', icon: <MdFormatColorText />, tag: 'color' },

    // Font Sizes
    { type: 'fontSmall', icon: <MdFormatSize style={{ fontSize: '12px' }} />, tag: 'font-sm' },
    { type: 'fontMedium', icon: <MdFormatSize style={{ fontSize: '16px' }} />, tag: 'font-md' },
    { type: 'fontLarge', icon: <MdFormatSize style={{ fontSize: '20px' }} />, tag: 'font-lg' },
    { type: 'fontXLarge', icon: <MdFormatSize style={{ fontSize: '24px' }} />, tag: 'font-xl' },
  ];

  const handleEdit = (item = null) => {
    setIsEditing(true);
    setCurrentEditItem(item ? { ...item } : {
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      readTime: '3 min read',
      excerpt: '',
      tags: [],
      content: '',
      newTag: ''
    });
    setNewItem(item === null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentEditItem(null);
    setNewItem(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Generate slug from title if new item
      const itemToSave = { ...currentEditItem };

      if (newItem) {
        // Create slug from title
        itemToSave.slug = itemToSave.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');

        // Add ID and creation date
        itemToSave.id = Date.now().toString();
        itemToSave.createdAt = new Date().toISOString();

        await addItem(itemToSave);
        toast.success('Blog post added successfully!');
      } else {
        const originalItem = blogPosts.find(item => item.id === currentEditItem.id);
        if (originalItem) {
          await updateItem(originalItem, itemToSave);
          toast.success('Blog post updated successfully!');
        }
      }
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = async () => {
    closeDeleteModal();
    try {
      await removeItem(itemToDelete);
      toast.success('Blog post deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (e) => {
    setCurrentEditItem(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleTagChange = (e) => {
    setCurrentEditItem(prev => ({
      ...prev,
      newTag: e.target.value
    }));
  };

  const addTag = () => {
    if (currentEditItem.newTag.trim() && !currentEditItem.tags.includes(currentEditItem.newTag.trim())) {
      setCurrentEditItem(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentEditItem(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleTextSelection = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selectedText = textarea.value.substring(start, end);
      _setSelectedText(selectedText);

      const rect = textarea.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      setFormatPosition({
        top: rect.top + scrollTop - 40,
        left: rect.left
      });

      setFormattingToolbar(true);
    } else {
      setFormattingToolbar(false);
      _setSelectedText('');
    }
  };

  const applyFormatting = (formatType) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = '';
    let newSelectionStart = start;
    let newSelectionEnd = end;

    switch (formatType) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        newSelectionStart = start + 8;
        newSelectionEnd = end + 8;
        break;

      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        newSelectionStart = start + 4;
        newSelectionEnd = end + 4;
        break;

      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        newSelectionStart = start + 3;
        newSelectionEnd = end + 3;
        break;

      case 'code':
        formattedText = `<code>${selectedText}</code>`;
        newSelectionStart = start + 6;
        newSelectionEnd = end + 6;
        break;

      case 'paragraph':
        formattedText = `<p>${selectedText}</p>`;
        newSelectionStart = start + 3;
        newSelectionEnd = end + 3;
        break;

      case 'bullet': {
        const bulletItems = selectedText.split('\n').filter(line => line.trim());
        formattedText = `\n<ul>\n${bulletItems.map(item => `  <li>${item.trim()}</li>`).join('\n')}\n</ul>\n`;
        newSelectionStart = start + 6;
        newSelectionEnd = start + formattedText.length - 7;
        break;
      }

      case 'ordered': {
        const listItems = selectedText.split('\n').filter(line => line.trim());
        formattedText = `\n<ol>\n${listItems.map(item => `  <li>${item.trim()}</li>`).join('\n')}\n</ol>\n`;
        newSelectionStart = start + 5;
        newSelectionEnd = start + formattedText.length - 6;
        break;
      }

      case 'roman': {
        const listItems = selectedText.split('\n').filter(line => line.trim());
        formattedText = `\n<ol type="I">\n${listItems.map(item => `  <li>${item.trim()}</li>`).join('\n')}\n</ol>\n`;
        newSelectionStart = start + 12;
        newSelectionEnd = start + formattedText.length - 13;
        break;
      }

      case 'heading':
        formattedText = `\n<h2>${selectedText}</h2>\n`;
        newSelectionStart = start + 5;
        newSelectionEnd = end + 5;
        break;

      case 'divider':
        formattedText = `\n<hr />\n`;
        newSelectionStart = start + formattedText.length;
        newSelectionEnd = newSelectionStart;
        break;

      case 'link': {
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          formattedText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
          newSelectionStart = start + formattedText.length;
          newSelectionEnd = newSelectionStart;
        } else {
          formattedText = selectedText;
        }
        break;
      }

      case 'color': {
        const color = prompt('Enter color (e.g., red, #ff0000, rgb(255,0,0)):', '#ff0000');
        if (color) {
          formattedText = `<span style="color: ${color}">${selectedText}</span>`;
          newSelectionStart = start + formattedText.length;
          newSelectionEnd = newSelectionStart;
        } else {
          formattedText = selectedText;
        }
        break;
      }

      case 'fontSmall': {
        formattedText = `<span style="font-size: 0.875rem">${selectedText}</span>`;
        newSelectionStart = start + formattedText.length;
        newSelectionEnd = newSelectionStart;
        break;
      }

      case 'fontMedium': {
        formattedText = `<span style="font-size: 1rem">${selectedText}</span>`;
        newSelectionStart = start + formattedText.length;
        newSelectionEnd = newSelectionStart;
        break;
      }

      case 'fontLarge': {
        formattedText = `<span style="font-size: 1.25rem">${selectedText}</span>`;
        newSelectionStart = start + formattedText.length;
        newSelectionEnd = newSelectionStart;
        break;
      }

      case 'fontXLarge': {
        formattedText = `<span style="font-size: 1.5rem">${selectedText}</span>`;
        newSelectionStart = start + formattedText.length;
        newSelectionEnd = newSelectionStart;
        break;
      }

      default:
        formattedText = selectedText;
    }

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(end);

    setCurrentEditItem(prev => ({
      ...prev,
      content: newContent
    }));

    // Restore cursor position after state update
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      }
    }, 0);

    setFormattingToolbar(false);
  };

  const openLanguageModal = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    setCodeBlockPosition(textarea.selectionStart);
    setIsLanguageModalOpen(true);
  };

  const insertCodeBlock = (language = 'javascript') => {
    setIsLanguageModalOpen(false);

    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = codeBlockPosition;

    // In your insertCodeBlock function, use this structure:
    let formattedText = `\n<div style="position: relative; border-radius: 10px; overflow: hidden;">
  <div style="position: relative;">
    <div style="position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10; display: flex; justify-content: flex-end; align-items: center; padding: 0.5rem 1rem; color: #abb2bf; font-size: 0.875rem;">
      <button 
        onclick="copyCode(this)" 
        style="color: #abb2bf; background: rgba(255, 255, 255, 0.1); border: none; padding: 0.375rem 0.75rem; border-radius: 0.375rem; cursor: pointer; font-size: 0.8125rem; transition: all 0.2s ease; display: flex; align-items: center; gap: 0.375rem;"
        onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-1px)';"
        onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)';"
      >
        Copy
      </button>
    </div>
    <pre style="margin: 0; border-radius: 0 0 10px 10px !important; background: #2d2d2d !important;"><code class="language-${language}" style="border-radius: 10px !important; background: #2d2d2d !important;">
// Your code here
    </code></pre>
  </div>
</div>\n`;

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(start);

    setCurrentEditItem(prev => ({
      ...prev,
      content: newContent
    }));

    // Position cursor inside the code block
    const codeStartPos = start + formattedText.indexOf('// Your') + 3;
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(codeStartPos, codeStartPos);
      }
    }, 0);
  };

  const insertExampleBlock = () => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const formattedText = `\n<div class="exampleBlock">
  <h3>Example</h3>
  <p>Your example content here</p>
</div>\n`;

    const newContent =
      textarea.value.substring(0, start) +
      formattedText +
      textarea.value.substring(start);

    setCurrentEditItem(prev => ({
      ...prev,
      content: newContent
    }));

    // Position cursor inside the example block
    const contentStartPos = start + formattedText.indexOf('Your example content here');
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(contentStartPos, contentStartPos);
      }
    }, 0);
  };

  if (loading && !blogPosts.length) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner}></div>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorOverlay}>
        <p>Error loading blog posts: {error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editorWrapper}>
      {isEditing ? (
        <div className={styles.editPanel}>
          <div className={styles.editHeader}>
            <h3>{newItem ? 'Add New' : 'Edit'} Blog Post</h3>
            <div className={styles.editActions}>
              <button
                onClick={handleSave}
                className={styles.saveButton}
                disabled={!currentEditItem?.title || !currentEditItem?.content || isSaving}
              >
                {isSaving ? (
                  <span className={styles.spinner}></span>
                ) : (
                  <>
                    <FiSave /> Save
                  </>
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                className={styles.cancelButton}
                disabled={isSaving}
              >
                <FiX /> Cancel
              </button>
            </div>
          </div>

          <div className={styles.editorContent}>
            <div className={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={currentEditItem?.title || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter blog post title"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={currentEditItem?.date || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Read Time</label>
                <input
                  type="text"
                  name="readTime"
                  value={currentEditItem?.readTime || ''}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., 3 min read"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Excerpt</label>
              <textarea
                name="excerpt"
                value={currentEditItem?.excerpt || ''}
                onChange={handleInputChange}
                className={styles.textarea}
                rows="3"
                placeholder="Brief description of the blog post"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tags</label>
              <div className={styles.tagsInputContainer}>
                <div className={styles.tagsList}>
                  {currentEditItem?.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className={styles.removeTag}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    value={currentEditItem?.newTag || ''}
                    onChange={handleTagChange}
                    onKeyPress={handleKeyPress}
                    className={styles.input}
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className={styles.addTagButton}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.contentHeader}>
                <label>Content *</label>
                <div className={styles.contentActions}>
                  <button
                    type="button"
                    onClick={openLanguageModal}
                    className={styles.addTagButton}
                    title="Insert code block"
                  >
                    <FiCode /> Code Block
                  </button>
                  <button
                    type="button"
                    onClick={insertExampleBlock}
                    className={styles.addTagButton}
                    title="Insert example block"
                  >
                    <FiType /> Example
                  </button>
                </div>
              </div>

              {formattingToolbar && (
                <div
                  className={styles.formatToolbar}
                  style={{ top: `${formatPosition.top}px`, left: `${formatPosition.left}px` }}
                >
                  {formatOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => applyFormatting(option.type)}
                      className={styles.formatButton}
                      title={option.type}
                    >
                      {option.icon || option.label}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                ref={contentTextareaRef}
                id="blogContent"
                name="content"
                value={currentEditItem?.content || ''}
                onChange={handleContentChange}
                onMouseUp={handleTextSelection}
                onKeyUp={handleTextSelection}
                className={styles.contentTextarea}
                rows="15"
                placeholder="Write your blog post content here..."
              />

              <div className={styles.formattingGuide}>
                <h4>Formatting Guide:</h4>
                <ul>
                  <li>
                    Select text and use the formatting toolbar for
                    <strong> Bold</strong>, <em> Italic</em>, <u> Underline</u>, and
                    <code> Inline Code</code>
                  </li>
                  <li>
                    Use the <strong>"Paragraph"</strong> button for normal text
                    (<code>&lt;p&gt;text&lt;/p&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Heading"</strong> button for section titles
                    (<code>&lt;h2&gt;Heading&lt;/h2&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Bullet List"</strong> button for unordered lists
                    (<code>&lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Ordered List"</strong> button for numbered lists
                    (<code>&lt;ol&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ol&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Roman List"</strong> button for roman numeral lists
                    (<code>&lt;ol type="I"&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ol&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Link"</strong> button to add hyperlinks
                    (<code>&lt;a href="#"&gt;Link&lt;/a&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Divider"</strong> button to insert a horizontal line
                    (<code>&lt;hr /&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Color"</strong> button to change text color
                    (<code>&lt;span style="color:red"&gt;text&lt;/span&gt;</code>)
                  </li>
                  <li>
                    Use the <strong>"Font Size"</strong> buttons to adjust text size:
                    <code>font-sm</code>, <code>font-md</code>, <code>font-lg</code>,
                    <code>font-xl</code>
                  </li>
                </ul>
              </div>


            </div>
          </div>
        </div>
      ) : (
        <div className={styles.contentList}>
          <div className={styles.listHeader}>
            <h3>Blog Posts</h3>
            <button
              onClick={() => handleEdit()}
              className={styles.editButton}
            >
              <FiPlus /> Add Blog Post
            </button>
          </div>

          {blogPosts.map((post) => (
            <div key={post.id} className={styles.listItem}>
              <div className={styles.itemContent}>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <div className={styles.itemMeta}>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <div className={styles.itemTags}>
                  {post.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.itemActions}>
                <button
                  onClick={() => handleEdit(post)}
                  className={styles.editButton}
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => openDeleteModal(post)}
                  className={styles.deleteButton}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete the blog post "{itemToDelete?.title}"? This cannot be undone.</p>
        <div className={styles.modalActions}>
          <button onClick={closeDeleteModal} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={confirmDelete} className={styles.deleteButton}>
            Confirm Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isLanguageModalOpen}
        onRequestClose={() => setIsLanguageModalOpen(false)}
        className={styles.languageModal}
        overlayClassName={styles.modalOverlay}
      >
        <h3>Select Programming Language</h3>

        <div className={styles.languageCategories}>
          <div className={styles.languageCategory}>
            <h4>Languages</h4>
            <div className={styles.languageGrid}>
              {programmingLanguages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => insertCodeBlock(lang.value)}
                  className={styles.languageButton}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.languageCategory}>
            <h4>Frameworks</h4>
            <div className={styles.languageGrid}>
              {frameworks.map((framework) => (
                <button
                  key={framework.value}
                  onClick={() => insertCodeBlock(framework.value)}
                  className={styles.languageButton}
                >
                  {framework.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BlogPostEditor;