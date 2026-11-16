import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/** Formulário à esquerda (fixo ao rolar no desktop) e lista à direita. */
export function AdminSplit({ form, children }: { form: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[24rem_1fr] lg:items-start lg:gap-8">
      <div className="rounded-xl border border-white/10 bg-surface-card p-5 lg:sticky lg:top-20">{form}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function AdminField({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-1.5', className)}>{children}</div>;
}

export function AdminEmpty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/55">
      {children}
    </p>
  );
}

interface AdminRowProps extends React.ComponentProps<'div'> {
  media: React.ReactNode;
  actions?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  nome: string;
}

/** Linha padrão das listas do admin: mídia, conteúdo e ações. */
export function AdminRow({ media, actions, onEdit, onDelete, nome, className, children, ...props }: AdminRowProps) {
  return (
    <div
      className={cn('flex items-center gap-3 rounded-xl border border-white/10 bg-surface-card p-3', className)}
      {...props}
    >
      {media}
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex shrink-0 gap-1.5">
        {onEdit && (
          <Button variant="outline" size="icon-lg" onClick={onEdit} aria-label={`Editar ${nome}`}>
            <Pencil />
          </Button>
        )}
        {actions}
        {onDelete && (
          <Button variant="destructive" size="icon-lg" onClick={onDelete} aria-label={`Excluir ${nome}`}>
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}
