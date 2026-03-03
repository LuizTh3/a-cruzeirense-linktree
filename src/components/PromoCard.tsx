import type { Produto } from '../types';

interface PromoCardProps {
  produto: Produto;
}

export default function PromoCard({ produto }: PromoCardProps) {
  const temDesconto = produto.precoPromocional && produto.precoPromocional < produto.preco;
  const desconto = temDesconto 
    ? Math.round(((produto.preco - produto.precoPromocional!) / produto.preco) * 100)
    : 0;

  return (
    <a 
      href={`/produto/${produto.id}`}
      className="flex flex-col bg-surface-card rounded-xl overflow-hidden no-underline transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:-translate-y-1.25 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/5"
    >
      <div className="relative">
        <img 
          src={produto.imagem} 
          alt={produto.titulo} 
          className="w-full h-40 object-cover block"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {temDesconto && (
          <div className="absolute top-2 right-2 bg-[#e53935] text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{desconto}%
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col grow">
        <h3 className="text-white font-roboto text-[1rem] font-semibold mb-2 text-left line-clamp-2">
          {produto.titulo}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          {temDesconto ? (
            <>
              <span className="text-[#4caf50] font-bold text-[1.1rem]">
                R$ {produto.precoPromocional?.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[#6b7c93] text-[0.8rem] line-through">
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </span>
            </>
          ) : (
            <span className="text-white font-bold text-[1.1rem]">
              R$ {produto.preco.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        
        <div className="bg-action text-surface-card text-center py-2 rounded-lg font-bold text-[0.9rem] mt-auto transition-colors duration-200 hover:bg-action-hover">
          Ver detalhes
        </div>
      </div>
    </a>
  );
}
