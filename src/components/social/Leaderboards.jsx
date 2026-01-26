import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useLeaderboards } from '../../hooks/useLeaderboards';
import { useAuth } from '../../contexts/AuthContext';

function Leaderboards() {
  const { isAuthenticated } = useAuth();
  const {
    globalLeaderboard,
    friendsLeaderboard,
    weeklyLeaderboard,
    userRank,
    loading,
    error,
    refresh,
  } = useLeaderboards();

  const [activeTab, setActiveTab] = useState('global');

  const tabs = [
    { id: 'global', name: 'Global', icon: '🌍', data: globalLeaderboard },
    { id: 'friends', name: 'Friends', icon: '👥', data: friendsLeaderboard },
    { id: 'weekly', name: 'This Week', icon: '📅', data: weeklyLeaderboard },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);
  const leaderboard = currentTab?.data || [];

  const getRankBadge = (rank) => {
    if (rank === 1) return { bg: 'bg-yellow-400', text: 'text-yellow-900', emoji: '🥇' };
    if (rank === 2) return { bg: 'bg-gray-300', text: 'text-gray-700', emoji: '🥈' };
    if (rank === 3) return { bg: 'bg-orange-400', text: 'text-orange-900', emoji: '🥉' };
    return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', emoji: null };
  };

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Leaderboards</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">See how you stack up!</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* User's rank card */}
      {isAuthenticated && userRank && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Your Global Rank</div>
              <div className="text-3xl font-bold">#{userRank}</div>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <p>Failed to load leaderboard: {error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && leaderboard.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Leaderboard list */}
      {!loading && leaderboard.length > 0 && (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const rankBadge = getRankBadge(entry.rank);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  entry.isCurrentUser
                    ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {/* Rank */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${rankBadge.bg} ${rankBadge.text}`}
                >
                  {rankBadge.emoji || entry.rank}
                </div>

                {/* Avatar */}
                {entry.avatar_url ? (
                  <img
                    src={entry.avatar_url}
                    alt={entry.display_name || entry.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {(entry.display_name || entry.username || '?')[0].toUpperCase()}
                  </div>
                )}

                {/* Name & Level */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 dark:text-gray-100 truncate">
                    {entry.display_name || entry.username || 'Anonymous'}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs text-purple-600 dark:text-purple-400">(You)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span>Level {entry.level || 1}</span>
                    {entry.streak_days > 0 && (
                      <span className="text-orange-500">🔥 {entry.streak_days}d streak</span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {activeTab === 'weekly' ? entry.activityCount : (entry.xp || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {activeTab === 'weekly' ? 'activities' : 'XP'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && leaderboard.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">
            {activeTab === 'friends' ? '👥' : activeTab === 'weekly' ? '📅' : '🌍'}
          </div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
            {activeTab === 'friends'
              ? 'No friends yet'
              : activeTab === 'weekly'
              ? 'No activity this week'
              : 'No data yet'}
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            {activeTab === 'friends'
              ? 'Add friends to see how you compare!'
              : activeTab === 'weekly'
              ? 'Start completing activities to appear here!'
              : 'Start earning XP to climb the ranks!'}
          </p>
        </div>
      )}

      {/* Sign in prompt for unauthenticated users */}
      {!isAuthenticated && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <p className="text-blue-800 dark:text-blue-200">
            Sign in to track your rank and compete with friends!
          </p>
        </div>
      )}
    </div>
  );
}

Leaderboards.propTypes = {};

export default Leaderboards;
