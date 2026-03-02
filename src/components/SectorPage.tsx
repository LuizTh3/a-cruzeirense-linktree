// src/pages/SectorPage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { getSetorBySlug } from '../data/setores';
import CollabCard from '../components/CollabCard';
import SocialPill from '../components/SocialPill';
import Header from '../components/Header';

export default function SectorPage() {
  // Pega o slug da URL: /setor/confeccao → slug = "confeccao"
  const { slug } = useParams<{ slug: string }>();

  // Busca os dados do setor pelo slug
  const setor = getSetorBySlug(slug ?? '');

  // Se o slug não existir nos dados, redireciona para a home
  if (!setor) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="
      relative max-w-120 mx-auto min-h-screen
      bg-container-radial border-x border-white/5
      shadow-lateral flex flex-col items-center
      overflow-x-hidden pb-10
    ">

      <div
        className="relative w-full min-h-70 flex flex-col justify-end items-center"
        style={{
          background: `
            linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%),
            url('${setor.heroImage}')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      >

        <Header />
      </div>

      {/* ── TÍTULO DO SETOR ───────────────────────────────────────────────── */}
      <div className="relative z-10 -mt-20 text-center w-full px-5 mb-4">
        <h2 className="
          text-[2rem] font-roboto font-bold text-white
          drop-shadow-[2px_2px_10px_rgba(0,0,0,0.8)]
          mb-1
        ">
          {setor.title}
        </h2>
        <p className="text-[1.3rem] text-white drop-shadow-[1px_1px_5px_rgba(0,0,0,0.8)]">
          {setor.subtitle}
        </p>
      </div>

      {/* ── SUBTÍTULO DA LISTA ────────────────────────────────────────────── */}
      <p className="
        text-center font-roboto w-full
        pt-8 font-medium text-[1.1rem] opacity-80
      ">
        Fale com um de nossos colaboradores
      </p>

      {/* ── LISTA DE COLABORADORES ────────────────────────────────────────── */}
      <div className="flex flex-col gap-3.75 w-full px-8.5 box-border mt-5">
        {setor.colaboradores.map((colab) => (
          <CollabCard key={colab.id} colaborador={colab} />
        ))}
      </div>

      {/* ── RODAPÉ SOCIAL ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center mt-8 mb-2 font-roboto px-6 w-full">
        <h2 className="text-center font-bold uppercase text-[1.1rem] tracking-wider">
          Acesse nossas Redes sociais
        </h2>
        <p className="text-center font-medium text-[0.95rem] opacity-80 mt-1">
          Confira as melhores promoções da cidade
        </p>
      </div>

      <div className="flex flex-col gap-3.75 w-full px-6 my-5">
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

      <div className="w-full mt-5 mb-10 px-6">
        <a href="/"
          className="
            flex items-center justify-center w-full py-4.5
            bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
            text-white no-underline rounded-2xl
            font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
            border-none transition-all duration-300
            ease-[cubic-bezier(0.25,0.8,0.25,1)]
            hover:brightness-110 hover:-translate-y-0.75
            hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
          "
        >
          Grupo de Clientes (Promoções)
        </a>
      </div>

    </main>
  );
}