// src/components/SectorCard.tsx

// 1. Criamos o "contrato" das propriedades (Props)
interface SectorCardProps {
  href: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  tags: string;
  desc: string;
}

// 2. Aplicamos a interface ao componente
export default function SectorCard({ href, imgSrc, imgAlt, title, tags, desc }: SectorCardProps) {
  return (
    <a 
      href={href} 
      className="flex flex-col bg-surface-card rounded-xl overflow-hidden no-underline transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.25)] hover:-translate-y-1.25 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] border border-white/5"
    >
      <img 
        src={imgSrc} 
        alt={imgAlt} 
        className="w-full h-27.5 object-cover block"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={300}
        height={180}
      />
      
      <div className="p-3 flex flex-col grow">
        <h3 className="text-white font-roboto text-[1.1rem] font-semibold mb-0.5 text-left">
          {title}
        </h3>
        
        <span className="text-[#6b7c93] text-[0.65rem] mb-2 text-left tracking-[0.5px]">
          {tags}
        </span>
        
        <p className="text-[#d1d9e2] text-[0.75rem] leading-[1.3] mb-3.75 text-left grow">
          {desc}
        </p>
        
        <div className="bg-action text-surface-card text-center py-2 rounded-lg font-bold text-[0.9rem] mt-auto transition-colors duration-200 hover:bg-action-hover">
          Acesse agora
        </div>
      </div>
    </a>
  );
}