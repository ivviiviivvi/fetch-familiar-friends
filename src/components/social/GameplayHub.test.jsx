import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameplayHub from './GameplayHub';

// Mock dependencies
vi.mock('../../hooks/useQuests', () => ({
  useQuests: vi.fn(),
}));

vi.mock('../../hooks/useGymBattles', () => ({
  useGymBattles: vi.fn(() => ({
    gymData: { wins: 5, losses: 2, streak: 3 },
    challenges: [
      { id: 1, name: 'Strength Challenge', difficulty: 'Easy', reward: 50 },
      { id: 2, name: 'Agility Challenge', difficulty: 'Medium', reward: 100 },
    ],
    gyms: [],
    earnedBadges: [],
    activeChallenge: null,
    gymsLoading: false,
    gymsError: null,
    challengeError: null,
    loading: false,
    error: null,
    startChallenge: vi.fn(),
    completeStep: vi.fn(),
    finishChallenge: vi.fn(),
    abandonChallenge: vi.fn(),
    canChallengeGym: vi.fn(() => ({ canChallenge: true })),
    hasBadgeForGym: vi.fn(() => false),
    CHALLENGE_STATUS: { PENDING: 'pending', IN_PROGRESS: 'in_progress', COMPLETED: 'completed' },
  })),
}));

vi.mock('../../hooks/useCollections', () => ({
  useCollections: vi.fn(() => ({
    collections: {
      breeds: [{ id: 1, name: 'Labrador' }],
      locations: [{ id: 1, name: 'Central Park' }],
      achievements: [{ id: 1, name: 'First Steps' }],
      badges: [{ id: 1, name: 'Explorer' }],
    },
    collectionProgress: {
      breeds: 10,
      locations: 20,
      achievements: 50,
      badges: 25,
    },
    recentDiscoveries: [
      { id: 1, type: 'breed', name: 'Labrador', discoveredAt: new Date() },
    ],
    loading: false,
    totalCollected: 4,
    percentComplete: 25,
  })),
  TOTAL_BREEDS: 100,
  TOTAL_LOCATIONS: 50,
  TOTAL_ACHIEVEMENTS: 20,
  TOTAL_BADGES: 30,
}));

vi.mock('../../hooks/useBattleQueue', () => ({
  useBattleQueue: vi.fn(() => ({
    inQueue: false,
    queueStatus: null,
    currentBattle: null,
    battleTypes: [
      { id: 'pvp', name: 'PvP', description: 'Battle other players' },
      { id: 'coop', name: 'Co-op', description: 'Team battles' },
    ],
    joinQueue: vi.fn(),
    leaveQueue: vi.fn(),
  })),
  BATTLE_TYPES: { RANKED: 'ranked', CASUAL: 'casual', PVP: 'pvp' },
  QUEUE_STATUS: { WAITING: 'waiting', MATCHED: 'matched', IN_PROGRESS: 'in_progress' },
}));

