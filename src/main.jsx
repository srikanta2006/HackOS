import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { HackathonLockProvider } from './context/HackathonLockContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx' // ✅ Add this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary> {/* ✅ Wrap everything */}
      <BrowserRouter>
        <AuthProvider>
          <HackathonLockProvider>
            <App />
          </HackathonLockProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)