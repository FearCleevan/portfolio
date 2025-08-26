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
  const contentTextareaRef = useRef(null);

  // Format options
  const formatOptions = [
    { type: 'bold', icon: <FiBold />, tag: 'strong' },
    { type: 'italic', icon: <FiItalic />, tag: 'em' },
    { type: 'underline', icon: <FiUnderline />, tag: 'u' },
    { type: 'code', icon: <FiCode />, tag: 'code' },
    { type: 'bullet', icon: <FiList />, tag: 'ul' },
    { type: 'heading', icon: <FiType />, tag: 'h2' },
    { type: 'divider', icon: <FiMinus />, tag: 'hr' },
    { type: 'link', icon: <FiLink />, tag: 'a' },
  ];

  // Language options with categories
  const languageOptions = [
    {
      category: 'Web Development',
      languages: [
        { value: 'javascript', label: 'JavaScript', icon: '🟨' },
        { value: 'typescript', label: 'TypeScript', icon: '🔷' },
        { value: 'html', label: 'HTML', icon: '🌐' },
        { value: 'css', label: 'CSS', icon: '🎨' },
        { value: 'jsx', label: 'JSX', icon: '⚛️' },
        { value: 'tsx', label: 'TSX', icon: '⚛️' },
      ]
    },
    {
      category: 'Frameworks',
      languages: [
        { value: 'react', label: 'React', icon: '⚛️' },
        { value: 'vue', label: 'Vue', icon: '🟢' },
        { value: 'angular', label: 'Angular', icon: '🅰️' },
        { value: 'svelte', label: 'Svelte', icon: '💨' },
        { value: 'nextjs', label: 'Next.js', icon: '⏭️' },
        { value: 'nuxtjs', label: 'Nuxt.js', icon: '🔄' },
      ]
    },
    {
      category: 'Backend',
      languages: [
        { value: 'python', label: 'Python', icon: '🐍' },
        { value: 'java', label: 'Java', icon: '☕' },
        { value: 'php', label: 'PHP', icon: '🐘' },
        { value: 'ruby', label: 'Ruby', icon: '💎' },
        { value: 'go', label: 'Go', icon: '🐹' },
        { value: 'rust', label: 'Rust', icon: '🦀' },
        { value: 'csharp', label: 'C#', icon: '🔷' },
        { value: 'dotnet', label: '.NET', icon: '🔷' },
        { value: 'nodejs', label: 'Node.js', icon: '🟢' },
        { value: 'laravel', label: 'Laravel', icon: '🔶' },
        { value: 'django', label: 'Django', icon: '🐍' },
        { value: 'flask', label: 'Flask', icon: '🍶' },
        { value: 'spring', label: 'Spring', icon: '🌱' },
      ]
    },
    {
      category: 'Mobile',
      languages: [
        { value: 'kotlin', label: 'Kotlin', icon: '🔶' },
        { value: 'swift', label: 'Swift', icon: '🐦' },
        { value: 'reactnative', label: 'React Native', icon: '📱' },
        { value: 'flutter', label: 'Flutter', icon: '🦋' },
      ]
    },
    {
      category: 'Database & Others',
      languages: [
        { value: 'sql', label: 'SQL', icon: '🗃️' },
        { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
        { value: 'graphql', label: 'GraphQL', icon: '📊' },
        { value: 'bash', label: 'Bash/Shell', icon: '💻' },
        { value: 'docker', label: 'Docker', icon: '🐳' },
        { value: 'yaml', label: 'YAML', icon: '📄' },
        { value: 'json', label: 'JSON', icon: '{}' },
        { value: 'markdown', label: 'Markdown', icon: '📝' },
      ]
    }
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

      case 'bullet': {
        const bulletItems = selectedText.split('\n').filter(line => line.trim());
        formattedText = `\n<ul>\n${bulletItems.map(item => `  <li>${item.trim()}</li>`).join('\n')}\n</ul>\n`;
        newSelectionStart = start + 6;
        newSelectionEnd = start + formattedText.length - 7;
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
    setIsLanguageModalOpen(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  const insertCodeBlock = (language) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    
    const formattedText = `\n<div class="codeBlock">
                            <div class="codeContainer">
                              <div class="codeHeader">
                                <span class="languageLabel">${language}</span>
                                <button 
                                  class="codeCopy" 
                                  onclick="copyCode(this)"
                                >
                                  Copy
                                </button>
                              </div>
                              <pre><code class="language-${language}">
                          // Your ${language} code here
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
    const codeStartPos = start + formattedText.indexOf(`// Your ${language} code here`);
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(codeStartPos, codeStartPos);
      }
    }, 0);

    closeLanguageModal();
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
                      {option.icon}
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
                  <li>Select text and use the formatting toolbar for <strong>bold</strong>, <em>italic</em>, <u>underline</u>, and <code>code</code></li>
                  <li>Use the "Code Block" button to insert syntax-highlighted code blocks</li>
                  <li>Use the "Example" button to insert example blocks</li>
                  <li>Use <code>&lt;h2&gt;Heading&lt;/h2&gt;</code> for section headings</li>
                  <li>Use <code>&lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt;</code> for bullet lists</li>
                  <li>Use <code>&lt;hr /&gt;</code> for horizontal dividers</li>
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

      {/* Delete Confirmation Modal */}
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

      {/* Language Selection Modal */}
      <Modal
        isOpen={isLanguageModalOpen}
        onRequestClose={closeLanguageModal}
        className={styles.languageModal}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.languageModalHeader}>
          <h3>Select Programming Language</h3>
          <button onClick={closeLanguageModal} className={styles.closeModalButton}>
            <FiX />
          </button>
        </div>
        
        <div className={styles.languageModalContent}>
          {languageOptions.map((category, categoryIndex) => (
            <div key={categoryIndex} className={styles.languageCategory}>
              <h4 className={styles.categoryTitle}>{category.category}</h4>
              <div className={styles.languageGrid}>
                {category.languages.map((language, langIndex) => (
                  <button
                    key={langIndex}
                    className={styles.languageButton}
                    onClick={() => insertCodeBlock(language.value)}
                    title={language.label}
                  >
                    <span className={styles.languageIcon}>{language.icon}</span>
                    <span className={styles.languageName}>{language.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default BlogPostEditor;