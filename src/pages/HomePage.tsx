import Header from '../components/Header';
import SectorCard from '../components/SectorCard';
import SocialLinks from '../components/SocialLinks';
import PromoCarousel from '../components/PromoCarousel';
import { getSectorCards } from '../services/setoresService';
import { promoWhatsAppGroup } from '../constants/socialLinks';
import type { CarouselImage } from '../types';

const promoImages: CarouselImage[] = [
  { id: 1, src: '/assets/images/promocoes/promo1.png', alt: 'Promoção 1' },
  { id: 2, src: '/assets/images/promocoes/promo2.png', alt: 'Promoção 2' },
  { id: 3, src: '/assets/images/promocoes/promo3.jpeg', alt: 'Promoção 3' },
];

const sectorCards = getSectorCards();

export default function HomePage() {
  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center gap-4 overflow-x-hidden pb-10">
      <Header />

      <div className="relative z-10 -mt-20 text-center w-full px-5 mb-4">
        <h2 className="text-[2rem] font-roboto font-bold text-white drop-shadow-[2px_2px_10px_rgba(0,0,0,0.8)] mb-1">
          Tudo em um só lugar!
        </h2>
        <p className="text-[1.3rem] text-white drop-shadow-[1px_1px_5px_rgba(0,0,0,0.8)]">
          Móveis • Calçados • Roupas • Tecidos
        </p>
      </div>

      <div className="w-full px-6">
        <PromoCarousel images={promoImages} autoPlayInterval={3500} />
      </div>

      <div className="w-full px-6 text-left mt-4">
        <h2 className="font-roboto font-black uppercase text-[1.5rem] tracking-[1px] text-white">
          Nossos setores
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

      <div className="flex flex-col items-center mt-5 mb-2 font-roboto">
        <h2 className="text-center font-bold uppercase text-[1.1rem] tracking-wider">
          Acesse nossas Redes sociais
        </h2>
      </div>

      <p className="text-center font-medium text-[0.95rem] opacity-80">
        CONFIRA AS MELHORES PROMOÇÕES DA CIDADE
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
    </main>
  );
}
