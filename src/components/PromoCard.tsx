import { Link } from 'react-router-dom';
import type { Produto } from '../types';
import { cloudinaryUrl } from '../services/cloudinaryService';
import { formatarPreco } from '@/lib/format';

interface PromoCardProps {
  produto: Produto;
}

export default function PromoCard({ produto }: PromoCardProps) {
  const temDesconto = !!produto.precoPromocional && produto.precoPromocional < produto.preco;
  const desconto = temDesconto
    ? Math.round(((produto.preco - produto.precoPromocional!) / produto.preco) * 100)
    : 0;
  const isOferta = produto.tipo === 'oferta';

  return (
    <Link
      to={`/produto/${produto.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface-card transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={cloudinaryUrl(produto.imagem, 500)}
          alt={produto.titulo}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        {temDesconto && (
          <span className="absolute right-2 top-2 rounded-md bg-discount px-2 py-0.5 text-xs font-semibold text-white">
            -{desconto}%
          </span>
        )}
        {isOferta && (
          <span className="absolute left-2 top-2 rounded-md bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
            Oferta
          </span>
        )}
      </div>

      <div className="flex grow flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">{produto.titulo}</h3>

        <div className="mt-2 flex grow flex-col justify-end">
          {temDesconto && !isOferta ? (
            <>
              <span className="text-xs text-white/50 line-through">{formatarPreco(produto.preco)}</span>
              <span className="text-lg font-semibold text-price">{formatarPreco(produto.precoPromocional!)}</span>
            </>
          ) : (
            <span className={isOferta ? 'text-lg font-semibold text-orange-400' : 'text-lg font-semibold text-white'}>
              {formatarPreco(produto.preco)}
            </span>
          )}
        </div>

        <span className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-action text-sm font-semibold text-surface-card transition-colors group-hover:bg-action-hover">
          Ver detalhes
        </span>
      </div>
    </Link>
  );
}
