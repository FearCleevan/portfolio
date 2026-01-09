//src/admin/ContentEditor/ExperienceEditor.jsx
import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { useExperience } from '../../firebase/hooks/useExperience';
import styles from './ExperienceEditor.module.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const ExperienceEditor = () => {
    const { experience, loading, error, addItem, updateItem, removeItem, getNextOrderNumber, reorderItems } = useExperience();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    const handleEdit = (item = null) => {
        setIsEditing(true);
        if (item) {
            setCurrentEditItem({ 
                ...item,
                order: item.order || 1
            });
            setNewItem(false);
        } else {
            const nextOrder = getNextOrderNumber();
            setCurrentEditItem({
                role: '',
                company: '',
                year: '',
                status: 'active',
                order: nextOrder
            });
            setNewItem(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentEditItem(null);
        setNewItem(false);
    };

    const handleSave = async () => {
        if (!currentEditItem?.role?.trim() || !currentEditItem?.company?.trim() || !currentEditItem?.year?.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            if (newItem) {
                await addItem(currentEditItem);
                toast.success('Experience item added successfully!');
            } else {
                const originalItem = experience.find(item => item.id === currentEditItem.id);
                if (originalItem) {
                    // Preserve the order from original item
                    const updatedItem = { 
                        ...currentEditItem, 
                        order: originalItem.order 
                    };
                    await updateItem(originalItem, updatedItem);
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

    const handleOrderChange = (value) => {
        const order = parseInt(value);
        if (isNaN(order) || order < 1) {
            toast.error('Order must be a positive number');
            return;
        }
        
        // Check if order number already exists
        const existingOrder = experience.find(item => 
            item.order === order && 
            (!currentEditItem || item.id !== currentEditItem.id)
        );
        
        if (existingOrder) {
            toast.error(`Order number ${order} is already used by "${existingOrder.role}"`);
            return;
        }

        setCurrentEditItem(prev => ({
            ...prev,
            order
        }));
    };

    const moveItemDown = async (item) => {
        if (isReordering) return;
        
        setIsReordering(true);
        try {
            const currentIndex = experience.findIndex(i => i.id === item.id);
            if (currentIndex < experience.length - 1) {
                const itemBelow = experience[currentIndex + 1];
                await reorderItems(item, itemBelow);
                toast.success('Item moved down');
            }
        } catch (error) {
            console.error('Error moving item down:', error);
            toast.error('Failed to reorder experience item');
        } finally {
            setIsReordering(false);
        }
    };

    const moveItemUp = async (item) => {
        if (isReordering) return;
        
        setIsReordering(true);
        try {
            const currentIndex = experience.findIndex(i => i.id === item.id);
            if (currentIndex > 0) {
                const itemAbove = experience[currentIndex - 1];
                await reorderItems(item, itemAbove);
                toast.success('Item moved up');
            }
        } catch (error) {
            console.error('Error moving item up:', error);
            toast.error('Failed to reorder experience item');
        } finally {
            setIsReordering(false);
        }
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
                                disabled={!currentEditItem?.role?.trim() || !currentEditItem?.company?.trim() || !currentEditItem?.year?.trim() || isSaving}
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
                            <label>Order Number (Higher number = top position)</label>
                            <input
                                type="number"
                                name="order"
                                value={currentEditItem?.order || 1}
                                onChange={(e) => handleOrderChange(e.target.value)}
                                className={styles.input}
                                min="1"
                                disabled={!newItem}
                            />
                            {!newItem && (
                                <small className={styles.hint}>Order cannot be changed after creation. Use arrows to reorder.</small>
                            )}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Role *</label>
                            <input
                                type="text"
                                name="role"
                                value={currentEditItem?.role || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., Frontend Developer"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Company *</label>
                            <input
                                type="text"
                                name="company"
                                value={currentEditItem?.company || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., Tech Solutions Inc"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Year *</label>
                            <input
                                type="text"
                                name="year"
                                value={currentEditItem?.year || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., 2022 - Present"
                                required
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
                        <h3>Experience Items (Higher order number = top position)</h3>
                        <button
                            onClick={() => handleEdit()}
                            className={styles.editButton}
                        >
                            <FiPlus /> Add Experience
                        </button>
                    </div>
                    {experience.map((exp, index) => {
                        // Create a composite key to ensure uniqueness
                        const uniqueKey = `${exp.id}-${exp.order}-${index}`;
                        return (
                            <div key={uniqueKey} className={`${styles.listItem} ${styles[exp.status]}`}>
                                <div className={styles.itemContent}>
                                    <div className={styles.itemHeader}>
                                        <span className={styles.orderBadge}>Order: {exp.order || 1}</span>
                                        <h4>{exp.role}</h4>
                                    </div>
                                    <p>{exp.company}</p>
                                    <span>{exp.year}</span>
                                </div>
                                <div className={styles.itemActions}>
                                    <div className={styles.orderControls}>
                                        <button
                                            onClick={() => moveItemUp(exp)}
                                            disabled={index === 0 || isReordering}
                                            className={styles.orderButton}
                                            title="Move up"
                                        >
                                            <FiArrowUp />
                                        </button>
                                        <button
                                            onClick={() => moveItemDown(exp)}
                                            disabled={index === experience.length - 1 || isReordering}
                                            className={styles.orderButton}
                                            title="Move down"
                                        >
                                            <FiArrowDown />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleEdit(exp)}
                                        className={styles.editButton}
                                        title="Edit"
                                        disabled={isReordering}
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(exp)}
                                        className={styles.deleteButton}
                                        title="Delete"
                                        disabled={isReordering}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
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