import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Colaborador } from '../types';
import { cloudinaryUrl } from '../services/cloudinaryService';
import { useRastrearWhatsApp } from '../hooks/useRastrearWhatsApp';

interface CollabCardProps {
  colaborador: Colaborador;
  setorTitle?: string;
  setorSlug?: string;
}

function CardContent({ colaborador, setorTitle }: { colaborador: Colaborador; setorTitle?: string }) {
  return (
    <>
      <img
        src={cloudinaryUrl(colaborador.avatarSrc, 240)}
        alt={`Foto ${colaborador.nome}`}
        className="size-16 shrink-0 rounded-full border border-white/15 object-cover md:size-20"
        loading="lazy"
        decoding="async"
        width={80}
        height={80}
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-semibold leading-tight text-white">{colaborador.nome}</h3>
        <p className="mt-0.5 truncate text-sm text-white/60">
          {[colaborador.cargo, setorTitle].filter(Boolean).join(' · ')}
        </p>
      </div>
    </>
  );
}

const baseClass =
  'flex w-full items-center gap-4 rounded-xl border border-white/10 bg-surface-card p-4 text-white transition-colors';
const interativoClass =
  'hover:border-white/25 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action';

export default function CollabCard({ colaborador, setorTitle, setorSlug }: CollabCardProps) {
  const { profileHref, whatsappHref } = colaborador;
  const { rastrearClique } = useRastrearWhatsApp();

  const getWhatsAppMessage = () => {
    if (setorSlug === 'pagamento') {
      return 'Olá, gostaria de realizar o pagamento de uma fatura, poderia me ajudar?';
    }
    if (setorSlug === 'negociacao') {
      return 'Olá, gostaria de saber mais sobre um crediario, poderia me ajudar?';
    }
    return 'Olá, gostaria de saber mais sobre um produto da loja, poderia me ajudar?';
  };

  const buildWhatsAppUrl = (baseUrl: string) => {
    const mensagem = encodeURIComponent(getWhatsAppMessage());
    if (baseUrl.includes('wa.me')) {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}text=${mensagem}`;
    }
    return `https://wa.me/${baseUrl}?text=${mensagem}`;
  };

  if (profileHref) {
    return (
      <Link to={profileHref} className={`${baseClass} ${interativoClass}`}>
        <CardContent colaborador={colaborador} setorTitle={setorTitle} />
        <ChevronRight className="size-5 shrink-0 text-white/40" />
      </Link>
    );
  }

  if (whatsappHref && whatsappHref !== '#') {
    return (
      <a
        href={buildWhatsAppUrl(whatsappHref)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${interativoClass}`}
        onClick={() => rastrearClique(setorSlug || 'contato', 'contato')}
      >
        <CardContent colaborador={colaborador} setorTitle={setorTitle} />
      </a>
    );
  }

  return (
    <div className={baseClass}>
      <CardContent colaborador={colaborador} setorTitle={setorTitle} />
    </div>
  );
}
