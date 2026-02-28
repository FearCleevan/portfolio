//src/admin/ContentEditor/ProjectsEditor.jsx
import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import { useProjects } from '../../firebase/hooks/useProjects';
import styles from './ProjectsEditor.module.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set modal root for accessibility
Modal.setAppElement('#root');
const MAX_SAMPLE_IMAGES = 6;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const TECH_SUGGESTIONS = [
    'React JS',
    'Next.js',
    'Vue.js',
    'Angular',
    'JavaScript',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'Express.js',
    'Firebase',
    'MongoDB',
    'MySQL',
    'PostgreSQL'
];

const ProjectsEditor = () => {
    const { projects, loading, error, addItem, updateItem, removeItem, uploadSampleImages } = useProjects();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [techInput, setTechInput] = useState('');

    const handleEdit = (item = null) => {
        setIsEditing(true);
        setCurrentEditItem(item ? {
            ...item,
            technologies: Array.isArray(item.technologies) ? item.technologies : [],
            sampleImages: Array.isArray(item.sampleImages) ? item.sampleImages : []
        } : {
            id: Date.now().toString(),
            title: '',
            description: '',
            url: '',
            domain: '',
            technologies: [],
            sampleImages: []
        });
        setTechInput('');
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
        let saveSucceeded = false;
        try {
            if (newItem) {
                await addItem(currentEditItem);
                toast.success('Project added successfully!');
                saveSucceeded = true;
            } else {
                const originalItem = projects.find(item => item.id === currentEditItem.id);
                if (originalItem) {
                    await updateItem(originalItem, currentEditItem);
                    toast.success('Project updated successfully!');
                    saveSucceeded = true;
                }
            }
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(`Failed to save project: ${error.message}`);
        } finally {
            setIsSaving(false);
            if (saveSucceeded) {
                handleCancelEdit();
            }
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

    const addTechnology = (rawValue) => {
        const value = rawValue.trim();
        if (!value) return;

        setCurrentEditItem((prev) => {
            const currentTech = prev.technologies || [];
            const alreadyExists = currentTech.some((tech) => tech.toLowerCase() === value.toLowerCase());
            if (alreadyExists) {
                toast.info('Technology already added.');
                return prev;
            }

            return {
                ...prev,
                technologies: [...currentTech, value]
            };
        });
        setTechInput('');
    };

    const handleTechInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTechnology(techInput);
        }
    };

    const handleTechInputBlur = () => {
        if (techInput.trim()) {
            addTechnology(techInput);
        }
    };

    const handleRemoveTechnology = (technology) => {
        setCurrentEditItem((prev) => ({
            ...prev,
            technologies: (prev.technologies || []).filter((tech) => tech !== technology)
        }));
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = '';

        if (!files.length || !currentEditItem?.id) {
            return;
        }

        const existingCount = currentEditItem.sampleImages?.length || 0;
        const remainingSlots = MAX_SAMPLE_IMAGES - existingCount;

        if (remainingSlots <= 0) {
            toast.warning(`Only ${MAX_SAMPLE_IMAGES} sample images are allowed.`);
            return;
        }

        const filesWithinLimit = files.slice(0, remainingSlots);
        if (files.length > remainingSlots) {
            toast.info(`Only ${remainingSlots} image slot(s) left. Extra files were ignored.`);
        }

        const validFiles = filesWithinLimit.filter((file) => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file.`);
                return false;
            }

            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                toast.error(`${file.name} is larger than 5MB.`);
                return false;
            }

            return true;
        });

        if (!validFiles.length) {
            return;
        }

        setIsUploadingImages(true);
        try {
            const uploadedImages = await uploadSampleImages(currentEditItem.id, validFiles);
            setCurrentEditItem((prev) => ({
                ...prev,
                sampleImages: [...(prev.sampleImages || []), ...uploadedImages].slice(0, MAX_SAMPLE_IMAGES)
            }));
            toast.success('Sample image(s) uploaded successfully.');
        } catch (error) {
            console.error('Error uploading sample images:', error);
            const message = error?.message || 'Unknown upload error';
            const isPresetError = /upload preset/i.test(message);
            toast.error(
                isPresetError
                    ? `Failed to upload image(s): ${message} Create or fix an unsigned Cloudinary upload preset in .env.`
                    : `Failed to upload image(s): ${message}`
            );
        } finally {
            setIsUploadingImages(false);
        }
    };

    const handleRemoveImage = (imageId, imageUrl) => {
        setCurrentEditItem((prev) => ({
            ...prev,
            sampleImages: (prev.sampleImages || []).filter((image) => {
                if (imageId) return image.id !== imageId;
                return image.url !== imageUrl;
            })
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

    if (error && !projects.length) return <div className={styles.errorOverlay}>Error loading projects: {error.message}</div>;

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
                                disabled={!currentEditItem?.title || !currentEditItem?.description || !currentEditItem?.url || isSaving || isUploadingImages}
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
                                disabled={isSaving || isUploadingImages}
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
                        <div className={styles.formGroup}>
                            <label>Technologies</label>
                            <div className={styles.techChipContainer}>
                                {(currentEditItem?.technologies || []).map((technology) => (
                                    <button
                                        key={technology}
                                        type="button"
                                        className={styles.techChip}
                                        onClick={() => handleRemoveTechnology(technology)}
                                        disabled={isSaving || isUploadingImages}
                                        title="Remove technology"
                                    >
                                        <span>{technology}</span>
                                        <FiX />
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={techInput}
                                onChange={(event) => setTechInput(event.target.value)}
                                onKeyDown={handleTechInputKeyDown}
                                onBlur={handleTechInputBlur}
                                list="technology-suggestions"
                                className={styles.input}
                                placeholder="Type technology and press Enter (e.g., React JS)"
                                disabled={isSaving || isUploadingImages}
                            />
                            <datalist id="technology-suggestions">
                                {TECH_SUGGESTIONS.map((tech) => (
                                    <option key={tech} value={tech} />
                                ))}
                            </datalist>
                            <p className={styles.uploadHint}>Press Enter to add a chip. Click a chip to remove it.</p>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Sample Images ({currentEditItem?.sampleImages?.length || 0}/{MAX_SAMPLE_IMAGES})</label>
                            <label className={styles.uploadButton} htmlFor="projectSampleImages">
                                <FiUpload /> {isUploadingImages ? 'Uploading...' : 'Upload Images'}
                            </label>
                            <input
                                id="projectSampleImages"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className={styles.fileInput}
                                disabled={isSaving || isUploadingImages || (currentEditItem?.sampleImages?.length || 0) >= MAX_SAMPLE_IMAGES}
                            />
                            <p className={styles.uploadHint}>Max 6 images, up to 5MB each.</p>

                            {!!currentEditItem?.sampleImages?.length && (
                                <div className={styles.imageGrid}>
                                    {currentEditItem.sampleImages.map((image, index) => (
                                        <div key={`${currentEditItem.id}-editor-sample-${image.id || image.url || 'image'}-${index}`} className={styles.imageTile}>
                                            <img src={image.url} alt="Project sample" />
                                            <button
                                                type="button"
                                                className={styles.removeImageButton}
                                                onClick={() => handleRemoveImage(image.id, image.url)}
                                                disabled={isSaving || isUploadingImages}
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                    {projects.map((project, projectIndex) => (
                        <div key={`${project.id}-${projectIndex}`} className={styles.listItem}>
                            <div className={styles.itemContent}>
                                <h4>{project.title}</h4>
                                <p>{project.description}</p>
                                <a href={project.url} target="_blank" rel="noopener noreferrer">
                                    {project.domain}
                                </a>
                                <p className={styles.imageCount}>
                                    {Array.isArray(project.sampleImages) ? project.sampleImages.length : 0} sample image(s)
                                </p>
                                <p className={styles.imageCount}>
                                    {Array.isArray(project.technologies) ? project.technologies.length : 0} technology chip(s)
                                </p>
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
