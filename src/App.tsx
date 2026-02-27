// src/App.tsx
import './index.css';
import Header from './components/Header';
import SectorCard from './components/SectorCard';
import SocialPill from './components/SocialPill'
// 1. Importando o Carrossel e a Interface de Imagem
import PromoCarousel, { type CarouselImage } from './components/PromoCarousel'; 


interface Sector {
  id: number;
  href: string;
  imgSrc: string;
  title: string;
  tags: string;
  desc: string;
}

const promoImages: CarouselImage[] = [
  { id: 1, src: "/assets/images/promocoes/promo1.png", alt: "Promoção 1" },
  { id: 2, src: "/assets/images/promocoes/promo2.png", alt: "Promoção 2" },
  { id: 3, src: "/assets/images/promocoes/promo3.jpeg", alt: "Promoção 3" },
];

const setores: Sector[] = [
  { id: 1, href: "/pages/moveis&eletro.html", imgSrc: "/assets/images/cards-setores/moveis.jpeg", title: "Setor de móveis", tags: "Modern . Design . practicality .", desc: "Transforme sua casa com móveis que unem conforto e sofisticação." },
  { id: 2, href: "/pages/confeccao&calcados.html", imgSrc: "/assets/images/cards-setores/calcados.png", title: "Confecção e Calçados", tags: "Estilo . Conforto . Moda .", desc: "Encontre as melhores peças para renovar o seu guarda-roupa." },
  { id: 3, href: "/pages/tercidos.html", imgSrc: "/assets/images/cards-setores/tecidos.jpeg", title: "Tecidos, Cama, Mesa", tags: "Comfort . Softness . Elegance .", desc: "Detalhes que transformam sua casa em um verdadeiro refúgio." },
  { id: 4, href: "/pages/pagamento&fatura.html", imgSrc: "/assets/images/cards-setores/financeiro.jpg", title: "Pagamentos de faturas", tags: "Dialogue . Value . Precision .", desc: "Comodidade e organização para facilitar seu dia a dia no pagamento de faturas." },
  { id: 5, href: "/pages/negociacoes.html", imgSrc: "/assets/images/cards-setores/negociacao.jpg", title: "Crediarios e negociações", tags: "Agreement . Planning . Growth .", desc: "Soluções justas para reorganizar suas finanças com tranquilidade." }
];

function App() {
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

      {/* 3. Inserindo o Componente Carrossel */}
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
        {setores.map((setor) => (
          <SectorCard 
            key={setor.id}
            href={setor.href}
            imgSrc={setor.imgSrc}
            imgAlt={setor.title}
            title={setor.title}
            tags={setor.tags}
            desc={setor.desc}
          />
        ))}
      </div>

      <div className="flex flex-col items-center mt-5 mb-2 font-roboto">
        {/* Título */}
        <h2 className="text-center font-bold uppercase text-[1.1rem] tracking-wider">
          Acesse nossas Redes sociais
        </h2>
      </div>
      
      {/* Subtítulo */}
      <p className="text-center font-medium text-[0.95rem] opacity-80">
        Confira as melhores promoções da cidade
      </p>

      <div className="flex flex-col gap-3.75 w-full px-6 my-6.25">
        
        <SocialPill 
          href="https://wa.me/seunumerodeexemplo" 
          iconClass="fa-brands fa-whatsapp text-[#25D366]" 
          label="Fale conosco no WhatsApp" 
        />
        
        <SocialPill 
          href="https://instagram.com/seuperfil" 
          iconClass="fa-brands fa-instagram text-[#E1306C]" 
          label="Siga nosso Instagram" 
        />
        
        <SocialPill 
          href="https://facebook.com/suapagina" 
          iconClass="fa-brands fa-facebook text-[#1877F2]" 
          label="Curta nossa página" 
        />
        
      </div>

      <div className="w-full mt-7.5 mb-10 px-6">
        <a 
          href="/" 
          className="flex items-center justify-center w-full py-4.5 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-[#ffffff] no-underline rounded-2xl font-roboto font-bold uppercase text-[0.85rem] tracking-[1px] border-none transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:brightness-110 hover:-translate-y-0.75 hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]"
        >
          <span className="w-auto mr-0 text-center">
            Grupo de Clientes (Promoções)
          </span>
        </a>
      </div>

    </main>
  );
}

export default App;