import { Link } from 'react-router-dom';
import type { Colaborador } from '../types';
import { useRastrearWhatsApp } from '../hooks/useRastrearWhatsApp';

interface CollabCardProps {
  colaborador: Colaborador;
  setorTitle?: string;
  setorSlug?: string;
}

interface CardContentProps {
  nome: string;
  avatarSrc: string;
  setorTitle?: string;
}

function CardContent({ nome, avatarSrc, setorTitle }: CardContentProps) {
  return (
    <>
      <div className="flex items-center gap-3.75">
        <img
          src={avatarSrc}
          alt={`Foto ${nome}`}
          className="w-27 h-27 xs:w-24 xs:h-24 xxs:w-22 xxs:h-22 rounded-full object-cover border-2 border-white/20"
          loading="lazy"
          decoding="async"
          width={104}
          height={104}
        />
        <div className="flex flex-col leading-tight">
          <h3 className="
            font-sans text-[24px] xs:text-[20px] xxs:text-[18px] font-bold text-white m-0
            border-b-2 border-[#A9B0B7] pb-1.25 mb-1.25 w-full
          ">
            {nome}
          </h3>
          <span className="font-sans text-[14px] xs:text-[12px] xxs:text-[11px] text-white/60 font-normal">
            {setorTitle}
          </span>
        </div>
      </div>
    </>
  );
}

const baseClass = `
  group w-full box-border
  bg-[#0d2137]
  rounded-[20px] p-[20px_15px] xs:p-[16px_12px] xxs:p-[14px_10px]
  flex justify-between items-center
  shadow-[0_4px_10px_rgba(0,0,0,0.4)]
  transition-transform duration-200 ease-in-out
  hover:-translate-y-[2px]
  no-underline text-white cursor-pointer
`;

export default function CollabCard({ colaborador, setorTitle, setorSlug }: CollabCardProps) {
  const { nome, avatarSrc, profileHref, whatsappHref } = colaborador;
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
      <Link to={profileHref} className={baseClass}>
        <CardContent nome={nome} avatarSrc={avatarSrc} setorTitle={setorTitle} />
        <i className="fa-solid fa-chevron-right text-white/40 text-lg"></i>
      </Link>
    );
  }

  if (whatsappHref && whatsappHref !== '#') {
    const whatsappUrl = buildWhatsAppUrl(whatsappHref);
    const handleWhatsAppClick = () => {
      rastrearClique(setorSlug || 'contato', 'contato');
    };
    return (
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={baseClass} onClick={handleWhatsAppClick}>
        <CardContent nome={nome} avatarSrc={avatarSrc} setorTitle={setorTitle} />
      </a>
    );
  }

  return (
    <div className={baseClass} aria-disabled="true">
      <CardContent nome={nome} avatarSrc={avatarSrc} setorTitle={setorTitle} />
    </div>
  );
}
