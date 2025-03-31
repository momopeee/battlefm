
import { createRoot } from 'react-dom/client'
import { lazy, Suspense } from 'react';
import './index.css'

// Lazy load the main App for better initial load
const App = lazy(() => import('./App.tsx'));

// Create root with loading fallback to prevent layout shift
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="initial-loading">Loading...</div>}>
    <App />
  </Suspense>
);
