import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from './AboutEditor.module.css';
import { useAboutContent } from '../../firebase/hooks/useFirestore';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const AboutEditor = () => {
  const { aboutContent, loading, error, updateContent } = useAboutContent();
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [newItem, setNewItem] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paragraphToDelete, setParagraphToDelete] = useState(null);

  const handleEdit = (item = null) => {
    setIsEditing(true);
    setCurrentEditItem(item ? { ...item } : { description: [...aboutContent] });
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
      await updateContent(currentEditItem.description);
      toast.success('About content saved successfully!');
      setIsEditing(false);
      setCurrentEditItem(null);
      setNewItem(false);
    } catch (error) {
      console.error('Failed to save about content:', error);
      toast.error('Failed to save about content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArrayItemChange = (e, index) => {
    const { value } = e.target;
    setCurrentEditItem(prev => {
      const newArray = [...prev.description];
      newArray[index] = value;
      return {
        ...prev,
        description: newArray
      };
    });
  };

  const addArrayItem = () => {
    setCurrentEditItem(prev => ({
      ...prev,
      description: [...(prev.description || []), ""]
    }));
  };

  const openDeleteModal = (index) => {
    setParagraphToDelete(index);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setParagraphToDelete(null);
  };

  const confirmDelete = async () => {
    closeDeleteModal();
    try {
      const updatedContent = aboutContent.filter((_, index) => index !== paragraphToDelete);
      await updateContent(updatedContent);
      toast.success('Paragraph deleted successfully!');
    } catch (error) {
      console.error('Failed to delete paragraph:', error);
      toast.error('Failed to delete paragraph');
    }
  };

  if (loading && !isEditing) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner}></div>
        <p>Loading about...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorOverlay}>
        <p>Failed to load about content.</p>
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
            <h3>{newItem ? 'Add New' : 'Edit'} About Section</h3>
            <div className={styles.editActions}>
              <button 
                onClick={handleSave}
                className={styles.saveButton}
                disabled={isSaving}
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
            <h3>About Section</h3>
            {currentEditItem?.description?.map((paragraph, index) => (
              <div key={index} className={styles.arrayItem}>
                <textarea
                  name={`paragraph-${index}`}
                  value={paragraph}
                  onChange={(e) => handleArrayItemChange(e, index)}
                  className={styles.textArea}
                />
                {/* <button 
                  onClick={() => removeArrayItem(index)}
                  className={styles.removeButton}
                  disabled={isSaving}
                >
                  <FiTrash2 />
                </button> */}
              </div>
            ))}
            <button 
              onClick={addArrayItem} 
              className={styles.addButton}
              disabled={isSaving}
            >
              <FiPlus /> Add Paragraph
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.contentList}>
          <div className={styles.listHeader}>
            <h3>About Content</h3>
            <div className={styles.headerActions}>
              <button 
                onClick={() => handleEdit()}
                className={styles.editButton}
              >
                <FiPlus /> Edit Content
              </button>
              {/* <button 
                onClick={handleReset}
                className={styles.deleteButton}
              >
                <FiTrash2 /> Reset Content
              </button> */}
            </div>
          </div>
          <div className={styles.paragraphsPreview}>
            {aboutContent.map((para, index) => (
              <div key={index} className={styles.paragraphItem}>
                <p>{para}</p>
                <div className={styles.itemActions}>
                  <button 
                    onClick={() => handleEdit({ description: [...aboutContent] })}
                    className={styles.editButton}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(index)}
                    className={styles.deleteButton}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this paragraph? This cannot be undone.</p>
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

export default AboutEditor;