import { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PromoCard from '../components/PromoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProdutoById, getProdutosRelacionados } from '../services/promocoesService';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import { useRastrearWhatsApp } from '../hooks/useRastrearWhatsApp';
import { setores } from '../data/setores';
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

  const colaboradores = useMemo(() => {
    if (!produto?.categoria) return [];
    const setorSlug = categoriaParaSetor[produto.categoria];
    const setor = setores.find(s => s.slug === setorSlug);
    return setor?.colaboradores || [];
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
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10">
        <SkeletonLoader />
      </main>
    );
  }

  if (!produto) {
    return <Navigate to="/" replace />;
  }

  const temDesconto = produto.precoPromocional && produto.precoPromocional < produto.preco;
  const desconto = temDesconto 
    ? Math.round(((produto.preco - produto.precoPromocional!) / produto.preco) * 100)
    : 0;

  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col overflow-x-hidden">
      <Header variant="minimal" />

      <div className="flex-1 px-4 xs:px-3 xxs:px-3 pb-10">

      <div className="w-full px-4 xs:px-3 xxs:px-3 mt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-4"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Voltar para início
        </Link>
      </div>

      <div className="w-full px-4 xs:px-3 xxs:px-3">
        <div className="bg-surface-card rounded-xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.25)] border border-white/5">
          <img 
            src={produto.imagem} 
            alt={produto.titulo} 
            className="w-full h-64 xs:h-56 xxs:h-48 object-contain bg-[#0a1628]"
            fetchPriority="high"
          />
          
          <div className="p-5">
            {temDesconto && (
              <div className="inline-block bg-[#e53935] text-white text-xs font-bold px-3 py-1 rounded-lg mb-3">
                {desconto}% DE DESCONTO
              </div>
            )}
            
            <h1 className="text-white font-roboto text-[1.5rem] xs:text-[1.3rem] xxs:text-[1.2rem] font-bold mb-3">
              {produto.titulo}
            </h1>
            
            <div className="flex flex-col gap-1 mb-4">
              {temDesconto ? (
                <>
                  <span className="text-[#6b7c93] text-[1rem] xs:text-[0.9rem] xxs:text-[0.85rem] line-through">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[#4caf50] font-bold text-[1.8rem] xs:text-[1.6rem] xxs:text-[1.4rem]">
                    R$ {produto.precoPromocional?.toFixed(2).replace('.', ',')}
                  </span>
                </>
              ) : (
                <span className="text-white font-bold text-[1.8rem] xs:text-[1.6rem] xxs:text-[1.4rem]">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            
            {!mostrarAtendentes ? (
              <button
                onClick={() => setMostrarAtendentes(true)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white no-underline rounded-xl font-roboto font-bold text-[1rem] xs:text-[0.9rem] xxs:text-[0.85rem] transition-all duration-300 hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]"
              >
                <i className="fa-brands fa-whatsapp text-xl"></i>
                Comprar pelo WhatsApp
              </button>
            ) : (
              <div className="mt-2">
                <p className="text-white text-sm mb-3 font-medium">
                  Selecione um atendente:
                </p>
                <div className="grid grid-cols-2 gap-3 xs:gap-2 xxs:gap-2 max-h-48 xs:max-h-40 xxs:max-h-36 overflow-y-auto">
                  {colaboradores
                    .filter(colab => colab.whatsappHref && colab.whatsappHref !== '#')
                    .map((colaborador) => (
                      <button
                        key={colaborador.id}
                        onClick={() => handleWhatsAppClick(colaborador)}
                        className="flex items-center gap-2 xs:gap-1.5 p-3 xs:p-2 xxs:p-2 bg-[#1a2d4a] rounded-lg hover:bg-[#2a3d5a] transition-colors text-left"
                      >
                        <img
                          src={colaborador.avatarSrc}
                          alt={colaborador.nome}
                          className="w-12 h-12 xs:w-10 xs:h-10 xxs:w-9 xxs:h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium text-sm xs:text-xs xxs:text-xs">{colaborador.nome}</p>
                          <p className="text-white/60 text-xs">{colaborador.cargo}</p>
                        </div>
                      </button>
                    ))}
                </div>
                <button
                  onClick={() => setMostrarAtendentes(false)}
                  className="mt-3 text-white/60 text-sm hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="w-full px-4 xs:px-3 xxs:px-3 mt-8">
          <h2 className="text-white font-roboto text-[1.3rem] xs:text-[1.2rem] xxs:text-[1.1rem] font-bold mb-4">
            Produtos Relacionados
          </h2>
          
          <div className="grid grid-cols-2 gap-3.75 xs:gap-2.5 xxs:gap-2">
            {relacionados.map((prod) => (
              <PromoCard key={prod.id} produto={prod} />
            ))}
          </div>
        </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
