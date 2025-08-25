import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import InstallToast from './components/InstallToast.jsx'
import { ingestIfNeeded } from './lib/db.js'
import './index.css'

const Quiz = lazy(() => import('./views/Quiz.jsx'))
const Search = lazy(() => import('./views/Search.jsx'))
const Summaries = lazy(() => import('./views/Summaries.jsx'))
const Settings = lazy(() => import('./views/Settings.jsx'))

export default function App() {
  const loc = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ingestIfNeeded().finally(() => setReady(true))
  }, [])

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 pt-5">
        <h1 className="text-2xl font-bold">Mentor</h1>
        <p className="text-white/60 text-sm">Învață. Repetă. Offline.</p>
      </header>

      <main className="flex-1 overflow-y-auto px-3 pb-24">
        {!ready ? (
          <div className="space-y-3">
            <div className="skeleton h-8 w-2/3"></div>
            <div className="skeleton h-24 w-full"></div>
            <div className="skeleton h-24 w-full"></div>
          </div>
        ) : (
          <Suspense fallback={<div className="skeleton h-24 w-full" />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={loc.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Routes location={loc}>
                  <Route path="/" element={<Quiz />} />
                  <Route path="/cauta" element={<Search />} />
                  <Route path="/rezumate" element={<Summaries />} />
                  <Route path="/setari" element={<Settings />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        )}
      </main>

      <nav className="fixed bottom-0 inset-x-0 p-2">
        <div className="card grid grid-cols-4 gap-1 text-sm">
          {[
            { to: '/', label: 'Quiz', icon: '❓' },
            { to: '/cauta', label: 'Căutare', icon: '🔎' },
            { to: '/rezumate', label: 'Rezumate', icon: '📚' },
            { to: '/setari', label: 'Setări', icon: '⚙️' }
          ].map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                'flex flex-col items-center py-2 rounded-xl ' + (isActive ? 'bg-white/10' : 'opacity-80')
              }
              end
            >
              <span aria-hidden="true">{i.icon}</span>
              <span className="mt-1">{i.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <InstallToast />
    </div>
  )
}
