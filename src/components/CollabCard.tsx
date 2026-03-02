import { Link } from 'react-router-dom';
import type { Colaborador } from '../types';

interface CollabCardProps {
  colaborador: Colaborador;
  setorTitle?: string;
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
          className="w-27 h-27 rounded-full object-cover border-2 border-white/20"
          loading="lazy"
          decoding="async"
          width={104}
          height={104}
        />
        <div className="flex flex-col leading-tight">
          <h3 className="
            font-sans text-[24px] font-bold text-white m-0
            border-b-2 border-[#A9B0B7] pb-1.25 mb-1.25 w-full
          ">
            {nome}
          </h3>
          <span className="font-sans text-[14px] text-white/60 font-normal">
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
  rounded-[20px] p-[20px_15px]
  flex justify-between items-center
  shadow-[0_4px_10px_rgba(0,0,0,0.4)]
  transition-transform duration-200 ease-in-out
  hover:-translate-y-[2px]
  no-underline text-white cursor-pointer
`;

export default function CollabCard({ colaborador, setorTitle }: CollabCardProps) {
  const { nome, avatarSrc, profileHref, whatsappHref } = colaborador;

  if (profileHref) {
    return (
      <Link to={profileHref} className={baseClass}>
        <CardContent nome={nome} avatarSrc={avatarSrc} setorTitle={setorTitle} />
        <i className="fa-solid fa-chevron-right text-white/40 text-lg"></i>
      </Link>
    );
  }

  if (whatsappHref && whatsappHref !== '#') {
    return (
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={baseClass}>
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
