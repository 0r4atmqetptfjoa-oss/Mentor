import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './index.css';
import { ToastProvider } from './ui/toast';
import PWAUpdater from './components/PWAUpdater';
import { enablePWA } from './pwa';

const Home = lazy(() => import('./pages/Home'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Review = lazy(() => import('./pages/Review'));
const ReviewMistakes = lazy(() => import('./pages/ReviewMistakes'));
const Missions = lazy(() => import('./pages/Missions'));

enablePWA();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <PWAUpdater />
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/review" element={<Review />} />
            <Route path="/review-greseli" element={<ReviewMistakes />} />
            <Route path="/misiuni" element={<Missions />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);

