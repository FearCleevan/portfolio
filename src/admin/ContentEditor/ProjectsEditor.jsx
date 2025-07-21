import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useProjects } from '../../firebase/hooks/useProjects';
import styles from './ProjectsEditor.module.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set modal root for accessibility
Modal.setAppElement('#root');

const ProjectsEditor = () => {
    const { projects, loading, error, addItem, updateItem, removeItem } = useProjects();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = (item = null) => {
        setIsEditing(true);
        setCurrentEditItem(item ? { ...item } : {
            title: '',
            description: '',
            url: '',
            domain: ''
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
                toast.success('Project added successfully!');
            } else {
                const originalItem = projects.find(item => item.id === currentEditItem.id);
                if (originalItem) {
                    await updateItem(originalItem, currentEditItem);
                    toast.success('Project updated successfully!');
                }
            }
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(`Failed to save project: ${error.message}`);
        } finally {
            setIsSaving(false);
            handleCancelEdit();
        }
    };

    const handleDeleteClick = (project) => {
        setDeleteCandidate(project);
        setIsDeleting(true);
    };

    const confirmDelete = async () => {
        if (!deleteCandidate) return;
        
        setIsSaving(true);
        try {
            await removeItem(deleteCandidate);
            toast.success('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error(`Failed to delete project: ${error.message}`);
        } finally {
            setIsSaving(false);
            setIsDeleting(false);
            setDeleteCandidate(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleting(false);
        setDeleteCandidate(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEditItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading && !projects.length) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Loading projects...</p>
            </div>
        );
    }

    if (error) return <div className={styles.errorOverlay}>Error loading projects: {error.message}</div>;

    return (
        <div className={styles.editorWrapper}>
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleting}
                onRequestClose={cancelDelete}
                contentLabel="Delete Confirmation"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete the "{deleteCandidate?.title}" project?</p>
                <div className={styles.modalActions}>
                    <button
                        onClick={cancelDelete}
                        className={styles.cancelButton}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDelete}
                        className={styles.deleteButton}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </Modal>

            {isEditing ? (
                <div className={styles.editPanel}>
                    <div className={styles.editHeader}>
                        <h3>{newItem ? 'Add New' : 'Edit'} Project</h3>
                        <div className={styles.editActions}>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                                disabled={!currentEditItem?.title || !currentEditItem?.description || !currentEditItem?.url || isSaving}
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
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentEditItem?.title || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Project title"
                                disabled={isSaving}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={currentEditItem?.description || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Project description"
                                disabled={isSaving}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>URL</label>
                            <input
                                type="url"
                                name="url"
                                value={currentEditItem?.url || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="https://example.com"
                                disabled={isSaving}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Domain</label>
                            <input
                                type="text"
                                name="domain"
                                value={currentEditItem?.domain || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="example.com"
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.contentList}>
                    <div className={styles.listHeader}>
                        <h3>Projects</h3>
                        <button
                            onClick={() => handleEdit()}
                            className={styles.editButton}
                        >
                            <FiPlus /> Add Project
                        </button>
                    </div>
                    {projects.map((project) => (
                        <div key={project.id} className={styles.listItem}>
                            <div className={styles.itemContent}>
                                <h4>{project.title}</h4>
                                <p>{project.description}</p>
                                <a href={project.url} target="_blank" rel="noopener noreferrer">
                                    {project.domain}
                                </a>
                            </div>
                            <div className={styles.itemActions}>
                                <button
                                    onClick={() => handleEdit(project)}
                                    className={styles.editButton}
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(project)}
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

export default ProjectsEditor;