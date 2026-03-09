import { useEffect, useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SocialLinks from '../components/SocialLinks';
import PromoCard from '../components/PromoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProdutosPorSetor } from '../services/promocoesService';
import { getSetorBySlug } from '../data/setores';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import type { Produto } from '../types';

export default function PromoçõesSetorPage() {
  const [searchParams] = useSearchParams();
  const setorSlug = searchParams.get('setor');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const setor = setorSlug ? getSetorBySlug(setorSlug) : undefined;

  useRastrearAcesso(`setor/promocoes?setor=${setorSlug}`);

  useEffect(() => {
    async function fetchProdutos() {
      if (!setorSlug) return;
      try {
        const data = await getProdutosPorSetor(setorSlug);
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, [setorSlug]);

  if (!setorSlug) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10">
        <SkeletonLoader />
      </main>
    );
  }

  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col overflow-x-hidden">
      <Header backgroundImage={setor?.heroImage || '/assets/images/promocoes-header.webp'} variant="minimal" />

      <div className="flex-1 px-6 pb-10">

      <div className="relative z-10 -mt-20 text-center w-full px-5 mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-2"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Voltar para início
        </Link>
        <h2 className="text-[2rem] font-roboto font-bold text-white drop-shadow-[2px_2px_10px_rgba(0,0,0,0.8)] mb-1">
          {setor?.title || 'Promoções'}
        </h2>
        <p className="text-[1.3rem] text-white drop-shadow-[1px_1px_5px_rgba(0,0,0,0.8)]">
          As melhores ofertas para você
        </p>
      </div>

      <div className="w-full px-6 grid grid-cols-2 gap-3.75">
        {produtos.map((produto) => (
          <PromoCard key={produto.id} produto={produto} />
        ))}
      </div>

      {produtos.length === 0 && (
        <div className="text-white text-center py-10 opacity-80">
          Nenhuma promoção disponível neste setor no momento.
        </div>
      )}

      <div className="flex flex-col items-center mt-8 mb-2 font-roboto px-6 w-full">
        <h2 className="text-center font-bold uppercase text-[1.1rem] tracking-wider">
          Acesse nossas Redes sociais
        </h2>
        <p className="text-center font-medium text-[0.95rem] opacity-80 mt-1">
          Compartilhe e acompanhe nossas promoções
        </p>
      </div>

      <div className="flex flex-col gap-3.75 w-full px-6 my-5">
        <SocialLinks />
      </div>
      </div>

      <Footer />
    </main>
  );
}
