import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ActivityFeed from './ActivityFeed';
import FriendsList from './FriendsList';
import PetProfile from './PetProfile';
import NearbyPetParents from './NearbyPetParents';
import CareInstructions from './CareInstructions';
import ARCamera from './ARCamera';
import VirtualPet from './VirtualPet';
import EnhancedMemorial from './EnhancedMemorial';
import CoachingHub from './CoachingHub';
import VetTelemedicine from './VetTelemedicine';
import SubscriptionTiers from './SubscriptionTiers';
import GameplayHub from './GameplayHub';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useFriends } from '../../hooks/useFriends';
import { useActivityFeed } from '../../hooks/useActivityFeed';
import { usePets } from '../../hooks/usePets';
import { generateMockFriends, generateActivityFeed } from '../../utils/socialData';
import { generateMockPet } from '../../utils/petData';

function SocialHub({ onClose }) {
  const { isAuthenticated, isOnlineMode } = useAuth();
  const { hasFeature, currentTier, needsUpgrade } = useSubscription();

  // Real data hooks
  const {
    friends: realFriends,
    pendingReceived,
    loading: friendsLoading,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriendship,
    searchUsers,
  } = useFriends();

  const {
    activities: realActivities,
    loading: activitiesLoading,
    createActivity,
    toggleReaction,
    addComment,
    loadMore: loadMoreActivities,
    hasMore: hasMoreActivities,
  } = useActivityFeed({ feedType: 'friends' });

  const {
    pets,
    primaryPet,
    loading: petsLoading,
  } = usePets();

  const [activeTab, setActiveTab] = useState('feed');

  // Mock data fallbacks for offline/unauthenticated mode
  const [mockFriends, setMockFriends] = useState([]);
  const [mockActivities, setMockActivities] = useState([]);
  const [mockPet, setMockPet] = useState(null);

  useEffect(() => {
    // Initialize mock data for offline/demo mode
    if (!isOnlineMode || !isAuthenticated) {
      const friends = generateMockFriends(15);
      setMockFriends(friends);
      setMockActivities(generateActivityFeed(friends, 30));
      setMockPet(generateMockPet('Max', 'Golden Retriever', 3));
    }
  }, [isOnlineMode, isAuthenticated]);

  // Use real data when available, fall back to mock
  const friends = isAuthenticated && isOnlineMode ? realFriends.map(f => f.friend) : mockFriends;
  const activities = isAuthenticated && isOnlineMode ? realActivities : mockActivities;
  const userPet = isAuthenticated && isOnlineMode ? primaryPet : mockPet;

  // Check if social features are available
  const socialEnabled = hasFeature('social') || !isAuthenticated; // Allow preview in demo mode

  const tabs = [
    { id: 'feed', name: 'Feed', icon: '📰', requiresAuth: false },
    { id: 'gameplay', name: 'Quests', icon: '🎮', requiresAuth: false },
    { id: 'friends', name: 'Friends', icon: '👥', premium: true },
    { id: 'nearby', name: 'Nearby', icon: '📍', premium: true },
    { id: 'coaching', name: 'Coaches', icon: '🏋️', premium: true },
    { id: 'vet', name: '24/7 Vet', icon: '🏥', premium: true },
    { id: 'care', name: 'Care', icon: '📋', requiresAuth: false },
    { id: 'ar', name: 'AR', icon: '📱', premium: true },
    { id: 'virtual', name: 'Virtual', icon: '✨', requiresAuth: false },
    { id: 'profile', name: 'Profile', icon: '🐾', requiresAuth: true },
    { id: 'memorial', name: 'Memorial', icon: '🌈', premium: true },
    { id: 'subscribe', name: 'Premium', icon: '👑', requiresAuth: false },
  ];

  const handleTabClick = (tab) => {
    // Check if tab requires premium and user doesn't have it
    if (tab.premium && !hasFeature('social') && isAuthenticated) {
      setActiveTab('subscribe');
      return;
    }
    // Check if tab requires auth
    if (tab.requiresAuth && !isAuthenticated) {
      // Could show login modal here
      setActiveTab('subscribe');
      return;
    }
    setActiveTab(tab.id);
  };

  // Handle activity interactions
  const handleReaction = async (activityId) => {
    if (!isAuthenticated) return;
    await toggleReaction(activityId);
  };

  const handleComment = async (activityId, content) => {
    if (!isAuthenticated) return;
    await addComment(activityId, content);
  };

  const handleAddFriend = async (userId) => {
    if (!isAuthenticated) return;
    await sendFriendRequest(userId);
  };

  const handleAcceptFriend = async (friendshipId) => {
    if (!isAuthenticated) return;
    await acceptFriendRequest(friendshipId);
  };

  const isLoading = friendsLoading || activitiesLoading || petsLoading;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Pet Social Hub</h2>
              <p className="text-blue-100 mt-1">
                {isAuthenticated
                  ? `Welcome back! ${pendingReceived.length > 0 ? `${pendingReceived.length} pending friend requests` : 'Connect with fellow pet parents'}`
                  : 'Sign in to unlock all features'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {tabs.map(tab => {
              const isPremiumLocked = tab.premium && !hasFeature('social') && isAuthenticated;
              const isAuthLocked = tab.requiresAuth && !isAuthenticated;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } ${isPremiumLocked || isAuthLocked ? 'opacity-75' : ''}`}
                >
                  <span>{tab.icon}</span>
                  {tab.name}
                  {isPremiumLocked && <span className="text-xs">🔒</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          {/* Demo mode banner */}
          {!isAuthenticated && activeTab !== 'subscribe' && (
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg text-sm flex items-center justify-between">
              <span>Preview mode - Sign in to save your progress and connect with friends</span>
              <button
                onClick={() => setActiveTab('subscribe')}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          )}

          {activeTab === 'feed' && (
            <ActivityFeed
              activities={activities}
              onReaction={handleReaction}
              onComment={handleComment}
              onLoadMore={loadMoreActivities}
              hasMore={hasMoreActivities}
              isAuthenticated={isAuthenticated}
            />
          )}
          {activeTab === 'gameplay' && <GameplayHub />}
          {activeTab === 'friends' && (
            <FriendsList
              friends={friends}
              pendingRequests={pendingReceived}
              onAcceptRequest={handleAcceptFriend}
              onRejectRequest={removeFriendship}
              onSearchUsers={searchUsers}
              onAddFriend={handleAddFriend}
              isAuthenticated={isAuthenticated}
            />
          )}
          {activeTab === 'nearby' && <NearbyPetParents />}
          {activeTab === 'coaching' && <CoachingHub />}
          {activeTab === 'vet' && <VetTelemedicine />}
          {activeTab === 'care' && userPet && <CareInstructions pet={userPet} />}
          {activeTab === 'ar' && <ARCamera />}
          {activeTab === 'virtual' && <VirtualPet realPet={userPet} />}
          {activeTab === 'profile' && userPet && <PetProfile pet={userPet} pets={pets} />}
          {activeTab === 'memorial' && <EnhancedMemorial pet={userPet} />}
          {activeTab === 'subscribe' && <SubscriptionTiers currentTier={currentTier} />}
        </div>
      </motion.div>
    </div>
  );
}

SocialHub.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SocialHub;
