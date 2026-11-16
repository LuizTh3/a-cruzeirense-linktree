import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import SiteHeader from '../components/layout/SiteHeader';
import Container from '../components/layout/Container';
import SectionHeading from '../components/layout/SectionHeading';
import PromoCard from '../components/PromoCard';
import { formatarPreco } from '@/lib/format';
import { Button } from '@/components/ui/button';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProdutoById, getProdutosRelacionados } from '../services/promocoesService';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import { useRastrearWhatsApp } from '../hooks/useRastrearWhatsApp';
import { getColaboradoresDoSetor } from '../services/colaboradoresService';
import { cloudinaryUrl } from '../services/cloudinaryService';
import type { Produto, Colaborador } from '../types';

const categoriaParaSetor: Record<string, string> = {
  'moveis': 'moveis',
  'calcados': 'confeccao',
  'confeccao': 'confeccao',
  'tecidos': 'tecidos',
};

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | undefined>(undefined);
  const [relacionados, setRelacionados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarAtendentes, setMostrarAtendentes] = useState(false);

  useRastrearAcesso();
  const { rastrearClique } = useRastrearWhatsApp();

  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);

  useEffect(() => {
    const setorSlug = produto?.categoria ? categoriaParaSetor[produto.categoria] : undefined;
    if (!setorSlug) {
      setColaboradores([]);
      return;
    }

    let cancelado = false;
    getColaboradoresDoSetor(setorSlug)
      .then((lista) => {
        if (!cancelado) setColaboradores(lista);
      })
      .catch((error) => {
        console.error('Erro ao buscar atendentes:', error);
        if (!cancelado) setColaboradores([]);
      });

    return () => {
      cancelado = true;
    };
  }, [produto?.categoria]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      try {
        const produtoData = await getProdutoById(id);
        setProduto(produtoData);
        
        if (produtoData?.categoria) {
          const relacionadosData = await getProdutosRelacionados(produtoData.categoria, id);
          setRelacionados(relacionadosData);
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleWhatsAppClick = (colaborador: Colaborador) => {
    const mensagem = encodeURIComponent(
      `Olá! Tenho interesse em saber mais sobre o produto ${produto?.titulo}. Pode me passar mais informações?`
    );
    
    let whatsappUrl: string;
    if (colaborador.whatsappHref?.includes('wa.me')) {
      whatsappUrl = `${colaborador.whatsappHref}?text=${mensagem}`;
    } else {
      whatsappUrl = `https://wa.me/${colaborador.whatsappHref}?text=${mensagem}`;
    }
    
    const setor = produto?.categoria ? categoriaParaSetor[produto.categoria] || 'promocoes' : 'promocoes';
    const tipo = produto?.precoPromocional ? 'promocao' : 'oferta';
    rastrearClique(setor, tipo);
    
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!produto) {
    return <Navigate to="/" replace />;
  }

  const temDesconto = !!produto.precoPromocional && produto.precoPromocional < produto.preco;
  const desconto = temDesconto
    ? Math.round(((produto.preco - produto.precoPromocional!) / produto.preco) * 100)
    : 0;
  const atendentes = colaboradores.filter((colab) => colab.whatsappHref && colab.whatsappHref !== '#');

  return (
    <PageShell>
      <SiteHeader back={{ to: '/', label: 'Voltar para início' }} />

      <Container className="mt-6 lg:mt-10">
        <div className="grid gap-6 overflow-hidden rounded-xl border border-white/10 bg-surface-card md:grid-cols-2 md:gap-0">
          <div className="flex items-center justify-center bg-surface-deep">
            <img
              src={cloudinaryUrl(produto.imagem, 900)}
              alt={produto.titulo}
              className="max-h-80 w-full object-contain md:max-h-[32rem]"
              fetchPriority="high"
            />
          </div>

          <div className="flex flex-col p-5 md:p-8">
            {temDesconto && (
              <span className="mb-3 w-fit rounded-md bg-discount px-2.5 py-1 text-xs font-semibold text-white">
                {desconto}% de desconto
              </span>
            )}

            <h1 className="text-balance text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {produto.titulo}
            </h1>

            <div className="mt-4 flex flex-col">
              {temDesconto ? (
                <>
                  <span className="text-base text-white/50 line-through">{formatarPreco(produto.preco)}</span>
                  <span className="text-3xl font-semibold text-price md:text-4xl">
                    {formatarPreco(produto.precoPromocional!)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-semibold text-white md:text-4xl">{formatarPreco(produto.preco)}</span>
              )}
            </div>

            <div className="mt-6 md:mt-auto md:pt-8">
              {!mostrarAtendentes ? (
                <Button
                  size="xl"
                  className="w-full bg-whatsapp text-white hover:bg-whatsapp-hover"
                  onClick={() => setMostrarAtendentes(true)}
                >
                  <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
                  Comprar pelo WhatsApp
                </Button>
              ) : (
                <div>
                  <p className="mb-3 text-sm font-medium text-white">Selecione um atendente:</p>
                  {atendentes.length === 0 ? (
                    <p className="rounded-lg bg-surface-raised p-3 text-sm text-white/70">
                      Nenhum atendente disponível no momento.
                    </p>
                  ) : (
                    <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                      {atendentes.map((colaborador) => (
                        <button
                          key={colaborador.id}
                          onClick={() => handleWhatsAppClick(colaborador)}
                          className="flex items-center gap-3 rounded-lg bg-surface-raised p-2.5 text-left transition-colors hover:bg-white/15"
                        >
                          <img
                            src={cloudinaryUrl(colaborador.avatarSrc, 120)}
                            alt=""
                            className="size-11 shrink-0 rounded-full object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-white">{colaborador.nome}</span>
                            <span className="block truncate text-xs text-white/60">{colaborador.cargo}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" size="lg" className="mt-3" onClick={() => setMostrarAtendentes(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-10 lg:mt-14">
            <SectionHeading title="Produtos relacionados" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
              {relacionados.map((prod) => (
                <PromoCard key={prod.id} produto={prod} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </PageShell>
  );
}
