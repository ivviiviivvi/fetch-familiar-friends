import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CalendarCard from './components/calendar/CalendarCard';
import ThemeSelector from './components/calendar/ThemeSelector';
import DateNavigation from './components/calendar/DateNavigation';
import MonthCalendar from './components/calendar/MonthCalendar';
import ErrorBoundary from './components/ErrorBoundary';
import JournalModal from './components/modals/JournalModal';
import AiModal from './components/modals/AiModal';
import FavoritesModal from './components/modals/FavoritesModal';
import StatisticsModal from './components/modals/StatisticsModal';
import KeyboardShortcutsModal from './components/modals/KeyboardShortcutsModal';
import SettingsModal from './components/modals/SettingsModal';
import AuthModal from './components/modals/AuthModal';
import { useNavigationShortcuts, useModalShortcuts, useThemeCycleShortcut, useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDarkMode } from './hooks/useDarkMode';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [theme, setTheme] = useState('park');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Modal states
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showMonthView, setShowMonthView] = useState(false);

  // Data states
  const [favorites, setFavorites] = useState([]);
  const [journalEntries, setJournalEntries] = useState({});
  const [currentImage, setCurrentImage] = useState(null);
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: false,
    imageQuality: 'high',
    cacheEnabled: true,
    preloadImages: true,
    preloadDays: 3,
    defaultView: 'day',
    animationsEnabled: true,
    compactMode: false,
    autoTheme: false
  });

  const themes = [
    { name: 'park', label: 'Park', icon: '🌳', gradient: 'from-lime-400 to-emerald-600' },
    { name: 'beach', label: 'Beach', icon: '🏖️', gradient: 'from-sky-400 to-blue-600' },
    { name: 'forest', label: 'Forest', icon: '🌲', gradient: 'from-green-500 to-green-800' },
    { name: 'tundra', label: 'Tundra', icon: '❄️', gradient: 'from-cyan-400 to-sky-700' },
    { name: 'sunset', label: 'Sunset', icon: '🌅', gradient: 'from-orange-400 to-pink-600' },
    { name: 'night', label: 'Night', icon: '🌙', gradient: 'from-indigo-500 to-purple-800' },
    { name: 'snow', label: 'Snow', icon: '🌨️', gradient: 'from-blue-100 to-cyan-300' },
    { name: 'autumn', label: 'Autumn', icon: '🍂', gradient: 'from-yellow-600 to-red-700' }
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('dogtale-favorites');
      const savedJournalEntries = localStorage.getItem('dogtale-journal');
      const savedTheme = localStorage.getItem('dogtale-theme');
      const savedSettings = localStorage.getItem('dogtale-settings');

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedJournalEntries) {
        setJournalEntries(JSON.parse(savedJournalEntries));
      }
      if (savedTheme) {
        setTheme(savedTheme);
      }
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dogtale-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
      // Optionally, notify the user that storage is full
    }
  }, [favorites]);

  // Save journal entries to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dogtale-journal', JSON.stringify(journalEntries));
    } catch (error) {
      console.error('Error saving journal entries to localStorage:', error);
    }
  }, [journalEntries]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('dogtale-theme', theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('dogtale-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }, [settings]);

  // Modal handlers
  const handleJournalClick = () => {
    setIsJournalOpen(true);
  };

  const handleAiClick = () => {
    setIsAiOpen(true);
  };

  const handleFavoritesClick = () => {
    setIsFavoritesOpen(true);
  };

  // Journal handlers
  const handleSaveJournal = async (date, entry) => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setJournalEntries(prev => ({
      ...prev,
      [dateKey]: entry
    }));
  };

  // Favorites handlers
  const handleAddFavorite = (imageUrl, imageType) => {
    const newFavorite = {
      id: Date.now().toString(),
      url: imageUrl,
      type: imageType,
      savedAt: Date.now()
    };
    setFavorites(prev => [newFavorite, ...prev]);
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  // Settings handler
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  // Check if current image is favorited
  const isCurrentImageFavorited = currentImage && favorites.some(fav => fav.url === currentImage.url);

  // Get journal entry for current date
  const currentJournalEntry = journalEntries[currentDate.toDateString()] || '';

  // Navigation handlers for keyboard shortcuts
  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const today = new Date();
    if (currentDate < today) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Theme cycle handler
  const handleCycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.name === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  // Keyboard shortcuts (only active when no modal is open)
  const anyModalOpen = isJournalOpen || isAiOpen || isFavoritesOpen || isStatsOpen || isShortcutsOpen || isSettingsOpen || isAuthOpen;

  useNavigationShortcuts({
    onPrevious: handlePreviousDay,
    onNext: handleNextDay,
    onToday: handleToday,
    enabled: !anyModalOpen
  });

  useModalShortcuts({
    onJournal: () => setIsJournalOpen(true),
    onAi: () => setIsAiOpen(true),
    onFavorites: () => setIsFavoritesOpen(true),
    onStats: () => setIsStatsOpen(true),
    enabled: !anyModalOpen
  });

  useThemeCycleShortcut(handleCycleTheme, !anyModalOpen);

  // Help, view toggle, dark mode, and settings shortcuts (always active except when typing)
  useKeyboardShortcuts({
    '?': () => setIsShortcutsOpen(true),
    'shift+/': () => setIsShortcutsOpen(true),
    'm': () => setShowMonthView(!showMonthView),
    'd': toggleDarkMode,
    ',': () => setIsSettingsOpen(true),
  }, !anyModalOpen);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-200">
        <div className="container mx-auto max-w-2xl">
          <div className="relative mb-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 transition-colors">
              DogTale Daily
            </h1>
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <UserProfileButton onSignInClick={() => setIsAuthOpen(true)} />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Light mode (D)' : 'Dark mode (D)'}
              >
                <span className="text-xl">{isDarkMode ? '☀️' : '🌙'}</span>
              </button>
              <button
                onClick={() => setShowMonthView(!showMonthView)}
                className="p-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={showMonthView ? 'Show day view' : 'Show month view'}
                title={showMonthView ? 'Show day view (M)' : 'Show month view (M)'}
              >
                <span className="text-xl">{showMonthView ? '📅' : '📆'}</span>
              </button>
              <button
                onClick={() => setIsShortcutsOpen(true)}
                className="p-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (?)"
              >
                <span className="text-xl">⌨️</span>
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Settings"
                title="Settings (,)"
              >
                <span className="text-xl">⚙️</span>
              </button>
              <button
                onClick={() => setIsStatsOpen(true)}
                className="p-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="View statistics"
                title="View your statistics (S)"
              >
                <span className="text-2xl">📊</span>
              </button>
            </div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-300 mb-6 transition-colors">
            Your daily dose of dog joy 🐾
          </p>

          {!showMonthView && (
            <DateNavigation
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />
          )}

          {!showMonthView && (
            <ThemeSelector
              currentTheme={theme}
              onThemeChange={setTheme}
              themes={themes}
            />
          )}

          {showMonthView ? (
            <MonthCalendar
              currentDate={currentDate}
              journalEntries={journalEntries}
              favorites={favorites}
              onDateSelect={(date) => {
                setCurrentDate(date);
                setShowMonthView(false);
              }}
            />
          ) : (
            <CalendarCard
              date={currentDate}
              theme={theme}
              onJournalClick={handleJournalClick}
              onAiClick={handleAiClick}
              onFavoritesClick={handleFavoritesClick}
              onImageLoad={setCurrentImage}
              onFavoriteToggle={handleAddFavorite}
              isFavorited={isCurrentImageFavorited}
              journalEntry={currentJournalEntry}
              favoriteCount={favorites.length}
              settings={settings}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        date={currentDate}
        initialEntry={currentJournalEntry}
        onSave={handleSaveJournal}
        allEntries={journalEntries}
      />

      <AiModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentBreed={currentImage?.breed || null}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemove={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />

      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        favorites={favorites}
        journalEntries={journalEntries}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </ErrorBoundary>
  );
}

// User Profile Button Component
function UserProfileButton({ onSignInClick }) {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) {
    return (
      <button
        onClick={onSignInClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Sign in to sync your data"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={user.displayName || user.email}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {(user.displayName || user.email || '?')[0].toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline text-gray-800 dark:text-gray-100">
          {user.displayName || user.email?.split('@')[0]}
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {user.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => {
                signOut();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

UserProfileButton.propTypes = {
  onSignInClick: PropTypes.func.isRequired
};

// Wrap App with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
