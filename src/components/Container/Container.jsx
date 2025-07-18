import styles from './Container.module.css';

const Container = ({ isDarkMode }) => {
  // Sample data
  const projects = [
    {
      title: "ScapeDBM",
      description: "Landscaping Services Landing Page",
      url: "https://scapedbm.com",
      domain: "scapedbm.com"
    },
    {
      title: "The Launchpad Inc",
      description: "Company Website Landing Page",
      url: "https://www.thelaunchpadteam.com/",
      domain: "thelaunchpadteam.com"
    },
    {
      title: "Chat System",
      description: "Company Internal Chat System",
      url: "https://lpchat.thelaunchpadteam.com/",
      domain: "lpchat.thelaunchpadteam.com"
    },
    {
      title: "TechnoBuild",
      description: "Static E-Commerce Website with Admin Panel and PC Builder",
      url: "https://fearcleevan.github.io/TechnoBlade-Ecommerce/",
      domain: "fearcleevan.github.io"
    }
  ];

  const certifications = [
    {
      title: "Best in Industry Immersion",
      issuer: "Samson Polytechnic College of Davao",
      url: "https://web.facebook.com/photo/?fbid=4320544268000607"
    },
    {
      title: "Best in Capstone Project",
      issuer: "Samson Polytechnic College of Davao",
      url: "https://www.credly.com/badges/d4ea07f0-f7f1-4889-8b15-2a0ec22850ff/public_url"
    },
  ];

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      {/* Projects Section */}
      <div className={`${styles.bentoCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <h2 className={`${styles.cardHeading} ${isDarkMode ? styles.darkText : ''}`}><span className={styles.gridIcon}>📂</span> Recent Projects</h2>
          </div>
          <a className={`${styles.viewAllLink} ${isDarkMode ? styles.darkLink : ''}`} href="#">
            View All
            <svg className={styles.linkArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <div key={index} className={`${styles.projectCard} ${isDarkMode ? styles.darkProjectCard : ''}`}>
              <a target="_blank" rel="noopener noreferrer" className={styles.projectLink} href={project.url}>
                <h3 className={`${styles.projectTitle} ${isDarkMode ? styles.darkText : ''}`}>
                  {project.title}
                  <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </h3>
                <p className={`${styles.projectDescription} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{project.description}</p>
                <p className={`${styles.projectDomain} ${isDarkMode ? styles.darkDomain : ''}`}>{project.domain}</p>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className={`${styles.bentoCard} ${isDarkMode ? styles.darkBentoCard : ''}`}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <h2 className={`${styles.cardHeading} ${isDarkMode ? styles.darkText : ''}`}><span className={styles.gridIcon}>🎓</span> Certifications</h2>
          </div>
          <a className={`${styles.viewAllLink} ${isDarkMode ? styles.darkLink : ''}`} href="#">
            View All
            <svg className={styles.linkArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
        <div className={styles.certificationsList}>
          {certifications.map((cert, index) => (
            <a 
              key={index} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.certificationItem} ${isDarkMode ? styles.darkCertificationItem : ''}`} 
              href={cert.url}
            >
              <h3 className={`${styles.certificationTitle} ${isDarkMode ? styles.darkText : ''}`}>{cert.title}</h3>
              <p className={`${styles.certificationIssuer} ${isDarkMode ? styles.darkSecondaryText : ''}`}>{cert.issuer}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Container;