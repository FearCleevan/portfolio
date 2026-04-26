import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DISPLAY_DAYS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const LEVEL_CLASSES = [
  'bg-gray-100 dark:bg-gray-800',           // NONE
  'bg-emerald-200 dark:bg-emerald-900',     // FIRST_QUARTILE
  'bg-emerald-400 dark:bg-emerald-700',     // SECOND_QUARTILE
  'bg-emerald-500 dark:bg-emerald-500',     // THIRD_QUARTILE
  'bg-emerald-700 dark:bg-emerald-400',     // FOURTH_QUARTILE
];

// Real SVG icons
function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function getLevel(contributionLevel) {
  const levels = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return levels[contributionLevel] ?? 0;
}

function calculateMonthLabels(weeks) {
  if (!weeks?.length) return [];
  const labels = [];
  let currentMonth = -1;

  weeks.forEach((week, wi) => {
    const day = week.contributionDays[0];
    if (!day) return;
    const m = new Date(day.date).getMonth();
    if (m !== currentMonth) {
      labels.push({ name: MONTH_NAMES[m], weekIndex: wi });
      currentMonth = m;
    }
  });
  return labels;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
  });
}

// No-token fallback — shows a GitHub profile card
function GitHubFallback({ username }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-4">
        <span className="text-gray-700 dark:text-gray-300"><GitHubIcon /></span>
        GitHub Activity
      </h2>
      <div className="flex flex-col items-center gap-4 py-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          View contribution history and open-source work on GitHub.
        </p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
        >
          <GitHubIcon />
          @{username}
        </a>
      </div>
    </div>
  );
}

export default function GitHubCalendar({ username }) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const { isDarkMode } = useTheme();

  const [weeks, setWeeks] = useState([]);
  const [months, setMonths] = useState([]);
  const [totalContribs, setTotal] = useState(0);
  const [availableYears, setAvailYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!token || !username) return <GitHubFallback username={username || 'FearCleevan'} />;

  const gql = async (query) => {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  };

  const fetchYear = async (year) => {
    setLoading(true);
    setError(null);
    try {
      const from = new Date(year, 0, 1).toISOString();
      const to = new Date(year, 11, 31).toISOString();
      const data = await gql(`query {
        user(login: "${username}") {
          contributionsCollection(from: "${from}", to: "${to}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }`);
      const cal = data.user.contributionsCollection.contributionCalendar;
      setWeeks(cal.weeks);
      setMonths(calculateMonthLabels(cal.weeks));
      setTotal(cal.totalContributions);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await gql(`query { user(login: "${username}") { createdAt } }`);
        const startYear = new Date(data.user.createdAt).getFullYear();
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let y = currentYear; y >= startYear; y--) years.push(y);
        setAvailYears(years);
        await fetchYear(currentYear);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [username]);

  const handleYearChange = (y) => {
    setSelectedYear(y);
    fetchYear(y);
  };

  // Build a 7-row × 53-column grid
  const grid = Array.from({ length: 7 }, () => Array(53).fill(null));
  weeks.forEach((week, wi) => {
    week.contributionDays.forEach((day, di) => {
      if (grid[di]) {
        grid[di][wi] = day;
      }
    });
  });

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-900 dark:border-white shadow-sm p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <span className="text-gray-700 dark:text-gray-300"><GitHubIcon /></span>
            GitHub Contributions
          </h2>
          {!loading && !error && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors duration-300">
              {totalContribs.toLocaleString()} contributions in {selectedYear}
            </p>
          )}
        </div>

        {availableYears.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {availableYears.map((y) => (
              <button
                key={y}
                onClick={() => handleYearChange(y)}
                aria-label={`View ${y}`}
                className={`px-2.5 py-1 text-xs font-medium transition-colors duration-150 border ${y === selectedYear
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : 'bg-transparent border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:border-gray-900 dark:hover:border-white'
                  }`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-28 gap-2 text-sm text-gray-400 dark:text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white animate-spin" />
          Loading contributions…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-xs text-red-500 dark:text-red-400 text-center py-8">
          Could not load contribution data.
        </p>
      )}

      {/* Calendar grid */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto pb-1">
            <div className="flex justify-center" style={{ minWidth: '750px' }}>
              {/* Day labels (left axis) */}
              <div className="flex flex-col mr-2" style={{ gap: '2px', paddingTop: '20px' }}>
                {DAY_LABELS.map((day, di) => (
                  DISPLAY_DAYS.includes(di) && (
                    <span
                      key={day}
                      className="text-[10px] text-gray-400 dark:text-gray-500 leading-3"
                      style={{ height: '12px', lineHeight: '12px' }}
                    >
                      {day}
                    </span>
                  )
                ))}
              </div>

              {/* Grid with month labels */}
              <div>
                {/* Month labels */}
                <div className="flex mb-1" style={{ gap: '2px' }}>
                  {months.map((m, i) => {
                    const span = i < months.length - 1
                      ? months[i + 1].weekIndex - m.weekIndex
                      : weeks.length - m.weekIndex;
                    return (
                      <span
                        key={i}
                        className="text-[10px] text-gray-400 dark:text-gray-500"
                        style={{ width: `${span * 14}px`, flexShrink: 0 }}
                      >
                        {m.name}
                      </span>
                    );
                  })}
                </div>

                {/* Contribution grid - 7 rows × 53 columns */}
                <div className="flex flex-col" style={{ gap: '2px' }}>
                  {grid.map((row, ri) => (
                    <div key={ri} className="flex" style={{ gap: '2px' }}>
                      {row.map((day, ci) => (
                        <div
                          key={ci}
                          data-level={day ? getLevel(day.contributionLevel) : 0}
                          title={day ? `${formatDate(day.date)}: ${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}` : 'No contributions'}
                          className={`w-3 h-3 cursor-default transition-opacity hover:opacity-70 ${day ? LEVEL_CLASSES[getLevel(day.contributionLevel)] : LEVEL_CLASSES[0]
                            }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer legend */}
          <div className="flex items-center justify-between mt-3">
            <a
              href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Learn how we count contributions
              <ExternalLinkIcon />
            </a>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">Less</span>
              {LEVEL_CLASSES.map((cls, i) => (
                <div key={i} className={`w-3 h-3 ${cls}`} />
              ))}
              <span className="text-[10px] text-gray-400 dark:text-gray-500">More</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}