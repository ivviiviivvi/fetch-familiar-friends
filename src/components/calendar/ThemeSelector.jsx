import { memo } from 'react';
import PropTypes from 'prop-types';

// Memoized to prevent re-renders when parent state changes but theme props remain stable
const ThemeSelector = memo(function ThemeSelector({ currentTheme, onThemeChange, themes }) {
  return (
    <div className="flex gap-2 justify-center mb-4" role="group" aria-label="Theme selector">
      {themes.map((theme) => (
        <button
          key={theme.name}
          onClick={() => onThemeChange(theme.name)}
          className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            currentTheme === theme.name
              ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
              : 'bg-white/50 text-gray-700 hover:bg-white/70'
          }`}
          aria-label={`Select ${theme.label} theme`}
          aria-pressed={currentTheme === theme.name}
          title={`Switch to ${theme.label} theme`}
        >
          <span className="mr-1" aria-hidden="true">{theme.icon}</span>
          {theme.label}
        </button>
      ))}
    </div>
  );
});

ThemeSelector.propTypes = {
  currentTheme: PropTypes.string.isRequired,
  onThemeChange: PropTypes.func.isRequired,
  themes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      gradient: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ThemeSelector;
