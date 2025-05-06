import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from '@/context/UserContext';
import './index.css'
import App from './App.tsx'
import AuthProvider from './RBAC/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UserProvider>
  </StrictMode>,
)
