import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

const ASCIIVisualizer = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('welcome');

  const asciiArt = {
    welcome: `
    ╔════════════════════════════════════════════╗
    ║                                            ║
    ║        🐾 DogTale Daily Guide 🐾         ║
    ║                                            ║
    ║          /\\_/\\                            ║
    ║         ( o.o )                            ║
    ║          > ^ <                             ║
    ║         /|   |\\                           ║
    ║        (_|   |_)                           ║
    ║                                            ║
    ║      Welcome to your retro guide!          ║
    ║                                            ║
    ╚════════════════════════════════════════════╝`,
    
    navigation: `
    ╔════════════════════════════════════════════╗
    ║         NAVIGATION SHORTCUTS                ║
    ╠════════════════════════════════════════════╣
    ║                                            ║
    ║  ←  Previous Day    →  Next Day           ║
    ║  T  Today           M  Month View         ║
    ║  D  Dark Mode       ?  Help               ║
    ║  ,  Settings                              ║
    ║                                            ║
    ║  [ESC] to close any modal                 ║
    ║                                            ║
    ╚════════════════════════════════════════════╝`,
    
    features: `
    ╔════════════════════════════════════════════╗
    ║           FEATURES OVERVIEW                 ║
    ╠════════════════════════════════════════════╣
    ║                                            ║
    ║  📅 Daily Calendar                         ║
    ║     Track your dog's daily adventures      ║
    ║                                            ║
    ║  📝 Journal Entries                        ║
    ║     Write notes and memories               ║
    ║                                            ║
    ║  ❤️  Favorites                             ║
    ║     Save your favorite images              ║
    ║                                            ║
    ║  📊 Statistics                             ║
    ║     View your activity stats               ║
    ║                                            ║
    ║  🎨 Themes                                 ║
    ║     8 beautiful themes to choose from      ║
    ║                                            ║
    ╚════════════════════════════════════════════╝`,
    
    tips: `
    ╔════════════════════════════════════════════╗
    ║            PRO TIPS & TRICKS                ║
    ╠════════════════════════════════════════════╣
    ║                                            ║
    ║  💡 Cycle themes with Shift+T             ║
    ║                                            ║
    ║  💡 Access modals with keyboard:          ║
    ║     J = Journal  A = AI  F = Favorites    ║
    ║     S = Statistics                         ║
    ║                                            ║
    ║  💡 Auto-save is enabled by default       ║
    ║     Your data is stored locally            ║
    ║                                            ║
    ║  💡 Enable preload for faster images      ║
    ║     Configure in Settings                  ║
    ║                                            ║
    ╚════════════════════════════════════════════╝`,
    
    about: `
    ╔════════════════════════════════════════════╗
    ║              ABOUT DOGTALE                  ║
    ╠════════════════════════════════════════════╣
    ║                                            ║
    ║    ____             _____     _            ║
    ║   |  _ \\  ___   __ |_   _|_ _| | ___     ║
    ║   | | | |/ _ \\ / _  || |/ _\` | |/ _ \\   ║
    ║   | |_| | (_) | (_| || | (_| | |  __/     ║
    ║   |____/ \\___/ \\__, ||_|\\__,_|_|\\___|  ║
    ║                |___/                       ║
    ║                                            ║
    ║  Version: 0.2.0                            ║
    ║  A daily dog calendar experience           ║
    ║                                            ║
    ║  Made with ❤️  for dog lovers             ║
    ║                                            ║
    ╚════════════════════════════════════════════╝`
  };

  const views = [
    { id: 'welcome', label: '🏠 Welcome', emoji: '🏠' },
    { id: 'navigation', label: '⌨️ Navigation', emoji: '⌨️' },
    { id: 'features', label: '✨ Features', emoji: '✨' },
    { id: 'tips', label: '💡 Tips', emoji: '💡' },
    { id: 'about', label: 'ℹ️ About', emoji: 'ℹ️' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ASCII Retro Guide" size="xl">
      <div className="space-y-4">
        {/* View selector */}
        <div className="flex gap-2 flex-wrap justify-center pb-4 border-b border-gray-200">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentView === view.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{view.emoji}</span>
              <span className="hidden sm:inline">{view.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* ASCII art display */}
        <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
          <pre className="whitespace-pre">{asciiArt[currentView]}</pre>
        </div>

        {/* Navigation hint */}
        <div className="text-center text-sm text-gray-500">
          <p>Use the buttons above to explore different sections</p>
          <p className="text-xs mt-1">Press ESC to close this guide</p>
        </div>
      </div>
    </Modal>
  );
};

ASCIIVisualizer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ASCIIVisualizer;
