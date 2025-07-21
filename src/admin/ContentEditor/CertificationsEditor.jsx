import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCertifications } from '../../firebase/hooks/useCertifications';
import styles from './CertificationsEditor.module.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CertificationsEditor = () => {
    const { certifications, loading, error, addItem, updateItem, removeItem } = useCertifications();
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
            issuer: '',
            url: ''
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
                toast.success('Certification added successfully!');
            } else {
                const originalItem = certifications.find(item => item.id === currentEditItem.id);
                if (originalItem) {
                    await updateItem(originalItem, currentEditItem);
                    toast.success('Certification updated successfully!');
                }
            }
        } catch (error) {
            console.error('Error saving certification:', error);
            toast.error(`Failed to save certification: ${error.message}`);
        } finally {
            setIsSaving(false);
            handleCancelEdit();
        }
    };

    const handleDeleteClick = (certification) => {
        setDeleteCandidate(certification);
        setIsDeleting(true);
    };

    const confirmDelete = async () => {
        if (!deleteCandidate) return;

        setIsDeleting(true);
        try {
            await removeItem(deleteCandidate);
            toast.success('Certification deleted successfully!');
        } catch (error) {
            console.error('Error deleting certification:', error);
            toast.error(`Failed to delete certification: ${error.message}`);
        } finally {
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

    if (loading && !certifications.length) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Loading certifications...</p>
            </div>
        );
    }

    if (error) return <div className={styles.errorOverlay}>Error loading certifications: {error.message}</div>;

    return (
        <div className={styles.editorWrapper}>
            {isEditing ? (
                <div className={styles.editPanel}>
                    <div className={styles.editHeader}>
                        <h3>{newItem ? 'Add New' : 'Edit'} Certification</h3>
                        <div className={styles.editActions}>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                                disabled={!currentEditItem?.title || !currentEditItem?.issuer || !currentEditItem?.url}
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
                                placeholder="Certification title"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Issuer</label>
                            <input
                                type="text"
                                name="issuer"
                                value={currentEditItem?.issuer || ''}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Issuing organization"
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
                                placeholder="https://example.com/certificate"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.contentList}>
                    <div className={styles.listHeader}>
                        <h3>Certifications</h3>
                        <button
                            onClick={() => handleEdit()}
                            className={styles.editButton}
                        >
                            <FiPlus /> Add Certification
                        </button>
                    </div>
                    {certifications.map((cert) => (
                        <div key={cert.id} className={styles.listItem}>
                            <div className={styles.itemContent}>
                                <h4>{cert.title}</h4>
                                <p>{cert.issuer}</p>
                                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                    View Certificate
                                </a>
                            </div>
                            <div className={styles.itemActions}>
                                <button
                                    onClick={() => handleEdit(cert)}
                                    className={styles.editButton}
                                >
                                    <FiEdit2 />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(cert)}
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
                isOpen={isDeleting}
                onRequestClose={cancelDelete}
                contentLabel="Delete Confirmation"
                className={styles.modalContent}
                overlayClassName={styles.modalOverlay}
            >
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete the "{deleteCandidate?.title}" certification?</p>
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
        </div>
    );
};

export default CertificationsEditor;