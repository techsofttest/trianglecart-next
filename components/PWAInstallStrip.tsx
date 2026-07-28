'use client';

import { useEffect, useState } from 'react';
import { Download, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallStrip() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already running as installed PWA
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    setIsInstalled(standalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (isInstalled) {
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      return;
    }

    // iPhone / unsupported browsers
    alert(
      'To install this app:\n\n• Android: Use the browser menu and tap "Install app" or "Add to Home screen".\n\n• iPhone/iPad: Tap Share → Add to Home Screen.'
    );
  };

  return (
    <div className="w-full bg-brand-blue text-white px-4 py-4 rounded-[5px]">
      <div className="mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Download className="w-5 h-5 flex-shrink-0" />

          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base">
              Install Triangle Cart App
            </p>

            <p className="text-xs sm:text-sm opacity-90">
              {isInstalled
                ? 'App is already installed.'
                : 'Install for faster access and a better experience.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleInstall}
          disabled={isInstalled}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
            isInstalled
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-white text-brand-green hover:bg-gray-100'
          }`}
        >
          {isInstalled ? (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Installed
            </span>
          ) : (
            'Install'
          )}
        </button>
      </div>
    </div>
  );
}