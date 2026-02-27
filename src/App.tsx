import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const SectorPage = lazy(() => import('./pages/SectorPage'));

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-container-radial flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setor/:slug" element={<SectorPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
