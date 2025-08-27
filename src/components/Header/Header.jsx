// src/components/header/Header.jsx
import React from 'react';
import styles from './Header.module.css';
import profile from '../../assets/profile.png';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaDownload } from 'react-icons/fa';
import resume from '../../assets/PeterPaulLazan_CV.pdf';
import { usePersonalDetails } from '../../firebase/hooks/usePersonalDetails';


function ThemeToggle({ isDarkMode, toggleDarkMode }) {
    return (
        <button
            className={`${styles.themeToggle} ${isDarkMode ? styles.dark : styles.light}`}
            aria-label="Toggle theme"
            onClick={toggleDarkMode}
            type="button"
        >
            <div
                className={`${styles.toggleKnob} ${isDarkMode ? styles.toggleKnobDark : styles.toggleKnobLight}`}
            >
                {isDarkMode ? (
                    <svg className={styles.toggleIcon} viewBox="0 0 20 20" fill="#000000">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                ) : (
                    <svg className={styles.toggleIcon} viewBox="0 0 20 20" fill="#FFD700">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                )}
            </div>
        </button>
    );
}

const Header = ({ isDarkMode, toggleDarkMode }) => {
    const { personalDetails, error } = usePersonalDetails();
    // const [profileImage, setProfileImage] = useState(defaultProfile);

    // useEffect(() => {
    //     // Check for locally stored profile image
    //     const localImage = localStorage.getItem('profileImage');
    //     if (localImage) {
    //         setProfileImage(localImage);
    //     }
    // }, []);

    const handleScheduleCall = () => {
        const calendlyUrl = personalDetails?.calendlyUrl || "https://calendly.com/fearcleevan/30min";
        window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
    };

    const handleSendEmail = () => {
        const email = personalDetails?.email || 'fearcleevan123@gmail.com';
        const subject = 'Regarding your portfolio';
        const body = 'Hello,\n\nI came across your portfolio and...';

        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
    };

    // if (loading) {
    //     return (
    //         <div className={`${styles.headerWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
    //             <div className={styles.container}>
    //                 <div className={styles.loadingState}>
    //                     <div className={styles.spinner}></div>
    //                     <p>Loading profile...</p>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    if (error) {
        return (
            <div className={`${styles.headerWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
                <div className={styles.container}>
                    <div className={styles.errorState}>
                        <p>Error loading profile details</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.headerWrapper} ${isDarkMode ? styles.darkMode : ''}`}>
            <div className={styles.container}>
                <div className={styles.profileImage}>
                    <img src={profile} alt="Peter Paul Abillar Lazan" width={160} height={160} />
                </div>
                <div className={styles.details}>
                    <div className={styles.modeToggle}>
                        <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    </div>
                    <div className={styles.nameContainer}>
                        <h1 className={`${styles.name} ${isDarkMode ? styles.darkText : ''}`}>
                            {personalDetails?.fullName || "Peter Paul Abillar Lazan"}
                            <svg className={styles.certifiedIcon} viewBox="0 0 24 24" fill="none" aria-label="Verified user">
                                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="#1d9bf0"></path>
                            </svg>
                        </h1>
                    </div>
                    <div className={`${styles.location} ${isDarkMode ? styles.darkText : ''}`}>
                        <FaMapMarkerAlt className={styles.locationIcon} />
                        <span>{personalDetails?.address || "Davao City, Philippines"}</span>
                    </div>
                    <p className={`${styles.title} ${isDarkMode ? styles.darkText : ''}`}>
                        {personalDetails?.jobTitle || "Junior Web Developer"}
                    </p>
                    <div className={styles.buttons}>
                        <button
                            className={`${styles.button} ${styles.scheduleButton} ${isDarkMode ? styles.darkButton : ''}`}
                            onClick={handleScheduleCall}
                        >
                            <FaPhone className={styles.buttonIcon} />
                            <span className={styles.buttonText}>Schedule a Call</span>
                        </button>
                        <button
                            className={`${styles.button} ${styles.emailButton} ${isDarkMode ? styles.darkEmailButton : ''}`}
                            onClick={handleSendEmail}
                        >
                            <FaEnvelope className={styles.buttonIcon} />
                            <span className={styles.buttonText}>Send Email</span>
                        </button>
                        <button
                            className={`${styles.button} ${styles.downloadButton} ${isDarkMode ? styles.darkButton : ''}`}
                        >
                            <FaDownload className={styles.buttonIcon} />
                            <a className={styles.buttonText} href={resume} download='Peter-Paul-Lazan-Resume.pdf'>Download CV</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;