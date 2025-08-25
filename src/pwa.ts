import { registerSW } from 'virtual:pwa-register';

let installPrompt: any = null;

export function enablePWA() {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    installPrompt = e;
    window.dispatchEvent(new Event('pwa:install-ready'));
  });

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      window.dispatchEvent(new Event('pwa:need-refresh'));
    }
  });

  window.addEventListener('pwa:reload', () => updateSW());
}

export function promptInstall() {
  installPrompt?.prompt();
  installPrompt = null;
}

export default enablePWA;

