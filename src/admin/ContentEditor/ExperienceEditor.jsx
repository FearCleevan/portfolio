// src/admin/ContentEditor/ExperienceEditor.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useExperience } from '../../firebase/hooks/useExperience';
import styles from './ExperienceEditor.module.css';

const ExperienceEditor = () => {
    const { experience, loading, error, addItem, updateItem, removeItem } = useExperience();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);

    const handleEdit = (item = null) => {
        setIsEditing(true);
        setCurrentEditItem(item ? { ...item } : {
            role: '',
            company: '',
            year: '',
            status: 'active'
        });
        setNewItem(item === null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentEditItem(null);
        setNewItem(false);
    };

    const handleSave = async () => {
        try {
            if (newItem) {
                await addItem(currentEditItem);
            } else {
                const originalItem = experience.find(item => item.id === currentEditItem.id);
                if (originalItem) {
                    await updateItem(originalItem, currentEditItem);
                }
            }
        } catch (error) {
            console.error('Error saving experience:', error);
        } finally {
            handleCancelEdit();
        }
    };

    const handleDelete = async (item) => {
        if (window.confirm(`Are you sure you want to delete the "${item.role}" at "${item.company}"?`)) {
            try {
                await removeItem(item);
            } catch (error) {
                console.error('Error deleting experience item:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEditItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading && !experience.length) return <div>Loading experience...</div>;
    if (error) return <div>Error loading experience: {error.message}</div>;

    return (
        <div className={styles.editorWrapper}>
            {isEditing ? (
                <div className={styles.editPanel}>
                    <div className={styles.editHeader}>
                        <h3>{newItem ? 'Add New' : 'Edit'} Experience Item</h3>
                        <div className={styles.editActions}>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                                disabled={!currentEditItem?.role || !currentEditItem?.company || !currentEditItem?.year}
                            >
                                <FiSave /> Save
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className={styles.cancelButton}
                            >
                                <FiX /> Cancel
                            </button>
                        </div>
                    </div>
                    <div className={styles.editorContent}>
                        <div className={styles.formGroup}>
                            <label>Role</label>
                            <input
                                type="text"
                                name="role"
                                value={currentEditItem?.role || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., Frontend Developer"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Company</label>
                            <input
                                type="text"
                                name="company"
                                value={currentEditItem?.company || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., Tech Solutions Inc"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Year</label>
                            <input
                                type="text"
                                name="year"
                                value={currentEditItem?.year || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., 2022 - Present"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Status</label>
                            <select
                                name="status"
                                value={currentEditItem?.status || 'active'}
                                onChange={handleInputChange}
                                className={styles.select}
                            >
                                <option value="active">Active</option>
                                <option value="current">Current</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.contentList}>
                    <div className={styles.listHeader}>
                        <h3>Experience Items</h3>
                        <button
                            onClick={() => handleEdit()}
                            className={styles.editButton}
                        >
                            <FiPlus /> Add Experience
                        </button>
                    </div>
                    {experience.map((exp, index) => (
                        <div key={exp.id} className={`${styles.listItem} ${styles[exp.status]}`}>
                            <div className={styles.itemContent}>
                                <h4>{exp.role}</h4>
                                <p>{exp.company}</p>
                                <span>{exp.year}</span>
                            </div>
                            <div className={styles.itemActions}>
                                <button
                                    onClick={() => handleEdit(exp)}
                                    className={styles.editButton}
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => handleDelete(exp)}
                                    className={styles.deleteButton}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExperienceEditor;