import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useExperience } from '../../firebase/hooks/useExperience';
import styles from './ExperienceEditor.module.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const ExperienceEditor = () => {
    const { experience, loading, error, addItem, updateItem, removeItem } = useExperience();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

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
        setIsSaving(true);
        try {
            if (newItem) {
                await addItem(currentEditItem);
                toast.success('Experience item added successfully!');
            } else {
                const originalItem = experience.find(item => item.id === currentEditItem.id);
                if (originalItem) {
                    await updateItem(originalItem, currentEditItem);
                    toast.success('Experience item updated successfully!');
                }
            }
            handleCancelEdit();
        } catch (error) {
            console.error('Error saving experience:', error);
            toast.error('Failed to save experience item');
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
            toast.success('Experience item deleted successfully!');
        } catch (error) {
            console.error('Error deleting experience item:', error);
            toast.error('Failed to delete experience item');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEditItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading && !experience.length) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Loading experience...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorOverlay}>
                <p>Error loading experience: {error.message}</p>
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
                        <h3>{newItem ? 'Add New' : 'Edit'} Experience Item</h3>
                        <div className={styles.editActions}>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                                disabled={!currentEditItem?.role || !currentEditItem?.company || !currentEditItem?.year || isSaving}
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
                    {experience.map((exp) => (
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
                                    onClick={() => openDeleteModal(exp)}
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
                <p>Are you sure you want to delete the "{itemToDelete?.role}" at "{itemToDelete?.company}"? This cannot be undone.</p>
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

export default ExperienceEditor;