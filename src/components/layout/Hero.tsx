import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Container from './Container';
import { temPromocaoAtiva } from '../../services/promocoesService';

interface HeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  back?: { to: string; label: string };
}

const promocoesLink = { href: '/#promocoes', label: 'Promoções' };

const navLinksFixos = [
  { href: '/#setores', label: 'Setores' },
  { href: '/#redes-sociais', label: 'Redes sociais' },
];

export default function Hero({ title, subtitle, image = '/assets/images/header.webp', back }: HeroProps) {
  const [temPromocao, setTemPromocao] = useState(false);

  useEffect(() => {
    let ativo = true;
    temPromocaoAtiva().then((resultado) => {
      if (ativo) setTemPromocao(resultado);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const navLinks = temPromocao ? [promocoesLink, ...navLinksFixos] : navLinksFixos;

  return (
    <header className="relative isolate">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.55) 100%), url('${image}')`,
          WebkitMaskImage: 'linear-gradient(to bottom, black 62%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 62%, transparent 100%)',
        }}
      />

      <Container className="flex min-h-72 flex-col md:min-h-80 lg:min-h-96">
        <div className="flex items-center justify-center py-4 md:justify-between md:py-5">
          <Link to="/" className="shrink-0 transition-opacity hover:opacity-80">
            <img
              src="/assets/images/ACRUZEIRENSE.png"
              alt="A Cruzeirense Matriz"
              className="h-11 w-auto object-contain md:h-12 lg:h-14"
              loading="eager"
              fetchPriority="high"
              width={200}
              height={60}
            />
          </Link>

          <nav
            aria-label="Principal"
            className="hidden items-center gap-0.5 rounded-full border border-white/15 bg-surface-deep/75 p-1 shadow-lg shadow-black/20 backdrop-blur-md md:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-action"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-auto pb-12 text-center md:pb-16">
          {back && (
            <Link
              to={back.to}
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              {back.label}
            </Link>
          )}
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-base text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </header>
  );
}