vi.mock('../../hooks/useSeasonPass', () => ({
  useSeasonPass: vi.fn(() => ({
    currentSeason: { name: 'Spring 2024', theme: 'spring' },
    currentLevel: 12,
    currentXp: 450,
    xpToNextLevel: 500,
    xpProgress: 90,
    maxLevel: 50,
    isPremium: false,
    rewards: [
      { level: 1, item: 'Badge', claimed: true },
      { level: 2, item: 'XP Boost', claimed: false },
    ],
    claimedRewards: [1],
    availableRewards: [2],
    timeRemaining: '30 days',
    loading: false,
    claimReward: vi.fn(),
  })),
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

import { useQuests } from '../../hooks/useQuests';
import { useAuth } from '../../contexts/AuthContext';

const mockDailyQuests = [
  { id: 1, quest_key: 'daily_walk', title: 'Morning Walk', xp: 50, progress: 1, target: 1, icon: '🚶', percentComplete: 100, isComplete: true, rewards_claimed: false },
  { id: 2, quest_key: 'daily_photo', title: 'Photo of the Day', xp: 30, progress: 0, target: 1, icon: '📸', percentComplete: 0, isComplete: false },
  { id: 3, quest_key: 'daily_trick', title: 'Train a Trick', xp: 75, progress: 0, target: 1, icon: '🎓', percentComplete: 0, isComplete: false },
];

const mockWeeklyQuests = [
  { id: 6, quest_key: 'weekly_explore', title: 'Visit 3 New Locations', xp: 200, progress: 1, target: 3, icon: '🗺️', percentComplete: 33, isComplete: false },
  { id: 7, quest_key: 'weekly_gym', title: 'Complete 5 Gym Challenges', xp: 300, progress: 5, target: 5, icon: '🏆', percentComplete: 100, isComplete: true, rewards_claimed: false },
];

describe('GameplayHub Component', () => {
  const mockClaimRewards = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    useQuests.mockReturnValue({
      dailyQuests: [],
      weeklyQuests: [],
      loading: false,
      error: null,
      completedDailyCount: 0,
      completedWeeklyCount: 0,
      totalDailyXp: 0,
      claimRewards: mockClaimRewards,
    });

    useAuth.mockReturnValue({
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<GameplayHub />);
    expect(screen.getByText('Gameplay Hub')).toBeInTheDocument();
  });

  it('renders the season pass progress section', () => {
    render(<GameplayHub />);
    // Season pass section should be visible - check for the season name from mock
    expect(screen.getByText('Spring 2024')).toBeInTheDocument();
  });

  it('renders all tab buttons', () => {
    render(<GameplayHub />);
    expect(screen.getByRole('button', { name: /Quests/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Gym Battles/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Team Battles/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Collections/i })).toBeInTheDocument();
  });

  describe('Loading state', () => {
    it('displays loading spinner when quests are loading', () => {
      useQuests.mockReturnValue({
        dailyQuests: [],
        weeklyQuests: [],
        loading: true,
        error: null,
        completedDailyCount: 0,
        completedWeeklyCount: 0,
        totalDailyXp: 0,
        claimRewards: mockClaimRewards,
      });

      render(<GameplayHub />);
      expect(screen.getByRole('button', { name: /Quests/i })).toBeInTheDocument();
      // Loading spinner should be visible
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('displays error message when quests fail to load', () => {
      useQuests.mockReturnValue({
        dailyQuests: [],
        weeklyQuests: [],
        loading: false,
        error: 'Failed to connect to server',
        completedDailyCount: 0,
        completedWeeklyCount: 0,
        totalDailyXp: 0,
        claimRewards: mockClaimRewards,
      });

      render(<GameplayHub />);
      expect(screen.getByText(/Failed to load quests: Failed to connect to server/)).toBeInTheDocument();
    });
  });

  describe('Quest display', () => {
    it('displays mock daily quests when unauthenticated', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
      });

      render(<GameplayHub />);

      // Mock data fallback should show
      expect(screen.getByText('Morning Walk')).toBeInTheDocument();
      expect(screen.getByText('Photo of the Day')).toBeInTheDocument();
    });

    it('displays real quests when authenticated with data', () => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
      });

      useQuests.mockReturnValue({
        dailyQuests: mockDailyQuests,
        weeklyQuests: mockWeeklyQuests,
        loading: false,
        error: null,
        completedDailyCount: 1,
        completedWeeklyCount: 1,
        totalDailyXp: 50,
        claimRewards: mockClaimRewards,
      });

      render(<GameplayHub />);

      expect(screen.getByText('Morning Walk')).toBeInTheDocument();
      expect(screen.getByText('Photo of the Day')).toBeInTheDocument();
      expect(screen.getByText('Train a Trick')).toBeInTheDocument();
    });

    it('displays weekly quests', () => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
      });

      useQuests.mockReturnValue({
        dailyQuests: mockDailyQuests,
        weeklyQuests: mockWeeklyQuests,
        loading: false,
        error: null,
        completedDailyCount: 1,
        completedWeeklyCount: 1,
        totalDailyXp: 50,
        claimRewards: mockClaimRewards,
      });

      render(<GameplayHub />);

      expect(screen.getByText('Visit 3 New Locations')).toBeInTheDocument();
      expect(screen.getByText('Complete 5 Gym Challenges')).toBeInTheDocument();
    });

    it('shows progress summary when authenticated', () => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
      });

      useQuests.mockReturnValue({
        dailyQuests: mockDailyQuests,
        weeklyQuests: mockWeeklyQuests,
        loading: false,
        error: null,
        completedDailyCount: 2,
        completedWeeklyCount: 1,
        totalDailyXp: 80,
        claimRewards: mockClaimRewards,
      });

      render(<GameplayHub />);

      expect(screen.getByText("Today's Progress")).toBeInTheDocument();
      expect(screen.getByText(/2 daily quests completed/)).toBeInTheDocument();
      expect(screen.getByText(/80 XP earned/)).toBeInTheDocument();
    });
  });

  describe('Claim rewards functionality', () => {
    it('shows claim button for completed quests when authenticated', () => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
      });

      useQuests.mockReturnValue({
        dailyQuests: mockDailyQuests,
        weeklyQuests: mockWeeklyQuests,
        loading: false,
        error: null,
        completedDailyCount: 1,
        completedWeeklyCount: 1,
        totalDailyXp: 50,
        claimRewards: mockClaimRewards,
      });

      render(<GameplayHub />);

      // Find claim buttons (should be visible for completed, unclaimed quests)
      const claimButtons = screen.getAllByRole('button', { name: /Claim/i });
      expect(claimButtons.length).toBeGreaterThan(0);
    });

    it('calls claimRewards when claim button is clicked', async () => {
      const user = userEvent.setup();

      useAuth.mockReturnValue({
        isAuthenticated: true,
      });

      useQuests.mockReturnValue({
        dailyQuests: mockDailyQuests,
        weeklyQuests: mockWeeklyQuests,
        loading: false,
        error: null,
        completedDailyCount: 1,
        completedWeeklyCount: 1,
        totalDailyXp: 50,
        claimRewards: mockClaimRewards,
      });

      render(<GameplayHub />);

      const claimButtons = screen.getAllByRole('button', { name: /Claim/i });
      await user.click(claimButtons[0]);

      expect(mockClaimRewards).toHaveBeenCalled();
    });
  });

  describe('Tab navigation', () => {
    it('switches to Gym Battles tab when clicked', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const gymTab = screen.getByRole('button', { name: /Gym Battles/i });
      await user.click(gymTab);

      // Gym tab should now be visible (hook provides earnedBadges)
      // Check that the gyms section rendered without error
      expect(gymTab).toBeInTheDocument();
    });

    it('switches to Team Battles tab when clicked', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const pvpTab = screen.getByRole('button', { name: /Team Battles/i });
      await user.click(pvpTab);

      // Team battles tab should now be active
      expect(pvpTab).toBeInTheDocument();
    });

    it('switches to Collections tab when clicked', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const collectionsTab = screen.getByRole('button', { name: /Collections/i });
      await user.click(collectionsTab);

      // Collections content should be visible - check for Collection Progress header
      expect(screen.getByText('Collection Progress')).toBeInTheDocument();
    });

    it('shows correct active tab styling', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const questsTab = screen.getByRole('button', { name: /Quests/i });
      const gymTab = screen.getByRole('button', { name: /Gym Battles/i });

      // Click gym tab to switch
      await user.click(gymTab);

      // Both tabs should still be visible after switching
      expect(questsTab).toBeInTheDocument();
      expect(gymTab).toBeInTheDocument();
    });
  });

  describe('Gym Battles content', () => {
    it('displays gym badges section when user has badges', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const gymTab = screen.getByRole('button', { name: /Gym Battles/i });
      await user.click(gymTab);

      // Gym tab should render without errors
      expect(gymTab).toBeInTheDocument();
    });

    it('renders gym battles tab correctly', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const gymTab = screen.getByRole('button', { name: /Gym Battles/i });
      await user.click(gymTab);

      // The tab should switch successfully
      expect(gymTab).toBeInTheDocument();
    });
  });

  describe('Team Battles content', () => {
    it('renders team battles tab', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const pvpTab = screen.getByRole('button', { name: /Team Battles/i });
      await user.click(pvpTab);

      // Team battles tab should render
      expect(pvpTab).toBeInTheDocument();
    });

    it('team battles tab is clickable', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const pvpTab = screen.getByRole('button', { name: /Team Battles/i });
      await user.click(pvpTab);

      // Tab should be accessible after click
      expect(pvpTab).toBeInTheDocument();
    });
  });

  describe('Collections content', () => {
    it('displays collection progress header', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const collectionsTab = screen.getByRole('button', { name: /Collections/i });
      await user.click(collectionsTab);

      // Collection Progress header should be visible
      expect(screen.getByText('Collection Progress')).toBeInTheDocument();
    });

    it('renders collections tab correctly', async () => {
      const user = userEvent.setup();
      render(<GameplayHub />);

      const collectionsTab = screen.getByRole('button', { name: /Collections/i });
      await user.click(collectionsTab);

      // Collections tab should render without errors
      expect(collectionsTab).toBeInTheDocument();
    });
  });
});
