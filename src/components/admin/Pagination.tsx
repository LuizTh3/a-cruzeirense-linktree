import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  paginaAtual: number;
  totalPaginas: number;
  onChange: (pagina: number) => void;
}

function intervalo(paginaAtual: number, totalPaginas: number): (number | '...')[] {
  if (totalPaginas <= 5) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  if (paginaAtual <= 3) return [1, 2, 3, 4, '...', totalPaginas];
  if (paginaAtual >= totalPaginas - 2) {
    return [1, '...', totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
  }
  return [1, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas];
}

export default function Pagination({ paginaAtual, totalPaginas, onChange }: PaginationProps) {
  if (totalPaginas <= 1) return null;

  const irPara = (pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    onChange(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav aria-label="Paginação" className="mt-6 flex flex-col items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-lg"
          aria-label="Página anterior"
          disabled={paginaAtual === 1}
          onClick={() => irPara(paginaAtual - 1)}
        >
          <ChevronLeft />
        </Button>

        {intervalo(paginaAtual, totalPaginas).map((pagina, index) =>
          pagina === '...' ? (
            <span key={`gap-${index}`} className="px-1 text-white/40">
              …
            </span>
          ) : (
            <Button
              key={pagina}
              variant={pagina === paginaAtual ? 'secondary' : 'outline'}
              size="icon-lg"
              aria-current={pagina === paginaAtual ? 'page' : undefined}
              onClick={() => irPara(pagina)}
            >
              {pagina}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon-lg"
          aria-label="Próxima página"
          disabled={paginaAtual === totalPaginas}
          onClick={() => irPara(paginaAtual + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
      <p className="text-xs text-white/50">
        Página {paginaAtual} de {totalPaginas}
      </p>
    </nav>
  );
}
