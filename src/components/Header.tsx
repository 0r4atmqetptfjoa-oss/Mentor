import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Button from '../ui/button';
import { promptInstall } from '../pwa';

export function Header() {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handler = () => setInstallable(true);
    window.addEventListener('pwa:install-ready', handler);
    return () => window.removeEventListener('pwa:install-ready', handler);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <h1 className="font-bold text-lg">Mentor</h1>
      {installable && (
        <Button onClick={promptInstall} className="flex items-center gap-1" aria-label="Install app">
          <Download className="w-4 h-4" /> Install
        </Button>
      )}
    </header>
  );
}

export default Header;

