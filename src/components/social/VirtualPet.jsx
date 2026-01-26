import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useVirtualPet } from '../../hooks/useVirtualPet';
import { useQuests } from '../../hooks/useQuests';
import { useAuth } from '../../contexts/AuthContext';

function VirtualPet({ realPet }) {
  const { isAuthenticated } = useAuth();

  // Use the real virtual pet hook
  const {
    pet,
    loading,
    mood,
    level,
    isHungry,
    isTired,
    isSad,
    needsAttention,
    performAction,
    actionCooldowns,
    feed,
    play,
    rest,
    treat,
    groom,
  } = useVirtualPet();

  // Get quests hook to update quest progress
  const { updateQuestProgress } = useQuests();

  const [selectedAction, setSelectedAction] = useState(null);
  const [actionResult, setActionResult] = useState(null);

  // Local fallback state for unauthenticated users
  const [localPet, setLocalPet] = useState({
    pet_name: realPet?.name || 'Buddy',
    pet_type: 'dog',
    happiness: 85,
    hunger: 30,
    energy: 70,
    level: 5,
    experience: 350,
  });

  // Use hook data when available, otherwise use local state
  const virtualPet = pet || localPet;

  // Mood emoji based on stats
  const getMoodEmoji = () => {
    const avg = ((100 - (virtualPet.hunger || 0)) + (virtualPet.happiness || 0) + (virtualPet.energy || 0)) / 3;
    if (avg > 80) return '😊';
    if (avg > 60) return '🙂';
    if (avg > 40) return '😐';
    if (avg > 20) return '😟';
    return '😢';
  };

  const actions = [
    { id: 'feed', name: 'Feed', icon: '🍖', handler: feed, effect: 'Reduces hunger' },
    { id: 'play', name: 'Play', icon: '🎾', handler: play, effect: 'Increases happiness' },
    { id: 'rest', name: 'Rest', icon: '😴', handler: rest, effect: 'Restores energy' },
    { id: 'groom', name: 'Groom', icon: '✨', handler: groom, effect: 'Boosts happiness' },
    { id: 'treat', name: 'Treat', icon: '🦴', handler: treat, effect: 'Special boost!' },
    { id: 'walk', name: 'Walk', icon: '🚶', handler: () => performAction('walk'), effect: 'Exercise time!' },
  ];

  const handleAction = async (action) => {
    setSelectedAction(action.id);
    setActionResult(null);

    if (isAuthenticated && action.handler) {
      // Use the hook's action handler
      const result = await action.handler();

      if (result?.leveledUp) {
        setActionResult({ type: 'levelup', level: result.newLevel });
      } else if (result?.error) {
        setActionResult({ type: 'error', message: result.error.message });
      } else if (result?.success) {
        setActionResult({ type: 'success', xp: result.xpGained });
        // Update quest progress
        await updateQuestProgress('daily_virtual_pet');
      }
    } else {
      // Local state fallback for demo mode
      setTimeout(() => {
        setLocalPet(prev => {
          const effects = {
            feed: { hunger: -30, happiness: 5, energy: 5 },
            play: { happiness: 20, energy: -15, hunger: 5 },
            rest: { energy: 30, happiness: -5 },
            groom: { happiness: 10 },
            treat: { happiness: 15, hunger: -10 },
            walk: { happiness: 25, energy: -20, hunger: 10 },
          };
          const effect = effects[action.id] || {};

          return {
            ...prev,
            happiness: Math.max(0, Math.min(100, (prev.happiness || 0) + (effect.happiness || 0))),
            hunger: Math.max(0, Math.min(100, (prev.hunger || 0) + (effect.hunger || 0))),
            energy: Math.max(0, Math.min(100, (prev.energy || 0) + (effect.energy || 0))),
            experience: (prev.experience || 0) + 10,
          };
        });
        setActionResult({ type: 'success', xp: 10 });
      }, 500);
    }

    setTimeout(() => {
      setSelectedAction(null);
      setTimeout(() => setActionResult(null), 2000);
    }, 1000);
  };

  const getStatColor = (value) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatColorReverse = (value) => {
    // For hunger, lower is better
    if (value < 30) return 'bg-green-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isActionOnCooldown = (actionId) => {
    const cooldown = actionCooldowns?.[actionId];
    return cooldown && cooldown > Date.now();
  };

  const getCooldownSeconds = (actionId) => {
    const cooldown = actionCooldowns?.[actionId];
    if (!cooldown) return 0;
    return Math.max(0, Math.ceil((cooldown - Date.now()) / 1000));
  };

  // Calculate XP for next level
  const currentLevel = virtualPet.level || 1;
  const currentXp = virtualPet.experience || 0;
  const xpForNextLevel = currentLevel * 50;
  const xpProgress = Math.min(100, (currentXp / xpForNextLevel) * 100);

  // Achievements (would come from useQuests in full implementation)
  const achievements = [
    { name: 'First Week', icon: '🎉', unlocked: true },
    { name: 'Happy Pet', icon: '😊', unlocked: (virtualPet.happiness || 0) > 80 },
    { name: `Level ${currentLevel}`, icon: '⭐', unlocked: true },
    { name: 'Best Friends', icon: '❤️', unlocked: currentLevel >= 10 },
    { name: 'Master Trainer', icon: '🏆', unlocked: currentLevel >= 20 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Virtual {virtualPet.pet_name || 'Buddy'}
        </h3>
        <div className="flex items-center gap-2">
          {needsAttention && (
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full animate-pulse">
              Needs attention!
            </span>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            Level {currentLevel}
          </span>
        </div>
      </div>

      {/* Action Result Toast */}
      {actionResult && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-3 rounded-lg text-center text-sm font-medium ${
            actionResult.type === 'levelup'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
              : actionResult.type === 'error'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
          }`}
        >
          {actionResult.type === 'levelup' && `🎉 Level Up! You're now level ${actionResult.level}!`}
          {actionResult.type === 'error' && `❌ ${actionResult.message}`}
          {actionResult.type === 'success' && `✨ +${actionResult.xp} XP`}
        </motion.div>
      )}

      {/* Virtual Pet Display */}
      <motion.div
        animate={selectedAction ? { scale: [1, 1.1, 1] } : {}}
        className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-4 right-4 text-2xl">{getMoodEmoji()}</div>

        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: selectedAction ? [0, -5, 5, 0] : 0,
          }}
          transition={{
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 0.3 },
          }}
          className="text-9xl mb-4"
        >
          {virtualPet.pet_type === 'cat' ? '🐱' : '🐕'}
        </motion.div>

        <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {virtualPet.pet_name || 'Buddy'}
        </h4>

        {/* XP Bar */}
        <div className="max-w-xs mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Level {currentLevel}</span>
            <span>{currentXp}/{xpForNextLevel} XP</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Happiness', value: virtualPet.happiness || 0, icon: '😊', colorFn: getStatColor },
          { name: 'Hunger', value: virtualPet.hunger || 0, icon: '🍖', colorFn: getStatColorReverse, invert: true },
          { name: 'Energy', value: virtualPet.energy || 0, icon: '⚡', colorFn: getStatColor },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.icon} {stat.name}
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {stat.invert ? `${100 - stat.value}%` : `${stat.value}%`}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${stat.colorFn(stat.value)} transition-colors`}
                initial={{ width: 0 }}
                animate={{ width: `${stat.invert ? 100 - stat.value : stat.value}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">
          Care for {virtualPet.pet_name || 'your pet'}
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {actions.map(action => {
            const onCooldown = isActionOnCooldown(action.id);
            const cooldownSecs = getCooldownSeconds(action.id);

            return (
              <button
                key={action.id}
                onClick={() => handleAction(action)}
                disabled={selectedAction !== null || onCooldown}
                className={`p-4 rounded-xl transition-all relative ${
                  selectedAction === action.id
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white scale-105'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                } ${(selectedAction !== null && selectedAction !== action.id) || onCooldown ? 'opacity-50' : ''}`}
                title={action.effect}
              >
                <div className="text-3xl mb-1">{action.icon}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {onCooldown ? `${cooldownSecs}s` : action.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">
          Achievements
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-center ${
                achievement.unlocked
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : 'bg-gray-100 dark:bg-gray-700 opacity-50'
              }`}
            >
              <div className="text-3xl mb-1">{achievement.icon}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {achievement.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync with Real Pet */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
          🔄 Sync with Real Pet
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Log real-world activities to boost your virtual pet's stats!
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleAction({ id: 'walk', handler: () => performAction('walk') })}
            className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium hover:shadow-md transition-all"
          >
            🚶 Log Walk
          </button>
          <button
            onClick={() => handleAction({ id: 'feed', handler: feed })}
            className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium hover:shadow-md transition-all"
          >
            🍖 Log Meal
          </button>
          <button
            onClick={() => handleAction({ id: 'play', handler: play })}
            className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium hover:shadow-md transition-all"
          >
            🎾 Log Play
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">💜 Virtual Pet Tips</h4>
        <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
          <li>• Check in daily to keep your virtual pet happy</li>
          <li>• Balance all stats for optimal growth</li>
          <li>• Sync real activities for double rewards</li>
          <li>• {isAuthenticated ? 'Your progress is saved automatically!' : 'Sign in to save your progress!'}</li>
        </ul>
      </div>
    </div>
  );
}

VirtualPet.propTypes = {
  realPet: PropTypes.object,
};

export default VirtualPet;
