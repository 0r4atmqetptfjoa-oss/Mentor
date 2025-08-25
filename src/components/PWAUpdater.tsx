import { useEffect } from 'react';
import { useToast } from '../ui/toast';

export function PWAUpdater() {
  const toast = useToast();

  useEffect(() => {
    const handler = () =>
      toast({
        message: 'New version available',
        action: {
          label: 'Reload',
          onClick: () => window.dispatchEvent(new Event('pwa:reload'))
        }
      });
    window.addEventListener('pwa:need-refresh', handler);
    return () => window.removeEventListener('pwa:need-refresh', handler);
  }, [toast]);

  return null;
}

export default PWAUpdater;

