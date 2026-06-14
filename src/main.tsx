import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { STORAGE_KEY, USER_STORAGE_KEY } from './types'

if (new URLSearchParams(window.location.search).get('reset') === '1') {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem('emotion-orchard-storage')
  window.history.replaceState({}, '', window.location.pathname)
  window.location.reload()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
