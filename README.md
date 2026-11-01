# ARCADIA — Cinematic Western Gaming Platform

> **Phase 1 Design Implementation**: Cinematic Western Glassmorphism + Hybrid Gaming Experience + PWA-First Architecture

---

## 🏜️ Overview

Arcadia is a premium casual multiplayer gaming platform that pairs the rugged, atmospheric majesty of the American frontier with modern luxury glassmorphism and competitive web mechanics.

---

## 🎨 Design Tokens & Visual Identity

The design system is centralized in `src/styles/tokens.css` and mapped to Tailwind CSS:

- **Background (Obsidian Dusk)**: `#100F0D`
- **Secondary Background**: `#191713`
- **Surface**: `#211C16`
- **Glass Fill**: `rgba(255, 255, 255, 0.075)`
- **Glass Hover**: `rgba(255, 255, 255, 0.11)`
- **Glass Border**: `rgba(255, 255, 255, 0.12)`
- **Antique Gold**: `#C5A46D`
- **Weathered Bronze**: `#80613C`
- **Text Primary (Parchment Cream)**: `#F3EBDD`
- **Text Secondary (Dust Sand)**: `#B8AA96`

### Typography Hierarchy
- **Serif (Headlines, Titles, Accents)**: `Playfair Display`
- **Sans-Serif (Body, Controls, UI Metrics)**: `Inter`

---

## 🎮 Platform Features

### 1. Homepage (`/`)
- Full-viewport (100vh) cinematic Western hero with dusk atmosphere and floating ember particles
- Staggered Framer Motion entrance animations
- Featured Games showcase (`Tic-Tac-Toe`, `Snake`, `Memory Match`, `Rock Paper Scissors`)
- "Why Arcadia" glass pillars with scroll-triggered reveals
- Multiplayer Arena preview with simulated matchmaking radar
- Global Leaderboard preview highlighting top contenders
- Community Fellowship invitation banner
- Luxury multi-column footer with custom social icons and server health status

### 2. Player Dashboard (`/dashboard`)
- Collapsible glassmorphic sidebar (72px collapsed / 260px expanded) with mobile drawer support
- Interactive Dashboard Header with live search, notification alerts, and player profile menu
- 4 Key Stat Cards (Games Played, Wins, Total Score, Playtime)
- Dynamic Player Profile widget with animated XP bar and honorific rank
- Recently Played games and interactive game library
- Real-time Activity Feed with type-differentiated icons
- Dedicated sub-views:
  - `/dashboard/discover`: Full catalog with search and category filters
  - `/dashboard/games`: My Games library with personal statistics
  - `/dashboard/multiplayer`: Multiplayer room matchmaking preview with waitlist notifications
  - `/dashboard/leaderboard`: Hall of Champions with podiums and time filtering
  - `/dashboard/achievements`: Interactive achievements matrix with progress bars and unlocked gilded status
  - `/dashboard/friends`: Syndicate alliance preview
  - `/dashboard/settings`: Account and display preferences

### 3. Game Detail Routes (`/games/[slug]`)
- Dynamic route for each featured title
- Thematic art banner with category badge, player count, and difficulty level
- "How to Play" rule codex with Grandmaster pro-tips
- Interactive "Play Now" action with coming-soon alerts
- Related games grid

### 4. Authentication (`/login`, `/register`)
- Atmospheric dusk glow background
- Glassmorphic authentication panels with input validation and show/hide password toggles
- Simulated transition into the Player Dashboard

---

## 📱 PWA-First Architecture

Arcadia is built from the ground up as a fully installable Progressive Web Application:

1. **Web App Manifest (`public/manifest.json`)**: Configured with `standalone` display mode, `#100F0D` brand themes, orientation support, and multi-size icon definitions (including maskable).
2. **Production Service Worker (`public/sw.js`)**:
   - Multi-tiered versioned cache (`arcadia-v1`)
   - Pre-caching of critical application shell routes (`/`, `/discover`, `/leaderboard`, `/community`, `/login`, `/register`, `/dashboard`, `/offline`)
   - Network-first navigation strategy with automatic fallback to `/offline`
   - Cache-first strategy for static styles, scripts, and web fonts
   - Stale-while-revalidate strategy for game media and icons
   - Network-only strategy for API and authentication endpoints to ensure zero sensitive data caching
3. **Offline Fallback Page (`/offline`)**: Custom zero-dependency Western glassmorphic screen with connection retry controls.
4. **Connection Monitor (`ConnectionStatus.tsx`)**: Ambient top bar displaying network status transitions in real time.
5. **Custom Install Banner (`InstallPrompt.tsx`)**: Responsive, dismissible prompt capturing `beforeinstallprompt` events with persistent dismissal memory.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Running the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```
