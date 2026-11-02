'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface PWAContextType {
  isOnline: boolean;
  isInstallable: boolean;
  installApp: () => Promise<boolean>;
  isUpdateAvailable: boolean;
  updateApp: () => void;
}

const PWAContext = createContext<PWAContextType>({
  isOnline: true,
  isInstallable: false,
  installApp: async () => false,
  isUpdateAvailable: false,
  updateApp: () => {},
});

export const usePWA = () => useContext(PWAContext);

interface PWAProviderProps {
  children: ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [statusToast, setStatusToast] = useState<{
    message: string;
    type: 'online' | 'offline';
  } | null>(null);

  // Initialize online status and subscribe to network events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setStatusToast({
        message: 'Connection restored. Welcome back to Arcadia.',
        type: 'online',
      });
      setTimeout(() => setStatusToast(null), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatusToast({
        message: 'Connection lost. Working in offline mode.',
        type: 'offline',
      });
      setTimeout(() => setStatusToast(null), 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker and handle lifecycle updates
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // In development mode, automatically unregister active service workers and clear caches
    // so Turbopack hot reloading and fresh CSS styles are never blocked by stale cache.
    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check if an update is found
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setIsUpdateAvailable(true);
                setWaitingWorker(newWorker);
              }
            });
          }
        });

        // If there is already a waiting worker
        if (registration.waiting) {
          setIsUpdateAvailable(true);
          setWaitingWorker(registration.waiting);
        }
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });

    // Handle controller change (when new SW takes over)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation prompt
  const installApp = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[PWA] Install prompt failed:', err);
      return false;
    }
  }, [installPrompt]);

  // Activate pending service worker update
  const updateApp = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [waitingWorker]);

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        isInstallable,
        installApp,
        isUpdateAvailable,
        updateApp,
      }}
    >
      {children}

      {/* Network Status Floating Toast */}
      <AnimatePresence>
        {statusToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed bottom-6 right-6 z-[80] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${
              statusToast.type === 'online'
                ? 'bg-[#19271E]/90 border-[#4EAD7B]/40 text-[#A8E6CF]'
                : 'bg-[#2A1D12]/90 border-[#E09F3E]/40 text-[#F5D49B]'
            }`}
          >
            {statusToast.type === 'online' ? (
              <Wifi size={18} className="text-[#4EAD7B]" />
            ) : (
              <WifiOff size={18} className="text-[#E09F3E]" />
            )}
            <span className="text-sm font-medium">{statusToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Worker Update Banner */}
      <AnimatePresence>
        {isUpdateAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 left-6 z-[80] flex items-center gap-4 px-4 py-3 bg-[var(--surface-card,#211C16)]/95 border border-[var(--gold,#C5A46D)]/50 rounded-xl shadow-2xl backdrop-blur-lg"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[var(--gold-light,#DFCA9B)]">
                Update Available
              </span>
              <span className="text-xs text-[var(--text-secondary,#B8AA96)]">
                A new version of Arcadia is ready.
              </span>
            </div>
            <button
              onClick={updateApp}
              type="button"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--gold,#C5A46D)] text-[#100F0D] hover:bg-[var(--gold-light,#DFCA9B)] transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <RefreshCw size={13} />
              Update Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PWAContext.Provider>
  );
}

export default PWAProvider;
