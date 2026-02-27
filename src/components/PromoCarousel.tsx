// src/components/PromoCarousel.tsx
import { useState, useEffect } from 'react';

export interface CarouselImage {
  id: number;
  src: string;
  alt: string;
}

interface PromoCarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number; // Tempo em milissegundos (opcional)
}

export default function PromoCarousel({ images, autoPlayInterval = 3000 }: PromoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hook responsável por passar as imagens automaticamente
  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      // Avança para o próximo index. O operador módulo (%) faz voltar a 0 quando chega no fim.
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    // Função de limpeza (cleanup)
    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-107.5 mx-auto mb-6 overflow-hidden rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] px-0">
      
      {/* Container das Imagens (Track) */}
      <div 
        className="flex w-full transition-transform duration-500 ease-in-out will-change-transform"
        // Move o track horizontalmente com base no index atual
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="min-w-full w-full object-cover block shrink-0"
          />
        ))}
      </div>

      {/* Indicadores (Pontinhos) */}
      <div className="absolute bottom-3.75 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)} 
            aria-label={`Ir para a imagem ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 border-none outline-none ${
              index === currentIndex
                ? 'bg-white scale-125 shadow-[0_0_5px_rgba(0,0,0,0.5)]' 
                : 'bg-white/40 hover:bg-white/60' 
            }`}
          />
        ))}
      </div>

    </div>
  );
}