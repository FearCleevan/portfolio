// src/admin/ContentEditor/BlogPostEditor.jsx
import React, { useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnUnderline,
  BtnUndo,
  createButton,
  Editor,
  EditorProvider,
  Separator,
  Toolbar
} from 'react-simple-wysiwyg';
import { useBlogPosts } from '../../firebase/hooks/useBlogPosts';
import styles from './BlogPostEditor.module.css';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const stripHtml = (html = '') =>
  html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const buildSlug = (title = '') =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const BtnCodeBlock = createButton('Code block', '</>', () => {
  document.execCommand('formatBlock', false, 'pre');
});

const BtnFontSmaller = createButton('Smaller font', 'A-', () => {
  document.execCommand('fontSize', false, '2');
});

const BtnFontNormal = createButton('Normal font', 'A', () => {
  document.execCommand('fontSize', false, '3');
});

const BtnFontBigger = createButton('Bigger font', 'A+', () => {
  document.execCommand('fontSize', false, '5');
});

const BlogPostEditor = () => {
  const { blogPosts, loading, error, addItem, updateItem, removeItem } = useBlogPosts();
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [newItem, setNewItem] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const sortedPosts = useMemo(
    () =>
      [...blogPosts].sort(
        (a, b) => new Date(b?.date || b?.createdAt || 0) - new Date(a?.date || a?.createdAt || 0)
      ),
    [blogPosts]
  );

  const handleEdit = (item = null) => {
    setIsEditing(true);
    setCurrentEditItem(
      item
        ? { ...item, tags: Array.isArray(item.tags) ? item.tags : [], newTag: '' }
        : {
            title: '',
            slug: '',
            date: new Date().toISOString().split('T')[0],
            readTime: '3 min read',
            excerpt: '',
            tags: [],
            content: '',
            newTag: ''
          }
    );
    setNewItem(item === null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentEditItem(null);
    setNewItem(false);
  };

  const handleSave = async () => {
    if (!currentEditItem?.title || !stripHtml(currentEditItem.content)) {
      toast.error('Title and content are required.');
      return;
    }

    setIsSaving(true);
    try {
      const itemToSave = { ...currentEditItem };
      delete itemToSave.newTag;

      if (!itemToSave.excerpt?.trim()) {
        itemToSave.excerpt = stripHtml(itemToSave.content).slice(0, 170);
      }

      if (!newItem) {
        const originalItem = blogPosts.find((item) => item.id === currentEditItem.id);
        if (originalItem) {
          await updateItem(originalItem, itemToSave);
          toast.success('Blog post updated successfully.');
        }
        handleCancelEdit();
        return;
      }

      itemToSave.id = Date.now().toString();
      itemToSave.slug = buildSlug(itemToSave.title);
      itemToSave.createdAt = new Date().toISOString();
      await addItem(itemToSave);
      toast.success('Blog post added successfully.');
      handleCancelEdit();
    } catch (saveError) {
      console.error('Error saving blog post:', saveError);
      toast.error('Failed to save blog post.');
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
      toast.success('Blog post deleted successfully.');
    } catch (deleteError) {
      console.error('Error deleting blog post:', deleteError);
      toast.error('Failed to delete blog post.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditItem((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    const value = (currentEditItem?.newTag || '').trim();
    if (!value) return;

    const hasTag = (currentEditItem?.tags || []).some(
      (tag) => tag.toLowerCase() === value.toLowerCase()
    );
    if (hasTag) {
      toast.info('Tag already added.');
      return;
    }

    setCurrentEditItem((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), value],
      newTag: ''
    }));
  };

  const removeTag = (tagToRemove) => {
    setCurrentEditItem((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (loading && !blogPosts.length) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner}></div>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error && !blogPosts.length) {
    return (
      <div className={styles.errorOverlay}>
        <p>Error loading blog posts: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
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
                disabled={!currentEditItem?.title || !stripHtml(currentEditItem?.content) || isSaving}
              >
                {isSaving ? <span className={styles.spinner}></span> : <><FiSave /> Save</>}
              </button>
              <button onClick={handleCancelEdit} className={styles.cancelButton} disabled={isSaving}>
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
              <label>Excerpt (optional)</label>
              <textarea
                name="excerpt"
                value={currentEditItem?.excerpt || ''}
                onChange={handleInputChange}
                className={styles.textarea}
                rows="3"
                placeholder="If left empty, this will be auto-generated from content."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tags</label>
              <div className={styles.tagsInputContainer}>
                <div className={styles.tagsList}>
                  {(currentEditItem?.tags || []).map((tag, index) => (
                    <span key={`${tag}-${index}`} className={styles.tag}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className={styles.removeTag}>
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    value={currentEditItem?.newTag || ''}
                    onChange={(e) =>
                      setCurrentEditItem((prev) => ({
                        ...prev,
                        newTag: e.target.value
                      }))
                    }
                    onKeyDown={handleTagKeyDown}
                    className={styles.input}
                    placeholder="Add a tag and press Enter"
                  />
                  <button type="button" onClick={addTag} className={styles.addTagButton}>
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Content *</label>
              <EditorProvider>
                <Editor
                  value={currentEditItem?.content || ''}
                  onChange={(e) =>
                    setCurrentEditItem((prev) => ({
                      ...prev,
                      content: e.target.value
                    }))
                  }
                  containerProps={{ className: styles.wysiwygEditor }}
                >
                  <Toolbar>
                    <BtnUndo />
                    <BtnRedo />
                    <Separator />
                    <BtnBold />
                    <BtnItalic />
                    <BtnUnderline />
                    <Separator />
                    <BtnFontSmaller />
                    <BtnFontNormal />
                    <BtnFontBigger />
                    <Separator />
                    <BtnNumberedList />
                    <BtnBulletList />
                    <BtnLink />
                    <BtnCodeBlock />
                    <BtnClearFormatting />
                  </Toolbar>
                </Editor>
              </EditorProvider>
              <p className={styles.formatHelp}>
                Toolbar supports bold, italic, underline, smaller/bigger font, links, lists, and code blocks.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.contentList}>
          <div className={styles.listHeader}>
            <h3>Blog Posts</h3>
            <button onClick={() => handleEdit()} className={styles.editButton}>
              <FiPlus /> Add Blog Post
            </button>
          </div>

          {sortedPosts.map((post) => (
            <div key={post.id} className={styles.listItem}>
              <div className={styles.itemContent}>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <div className={styles.itemMeta}>
                  <span>{post.date}</span>
                  <span>&bull;</span>
                  <span>{post.readTime}</span>
                </div>
                <div className={styles.itemTags}>
                  {(post.tags || []).map((tag, index) => (
                    <span key={`${tag}-${index}`} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => handleEdit(post)} className={styles.editButton}>
                  <FiEdit2 />
                </button>
                <button onClick={() => openDeleteModal(post)} className={styles.deleteButton}>
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
    </div>
  );
};

export default BlogPostEditor;
