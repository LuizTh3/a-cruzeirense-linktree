import { useEffect, useState } from 'react';
import Header from '../components/Header';
import PromoCard from '../components/PromoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProdutos } from '../services/promocoesService';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import type { Produto } from '../types';

export default function PromocoesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useRastrearAcesso('promocoes');

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await getProdutos();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10">
        <SkeletonLoader />
      </main>
    );
  }

  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center overflow-x-hidden pb-10">
      <Header backgroundImage="/assets/images/promocoes-header.webp" />

      <div className="relative z-10 -mt-20 text-center w-full px-5 mb-4">
        <h2 className="text-[2rem] font-roboto font-bold text-white drop-shadow-[2px_2px_10px_rgba(0,0,0,0.8)] mb-1">
          Promoções
        </h2>
        <p className="text-[1.3rem] text-white drop-shadow-[1px_1px_5px_rgba(0,0,0,0.8)]">
          Os melhores preços você encontra aqui
        </p>
      </div>

      <div className="w-full px-6 grid grid-cols-2 gap-3.75">
        {produtos.map((produto) => (
          <PromoCard key={produto.id} produto={produto} />
        ))}
      </div>

      {produtos.length === 0 && (
        <div className="text-white text-center py-10 opacity-80">
          Nenhuma promoção disponível no momento.
        </div>
      )}
    </main>
  );
}
