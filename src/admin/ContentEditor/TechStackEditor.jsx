import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTechStack } from '../../firebase/hooks/useTechStack';
import styles from './TechStackEditor.module.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const TechStackEditor = () => {
    const { techStack, loading, error, addGroup, updateGroup, removeGroup } = useTechStack();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);
    const [techInput, setTechInput] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = (item = null) => {
        setIsEditing(true);
        setCurrentEditItem(item ? { ...item } : { title: '', items: [] });
        setTechInput(item ? item.items.join(', ') : '');
        setNewItem(item === null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentEditItem(null);
        setNewItem(false);
        setTechInput('');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (newItem) {
                await addGroup(currentEditItem);
                toast.success('Tech stack group added successfully!');
            } else {
                const originalGroup = techStack.find(
                    group => group.title === currentEditItem.title ||
                        JSON.stringify(group) === JSON.stringify(currentEditItem)
                );
                if (originalGroup) {
                    await updateGroup(originalGroup, currentEditItem);
                    toast.success('Tech stack group updated successfully!');
                }
            }
            handleCancelEdit();
        } catch (error) {
            console.error('Error saving tech stack:', error);
            toast.error('Failed to save tech stack group');
        } finally {
            setIsSaving(false);
        }
    };

    const openDeleteModal = (group) => {
        setGroupToDelete(group);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setGroupToDelete(null);
    };

    const confirmDelete = async () => {
        closeDeleteModal();
        try {
            await removeGroup(groupToDelete);
            toast.success('Tech stack group deleted successfully!');
        } catch (error) {
            console.error('Error deleting tech stack group:', error);
            toast.error('Failed to delete tech stack group');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEditItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTechInputChange = (e) => {
        const value = e.target.value;
        setTechInput(value);

        const items = value.split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        setCurrentEditItem(prev => ({
            ...prev,
            items
        }));
    };

    if (loading && !techStack.length) {
        return (
            <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Loading tech stack...</p>
                  </div>
        );
    }
    if (error) return <div className={styles.errorOverlay}>Error loading tech stack: {error.message}</div>;

    return (
        <div className={styles.editorWrapper}>
            {isEditing ? (
                <div className={styles.editPanel}>
                    <div className={styles.editHeader}>
                        <h3>{newItem ? 'Add New' : 'Edit'} Tech Stack Group</h3>
                        <div className={styles.editActions}>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                                disabled={!currentEditItem?.title || !currentEditItem?.items?.length || isSaving}
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
                            <label>Group Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentEditItem?.title || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g., Frontend, Backend"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Technologies (comma separated)</label>
                            <input
                                type="text"
                                name="items"
                                value={techInput}
                                onChange={handleTechInputChange}
                                className={styles.input}
                                placeholder="e.g., React, JavaScript, HTML"
                            />
                            <div className={styles.inputHint}>
                                Separate technologies with commas (e.g., "React, JavaScript, HTML")
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.contentList}>
                    <div className={styles.listHeader}>
                        <h3>Tech Stack Groups</h3>
                        <button
                            onClick={() => handleEdit()}
                            className={styles.editButton}
                        >
                            <FiPlus /> Add Group
                        </button>
                    </div>
                    {techStack.map((group, index) => (
                        <div key={index} className={styles.listItem}>
                            <div className={styles.itemContent}>
                                <h4>{group.title}</h4>
                                <div className={styles.tags}>
                                    {group.items.map((item, i) => (
                                        <span key={i} className={styles.tag}>{item}</span>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.itemActions}>
                                <button
                                    onClick={() => handleEdit(group)}
                                    className={styles.editButton}
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(group)}
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
                <p>Are you sure you want to delete the "{groupToDelete?.title}" group? This cannot be undone.</p>
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

export default TechStackEditor;