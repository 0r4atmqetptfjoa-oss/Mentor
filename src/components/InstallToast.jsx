import { useEffect, useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export default function InstallToast() {
  const { canPrompt, prompt, isIOS, isStandalone, installed } = useInstallPrompt()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (installed || isStandalone) return
    if (canPrompt) setShow(true)
    else if (isIOS) setShow(true) // arătăm instrucțiuni iOS
  }, [canPrompt, isIOS, installed, isStandalone])

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-3 px-3 z-50">
      <div className="card">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="font-semibold">Instalează Mentor</div>
            <div className="text-white/70 text-sm">
              {isIOS
                ? 'Pe iPhone: Share → Add to Home Screen pentru instalare.'
                : 'Adaugă aplicația pe ecranul de start pentru acces mai rapid.'}
            </div>
          </div>
          {!isIOS && (
            <button className="btn-primary" onClick={() => prompt().then(()=>setShow(false))}>
              Instalează
            </button>
          )}
          <button className="ml-2 text-white/60" onClick={() => setShow(false)}>Închide</button>
        </div>
      </div>
    </div>
  )
}
