import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-4 md:mb-5', className)}>
      <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-white/70 md:text-base">{subtitle}</p>}
    </div>
  );
}
