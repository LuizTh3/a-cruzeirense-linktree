import { useState, useEffect, useRef } from 'react';

export interface CarouselImage {
  id: number;
  src: string;
  alt: string;
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = SWIPE_THRESHOLD;

    if (distance > minSwipeDistance) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }

    if (distance < -minSwipeDistance) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-107.5 mx-auto mb-6 overflow-hidden rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] px-0 touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex w-full transition-transform duration-500 ease-in-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className="min-w-full w-full object-cover block shrink-0"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            width="860"
            height="430"
          />
        ))}
      </div>

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
