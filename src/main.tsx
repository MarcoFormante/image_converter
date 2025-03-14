import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import AppContext from './context/Context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContext>
        <App />
    </AppContext>
  </StrictMode>,
)
