import { useEffect, useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectorCard from '../components/SectorCard';
import SocialLinks from '../components/SocialLinks';
import PromoCarousel from '../components/PromoCarousel';
import PromoCard from '../components/PromoCard';
import { getSectorCards } from '../services/setoresService';
import { getProdutos } from '../services/promocoesService';
import { getSlides } from '../services/carouselService';
import { promoWhatsAppGroup } from '../constants/socialLinks';
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

  useRastrearAcesso('home');

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await getProdutos();
        setProdutos(data);
      } catch (error) {
        console.error('Erro ao buscar promoções:', error);
      }
    }
    fetchProdutos();
  }, []);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const data = await getSlides();
        setCarouselSlides(data);
      } catch (error) {
        console.error('Erro ao buscar slides:', error);
      }
    }
    fetchSlides();
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
  
  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col overflow-x-hidden">
      <Header />

      <div className="flex-1 px-6 pb-10">

      <div className="relative z-10 -mt-20 text-center w-full px-5 mb-4">
        <h2 className="text-[2rem] font-roboto font-bold text-white drop-shadow-[2px_2px_10px_rgba(0,0,0,0.8)] mb-1">
          Tudo em um só lugar!
        </h2>
        <p className="text-[1.3rem] text-white drop-shadow-[1px_1px_5px_rgba(0,0,0,0.8)]">
          Móveis • Calçados • Roupas • Tecidos
        </p>
      </div>

      <div className="w-full px-6" id="promocoes">
        <PromoCarousel images={carouselImages} autoPlayInterval={3500} />
      </div>

      {produtosDestaque.length > 0 && (
        <div className="w-full px-6 mt-4">
          <h3 className="text-white font-roboto font-bold text-lg mb-3">
            <i className="fa-solid fa-star text-yellow-400 mr-2"></i>
            Promoções em Destaque
          </h3>
          <div className="grid grid-cols-2 gap-3.75">
            {produtosDestaque.map((produto) => (
              <PromoCard key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      )}

      {setoresComPromocoes.length > 0 && (
        <div className="w-full px-6 mt-4">
          <h3 className="text-white font-roboto font-bold text-lg mb-3">
            <i className="fa-solid fa-layer-group mr-2"></i>
            Promoções e Ofertas!
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {setoresComPromocoes.map((setor) => (
              <a
                key={setor.slug}
                href={`/setor/promocoes?setor=${setor.slug}`}
                className="shrink-0 flex flex-col items-center gap-2 no-underline"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <img
                    src={setor.image}
                    alt={setor.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white text-xs text-center font-medium whitespace-nowrap">
                  {setor.title.replace('Setor de ', '').replace(', Cama, Mesa', '')}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="w-full px-6 text-left mt-4" id="setores">
        <h2 className="font-roboto font-black text-[1.5rem] tracking-[1px] text-white">
          Nossos Setores
        </h2>
        <p className="font-medium text-[1.1rem] opacity-80 mb-2 text-white">
          Acesse e fale com um de nossos colaboradores
        </p>
      </div>

      <div className="w-full px-6 grid grid-cols-2 gap-3.75">
        {sectorCards.map((setor) => (
          <SectorCard
            key={setor.slug}
            href={`/setor/${setor.slug}`}
            imgSrc={setor.cardImage}
            imgAlt={setor.title}
            title={setor.title}
            tags={setor.cardTags}
            desc={setor.cardDesc}
          />
        ))}
      </div>

      <div className="flex flex-col items-center mt-5 mb-2 font-roboto" id="redes-sociais">
        <h2 className="text-center font-bold uppercase text-[1.1rem] tracking-wider">
          Acesse nossas Redes sociais
        </h2>
      </div>

      <p className="text-center font-medium text-[0.95rem] opacity-80">
        Configure as melhores promoções da cidade
      </p>

      <div className="flex flex-col gap-3.75 w-full px-6 my-2">
        <SocialLinks />
      </div>

      <div className="w-full mt-4 mb-10 px-6">
        <a
          href={promoWhatsAppGroup}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-4.5 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white no-underline rounded-2xl font-roboto font-bold uppercase text-[0.85rem] tracking-[1px] border-none transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:brightness-110 hover:-translate-y-0.75 hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]"
        >
          Grupo de Clientes (Promoções)
        </a>
      </div>
      </div>

      <Footer />
    </main>
  );
}
