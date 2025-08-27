// src/admin/ContentEditor/PersonalDetailEditor.jsx
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX, FiUpload, FiEye, FiEyeOff } from 'react-icons/fi';
import { 
  getPersonalDetails, 
  updatePersonalDetails, 
  updateAdminPassword 
} from '../../firebase/services/personalDetailsService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './PersonalDetailEditor.module.css';
// import defaultProfileImage from '../../assets/profile.png';

const PersonalDetailEditor = () => {
    const [personalDetails, setPersonalDetails] = useState({
        fullName: 'Peter Paul Abillar Lazan',
        jobTitle: 'Junior Web Developer',
        email: 'fearcleevan123@gmail.com',
        secondaryEmail: 'jonathan.mauring17@gmail.com',
        phone: '+63 951 537 9127',
        address: 'Davao City, Philippines',
        calendlyUrl: 'https://calendly.com/fearcleevan/30min',
        linkedinUrl: 'https://linkedin.com/in/peterpaullazan',
        githubUrl: 'https://github.com/FearCleevan',
        instagramUrl: 'https://www.instagram.com/fearcleevan12345/',
        facebookUrl: 'https://www.facebook.com/FearCleevan',
        profileImage: null
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadPersonalDetails();
    }, []);

    const loadPersonalDetails = async () => {
        try {
            setIsLoading(true);
            const details = await getPersonalDetails();
            if (details) {
                setPersonalDetails(prev => ({ ...prev, ...details }));
                
                // Check if there's a locally stored profile image
                // const localImage = localStorage.getItem('profileImage');
                // if (localImage) {
                //     setImagePreview(localImage);
                // }
            }
        } catch (error) {
            console.error('Error loading personal details:', error);
            toast.error('Failed to load personal details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         // Validate file type
    //         if (!file.type.startsWith('image/')) {
    //             toast.error('Please select an image file');
    //             return;
    //         }
            
    //         // Validate file size (max 4MB)
    //         if (file.size > 8 * 1024 * 1024) {
    //             toast.error('Image size should be less than 8MB');
    //             return;
    //         }
            
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             const imageDataUrl = reader.result;
    //             setImagePreview(imageDataUrl);
                
    //             // Store image in localStorage for persistence
    //             localStorage.setItem('profileImage', imageDataUrl);
                
    //             // Update the header image if we're on the same domain
    //             updateHeaderProfileImage(imageDataUrl);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // const updateHeaderProfileImage = (imageData) => {
    //     // Update the profile image in the header component
    //     const headerImages = document.querySelectorAll('img[alt*="Peter Paul"], img[alt*="Profile"]');
    //     headerImages.forEach(img => {
    //         img.src = imageData;
    //     });
    // };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updatePersonalDetails(personalDetails);
            toast.success('Personal details updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving personal details:', error);
            toast.error('Failed to update personal details. Check Firebase permissions.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSave = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsSaving(true);
        try {
            await updateAdminPassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password updated successfully!');
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Failed to update password. Please check your current password.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    // const getProfileImageSrc = () => {
    //     return imagePreview || defaultProfileImage;
    // };

    if (isLoading) {
        return (
            <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Loading personal details...</p>
            </div>
        );
    }

    return (
        <div className={styles.editorWrapper}>
            <div className={styles.header}>
                <h2>Personal Details</h2>
                {!isEditing && !isChangingPassword && (
                    <button onClick={toggleEdit} className={styles.editButton}>
                        <FiEdit2 /> Edit Details
                    </button>
                )}
            </div>

            {isChangingPassword ? (
                <div className={styles.passwordPanel}>
                    <h3>Change Password</h3>
                    <div className={styles.formGroup}>
                        <label>Current Password</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className={styles.input}
                                placeholder="Enter current password"
                            />
                            <button 
                                type="button" 
                                className={styles.passwordToggle}
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>New Password</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className={styles.input}
                                placeholder="Enter new password"
                            />
                            <button 
                                type="button" 
                                className={styles.passwordToggle}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Confirm New Password</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className={styles.input}
                                placeholder="Confirm new password"
                            />
                            <button 
                                type="button" 
                                className={styles.passwordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handlePasswordSave}
                            className={styles.saveButton}
                            disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        >
                            {isSaving ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                <>
                                    <FiSave /> Update Password
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => setIsChangingPassword(false)}
                            className={styles.cancelButton}
                            disabled={isSaving}
                        >
                            <FiX /> Cancel
                        </button>
                    </div>
                </div>
            ) : isEditing ? (
                <div className={styles.editPanel}>
                    {/* <div className={styles.profileImageSection}>
                        <div className={styles.imagePreview}>
                            <img 
                                src={getProfileImageSrc()} 
                                alt="Profile preview" 
                            />
                        </div>
                        <div className={styles.imageUpload}>
                            <label htmlFor="profileImage" className={styles.uploadButton}>
                                <FiUpload /> Change Profile Image
                            </label>
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.fileInput}
                            />
                            <p className={styles.imageNote}>Recommended: Square image, 300x300px, max 2MB</p>
                        </div>
                    </div> */}

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={personalDetails.fullName}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter your full name"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={personalDetails.jobTitle}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter your job title"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Primary Email</label>
                            <input
                                type="email"
                                name="email"
                                value={personalDetails.email}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter primary email"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Secondary Email</label>
                            <input
                                type="email"
                                name="secondaryEmail"
                                value={personalDetails.secondaryEmail}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter secondary email"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={personalDetails.phone}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter phone number"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={personalDetails.address}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter your address"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Calendly URL</label>
                            <input
                                type="url"
                                name="calendlyUrl"
                                value={personalDetails.calendlyUrl}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter Calendly URL"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedinUrl"
                                value={personalDetails.linkedinUrl}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter LinkedIn URL"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>GitHub URL</label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={personalDetails.githubUrl}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter GitHub URL"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Instagram URL</label>
                            <input
                                type="url"
                                name="instagramUrl"
                                value={personalDetails.instagramUrl}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter Instagram URL"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label>Facebook URL</label>
                            <input
                                type="url"
                                name="facebookUrl"
                                value={personalDetails.facebookUrl}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter Facebook URL"
                            />
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            onClick={handleSave}
                            className={styles.saveButton}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                <>
                                    <FiSave /> Save Changes
                                </>
                            )}
                        </button>
                        <button
                            onClick={toggleEdit}
                            className={styles.cancelButton}
                            disabled={isSaving}
                        >
                            <FiX /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.viewPanel}>
                    <div className={styles.detailCard}>
                        {/* <div className={styles.profileImage}>
                            <img src={getProfileImageSrc()} alt="Profile" />
                        </div> */}
                        
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Full Name</span>
                                <span className={styles.detailValue}>{personalDetails.fullName}</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Job Title</span>
                                <span className={styles.detailValue}>{personalDetails.jobTitle}</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Primary Email</span>
                                <span className={styles.detailValue}>{personalDetails.email}</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Secondary Email</span>
                                <span className={styles.detailValue}>{personalDetails.secondaryEmail}</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Phone</span>
                                <span className={styles.detailValue}>{personalDetails.phone}</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Address</span>
                                <span className={styles.detailValue}>{personalDetails.address}</span>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Calendly</span>
                                <a href={personalDetails.calendlyUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                                    {personalDetails.calendlyUrl}
                                </a>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>LinkedIn</span>
                                <a href={personalDetails.linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                                    {personalDetails.linkedinUrl}
                                </a>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>GitHub</span>
                                <a href={personalDetails.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                                    {personalDetails.githubUrl}
                                </a>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Instagram</span>
                                <a href={personalDetails.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                                    {personalDetails.instagramUrl}
                                </a>
                            </div>
                            
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Facebook</span>
                                <a href={personalDetails.facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                                    {personalDetails.facebookUrl}
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.actionButtons}>
                        <button 
                            onClick={() => setIsChangingPassword(true)} 
                            className={styles.passwordButton}
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalDetailEditor;