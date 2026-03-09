// src/components/Header.tsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  backgroundImage?: string;
  variant?: 'full' | 'minimal';
}

interface MenuOption {
  label: string;
  icon: string;
  targetId?: string | null;
  href?: string | null;
}

const fullMenuOptions: MenuOption[] = [
  { label: 'Setores', icon: 'fa-solid fa-layer-group', targetId: 'setores' },
  { label: 'Redes sociais', icon: 'fa-solid fa-share-nodes', targetId: 'redes-sociais' },
];

const minimalMenuOptions: MenuOption[] = [
  { label: 'Home', icon: 'fa-solid fa-house', href: '/' },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Header({ backgroundImage, variant = 'full' }: HeaderProps) {
  const bgImage = backgroundImage || '/assets/images/header.webp';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const menuOptions = variant === 'minimal' ? minimalMenuOptions : fullMenuOptions;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (targetId?: string | null, href?: string | null) => {
    if (href) {
      navigate(href);
    } else if (targetId) {
      const isHomePage = window.location.pathname === '/';
      if (isHomePage) {
        scrollToSection(targetId);
      } else {
        navigate(`/#${targetId}`);
      }
    }
    setMenuOpen(false);
  };

  return (
    <div 
      className="relative w-full min-h-70 xs:min-h-60 xxs:min-h-56 flex flex-col justify-end items-center pb-10 z-10 mb-2.5 text-center text-white"
      style={{
        background: `linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }}
    >
      <header className="absolute top-0 left-0 w-full px-4 xs:px-3 xxs:px-3 py-5 flex justify-between items-center pointer-events-none z-20">
        
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

        <div ref={menuRef} className="relative pointer-events-auto z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            className={`
              w-12 h-12 xs:w-10 xs:h-10 xxs:w-10 xxs:h-10 rounded-full bg-[#082d5e] text-white
              flex items-center justify-center text-xl
              shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-300
              hover:bg-[#1a5fa8] hover:scale-110
              ${menuOpen ? 'rotate-90' : ''}
            `}
          >
            <i className={menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
          </button>

          <div
            className={`
              absolute right-14 top-0 flex flex-col gap-2
              transition-all duration-300 ease-out origin-right
              ${menuOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-4 pointer-events-none'}
            `}
          >
            {menuOptions.map((option, index) => (
              <button
                key={option.href || option.targetId || index}
                onClick={() => handleOptionClick(option.targetId, option.href)}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-[#082d5e] text-white rounded-full
                  shadow-[0_4px_15px_rgba(0,0,0,0.3)]
                  whitespace-nowrap text-sm font-medium
                  hover:bg-[#1a5fa8] hover:scale-105
                  transition-all duration-200
                "
              >
                <i className={option.icon} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

      </header>
    </div>
  );
}
