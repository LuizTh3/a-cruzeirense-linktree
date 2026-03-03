import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import RequireAuth from './components/RequireAuth';
import SkeletonLoader from './components/SkeletonLoader';

const HomePage = lazy(() => import('./pages/HomePage'));
const SectorPage = lazy(() => import('./pages/SectorPage'));
const PromoçõesSetorPage = lazy(() => import('./pages/PromoçõesSetorPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AvaliacoesPage = lazy(() => import('./pages/AvaliacoesPage'));
const RelatoriosPage = lazy(() => import('./pages/RelatoriosPage'));
const CollabProfilePage = lazy(() => import('./pages/CollabProfilePage'));
const ProdutoPage = lazy(() => import('./pages/ProdutoPage'));
const GerenciarPromocoesPage = lazy(() => import('./pages/GerenciarPromocoesPage'));

function App() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setor/promocoes" element={<PromoçõesSetorPage />} />
        <Route path="/setor/:slug" element={<SectorPage />} />
        <Route path="/colaborador/:slug/:id" element={<CollabProfilePage />} />
        <Route path="/produto/:id" element={<ProdutoPage />} />
        <Route path="/admin" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<RequireAuth><AdminPage /></RequireAuth>} />
        <Route path="/admin/avaliacoes" element={<RequireAuth><AvaliacoesPage /></RequireAuth>} />
        <Route path="/admin/relatorios" element={<RequireAuth><RelatoriosPage /></RequireAuth>} />
        <Route path="/admin/promocoes" element={<RequireAuth><GerenciarPromocoesPage /></RequireAuth>} />
      </Routes>
    </Suspense>
  );
}

export default App;
