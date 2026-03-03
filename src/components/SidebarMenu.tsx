import { useState, useEffect, useRef } from 'react';

interface MenuOption {
  label: string;
  icon: string;
  targetId: string;
}

const menuOptions: MenuOption[] = [
  { label: 'Setores', icon: 'fa-solid fa-layer-group', targetId: 'setores' },
  { label: 'Promoções', icon: 'fa-solid fa-tags', targetId: 'promocoes' },
  { label: 'Redes sociais', icon: 'fa-solid fa-share-nodes', targetId: 'redes-sociais' },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (targetId: string) => {
    scrollToSection(targetId);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menu"
          className={`
            w-12 h-12 rounded-full bg-[#082d5e] text-white
            flex items-center justify-center text-xl
            shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-300
            hover:bg-[#1a5fa8] hover:scale-110
            ${isOpen ? 'rotate-90' : ''}
          `}
        >
          <i className={isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
        </button>

        <div
          className={`
            absolute right-14 top-0 flex flex-col gap-2
            transition-all duration-300 ease-out origin-right
            ${isOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-4 pointer-events-none'}
          `}
        >
          {menuOptions.map((option) => (
            <button
              key={option.targetId}
              onClick={() => handleOptionClick(option.targetId)}
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
    </div>
  );
}
