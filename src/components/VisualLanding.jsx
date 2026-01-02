import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const VisualLanding = ({ onComplete }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const scenes = [
    {
      emoji: '🐕',
      title: 'Welcome to DogTale Daily',
      description: 'Your daily dose of dog joy and care',
      background: 'from-blue-400 to-cyan-500'
    },
    {
      emoji: '📅',
      title: 'Track Your Journey',
      description: 'Keep a daily journal of your furry friend\'s adventures',
      background: 'from-purple-400 to-pink-500'
    },
    {
      emoji: '❤️',
      title: 'Save Favorites',
      description: 'Collect and treasure your favorite moments',
      background: 'from-red-400 to-orange-500'
    },
    {
      emoji: '🌈',
      title: 'Beautiful Themes',
      description: 'Customize your experience with stunning themes',
      background: 'from-green-400 to-teal-500'
    },
    {
      emoji: '🎉',
      title: 'Let\'s Get Started!',
      description: 'Begin your journey with DogTale Daily',
      background: 'from-yellow-400 to-amber-500'
    }
  ];

  useEffect(() => {
    // Auto-advance to next scene after 3 seconds
    if (currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScene, scenes.length]);

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  if (!isVisible) return null;

  const scene = scenes[currentScene];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
      >
        <div className="relative w-full max-w-2xl mx-4">
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-0 right-0 text-white/70 hover:text-white transition-colors px-4 py-2 text-sm font-medium"
          >
            Skip
          </button>

          {/* Scene content */}
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-br ${scene.background} rounded-3xl p-12 text-center shadow-2xl`}
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-9xl mb-8"
            >
              {scene.emoji}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-white mb-4"
            >
              {scene.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/90 mb-8"
            >
              {scene.description}
            </motion.p>

            {/* Progress indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {scenes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentScene(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentScene
                      ? 'bg-white w-8'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to scene ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={handleNext}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              {currentScene < scenes.length - 1 ? 'Next' : 'Get Started'}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

VisualLanding.propTypes = {
  onComplete: PropTypes.func.isRequired
};

export default VisualLanding;
