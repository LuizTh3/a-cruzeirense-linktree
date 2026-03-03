import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SidebarMenu from '../components/SidebarMenu';
import PromoCard from '../components/PromoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getProdutoById, getProdutosRelacionados } from '../services/promocoesService';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import { promoWhatsAppGroup } from '../constants/socialLinks';
import type { Produto } from '../types';

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | undefined>(undefined);
  const [relacionados, setRelacionados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useRastrearAcesso(`produto/${id}`);

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

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10">
        <SkeletonLoader />
      </main>
    );
  }

  if (!produto) {
    return <Navigate to="/promocoes" replace />;
  }

  const temDesconto = produto.precoPromocional && produto.precoPromocional < produto.preco;
  const desconto = temDesconto 
    ? Math.round(((produto.preco - produto.precoPromocional!) / produto.preco) * 100)
    : 0;

  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center overflow-x-hidden pb-10">
      <Header variant="minimal" />
      <SidebarMenu variant="minimal" />

      <div className="w-full px-6 mt-4">
        <Link
          to="/promocoes"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-4"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Voltar para promoções
        </Link>
      </div>

      <div className="w-full px-6">
        <div className="bg-surface-card rounded-xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.25)] border border-white/5">
          <img 
            src={produto.imagem} 
            alt={produto.titulo} 
            className="w-full h-64 object-contain bg-[#0a1628]"
            fetchPriority="high"
          />
          
          <div className="p-5">
            {temDesconto && (
              <div className="inline-block bg-[#e53935] text-white text-xs font-bold px-3 py-1 rounded-lg mb-3">
                {desconto}% DE DESCONTO
              </div>
            )}
            
            <h1 className="text-white font-roboto text-[1.5rem] font-bold mb-3">
              {produto.titulo}
            </h1>
            
            <div className="flex items-center gap-3 mb-4">
              {temDesconto ? (
                <>
                  <span className="text-[#4caf50] font-bold text-[1.8rem]">
                    R$ {produto.precoPromocional?.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[#6b7c93] text-[1rem] line-through">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </span>
                </>
              ) : (
                <span className="text-white font-bold text-[1.8rem]">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>
            
            <p className="text-[#d1d9e2] text-[0.95rem] leading-[1.5] mb-6">
              {produto.descricao}
            </p>
            
            <a
              href={promoWhatsAppGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white no-underline rounded-xl font-roboto font-bold text-[1rem] transition-all duration-300 hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              Comprar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="w-full px-6 mt-8">
          <h2 className="text-white font-roboto text-[1.3rem] font-bold mb-4">
            Produtos Relacionados
          </h2>
          
          <div className="grid grid-cols-2 gap-3.75">
            {relacionados.map((prod) => (
              <PromoCard key={prod.id} produto={prod} />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
