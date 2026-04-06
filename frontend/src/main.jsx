import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 8px 30px -5px rgba(0,0,0,0.15)',
          padding: '14px 18px',
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
  </React.StrictMode>,
)
