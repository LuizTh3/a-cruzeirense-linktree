import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSetor } from '../hooks/useSetor';
import PageShell, { PageLoading } from '../components/layout/PageShell';
import Hero from '../components/layout/Hero';
import Container from '../components/layout/Container';
import SectionHeading from '../components/layout/SectionHeading';
import CollabCard from '../components/CollabCard';
import SocialSection from '../components/SocialLinks';
import SetorPromoCard from '../components/SetorPromoCard';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import { getProdutosPorSetor } from '../services/promocoesService';

export default function SectorPage() {
  const { slug } = useParams<{ slug: string }>();
  const { setor, colaboradores, loading: loadingSetor, error } = useSetor(slug);
  const [temPromocoes, setTemPromocoes] = useState(false);
  const [loadingPromocoes, setLoadingPromocoes] = useState(true);

  useRastrearAcesso();

  useEffect(() => {
    async function verificarPromocoes() {
      if (!slug) return;
      try {
        const produtos = await getProdutosPorSetor(slug);
        setTemPromocoes(produtos.length > 0);
      } catch (error) {
        console.error('Erro ao verificar promoções:', error);
      } finally {
        setLoadingPromocoes(false);
      }
    }
    verificarPromocoes();
  }, [slug]);

  if (error || !setor) {
    return <Navigate to="/" replace />;
  }

  if (loadingSetor || loadingPromocoes) {
    return <PageLoading />;
  }

  return (
    <PageShell>
      <Hero
        image={setor.heroImage}
        title={setor.title}
        subtitle={setor.subtitle}
        back={{ to: '/', label: 'Voltar para início' }}
      />

      <Container>
        {temPromocoes && (
          <div className="mb-10 max-w-xl">
            <SetorPromoCard setorSlug={slug!} />
          </div>
        )}

        <section>
          <SectionHeading
            title="Nossa equipe"
            subtitle={
              slug === 'tecidos'
                ? 'Fale com uma de nossas colaboradoras'
                : 'Fale com um de nossos colaboradores'
            }
          />

          {colaboradores.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-surface-card p-6 text-center text-white/70">
              Nenhum atendente disponível neste setor no momento.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {colaboradores.map((colab) => (
                <CollabCard key={colab.id} colaborador={colab} setorTitle={setor.title} setorSlug={setor.slug} />
              ))}
            </div>
          )}
        </section>
      </Container>

      <SocialSection />
    </PageShell>
  );
}
