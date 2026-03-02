import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import RequireAuth from './components/RequireAuth';

const HomePage = lazy(() => import('./pages/HomePage'));
const SectorPage = lazy(() => import('./pages/SectorPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AvaliacoesPage = lazy(() => import('./pages/AvaliacoesPage'));
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));
const CollabProfilePage = lazy(() => import('./pages/CollabProfilePage'));

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
        <Route path="/colaborador/:slug/:id" element={<CollabProfilePage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<RequireAuth><AdminPage /></RequireAuth>} />
        <Route path="/admin/avaliacoes" element={<RequireAuth><AvaliacoesPage /></RequireAuth>} />
        <Route path="/admin/relatorios" element={<RequireAuth><RelatoriosPage /></RequireAuth>} />
      </Routes>
    </Suspense>
  );
}

export default App;
