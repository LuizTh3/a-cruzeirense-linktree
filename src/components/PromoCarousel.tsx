import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cloudinaryUrl } from '../services/cloudinaryService';

export interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  href?: string;
}

interface PromoCarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number;
}

const SWIPE_THRESHOLD = 50;

export default function PromoCarousel({ images, autoPlayInterval = 3000 }: PromoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const total = images?.length ?? 0;

  useEffect(() => {
    if (total < 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => clearInterval(interval);
    // currentIndex nas dependências reinicia a contagem após uma troca manual
  }, [total, autoPlayInterval, currentIndex]);

  if (total === 0) return null;

  const indice = currentIndex % total;
  const anterior = () => setCurrentIndex((prev) => (prev % total === 0 ? total - 1 : (prev % total) - 1));
  const proximo = () => setCurrentIndex((prev) => (prev + 1) % total);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > SWIPE_THRESHOLD) proximo();
    if (distance < -SWIPE_THRESHOLD) anterior();
  };

  const setaClass =
    'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface-deep/70 text-white opacity-0 transition-opacity hover:bg-surface-deep focus-visible:opacity-100 group-hover:opacity-100 md:flex';

  return (
    <div
      className="group relative w-full touch-pan-y overflow-hidden rounded-xl border border-white/10 bg-surface-card"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carrossel"
    >
      <div
        className="flex w-full transition-transform duration-700 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {images.map((image, index) => {
          const content = (
            <img
              src={cloudinaryUrl(image.src, 1400)}
              alt={image.alt}
              className="block h-auto w-full"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding="async"
            />
          );

          return image.href ? (
            <Link key={image.id} to={image.href} className="block w-full min-w-full shrink-0">
              {content}
            </Link>
          ) : (
            <div key={image.id} className="block w-full min-w-full shrink-0">
              {content}
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button type="button" onClick={anterior} aria-label="Imagem anterior" className={`${setaClass} left-3`}>
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={proximo} aria-label="Próxima imagem" className={`${setaClass} right-3`}>
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir para a imagem ${index + 1}`}
                aria-current={index === indice}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === indice ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
