/**
 * Arcadia Platform Constants & Demo Data
 * Production-ready mock datasets and navigational configurations.
 */

export interface NavLink {
  label: string;
  href: string;
  icon: string;
}

export interface FeaturedGame {
  id: string;
  name: string;
  description: string;
  category: 'Strategy' | 'Arcade' | 'Puzzle' | 'Casual' | string;
  slug: string;
  image: string;
  playerCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive' | string;
  rating?: number;
  minPlayers?: number;
  maxPlayers?: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  totalScore: number;
  playtime: string;
}

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  avatar: string;
  joinDate: string;
  title?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  wins: number;
  avatar: string;
  badge?: string;
  winRate?: string;
}

export type ActivityType = 'game_played' | 'achievement' | 'friend' | 'level_up';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  unlocked: boolean;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  xpReward?: number;
}

/**
 * Primary Navigation Links for Public Header
 */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Discover', href: '/discover', icon: 'compass' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'trophy' },
  { label: 'Community', href: '/community', icon: 'users' },
] as const;

/**
 * Dashboard Sidebar Navigation Links
 */
export const DASHBOARD_NAV: readonly NavLink[] = [
  { label: 'Overview', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Discover Games', href: '/dashboard/discover', icon: 'compass' },
  { label: 'My Games', href: '/dashboard/games', icon: 'gamepad-2' },
  { label: 'Multiplayer', href: '/dashboard/multiplayer', icon: 'swords' },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: 'trophy' },
  { label: 'Achievements', href: '/dashboard/achievements', icon: 'award' },
  { label: 'Friends', href: '/dashboard/friends', icon: 'users' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
] as const;

/**
 * Featured Games List
 */
export const FEATURED_GAMES: readonly FeaturedGame[] = [
  {
    id: 'tic-tac-toe',
    name: 'Tic-Tac-Toe',
    description: 'The timeless duel of strategy and foresight, reimagined with gilded glyphs, timed turns, and intelligent AI opponents.',
    category: 'Strategy',
    slug: 'tic-tac-toe',
    image: '/images/games/tic-tac-toe.jpg',
    playerCount: 1420,
    difficulty: 'Easy',
    rating: 4.8,
    minPlayers: 1,
    maxPlayers: 2,
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Guide the celestial serpent through an obsidian labyrinth. Harvest golden orbs, build combo multipliers, and survive the coil.',
    category: 'Arcade',
    slug: 'snake',
    image: '/images/games/snake.jpg',
    playerCount: 2890,
    difficulty: 'Medium',
    rating: 4.9,
    minPlayers: 1,
    maxPlayers: 1,
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Uncover paired ancient relics and arcane sigils. Test your mnemonic reflexes across increasingly intricate grid layouts.',
    category: 'Puzzle',
    slug: 'memory-match',
    image: '/images/games/memory-match.jpg',
    playerCount: 980,
    difficulty: 'Medium',
    rating: 4.7,
    minPlayers: 1,
    maxPlayers: 2,
  },
  {
    id: 'rock-paper-scissors',
    name: 'Rock Paper Scissors',
    description: 'A psychological tournament of instinct and anticipation. Read your rival, execute lightning counters, and claim the victor crown.',
    category: 'Casual',
    slug: 'rock-paper-scissors',
    image: '/images/games/rock-paper-scissors.jpg',
    playerCount: 3150,
    difficulty: 'Easy',
    rating: 4.6,
    minPlayers: 1,
    maxPlayers: 2,
  },
] as const;

/**
 * Authenticated Demo Player Statistics
 */
export const DEMO_STATS: PlayerStats = {
  gamesPlayed: 247,
  wins: 183,
  totalScore: 45280,
  playtime: '127h',
};

/**
 * Authenticated Demo Player Profile
 */
export const DEMO_PLAYER: PlayerProfile = {
  username: 'Frontier_Scout',
  level: 24,
  xp: 7450,
  xpToNext: 10000,
  avatar: '/images/avatar-placeholder.jpg',
  joinDate: 'March 2024',
  title: 'Vanguard Tactician',
};

/**
 * Global Leaderboard Top 10 Roster
 */
export const DEMO_LEADERBOARD: readonly LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Aurelius_Prime',
    score: 128450,
    wins: 642,
    avatar: '/images/avatars/avatar-1.jpg',
    badge: 'Imperator',
    winRate: '79%',
  },
  {
    rank: 2,
    name: 'SolonTheWise',
    score: 114890,
    wins: 589,
    avatar: '/images/avatars/avatar-2.jpg',
    badge: 'Archon',
    winRate: '76%',
  },
  {
    rank: 3,
    name: 'AthenaVanguard',
    score: 98340,
    wins: 497,
    avatar: '/images/avatars/avatar-3.jpg',
    badge: 'Centurion',
    winRate: '74%',
  },
  {
    rank: 4,
    name: 'Frontier_Scout',
    score: 45280,
    wins: 183,
    avatar: '/images/avatar-placeholder.jpg',
    badge: 'Gladiator',
    winRate: '74%',
  },
  {
    rank: 5,
    name: 'ZephyrBlade',
    score: 41920,
    wins: 172,
    avatar: '/images/avatars/avatar-5.jpg',
    badge: 'Duelist',
    winRate: '71%',
  },
  {
    rank: 6,
    name: 'Cassian_V',
    score: 38450,
    wins: 161,
    avatar: '/images/avatars/avatar-6.jpg',
    badge: 'Veteran',
    winRate: '68%',
  },
  {
    rank: 7,
    name: 'NyxChronicle',
    score: 35100,
    wins: 149,
    avatar: '/images/avatars/avatar-7.jpg',
    badge: 'Champion',
    winRate: '67%',
  },
  {
    rank: 8,
    name: 'Valerius99',
    score: 32800,
    wins: 137,
    avatar: '/images/avatars/avatar-8.jpg',
    badge: 'Contender',
    winRate: '64%',
  },
  {
    rank: 9,
    name: 'RadiantEcho',
    score: 29450,
    wins: 122,
    avatar: '/images/avatars/avatar-9.jpg',
    badge: 'Challenger',
    winRate: '62%',
  },
  {
    rank: 10,
    name: 'ObsidianKnight',
    score: 26180,
    wins: 110,
    avatar: '/images/avatars/avatar-10.jpg',
    badge: 'Guardian',
    winRate: '60%',
  },
] as const;

