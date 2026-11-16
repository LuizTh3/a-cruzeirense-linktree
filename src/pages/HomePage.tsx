import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Hero from '../components/layout/Hero';
import Container from '../components/layout/Container';
import SectionHeading from '../components/layout/SectionHeading';
import SectorCard from '../components/SectorCard';
import SocialSection from '../components/SocialLinks';
import PromoCarousel from '../components/PromoCarousel';
import PromoCard from '../components/PromoCard';
import { getSectorCards } from '../services/setoresService';
import { getProdutos } from '../services/promocoesService';
import { getSlides } from '../services/carouselService';
import type { CarouselImage, Produto, CarouselSlide } from '../types';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import { setores } from '../data/setores';

const promoImages: CarouselImage[] = [
  { id: 1, src: '/assets/images/promocoes/promo1.webp', alt: 'Promoção 1' },
  { id: 2, src: '/assets/images/promocoes/promo2.webp', alt: 'Promoção 2' },
  { id: 3, src: '/assets/images/promocoes/promo3.webp', alt: 'Promoção 3' },
];

const sectorCards = getSectorCards();

export default function HomePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);

  useRastrearAcesso();

  useEffect(() => {
    getProdutos()
      .then(setProdutos)
      .catch((error) => console.error('Erro ao buscar promoções:', error));
    getSlides()
      .then(setCarouselSlides)
      .catch((error) => console.error('Erro ao buscar slides:', error));
  }, []);

  // Links do menu como /#setores, vindos de outra página
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Espera o carrossel ocupar seu espaço para não parar no lugar errado
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 500);
    return () => clearTimeout(timer);
  }, []);

  const carouselImages: CarouselImage[] = carouselSlides.length > 0
    ? carouselSlides.map((slide, index) => ({
        id: index + 1,
        src: slide.src,
        alt: slide.alt || `Banner ${index + 1}`,
        href: slide.href,
      }))
    : promoImages;

  const produtosDestaque = useMemo(() => {
    return produtos.filter(p => p.destaque).slice(0, 2);
  }, [produtos]);

  const setoresComPromocoes = useMemo(() => {
    const categoriasComPromocoes = new Set(produtos.map(p => p.categoria).filter(Boolean));
    return setores
      .filter(setor => categoriasComPromocoes.has(setor.slug))
      .map(setor => ({
        slug: setor.slug,
        title: setor.title,
        image: setor.cardImage,
      }));
  }, [produtos]);

  const temDestaques = produtosDestaque.length > 0;

  return (
    <PageShell>
      <Hero
        title="Tudo em um só lugar"
        subtitle="Móveis • Calçados • Confecção • Tecidos • Cama • Mesa • Banho"
      />

      <Container>
        <section
          id="promocoes"
          className={`scroll-mt-6 grid gap-6 ${temDestaques ? 'lg:grid-cols-3 lg:items-start' : ''}`}
        >
          <div className={temDestaques ? 'lg:col-span-2' : 'mx-auto w-full max-w-3xl'}>
            <PromoCarousel images={carouselImages} autoPlayInterval={5000} />
          </div>

          {temDestaques && (
            <div>
              <SectionHeading title="Produtos em destaque" className="mb-3 md:mb-3" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2">
                {produtosDestaque.map((produto) => (
                  <PromoCard key={produto.id} produto={produto} />
                ))}
              </div>
            </div>
          )}
        </section>

        {setoresComPromocoes.length > 0 && (
          <section className="mt-10 lg:mt-14">
            <SectionHeading title="Promoções da semana" subtitle="Escolha um setor para ver as ofertas" />
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
              {setoresComPromocoes.map((setor) => (
                <Link
                  key={setor.slug}
                  to={`/setor/promocoes?setor=${setor.slug}`}
                  className="group flex w-20 shrink-0 flex-col items-center gap-2 md:w-24"
                >
                  <span className="block size-16 overflow-hidden rounded-full border-2 border-action md:size-20">
                    <img
                      src={setor.image}
                      alt=""
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </span>
                  <span className="text-center text-xs font-medium leading-tight text-white md:text-sm">
                    {setor.title.replace('Setor de ', '').replace(', Cama, Mesa', '')}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="setores" className="mt-10 scroll-mt-6 lg:mt-14">
          <SectionHeading title="Nossos setores" subtitle="Acesse e fale com um de nossos colaboradores" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {sectorCards.map((setor) => (
              <SectorCard
                key={setor.slug}
                href={`/setor/${setor.slug}`}
                imgSrc={setor.cardImage}
                imgAlt={setor.title}
                title={setor.title}
                desc={setor.cardDesc}
              />
            ))}
          </div>
        </section>
      </Container>

      <SocialSection />
    </PageShell>
  );
}
