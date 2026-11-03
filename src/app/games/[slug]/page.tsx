'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Star,
  Play,
  ArrowLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Flame,
  RotateCcw,
  Trophy,
  Swords,
  Shield,
  Crown,
  Zap,
  Gamepad2,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from 'lucide-react';

import AppShell from '@/components/layout/AppShell';
import GlassPanel from '@/components/ui/GlassPanel';
import GameCard from '@/components/ui/GameCard';
import { FEATURED_GAMES } from '@/lib/constants';
import { formatNumber, getGameImage } from '@/lib/utils';
import { playBlip, playEngage } from '@/lib/sound';
import { triggerHaptic } from '@/lib/haptics';
import { recordGameResult } from '@/lib/telemetry';
import { useWakeLock } from '@/lib/wakelock';

// =========================================================================
// 1. GAME-SPECIFIC PLAYABLE ARENAS
// =========================================================================

// --- TIC TAC TOE ARENA ---
function TicTacToeArena() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [vsAI, setVsAI] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every(Boolean)) return { winner: 'draw', line: [] };
    return null;
  };

  const result = calculateWinner(board);

  // AI Move
  useEffect(() => {
    if (vsAI && !isXNext && !result) {
      const emptyIndices = board
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);

      if (emptyIndices.length > 0) {
        const timer = setTimeout(() => {
          // Simple intelligent move: center or random empty
          const choice = emptyIndices.includes(4) ? 4 : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[choice] = 'O';
          setBoard(newBoard);
          setIsXNext(true);

          const res = calculateWinner(newBoard);
          if (res?.winner === 'O') {
            triggerHaptic('error');
            setScores((s) => ({ ...s, o: s.o + 1 }));
            recordGameResult('tic-tac-toe', false, 20);
          } else if (res?.winner === 'draw') {
            setScores((s) => ({ ...s, draws: s.draws + 1 }));
            recordGameResult('tic-tac-toe', false, 50);
          }
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [vsAI, isXNext, board, result]);

  const handleClick = (idx: number) => {
    if (board[idx] || result) return;
    if (vsAI && !isXNext) return;

    triggerHaptic('medium');
    playBlip();

    const newBoard = [...board];
    newBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const res = calculateWinner(newBoard);
    if (res?.winner === 'X') {
      triggerHaptic('success');
      playEngage();
      setScores((s) => ({ ...s, x: s.x + 1 }));
      recordGameResult('tic-tac-toe', true, 100);
    } else if (res?.winner === 'O') {
      triggerHaptic('error');
      setScores((s) => ({ ...s, o: s.o + 1 }));
      recordGameResult('tic-tac-toe', false, 20);
    } else if (res?.winner === 'draw') {
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
      recordGameResult('tic-tac-toe', false, 50);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 rounded-2xl bg-[var(--surface-primary)] border border-[rgba(227,66,66,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
      {/* Top Bar: Mode selector and score */}
      <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setVsAI(true); resetGame(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              vsAI ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            vs Arena AI
          </button>
          <button
            onClick={() => { setVsAI(false); resetGame(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !vsAI ? 'bg-[var(--accent-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            Pass &amp; Play
          </button>
        </div>

        <button
          onClick={resetGame}
          className="p-2 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)] transition-colors"
          title="Reset board"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Score Tracker */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6 text-center">
        <div className="p-2.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
          <span className="text-[10px] uppercase font-mono text-[var(--accent-primary)] block font-semibold">You (X)</span>
          <span className="text-lg font-bold font-mono text-white">{scores.x}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
          <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block font-semibold">Draws</span>
          <span className="text-lg font-bold font-mono text-white">{scores.draws}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
          <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)] block font-semibold">
            {vsAI ? 'AI (O)' : 'P2 (O)'}
          </span>
          <span className="text-lg font-bold font-mono text-white">{scores.o}</span>
        </div>
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-3 w-full aspect-square max-w-[320px]">
        {board.map((val, idx) => {
          const isWinningCell = result?.line?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`rounded-2xl border text-3xl font-heading font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                isWinningCell
                  ? 'bg-[var(--accent-primary)] border-white text-white shadow-[0_0_20px_rgba(227,66,66,0.6)] scale-102'
                  : 'bg-[var(--surface-secondary)] border-[var(--border-subtle)] hover:border-[rgba(227,66,66,0.5)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)]'
              }`}
            >
              {val === 'X' ? (
                <span className={isWinningCell ? 'text-white' : 'text-[var(--accent-primary)]'}>X</span>
              ) : val === 'O' ? (
                <span className={isWinningCell ? 'text-white' : 'text-[#C7A9A3]'}>O</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Status Banner */}
      <div className="mt-6 text-center">
        {result ? (
          <div className="text-sm font-heading font-bold text-white px-4 py-1.5 rounded-full bg-[var(--surface-secondary)] border border-[rgba(227,66,66,0.3)] shadow-[0_0_12px_rgba(227,66,66,0.2)]">
            {result.winner === 'draw'
              ? 'Honorable Stalemate!'
              : `${result.winner === 'X' ? 'Player X' : vsAI ? 'Arena AI' : 'Player O'} Claims Victory!`}
          </div>
        ) : (
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Current Move: <strong className="text-[var(--accent-primary)]">{isXNext ? 'X (You)' : vsAI ? 'O (AI thinking...)' : 'O (P2)'}</strong>
          </span>
        )}
      </div>
    </div>
  );
}

// --- SNAKE ARENA ---
function SnakeArena() {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const GRID_SIZE = 20;

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setFood({
      x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
      y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
    });
    setDir({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Keyboard & Gamepad controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && dir.y === 0) {
        setDir({ x: 0, y: -1 });
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && dir.y === 0) {
        setDir({ x: 0, y: 1 });
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && dir.x === 0) {
        setDir({ x: -1, y: 0 });
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && dir.x === 0) {
        setDir({ x: 1, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    let rafId: number;
    const pollGamepad = () => {
      if (isPlaying && !gameOver) {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        const pad = pads[0];
        if (pad) {
          const axeX = pad.axes[0];
          const axeY = pad.axes[1];
          const dpadUp = pad.buttons[12]?.pressed;
          const dpadDown = pad.buttons[13]?.pressed;
          const dpadLeft = pad.buttons[14]?.pressed;
          const dpadRight = pad.buttons[15]?.pressed;

          if ((axeY < -0.45 || dpadUp) && dir.y === 0) {
            setDir({ x: 0, y: -1 });
          } else if ((axeY > 0.45 || dpadDown) && dir.y === 0) {
            setDir({ x: 0, y: 1 });
          } else if ((axeX < -0.45 || dpadLeft) && dir.x === 0) {
            setDir({ x: -1, y: 0 });
          } else if ((axeX > 0.45 || dpadRight) && dir.x === 0) {
            setDir({ x: 1, y: 0 });
          }
        }
      }
      rafId = requestAnimationFrame(pollGamepad);
    };
    rafId = requestAnimationFrame(pollGamepad);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(rafId);
    };
  }, [isPlaying, gameOver, dir]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { x: prevSnake[0].x + dir.x, y: prevSnake[0].y + dir.y };

        // Wall collisions
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          triggerHaptic('error');
          recordGameResult('snake', score > 50, score);
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          triggerHaptic('error');
          recordGameResult('snake', score > 50, score);
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          triggerHaptic('medium');
          playBlip();
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          setFood({
            x: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
            y: Math.floor(Math.random() * (GRID_SIZE - 2)) + 1,
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, dir, food, highScore, score]);

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 rounded-2xl bg-[var(--surface-primary)] border border-[rgba(227,66,66,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Score: <strong className="text-[var(--accent-primary)] font-bold text-sm">{score}</strong>
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            High: <strong className="text-white font-bold">{highScore}</strong>
          </span>
        </div>

        <button
          onClick={resetGame}
          className="p-2 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)] transition-colors"
          title="Reset Snake"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Grid Canvas Screen */}
      <div className="relative w-full aspect-square max-w-[320px] rounded-2xl bg-[#1C0A0A] border-2 border-[var(--border-subtle)] overflow-hidden shadow-inner flex items-center justify-center">
        {/* Render Snake and Food as absolute blocks */}
        {snake.map((seg, idx) => (
          <div
            key={idx}
            className="absolute rounded-sm"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(seg.x * 100) / GRID_SIZE}%`,
              top: `${(seg.y * 100) / GRID_SIZE}%`,
              backgroundColor: idx === 0 ? '#E34242' : '#C83A35',
              boxShadow: idx === 0 ? '0 0 8px rgba(227,66,66,0.8)' : 'none',
            }}
          />
        ))}

        <div
          className="absolute rounded-full animate-pulse bg-emerald-400"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
            boxShadow: '0 0 10px rgba(52,211,153,0.9)',
          }}
        />

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-[#260D0D]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {gameOver ? (
              <>
                <h4 className="text-xl font-heading font-extrabold text-white mb-1">Serpent Slain</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Final Score: {score} pts</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E34242] to-[#C83A35] text-white text-xs font-bold shadow-[0_4px_16px_rgba(227,66,66,0.4)] cursor-pointer"
                >
                  Play Again
                </button>
              </>
            ) : (
              <>
                <h4 className="text-xl font-heading font-extrabold text-white mb-2">Ready to Glide?</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Use Arrow keys or WASD to navigate</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E34242] to-[#C83A35] text-white text-xs font-bold shadow-[0_4px_16px_rgba(227,66,66,0.4)] cursor-pointer flex items-center gap-2"
                >
                  <Play size={14} className="fill-current" />
                  <span>Start Game</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* On-screen D-pad Controls for Mobile & PWA */}
      <div className="grid grid-cols-3 gap-2 w-44 mt-5">
        <div />
        <button
          onClick={() => dir.y === 0 && setDir({ x: 0, y: -1 })}
          className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-white hover:bg-[var(--accent-primary)] flex items-center justify-center cursor-pointer active:scale-95"
        >
          <ArrowUp size={16} />
        </button>
        <div />
        <button
          onClick={() => dir.x === 0 && setDir({ x: -1, y: 0 })}
          className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-white hover:bg-[var(--accent-primary)] flex items-center justify-center cursor-pointer active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => dir.y === 0 && setDir({ x: 0, y: 1 })}
          className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-white hover:bg-[var(--accent-primary)] flex items-center justify-center cursor-pointer active:scale-95"
        >
          <ArrowDown size={16} />
        </button>
        <button
          onClick={() => dir.x === 0 && setDir({ x: 1, y: 0 })}
          className="p-3 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-white hover:bg-[var(--accent-primary)] flex items-center justify-center cursor-pointer active:scale-95"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// --- MEMORY MATCH ARENA ---
function MemoryMatchArena() {
  const ICONS = ['swords', 'crown', 'shield', 'star', 'trophy', 'flame', 'sparkles', 'zap'];
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedIds.length === 2) return;
    const clicked = cards.find((c) => c.id === id);
    if (!clicked || clicked.flipped || clicked.matched) return;

    triggerHaptic('light');
    playBlip();

    const nextFlipped = [...flippedIds, id];
    setFlippedIds(nextFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        setMatches((m) => {
          const nextMatches = m + 1;
          if (nextMatches === 8) {
            triggerHaptic('success');
            playEngage();
            recordGameResult('memory-match', true, Math.max(100, 1000 - moves * 25));
          } else {
            triggerHaptic('medium');
          }
          return nextMatches;
        });
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, matched: true } : c
          )
        );
        setFlippedIds([]);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, flipped: false } : c
            )
          );
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'swords': return <Swords size={22} />;
      case 'crown': return <Crown size={22} />;
      case 'shield': return <Shield size={22} />;
      case 'star': return <Star size={22} className="fill-current" />;
      case 'trophy': return <Trophy size={22} />;
      case 'flame': return <Flame size={22} />;
      case 'sparkles': return <Sparkles size={22} />;
      case 'zap': return <Zap size={22} />;
      default: return <Sparkles size={22} />;
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 rounded-2xl bg-[var(--surface-primary)] border border-[rgba(227,66,66,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-5 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[var(--text-secondary)]">Moves: <strong className="text-white font-bold">{moves}</strong></span>
          <span className="text-[var(--text-secondary)]">Matched: <strong className="text-[var(--accent-primary)] font-bold">{matches} / 8</strong></span>
        </div>

        <button
          onClick={initGame}
          className="p-2 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)] transition-colors"
          title="Restart Deck"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* 4x4 Grid */}
      <div className="grid grid-cols-4 gap-2.5 w-full aspect-square max-w-[320px]">
        {cards.map((card) => {
          const isOpen = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`rounded-xl border flex items-center justify-center text-white transition-all cursor-pointer aspect-square ${
                card.matched
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                  : isOpen
                  ? 'bg-[var(--accent-primary)] border-white text-white shadow-[0_0_12px_rgba(227,66,66,0.5)]'
                  : 'bg-[var(--surface-secondary)] border-[var(--border-subtle)] hover:border-[rgba(227,66,66,0.4)] text-[var(--text-muted)]'
              }`}
            >
              {isOpen ? renderIcon(card.icon) : <span className="text-xs font-mono opacity-40">?</span>}
            </button>
          );
        })}
      </div>

      {/* Victory Banner */}
      {matches === 8 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
        >
          All 8 Arcane Pairs Solved in {moves} moves!
        </motion.div>
      )}
    </div>
  );
}

// --- ROCK PAPER SCISSORS ARENA ---
function RPSArena() {
  const CHOICES = [
    { id: 'rock', name: 'Rock', icon: Shield, beats: 'scissors' },
    { id: 'paper', name: 'Paper', icon: BookOpen, beats: 'rock' },
    { id: 'scissors', name: 'Scissors', icon: Swords, beats: 'paper' },
  ];

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [aiChoice, setAiChoice] = useState<string | null>(null);
  const [isFighting, setIsFighting] = useState(false);

  const playRound = (choiceId: string) => {
    triggerHaptic('medium');
    playBlip();
    setIsFighting(true);
    setPlayerChoice(choiceId);
    setAiChoice(null);
    setRoundResult(null);

    setTimeout(() => {
      const randomAI = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
      setAiChoice(randomAI);

      if (choiceId === randomAI) {
        setRoundResult('Tie Clash!');
        triggerHaptic('light');
      } else {
        const choiceObj = CHOICES.find((c) => c.id === choiceId);
        if (choiceObj?.beats === randomAI) {
          triggerHaptic('success');
          setPlayerScore((s) => {
            const next = s + 1;
            if (next >= 3) {
              playEngage();
              recordGameResult('rock-paper-scissors', true, 100);
            }
            return next;
          });
          setRoundResult('Round Won!');
        } else {
          triggerHaptic('error');
          setAiScore((s) => {
            const next = s + 1;
            if (next >= 3) {
              recordGameResult('rock-paper-scissors', false, 25);
            }
            return next;
          });
          setRoundResult('Round Lost!');
        }
      }
      setIsFighting(false);
    }, 450);
  };

  const resetDuel = () => {
    setPlayerScore(0);
    setAiScore(0);
    setPlayerChoice(null);
    setAiChoice(null);
    setRoundResult(null);
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto p-6 rounded-2xl bg-[var(--surface-primary)] border border-[rgba(227,66,66,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-6 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[var(--text-secondary)]">Best of 5 Duel</span>
        </div>
        <button
          onClick={resetDuel}
          className="p-2 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-white border border-[var(--border-subtle)] transition-colors"
          title="Reset Match"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Head to Head Duel Stage */}
      <div className="grid grid-cols-3 gap-3 w-full mb-8 items-center text-center">
        <div className="p-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
          <span className="text-[10px] uppercase font-mono text-[var(--accent-primary)] block font-semibold mb-1">You</span>
          <span className="text-2xl font-bold font-mono text-white block mb-2">{playerScore}</span>
          <span className="text-xs text-[var(--text-muted)] capitalize">{playerChoice || 'Ready'}</span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="w-10 h-10 rounded-full bg-[rgba(227,66,66,0.15)] border border-[rgba(227,66,66,0.3)] flex items-center justify-center text-[var(--accent-primary)] font-heading font-extrabold text-sm mb-1">
            VS
          </span>
          {roundResult && (
            <span className={`text-[11px] font-bold mt-1 ${
              roundResult.includes('Won') ? 'text-emerald-400' : roundResult.includes('Tie') ? 'text-amber-400' : 'text-red-400'
            }`}>
              {roundResult}
            </span>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)]">
          <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)] block font-semibold mb-1">Arena AI</span>
          <span className="text-2xl font-bold font-mono text-white block mb-2">{aiScore}</span>
          <span className="text-xs text-[var(--text-muted)] capitalize">{aiChoice || 'Waiting'}</span>
        </div>
      </div>

      {/* 3 Action Buttons */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
        {CHOICES.map((choice) => {
          const Icon = choice.icon;
          return (
            <button
              key={choice.id}
              disabled={isFighting}
              onClick={() => playRound(choice.id)}
              className="p-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:bg-[var(--surface-elevated)] flex flex-col items-center gap-2 text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Icon size={26} className="text-[var(--accent-primary)]" />
              <span className="text-xs font-semibold">{choice.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// 2. MAIN GAME DETAIL CONTENT
// =========================================================================

function GameDetailContent() {
  const routeParams = useParams();
  const rawSlug = routeParams?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string) || '';

  // Screen WakeLock active during gameplay
  useWakeLock(true);

  const [activeTab, setActiveTab] = useState<'arena' | 'codex'>('arena');
  const [bookmarked, setBookmarked] = useState(false);

  // Look up game by slug from FEATURED_GAMES constant
  const game = FEATURED_GAMES.find(
    (g) => g.slug.toLowerCase() === slug.toLowerCase()
  );

  // If game is not found, display a stylish 404 message
  if (!game) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <GlassPanel padding="lg" className="text-center max-w-lg p-10 bg-[var(--surface-primary)] border-[rgba(227,66,66,0.3)] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(227,66,66,0.15)] border border-[rgba(227,66,66,0.3)] text-[var(--accent-primary)] flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-[var(--text-primary)] mb-3">
              Title Not Found
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
              The title you seek has either vanished into legend or has not yet been transcribed
              into the Arcadia archive.
            </p>
            <Link
              href="/discover"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E34242] to-[#C83A35] text-white text-sm font-bold shadow-[0_4px_16px_rgba(227,66,66,0.35)] inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Discover Games</span>
            </Link>
          </GlassPanel>
        </div>
      </AppShell>
    );
  }

  const details = {
    tagline: 'An exalted casual challenge awaiting your tactical prowess.',
    rules: [
      {
        title: 'Master the Fundamentals',
        desc: 'Execute moves with foresight and maintain composure under turn pressure.',
      },
      {
        title: 'Score Multipliers',
        desc: 'Chain accurate maneuvers to multiply your seasonal arena score.',
      },
      {
        title: 'Strategic Adaptability',
        desc: 'Read rival pacing and exploit overextended positions.',
      },
      {
        title: 'Victory Protocol',
        desc: 'Reach triumph milestones to claim ranking points and distinguished medals.',
      },
    ],
    tactics: [
      'Maintain awareness of your opponent’s primary win condition.',
      'Control the spatial center to maximize future options.',
      'Anticipate your rival’s counter two turns ahead.',
    ],
    controls: 'Standard mouse and keyboard controls',
  };

  const relatedGames = FEATURED_GAMES.filter((g) => g.slug !== game.slug);

  return (
    <AppShell>
      <div className="space-y-6 pb-8 select-none">
        {/* ========================================================================= */}
        {/* GAME HERO CONSOLE CARD                                                    */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-[#291010] via-[#351414] to-[#220C0C] border border-white/[0.08] p-6 sm:p-8 relative shadow-xl">
          <div className="mb-4">
            <Link
              href="/discover"
              prefetch={true}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C7A9A3] hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Discover</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Game Meta & Titles */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E34242]/20 border border-[#E34242]/40 text-[#E34242] text-xs font-mono font-bold uppercase tracking-wider">
                  {game.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1C0A0A] border border-white/10 text-[#C7A9A3] text-xs font-mono">
                  Difficulty: {game.difficulty}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C0A0A] border border-white/10 text-[#C7A9A3] text-xs font-mono">
                  <Users className="w-3 h-3 text-[#E34242]" />
                  {formatNumber(game.playerCount)} Contenders
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
                {game.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#C7A9A3] leading-relaxed max-w-2xl">
                {game.description}
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('arena')}
                  className={`px-6 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'arena'
                      ? 'bg-gradient-to-r from-[#E34242] to-[#C83A35] text-white shadow-[0_4px_20px_rgba(227,66,66,0.4)]'
                      : 'bg-[#1C0A0A] text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play In Arena</span>
                </button>

                <button
                  onClick={() => setActiveTab('codex')}
                  className={`px-5 py-3 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'codex'
                      ? 'bg-[#291010] border border-[#E34242] text-white shadow-[0_0_12px_rgba(227,66,66,0.25)]'
                      : 'bg-[#1C0A0A] text-[#C7A9A3] border border-white/10 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Codex &amp; Rules</span>
                </button>

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className="p-3 rounded-2xl border border-white/10 bg-[#1C0A0A] hover:text-[#E34242] text-[#C7A9A3] transition-colors cursor-pointer"
                  title={bookmarked ? 'Saved to Favorites' : 'Bookmark Title'}
                >
                  <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#E34242] text-[#E34242]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Game Emblem Art Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md aspect-[16/10] overflow-hidden bg-[#1C0A0A] border border-white/10 shadow-2xl relative group rounded-2xl">
                <img
                  src={game.image || `/images/games/${game.slug}.jpg`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getGameImage(game.slug);
                  }}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#C7A9A3] font-mono">
                  <span className="bg-black/70 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10 text-white text-[11px]">
                    Controls: {details.controls}
                  </span>
                  <span className="bg-black/70 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                    <Star className="w-3 h-3 fill-current" />
                    {game.rating || 4.8} / 5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE ARENA & CODEX SECTIONS                                       */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-[#291010] border border-white/[0.08] p-5 sm:p-8">
          {activeTab === 'arena' ? (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(227,66,66,0.12)] border border-[rgba(227,66,66,0.3)] text-[var(--accent-primary)] text-xs font-mono font-semibold uppercase tracking-wider mb-2">
                  <Gamepad2 size={13} />
                  Live Battlefield
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text-primary)]">
                  {game.name} Duel Arena
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Interact with the arena below to challenge AI tacticians or friends
                </p>
              </div>

              {/* Render dynamic working game component */}
              {game.slug === 'tic-tac-toe' && <TicTacToeArena />}
              {game.slug === 'snake' && <SnakeArena />}
              {game.slug === 'memory-match' && <MemoryMatchArena />}
              {game.slug === 'rock-paper-scissors' && <RPSArena />}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left: Rules & Sequence */}
              <div className="lg:col-span-7 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold">
                      CODEX &amp; MECHANICS
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[var(--text-primary)]">
                    How to Play {game.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    Familiarize yourself with the fundamental laws governing the arena.
                  </p>
                </div>

                {/* Rules Sequence */}
                <div className="space-y-4">
                  {details.rules.map((rule, idx) => (
                    <GlassPanel
                      key={rule.title}
                      padding="md"
                      className="bg-[var(--surface-primary)] border-[var(--border-subtle)] flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-[rgba(227,66,66,0.15)] border border-[rgba(227,66,66,0.35)] text-[var(--accent-primary)] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-heading font-bold text-[var(--text-primary)] mb-1">
                          {rule.title}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {rule.desc}
                        </p>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>

              {/* Right: Tactics & Mastery Pro-Tips */}
              <div className="lg:col-span-5 space-y-6">
                <GlassPanel
                  padding="lg"
                  className="p-6 sm:p-8 bg-[var(--surface-primary)] border-[rgba(227,66,66,0.3)] shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] uppercase font-semibold mb-3">
                    <Flame className="w-4 h-4 text-[var(--accent-primary)]" />
                    Tactical Mastery
                  </div>

                  <h3 className="text-xl font-heading font-bold text-[var(--text-primary)] mb-4">
                    Grandmaster Pro-Tips
                  </h3>

                  <ul className="space-y-3.5">
                    {details.tactics.map((tactic) => (
                      <li key={tactic} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                        <span>{tactic}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Recommended Level:</span>
                      <span className="font-mono text-[var(--accent-primary)] font-semibold">Novice to Master</span>
                    </div>
                  </div>
                </GlassPanel>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RELATED GAMES SECTION                                                    */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-white">
                More Handcrafted Titles
              </h2>
              <p className="text-xs text-[#C7A9A3]">
                Challenge your reflexes and wit across other Arcadia titles.
              </p>
            </div>

            <Link
              href="/discover"
              className="px-3.5 py-1.5 rounded-xl bg-[#1C0A0A] border border-white/10 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#E34242] transition-all"
            >
              <span>View All</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedGames.slice(0, 3).map((relGame) => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function GameDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--app-background)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <GameDetailContent />
    </Suspense>
  );
}