/**
 * Recent Player Activity Stream (8 items)
 */
export const DEMO_ACTIVITY: readonly ActivityItem[] = [
  {
    id: 'act-1',
    type: 'game_played',
    message: 'Won a match in Tic-Tac-Toe against SolonTheWise with a flawless counter',
    time: '5m ago',
    icon: 'trophy',
  },
  {
    id: 'act-2',
    type: 'level_up',
    message: 'Ascended to Level 24 — Vanguard Veteran status unlocked',
    time: '2h ago',
    icon: 'sparkles',
  },
  {
    id: 'act-3',
    type: 'achievement',
    message: 'Earned the "Centurion" badge for recording 100 competitive triumphs',
    time: '4h ago',
    icon: 'award',
  },
  {
    id: 'act-4',
    type: 'friend',
    message: 'Forged an alliance with SolonTheWise',
    time: '1d ago',
    icon: 'user-plus',
  },
  {
    id: 'act-5',
    type: 'game_played',
    message: 'Set an arena personal best of 8,420 points in Snake',
    time: '1d ago',
    icon: 'gamepad-2',
  },
  {
    id: 'act-6',
    type: 'achievement',
    message: 'Unlocked "Mnemonic Master" by solving Memory Match in record time',
    time: '2d ago',
    icon: 'zap',
  },
  {
    id: 'act-7',
    type: 'game_played',
    message: 'Completed 10 consecutive Rock Paper Scissors duels',
    time: '3d ago',
    icon: 'swords',
  },
  {
    id: 'act-8',
    type: 'friend',
    message: 'Extended an alliance invitation to AthenaVanguard',
    time: '4d ago',
    icon: 'send',
  },
] as const;

/**
 * Showcase Player Achievements (6 achievements)
 */
export const DEMO_ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Claim your inaugural victory across any competitive title.',
    icon: 'swords',
    progress: 100,
    unlocked: true,
    tier: 'Bronze',
    xpReward: 250,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Record 100 sanctioned victories in the Arcadia amphitheater.',
    icon: 'award',
    progress: 100,
    unlocked: true,
    tier: 'Gold',
    xpReward: 1500,
  },
  {
    id: 'serpent-sovereign',
    name: 'Serpent Sovereign',
    description: 'Achieve a legendary score of 10,000 or greater in Snake.',
    icon: 'crown',
    progress: 84,
    unlocked: false,
    tier: 'Platinum',
    xpReward: 3000,
  },
  {
    id: 'mnemonic-master',
    name: 'Mnemonic Master',
    description: 'Clear an advanced Memory Match trial in under 45 seconds.',
    icon: 'zap',
    progress: 100,
    unlocked: true,
    tier: 'Silver',
    xpReward: 750,
  },
  {
    id: 'tactical-grandmaster',
    name: 'Tactical Grandmaster',
    description: 'Win 50 Tic-Tac-Toe games without suffering defeat.',
    icon: 'shield',
    progress: 60,
    unlocked: false,
    tier: 'Gold',
    xpReward: 2000,
  },
  {
    id: 'arcadia-legend',
    name: 'Arcadia Legend',
    description: 'Reach Player Level 50 and earn all core gilded distinctions.',
    icon: 'star',
    progress: 48,
    unlocked: false,
    tier: 'Platinum',
    xpReward: 5000,
  },
] as const;
