import { useEffect, useState } from 'react'

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [installed, setInstalled] = useState(window.matchMedia('(display-mode: standalone)').matches)

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferred(e)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  return {
    canPrompt: !!deferred,
    prompt: async () => {
      if (deferred) {
        deferred.prompt()
        const { outcome } = await deferred.userChoice
        setDeferred(null)
        return outcome
      }
      return 'unavailable'
    },
    installed, isIOS, isStandalone
  }
}
