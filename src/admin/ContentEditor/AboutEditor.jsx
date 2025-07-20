import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from './AboutEditor.module.css';
import { useAboutContent } from '../../firebase/hooks/useFirestore';

const AboutEditor = () => {
  const { aboutContent, loading, error, updateContent } = useAboutContent();
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [newItem, setNewItem] = useState(false);

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
    try {
      await updateContent(currentEditItem.description);
      setIsEditing(false);
      setCurrentEditItem(null);
      setNewItem(false);
    } catch (error) {
      console.error('Failed to save about content:', error);
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

  const removeArrayItem = (index) => {
    setCurrentEditItem(prev => {
      const newArray = [...prev.description];
      newArray.splice(index, 1);
      return {
        ...prev,
        description: newArray
      };
    });
  };

  if (loading && !isEditing) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner}></div>
        <p>Loading about content...</p>
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
                disabled={loading}
              >
                {loading ? (
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
                disabled={loading}
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
                <button 
                  onClick={() => removeArrayItem(index)}
                  className={styles.removeButton}
                  disabled={loading}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button 
              onClick={addArrayItem} 
              className={styles.addButton}
              disabled={loading}
            >
              <FiPlus /> Add Paragraph
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.contentList}>
          <div className={styles.listHeader}>
            <h3>About Content</h3>
            <button 
              onClick={() => handleEdit()}
              className={styles.editButton}
            >
              <FiPlus /> Edit Content
            </button>
          </div>
          <div className={styles.paragraphsPreview}>
            {aboutContent.map((para, index) => (
              <div key={index} className={styles.paragraphItem}>
                <p>{para}</p>
                <button 
                  onClick={() => handleEdit({ description: [...aboutContent] })}
                  className={styles.editButton}
                >
                  <FiEdit2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutEditor;