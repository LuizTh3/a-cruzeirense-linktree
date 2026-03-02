// src/components/Header.tsx

interface HeaderProps {
  backgroundImage?: string;
}

export default function Header({ backgroundImage }: HeaderProps) {
  const bgImage = backgroundImage || '/assets/images/header.webp';
  
  return (
    <div 
      className="relative w-full min-h-70 flex flex-col justify-end items-center pb-10 z-1 mb-2.5 text-center text-white"
      style={{
        background: `linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }}
    >
      {/* pointer-events-none: Permite clicar "através" do container do header invisível.
        Mas reativamos os cliques (pointer-events-auto) na logo e no botão! 
      */}
      <header className="absolute top-0 left-0 w-full px-6 py-5 flex justify-between items-center z-11 pointer-events-none">
        
        <a href="/" className="pointer-events-auto shrink-0 hover:opacity-80 transition-opacity duration-300">
          <img 
            src="/assets/images/ACRUZEIRENSE.png" 
            alt="A Cruzeirense Matriz" 
            className="h-[clamp(40px,12vw,60px)] w-auto block object-contain transition-[height] duration-100 ease-out"
            loading="eager"
            fetchPriority="high"
            width={200}
            height={60}
          />
        </a>

        <button className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 text-white cursor-pointer flex items-center justify-center transition-colors duration-300">
          <i className="fa-solid fa-ellipsis"></i>
        </button>

      </header>
    </div>
  );
}