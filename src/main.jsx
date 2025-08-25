import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { registerPWA } from './modules/pwa/register';

registerPWA();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#2D3748',
            color: '#E2E8F0',
            border: '1px solid #4A5568'
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);