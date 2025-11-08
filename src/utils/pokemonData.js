// Pokemon GO Data and Utilities

export const pokemonDatabase = {
  1: { id: 1, name: 'Bulbasaur', type: ['Grass', 'Poison'], rarity: 'Common', maxCP: 1115 },
  2: { id: 2, name: 'Ivysaur', type: ['Grass', 'Poison'], rarity: 'Uncommon', maxCP: 1699 },
  3: { id: 3, name: 'Venusaur', type: ['Grass', 'Poison'], rarity: 'Rare', maxCP: 2720 },
  4: { id: 4, name: 'Charmander', type: ['Fire'], rarity: 'Common', maxCP: 1108 },
  5: { id: 5, name: 'Charmeleon', type: ['Fire'], rarity: 'Uncommon', maxCP: 1653 },
  6: { id: 6, name: 'Charizard', type: ['Fire', 'Flying'], rarity: 'Rare', maxCP: 2889 },
  7: { id: 7, name: 'Squirtle', type: ['Water'], rarity: 'Common', maxCP: 1069 },
  8: { id: 8, name: 'Wartortle', type: ['Water'], rarity: 'Uncommon', maxCP: 1582 },
  9: { id: 9, name: 'Blastoise', type: ['Water'], rarity: 'Rare', maxCP: 2466 },
  25: { id: 25, name: 'Pikachu', type: ['Electric'], rarity: 'Uncommon', maxCP: 1060 },
  26: { id: 26, name: 'Raichu', type: ['Electric'], rarity: 'Rare', maxCP: 2286 },
  133: { id: 133, name: 'Eevee', type: ['Normal'], rarity: 'Common', maxCP: 1210 },
  134: { id: 134, name: 'Vaporeon', type: ['Water'], rarity: 'Rare', maxCP: 3114 },
  135: { id: 135, name: 'Jolteon', type: ['Electric'], rarity: 'Rare', maxCP: 2730 },
  136: { id: 136, name: 'Flareon', type: ['Fire'], rarity: 'Rare', maxCP: 2904 },
  143: { id: 143, name: 'Snorlax', type: ['Normal'], rarity: 'Very Rare', maxCP: 3355 },
  144: { id: 144, name: 'Articuno', type: ['Ice', 'Flying'], rarity: 'Legendary', maxCP: 3051 },
  145: { id: 145, name: 'Zapdos', type: ['Electric', 'Flying'], rarity: 'Legendary', maxCP: 3527 },
  146: { id: 146, name: 'Moltres', type: ['Fire', 'Flying'], rarity: 'Legendary', maxCP: 3465 },
  149: { id: 149, name: 'Dragonite', type: ['Dragon', 'Flying'], rarity: 'Very Rare', maxCP: 3581 },
  150: { id: 150, name: 'Mewtwo', type: ['Psychic'], rarity: 'Legendary', maxCP: 4178 },
};

export const typeColors = {
  Normal: '#A8A878',
  Fire: '#F08030',
  Water: '#6890F0',
  Electric: '#F8D030',
  Grass: '#78C850',
  Ice: '#98D8D8',
  Fighting: '#C03028',
  Poison: '#A040A0',
  Ground: '#E0C068',
  Flying: '#A890F0',
  Psychic: '#F85888',
  Bug: '#A8B820',
  Rock: '#B8A038',
  Ghost: '#705898',
  Dragon: '#7038F8',
  Dark: '#705848',
  Steel: '#B8B8D0',
  Fairy: '#EE99AC'
};

export const teamColors = {
  Mystic: { primary: '#3B7CCA', secondary: '#1E5A9A', name: 'Team Mystic', icon: '❄️' },
  Valor: { primary: '#E74C3C', secondary: '#C0392B', name: 'Team Valor', icon: '🔥' },
  Instinct: { primary: '#F1C40F', secondary: '#D4AC0D', name: 'Team Instinct', icon: '⚡' }
};

export const activityTypes = {
  CAUGHT_POKEMON: 'caught',
  EVOLVED_POKEMON: 'evolved',
  RAID_COMPLETED: 'raid',
  GYM_BATTLE: 'gym',
  FRIEND_ADDED: 'friend',
  TRADE_COMPLETED: 'trade',
  ACHIEVEMENT: 'achievement',
  LEVEL_UP: 'levelup'
};

// Generate random Pokemon catch
export const generateRandomCatch = () => {
  const pokemonIds = Object.keys(pokemonDatabase);
  const randomId = pokemonIds[Math.floor(Math.random() * pokemonIds.length)];
  const pokemon = pokemonDatabase[randomId];

  return {
    id: Date.now() + Math.random(),
    pokemonId: pokemon.id,
    name: pokemon.name,
    cp: Math.floor(Math.random() * pokemon.maxCP),
    iv: Math.floor(Math.random() * 100),
    shiny: Math.random() < 0.05, // 5% shiny rate
    caughtAt: new Date(),
    location: generateRandomLocation()
  };
};

// Generate random location
export const generateRandomLocation = () => {
  const locations = [
    'Central Park', 'Times Square', 'Golden Gate Bridge', 'Santa Monica Pier',
    'Downtown', 'Riverside Park', 'Shopping Mall', 'City Center', 'Beach',
    'Mountain Trail', 'Lake Shore', 'Forest Path', 'Stadium', 'University Campus'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

// Generate trainer code
export const generateTrainerCode = () => {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += ' ';
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
};

// Calculate trainer level from XP
export const calculateLevel = (xp) => {
  const levels = [
    0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000,
    55000, 65000, 75000, 85000, 100000, 120000, 140000, 160000, 185000, 210000,
    260000, 335000, 435000, 560000, 710000, 900000, 1100000, 1350000, 1650000, 2000000,
    2500000, 3000000, 3750000, 4750000, 6000000, 7500000, 9500000, 12000000, 15000000, 20000000
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) return i + 1;
  }
  return 1;
};

// Format large numbers
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Get Pokemon image URL (using PokeAPI)
export const getPokemonImageUrl = (pokemonId, shiny = false) => {
  if (shiny) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
};

// Get type effectiveness
export const getTypeEffectiveness = (attackType, defenseTypes) => {
  const effectiveness = {
    Fire: { strong: ['Grass', 'Ice', 'Bug', 'Steel'], weak: ['Water', 'Rock', 'Dragon'] },
    Water: { strong: ['Fire', 'Ground', 'Rock'], weak: ['Grass', 'Electric', 'Dragon'] },
    Grass: { strong: ['Water', 'Ground', 'Rock'], weak: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'] },
    Electric: { strong: ['Water', 'Flying'], weak: ['Ground'] },
  };

  let multiplier = 1;
  defenseTypes.forEach(defType => {
    if (effectiveness[attackType]?.strong?.includes(defType)) multiplier *= 1.6;
    if (effectiveness[attackType]?.weak?.includes(defType)) multiplier *= 0.625;
  });

  return multiplier;
};
