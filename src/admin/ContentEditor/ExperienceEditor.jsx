import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from './ExperienceEditor.module.css';

const ExperienceEditor = () => {
    const [experience, setExperience] = useState([
        {
            id: 1,
            role: "Frontend Developer",
            company: "The Launchpad Inc",
            year: "2022 - Present",
            status: "current"
        },
        {
            id: 2,
            role: "Web Developer Intern",
            company: "Tech Solutions Inc",
            year: "2021 - 2022",
            status: "active"
        }
    ]);
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

    const handleSave = () => {
        console.log('Saving experience data:', currentEditItem);
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

    const handleDelete = (id) => {
        console.log('Deleting experience item with id:', id);
    };

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
                        <div key={index} className={`${styles.listItem} ${styles[exp.status]}`}>
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
                                    onClick={() => handleDelete(exp.id)}
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