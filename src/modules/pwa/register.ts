import { registerSW } from 'virtual:pwa-register';

/**
 * Înregistrează service worker-ul PWA.
 */
export function registerPWA() {
  if (typeof window !== 'undefined') {
    registerSW({});
  }
}
