// src/components/Header.tsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  backgroundImage?: string;
}

const menuOptions = [
  { label: 'Setores', icon: 'fa-solid fa-layer-group', targetId: 'setores', href: null },
  { label: 'Promoções', icon: 'fa-solid fa-tags', targetId: null, href: '/promocoes' },
  { label: 'Redes sociais', icon: 'fa-solid fa-share-nodes', targetId: 'redes-sociais', href: null },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Header({ backgroundImage }: HeaderProps) {
  const bgImage = backgroundImage || '/assets/images/header.webp';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (targetId: string | null, href: string | null) => {
    if (href) {
      navigate(href);
    } else if (targetId) {
      scrollToSection(targetId);
    }
    setMenuOpen(false);
  };

  return (
    <div 
      className="relative w-full min-h-70 flex flex-col justify-end items-center pb-10 z-10 mb-2.5 text-center text-white"
      style={{
        background: `linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.4) 100%), url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }}
    >
      <header className="absolute top-0 left-0 w-full px-6 py-5 flex justify-between items-center pointer-events-none z-20">
        
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

        <div ref={menuRef} className="relative pointer-events-auto z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            className="w-12 h-12 rounded-full bg-[#082d5e] hover:bg-[#1a5fa8] text-white cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg"
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} text-xl transition-transform ${menuOpen ? '' : 'rotate-0'}`}></i>
          </button>

          <div
            className={`
              absolute right-0 top-14 w-48 bg-[#082d5e] rounded-xl shadow-2xl overflow-hidden
              transition-all duration-200 ease-out origin-top-right
              ${menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
            `}
          >
            {menuOptions.map((option) => (
              <button
                key={option.href || option.targetId}
                onClick={() => handleOptionClick(option.targetId, option.href)}
                className="w-full px-4 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors text-left"
              >
                <i className={`${option.icon} w-5 text-center`} />
                <span className="font-medium text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

      </header>
    </div>
  );
}