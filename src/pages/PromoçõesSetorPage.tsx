import { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Hero from '../components/layout/Hero';
import Container from '../components/layout/Container';
import SocialSection from '../components/SocialLinks';
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

  useRastrearAcesso();

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
    return <SkeletonLoader />;
  }

  return (
    <PageShell>
      <Hero
        image={setor?.heroImage}
        title={setor?.title || 'Promoções'}
        subtitle="As melhores ofertas para você"
        back={{ to: '/', label: 'Voltar para início' }}
      />

      <Container>
        {produtos.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-surface-card p-8 text-center text-white/70">
            Nenhuma promoção disponível neste setor no momento.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {produtos.map((produto) => (
              <PromoCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </Container>

      <SocialSection subtitle="Compartilhe e acompanhe nossas promoções" showGroup={false} />
    </PageShell>
  );
}
