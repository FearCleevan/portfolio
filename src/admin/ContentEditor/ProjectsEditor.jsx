import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from './ProjectsEditor.module.css';

const ProjectsEditor = () => {
    const [projects, setProjects] = useState([
        {
            title: "ScapeDBM",
            description: "Landscaping Services Landing Page",
            url: "https://scapedbm.com",
            domain: "scapedbm.com"
        }
    ]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);

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

    const handleSave = () => {
        console.log('Saving project data:', currentEditItem);
        setIsEditing(false);
        setCurrentEditItem(null);
        setNewItem(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEditItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = (index) => {
        console.log('Deleting project with index:', index);
    };

    return (
        <div className={styles.editorWrapper}>
            {isEditing ? (
                <div className={styles.editPanel}>
                    <div className={styles.editHeader}>
                        <h3>{newItem ? 'Add New' : 'Edit'} Project</h3>
                        <div className={styles.editActions}>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
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
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentEditItem?.title || ''}
                                onChange={handleInputChange}
                                className={styles.input}
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
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>URL</label>
                            <input
                                type="text"
                                name="url"
                                value={currentEditItem?.url || ''}
                                onChange={handleInputChange}
                                className={styles.input}
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
                    {projects.map((project, index) => (
                        <div key={index} className={styles.listItem}>
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
                                    onClick={() => handleDelete(index)}
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