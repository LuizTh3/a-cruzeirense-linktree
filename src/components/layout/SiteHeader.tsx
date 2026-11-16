import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from './Container';

interface SiteHeaderProps {
  back?: { to: string; label: string };
}

/** Cabeçalho compacto (sem imagem) para páginas internas como produto e perfil. */
export default function SiteHeader({ back }: SiteHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-surface-deep/60">
      <Container className="relative flex h-16 items-center justify-center md:h-20">
        {back && (
          <Link
            to={back.to}
            className="absolute left-4 inline-flex items-center gap-1.5 rounded-lg py-2 text-sm text-white/80 transition-colors hover:text-white sm:left-6 lg:left-8"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">{back.label}</span>
            <span className="sm:hidden">Voltar</span>
          </Link>
        )}
        <Link to="/" className="transition-opacity hover:opacity-80">
          <img
            src="/assets/images/ACRUZEIRENSE.png"
            alt="A Cruzeirense Matriz"
            className="h-10 w-auto object-contain md:h-12"
            width={200}
            height={60}
          />
        </Link>
      </Container>
    </header>
  );
}
