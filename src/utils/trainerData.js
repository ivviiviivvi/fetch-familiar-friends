// Trainer Profile and Social Data Management

// Generate mock trainer data
export const generateMockTrainer = (name, team, level) => {
  return {
    id: Date.now() + Math.random(),
    username: name,
    trainerCode: generateTrainerCode(),
    level: level || Math.floor(Math.random() * 40) + 1,
    team: team || ['Mystic', 'Valor', 'Instinct'][Math.floor(Math.random() * 3)],
    xp: (level || 20) * 50000,
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    stats: {
      totalCatches: Math.floor(Math.random() * 5000) + 100,
      pokemonSeen: Math.floor(Math.random() * 200) + 50,
      pokemonCaught: Math.floor(Math.random() * 150) + 40,
      totalDistance: (Math.random() * 1000 + 50).toFixed(1),
      battlesWon: Math.floor(Math.random() * 500) + 10,
      raidsCompleted: Math.floor(Math.random() * 200) + 5,
      gymBadges: Math.floor(Math.random() * 50) + 1,
      stardust: Math.floor(Math.random() * 1000000) + 10000,
    },
    badges: generateBadges(),
    location: 'San Francisco, CA',
    bio: 'Gotta catch \'em all! 🔥',
    avatarColor: getRandomColor(),
  };
};

export const generateTrainerCode = () => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += ' ';
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
};

export const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateBadges = () => {
  const allBadges = [
    { id: 'jogger', name: 'Jogger', icon: '🏃', level: 'Gold', description: 'Walk 1000km' },
    { id: 'collector', name: 'Collector', icon: '🎯', level: 'Silver', description: 'Catch 1000 Pokemon' },
    { id: 'scientist', name: 'Scientist', icon: '🔬', level: 'Bronze', description: 'Evolve 200 Pokemon' },
    { id: 'breeder', name: 'Breeder', icon: '🥚', level: 'Gold', description: 'Hatch 500 eggs' },
    { id: 'backpacker', name: 'Backpacker', icon: '🎒', level: 'Silver', description: 'Visit 2000 PokeStops' },
    { id: 'battle-girl', name: 'Battle Girl', icon: '⚔️', level: 'Gold', description: 'Win 1000 gym battles' },
    { id: 'ace-trainer', name: 'Ace Trainer', icon: '🏆', level: 'Platinum', description: 'Train 2000 times' },
    { id: 'youngster', name: 'Youngster', icon: '👦', level: 'Bronze', description: 'Catch 50 tiny Rattata' },
  ];

  const numBadges = Math.floor(Math.random() * 5) + 3;
  return allBadges.slice(0, numBadges);
};

// Generate mock friends
export const generateMockFriends = (count = 10) => {
  const names = [
    'AshKetchum', 'MistyWaters', 'BrockRock', 'PikachuFan', 'DragonMaster',
    'TeamRocketJoe', 'ProfessorOak', 'GaryOak', 'NurseyJoy', 'OfficerJenny',
    'LanceDragon', 'RedTrainer', 'BlueMaster', 'GreenLeaf', 'YellowPika',
    'GoldJohto', 'SilverRival', 'CrystalClear', 'RubyHoenn', 'SapphireOcean'
  ];

  const friends = [];
  for (let i = 0; i < Math.min(count, names.length); i++) {
    friends.push({
      ...generateMockTrainer(names[i]),
      friendshipLevel: Math.floor(Math.random() * 4) + 1, // 1-4 (Good, Great, Ultra, Best)
      daysUntilNextLevel: Math.floor(Math.random() * 30),
      lastInteraction: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      giftAvailable: Math.random() > 0.5,
    });
  }

  return friends;
};

// Generate activity feed
export const generateActivityFeed = (friends, count = 20) => {
  const activities = [];
  const activityTemplates = [
    { type: 'caught', emoji: '⚡', getText: (f, p) => `${f.username} caught a ${p?.shiny ? 'shiny ' : ''}${p?.name}!` },
    { type: 'evolved', emoji: '✨', getText: (f, p) => `${f.username} evolved ${p?.name}!` },
    { type: 'raid', emoji: '🏆', getText: (f, p) => `${f.username} completed a ${p?.tier}-star raid!` },
    { type: 'gym', emoji: '🥋', getText: (f) => `${f.username} conquered a gym!` },
    { type: 'levelup', emoji: '📈', getText: (f) => `${f.username} reached level ${f.level}!` },
    { type: 'trade', emoji: '🔄', getText: (f, p) => `${f.username} traded a ${p?.name}!` },
    { type: 'achievement', emoji: '🎖️', getText: (f, p) => `${f.username} earned ${p?.badge} badge!` },
  ];

  for (let i = 0; i < count; i++) {
    const friend = friends[Math.floor(Math.random() * friends.length)];
    const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];

    const pokemonNames = ['Pikachu', 'Charizard', 'Mewtwo', 'Dragonite', 'Snorlax', 'Gyarados', 'Tyranitar'];
    const raids = ['1', '3', '5', 'Mega'];
    const badges = ['Gold', 'Silver', 'Platinum'];

    const extraData = {
      name: pokemonNames[Math.floor(Math.random() * pokemonNames.length)],
      shiny: Math.random() < 0.1,
      tier: raids[Math.floor(Math.random() * raids.length)],
      badge: badges[Math.floor(Math.random() * badges.length)],
    };

    activities.push({
      id: Date.now() + i,
      friend: friend,
      type: template.type,
      emoji: template.emoji,
      text: template.getText(friend, extraData),
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      likes: Math.floor(Math.random() * 20),
      comments: Math.floor(Math.random() * 5),
    });
  }

  return activities.sort((a, b) => b.timestamp - a.timestamp);
};

// Friendship levels
export const friendshipLevels = {
  1: { name: 'Good Friend', color: '#3498db', attackBonus: 0, daysRequired: 1 },
  2: { name: 'Great Friend', color: '#9b59b6', attackBonus: 1, daysRequired: 7 },
  3: { name: 'Ultra Friend', color: '#e67e22', attackBonus: 2, daysRequired: 30 },
  4: { name: 'Best Friend', color: '#e74c3c', attackBonus: 4, daysRequired: 90 },
};

// Calculate time ago
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [name, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${name} ago` : `${interval} ${name}s ago`;
    }
  }

  return 'just now';
};

// Format date
export const formatDate = (date) => {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
