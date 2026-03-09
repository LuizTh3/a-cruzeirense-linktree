import { useParams, Navigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSetor } from '../hooks/useSetor';
import CollabCard from '../components/CollabCard';
import SocialLinks from '../components/SocialLinks';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SetorPromoCard from '../components/SetorPromoCard';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import { getProdutosPorSetor } from '../services/promocoesService';

export default function SectorPage() {
  const { slug } = useParams<{ slug: string }>();
  const { setor, loading: loadingSetor, error } = useSetor(slug);
  const [temPromocoes, setTemPromocoes] = useState(false);
  const [loadingPromocoes, setLoadingPromocoes] = useState(true);

  useRastrearAcesso(`setor/${slug}`);

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

  if (loadingSetor || loadingPromocoes) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !setor) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="
      relative max-w-120 mx-auto min-h-screen
      bg-container-radial border-x border-white/5
      shadow-lateral flex flex-col
      overflow-x-hidden
    ">
      <Header backgroundImage={setor.heroImage} variant="minimal" />

      <div className="flex-1 px-4 xs:px-3 xxs:px-3 pb-10">

      <div className="relative z-10 -mt-20 text-center w-full px-5 mb-4">
        <h2 className="
          text-[2rem] xs:text-[1.75rem] xxs:text-[1.6rem] font-roboto font-bold text-white
          drop-shadow-[2px_2px_10px_rgba(0,0,0,0.8)]
          mb-1
        ">
          {setor.title}
        </h2>
        <p className="text-[1.3rem] xs:text-[1.1rem] xxs:text-[1rem] text-white drop-shadow-[1px_1px_5px_rgba(0,0,0,0.8)]">
          {setor.subtitle}
        </p>
      </div>

      {temPromocoes && (
        <div className="w-full px-4 xs:px-3 xxs:px-3 mt-4">
          <SetorPromoCard setorSlug={slug!} />
        </div>
      )}

      <p className="
        text-center font-roboto w-full
        pt-8 font-medium text-[1.1rem] opacity-80
      ">
        Fale com um de nossos colaboradores
      </p>

      <div className="flex flex-col gap-3.75 xs:gap-2.5 xxs:gap-2 w-full px-8.5 xs:px-6 xxs:px-5 box-border mt-5">
        {setor.colaboradores.map((colab) => (
          <CollabCard key={colab.id} colaborador={colab} setorTitle={setor.title} setorSlug={setor.slug} />
        ))}
      </div>

      <div className="flex flex-col items-center mt-8 mb-2 font-roboto px-4 xs:px-3 xxs:px-3 w-full">
        <h2 className="text-center font-bold uppercase text-[1.1rem] xs:text-[1rem] xxs:text-[0.9rem] tracking-wider">
          Acesse nossas Redes sociais
        </h2>
        <p className="text-center font-medium text-[0.95rem] opacity-80 mt-1">
          Confira as melhores promoções da cidade
        </p>
      </div>

      <div className="flex flex-col gap-3.75 xs:gap-2.5 xxs:gap-2 w-full px-4 xs:px-3 xxs:px-3 my-5">
        <SocialLinks />
      </div>

      <div className="w-full mt-5 mb-10 px-4 xs:px-3 xxs:px-3">
        <Link
          to="/"
          className="
            flex items-center justify-center w-full py-4.5
            bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
            text-white no-underline rounded-2xl
            font-roboto font-bold uppercase text-[0.85rem] xs:text-[0.8rem] xxs:text-[0.75rem] tracking-[1px]
            border-none transition-all duration-300
            ease-[cubic-bezier(0.25,0.8,0.25,1)]
            hover:brightness-110 hover:-translate-y-0.75
            hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
          "
        >
          Grupo de Clientes (Promoções)
        </Link>
      </div>
      </div>

      <Footer />
    </main>
  );
}
