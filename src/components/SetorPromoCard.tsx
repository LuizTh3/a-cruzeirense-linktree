import { Link } from 'react-router-dom';
import { ChevronRight, Tags } from 'lucide-react';

interface SetorPromoCardProps {
  setorSlug: string;
}

export default function SetorPromoCard({ setorSlug }: SetorPromoCardProps) {
  return (
    <Link
      to={`/setor/promocoes?setor=${setorSlug}`}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-card px-4 py-3.5 transition-colors hover:border-white/25 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-action text-surface-card">
        <Tags className="size-5" />
      </span>
      <span className="grow">
        <span className="block font-semibold text-white">Promoções e ofertas</span>
        <span className="block text-sm text-white/65">Veja os produtos em destaque deste setor</span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-white/40" />
    </Link>
  );
}
