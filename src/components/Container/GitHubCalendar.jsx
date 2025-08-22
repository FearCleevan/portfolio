// src/components/Container/GitHubCalendar.jsx
import React, { useState, useEffect } from 'react';
import styles from './GitHubCalendar.module.css';

const GitHubCalendar = ({ username, token, isDarkMode }) => {
  const [contributions, setContributions] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username || !token) {
        setError('Username and token are required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, get user creation date to determine available years
        const userQuery = `
          query {
            user(login: "${username}") {
              createdAt
            }
          }
        `;

        const userResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userQuery }),
        });

        const userResult = await userResponse.json();
        
        if (userResult.errors) {
          throw new Error(userResult.errors[0].message);
        }
        
        const createdAt = new Date(userResult.data.user.createdAt);
        const currentYear = new Date().getFullYear();
        const startYear = createdAt.getFullYear();
        
        // Generate available years from account creation to current year
        const years = [];
        for (let year = currentYear; year >= startYear; year--) {
          years.push(year);
        }
        
        setAvailableYears(years);
        
        // Now fetch contributions for the selected year
        await fetchContributions(selectedYear);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, token]);

  const fetchContributions = async (year) => {
    try {
      const startDate = new Date(year, 0, 1); // January 1st of selected year
      const endDate = new Date(year, 11, 31); // December 31st of selected year
      
      const query = `
        query {
          user(login: "${username}") {
            contributionsCollection(from: "${startDate.toISOString()}", to: "${endDate.toISOString()}") {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    weekday
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      const weeks = result.data.user.contributionsCollection.contributionCalendar.weeks;
      setContributions(weeks);
      
      // Calculate which months to display
      const monthLabels = calculateMonthLabels(weeks);
      setMonths(monthLabels);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate which months to display
  const calculateMonthLabels = (weeks) => {
    if (!weeks || weeks.length === 0) return [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = [];
    
    // Get the first date from the first week
    if (weeks[0] && weeks[0].contributionDays.length > 0) {
      const firstDate = new Date(weeks[0].contributionDays[0].date);
      let currentMonth = firstDate.getMonth();
      
      // Add the first month
      months.push({
        name: monthNames[currentMonth],
        position: 0,
        weeks: 1
      });
      
      // Calculate positions for subsequent months
      for (let i = 1; i < weeks.length; i++) {
        const week = weeks[i];
        if (week.contributionDays.length > 0) {
          const weekDate = new Date(week.contributionDays[0].date);
          const weekMonth = weekDate.getMonth();
          
          if (weekMonth !== currentMonth) {
            months.push({
              name: monthNames[weekMonth],
              position: i,
              weeks: 1
            });
            currentMonth = weekMonth;
          } else if (months.length > 0) {
            // Update the last month's week count
            months[months.length - 1].weeks++;
          }
        }
      }
    }
    
    return months;
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setLoading(true);
    fetchContributions(year);
  };

  const getColorClass = (count) => {
    if (count === 0) return styles.color0;
    if (count >= 1 && count <= 4) return styles.color1;
    if (count >= 5 && count <= 9) return styles.color2;
    if (count >= 10 && count <= 19) return styles.color3;
    if (count >= 20) return styles.color4;
    return styles.color0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className={`${styles.calendarContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.loading}>Loading contribution data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.calendarContainer} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.calendarContainer} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.calendarHeader}>
        <h2 className={`${styles.calendarTitle} ${isDarkMode ? styles.darkText : ''}`}>
          GitHub Contributions
        </h2>
        
        {availableYears.length > 0 && (
          <ul className={styles.yearFilter}>
            {availableYears.map(year => (
              <li key={year}>
                <button
                  className={`${styles.yearButton} ${year === selectedYear ? styles.selected : ''} ${isDarkMode ? styles.darkYearButton : ''}`}
                  onClick={() => handleYearChange(year)}
                  aria-label={`Contribution activity in ${year}`}
                  aria-current={year === selectedYear ? 'true' : 'false'}
                >
                  {year}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className={styles.calendarWrapper}>
        <div className={styles.calendar}>
          <div className={styles.weeks}>
            {contributions.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.week}>
                {week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`${styles.day} ${getColorClass(day.contributionCount)}`}
                    data-tooltip={`${formatDate(day.date)}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
          
          <div className={styles.months}>
            {months.map((month, index) => (
              <span 
                key={index} 
                className={`${styles.month} ${isDarkMode ? styles.darkText : ''}`}
                style={{ 
                  marginLeft: index === 0 ? '0' : 'auto',
                  flex: month.weeks
                }}
              >
                {month.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.legend}>
        <span className={`${styles.legendText} ${isDarkMode ? styles.darkText : ''}`}>Less</span>
        <div className={styles.legendColors}>
          <div className={`${styles.legendColor} ${styles.color0}`} />
          <div className={`${styles.legendColor} ${styles.color1}`} />
          <div className={`${styles.legendColor} ${styles.color2}`} />
          <div className={`${styles.legendColor} ${styles.color3}`} />
          <div className={`${styles.legendColor} ${styles.color4}`} />
        </div>
        <span className={`${styles.legendText} ${isDarkMode ? styles.darkText : ''}`}>More</span>
      </div>
    </div>
  );
};

export default GitHubCalendar;