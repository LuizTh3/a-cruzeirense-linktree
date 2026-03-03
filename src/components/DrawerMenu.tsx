import { useState, useEffect, useRef } from 'react';

interface DrawerMenuProps {
  onNavigate?: (sectionId: string) => void;
}

const menuOptions = [
  { label: 'Setores', icon: 'fa-solid fa-layer-group', targetId: 'setores' },
  { label: 'Promoções', icon: 'fa-solid fa-tags', targetId: 'promocoes' },
  { label: 'Redes sociais', icon: 'fa-solid fa-share-nodes', targetId: 'redes-sociais' },
];

export default function DrawerMenu({ onNavigate }: DrawerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleOptionClick = (targetId: string) => {
    onNavigate?.(targetId);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
        className="pointer-events-auto z-30 relative w-12 h-12 rounded-full bg-[#082d5e] hover:bg-[#1a5fa8] text-white cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg"
      >
        <i className="fa-solid fa-bars text-xl"></i>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div
            ref={drawerRef}
            className="fixed right-0 top-0 h-full w-72 z-50 bg-[#082d5e] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col"
            style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-semibold text-lg">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <nav className="flex-1 py-4">
              {menuOptions.map((option) => (
                <button
                  key={option.targetId}
                  onClick={() => handleOptionClick(option.targetId)}
                  className="w-full px-6 py-4 flex items-center gap-4 text-white hover:bg-white/10 transition-colors text-left"
                >
                  <i className={`${option.icon} w-5 text-center`} />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
