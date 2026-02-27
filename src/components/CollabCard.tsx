import { Link } from 'react-router-dom';
import type { Colaborador } from '../types';

interface CollabCardProps {
  colaborador: Colaborador;
}

interface CardContentProps {
  nome: string;
  cargo: string;
  avatarSrc: string;
}

function CardContent({ nome, cargo, avatarSrc }: CardContentProps) {
  return (
    <>
      <div className="flex items-center gap-[15px]">
        <img
          src={avatarSrc}
          alt={`Foto ${nome}`}
          className="w-[70px] h-[70px] rounded-full object-cover border-2 border-white/20"
        />
        <div className="flex flex-col leading-tight">
          <h3 className="
            font-sans text-[24px] font-bold text-white m-0
            border-b-2 border-[#A9B0B7] pb-[5px] mb-[5px] w-full
          ">
            {nome}
          </h3>
          <span className="font-sans text-[14px] text-white/60 font-normal">
            {cargo}
          </span>
        </div>
      </div>

      <div className="
        w-[52px] h-[52px] min-w-[52px]
        bg-[#25D366] rounded-full
        flex justify-center items-center
        text-white text-[42px]
        shadow-[0_2px_5px_rgba(0,0,0,0.3)]
        transition-colors duration-300
        group-hover:bg-[#1DA851]
      ">
        <i className="fa-brands fa-whatsapp" />
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

export default function CollabCard({ colaborador }: CollabCardProps) {
  const { nome, cargo, avatarSrc, profileHref, whatsappHref } = colaborador;

  if (profileHref) {
    return (
      <Link to={profileHref} className={baseClass}>
        <CardContent nome={nome} cargo={cargo} avatarSrc={avatarSrc} />
      </Link>
    );
  }

  if (whatsappHref) {
    return (
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={baseClass}>
        <CardContent nome={nome} cargo={cargo} avatarSrc={avatarSrc} />
      </a>
    );
  }

  return (
    <div className={baseClass} aria-disabled="true">
      <CardContent nome={nome} cargo={cargo} avatarSrc={avatarSrc} />
    </div>
  );
}
