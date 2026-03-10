
interface HeaderProps {
  backgroundImage?: string;
  variant?: 'full' | 'minimal';
}

export default function Header({ backgroundImage}: HeaderProps) {
  const bgImage = backgroundImage || '/assets/images/header.webp';

  return (
    <div 
      className="relative w-full min-h-60 xs:min-h-52 xxs:min-h-48 flex flex-col justify-end items-center pb-6 xs:pb-5 xxs:pb-4 z-10 mb-2.5 text-center text-white"
      style={{
        background: `linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
      }}
    >
      <header className="absolute top-0 bottom-45 left-0 w-full px-4 xs:px-3 xxs:px-3 py-5 flex justify-center items-center pointer-events-none z-20">
        
        <a href="/" className="pointer-events-auto shrink-0 hover:opacity-80 transition-opacity duration-300">
          <img 
            src="/assets/images/ACRUZEIRENSE.png" 
            alt="A Cruzeirense Matriz" 
            className="h-[clamp(40px,12vw,60px)] xs:h-[clamp(35px,10vw,50px)] xxs:h-[clamp(32px,9vw,45px)] w-auto block object-contain transition-[height] duration-100 ease-out"
            loading="eager"
            fetchPriority="high"
            width={200}
            height={60}
          />
        </a>

      </header>
    </div>
  );
}
