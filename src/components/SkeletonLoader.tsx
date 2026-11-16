import { Skeleton } from '@/components/ui/skeleton';
import Container from './layout/Container';

const bloco = 'bg-white/10';

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen" role="status" aria-label="Carregando">
      <Container className="flex min-h-72 flex-col md:min-h-80 lg:min-h-96">
        <div className="flex justify-center py-5 md:justify-start">
          <Skeleton className={`h-11 w-40 ${bloco}`} />
        </div>
        <div className="mt-auto flex flex-col items-center gap-3 pb-12 md:pb-16">
          <Skeleton className={`h-10 w-3/4 max-w-md ${bloco}`} />
          <Skeleton className={`h-5 w-1/2 max-w-xs ${bloco}`} />
        </div>
      </Container>

      <Container>
        <Skeleton className={`aspect-[2/1] w-full rounded-xl lg:aspect-[3/1] ${bloco}`} />

        <Skeleton className={`mt-10 h-7 w-44 ${bloco}`} />
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className={`aspect-[4/5] rounded-xl ${bloco} ${i === 5 ? 'hidden md:block' : ''}`} />
          ))}
        </div>
      </Container>
    </div>
  );
}
