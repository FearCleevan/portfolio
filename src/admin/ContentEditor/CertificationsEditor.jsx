//src/admin/ContentEditor/CertificationsEditor.jsx
import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import styles from './CertificationsEditor.module.css';

const CertificationsEditor = () => {
    const [certifications, setCertifications] = useState([
        {
            title: "Best in Industry Immersion",
            issuer: "Samson Polytechnic College of Davao",
            url: "https://web.facebook.com/photo/?fbid=4320544268000607"
        }
    ]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [newItem, setNewItem] = useState(false);

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

    const handleSave = () => {
        console.log('Saving certification data:', currentEditItem);
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
        console.log('Deleting certification with index:', index);
    };

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
                            <label>Issuer</label>
                            <input
                                type="text"
                                name="issuer"
                                value={currentEditItem?.issuer || ''}
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
                    {certifications.map((cert, index) => (
                        <div key={index} className={styles.listItem}>
                            <div className={styles.itemContent}>
                                <h4>{cert.title}</h4>
                                <p>{cert.issuer}</p>
                            </div>
                            <div className={styles.itemActions}>
                                <button
                                    onClick={() => handleEdit(cert)}
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

export default CertificationsEditor;