import { Link } from 'react-router-dom';

interface SectorCardProps {
  href: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  desc: string;
}

export default function SectorCard({ href, imgSrc, imgAlt, title, desc }: SectorCardProps) {
  return (
    <Link
      to={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface-card transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width={300}
          height={188}
        />
      </div>

      <div className="flex grow flex-col p-3 md:p-4">
        <h3 className="text-[0.95rem] font-semibold leading-snug text-white md:text-base">{title}</h3>
        <p className="mt-1 grow text-xs leading-relaxed text-white/70 md:text-sm">{desc}</p>
        <span className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-action text-sm font-semibold text-surface-card transition-colors group-hover:bg-action-hover">
          Acesse agora
        </span>
      </div>
    </Link>
  );
}
