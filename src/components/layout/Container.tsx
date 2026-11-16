import { cn } from '@/lib/utils';

interface ContainerProps extends React.ComponentProps<'div'> {
  size?: 'default' | 'narrow';
}

/** Largura máxima e respiro lateral padrão de todas as páginas. */
export default function Container({ className, size = 'default', ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'narrow' ? 'max-w-3xl' : 'max-w-6xl',
        className
      )}
      {...props}
    />
  );
}
