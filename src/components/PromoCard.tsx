import type { Produto } from '../types';

interface PromoCardProps {
  produto: Produto;
}

export default function PromoCard({ produto }: PromoCardProps) {
  const temDesconto = produto.precoPromocional && produto.precoPromocional < produto.preco;
  const desconto = temDesconto 
    ? Math.round(((produto.preco - produto.precoPromocional!) / produto.preco) * 100)
    : 0;
  const isOferta = produto.tipo === 'oferta';

  return (
    <a 
      href={`/produto/${produto.id}`}
      className="flex flex-col bg-surface-card rounded-xl overflow-hidden no-underline transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:-translate-y-1.25 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/5"
    >
      <div className="relative">
        <img 
          src={produto.imagem} 
          alt={produto.titulo} 
          className="w-full h-32 xs:h-28 xxs:h-26 object-cover block"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {temDesconto && (
          <div className="absolute top-2 right-2 bg-[#e53935] text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{desconto}%
          </div>
        )}
        {isOferta && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            OFERTA
          </div>
        )}
      </div>
      
      <div className="p-2 flex flex-col grow">
        <h3 className="text-white font-roboto text-[0.85rem] xs:text-[0.8rem] xxs:text-[0.75rem] font-semibold mb-2 text-left line-clamp-2">
          {produto.titulo}
        </h3>
        
        <div className="flex flex-col gap-1 mb-2">
          {temDesconto && !isOferta ? (
            <>
              <span className="text-[#6b7c93] text-[0.75rem] xs:text-[0.7rem] xxs:text-[0.65rem] line-through">
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[#4caf50] font-bold text-[1rem] xs:text-[0.9rem] xxs:text-[0.85rem]">
                R$ {produto.precoPromocional?.toFixed(2).replace('.', ',')}
              </span>
            </>
          ) : (
            <span className={isOferta ? "text-orange-400 font-bold text-[1rem] xs:text-[0.9rem] xxs:text-[0.85rem]" : "text-white font-bold text-[1rem] xs:text-[0.9rem] xxs:text-[0.85rem]"}>
              R$ {produto.preco.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        
        <div className="bg-action text-surface-card text-center py-1.5 rounded-lg font-bold text-[0.8rem] xs:text-[0.75rem] xxs:text-[0.7rem] mt-auto transition-colors duration-200 hover:bg-action-hover">
          Ver detalhes
        </div>
      </div>
    </a>
  );
}
