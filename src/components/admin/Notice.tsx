import { CircleAlert, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Faixa de retorno das ações do admin. Mensagens com "sucesso" ficam verdes. */
export default function Notice({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  const sucesso = mensagem.includes('sucesso');
  const Icon = sucesso ? CircleCheck : CircleAlert;

  return (
    <div
      role="status"
      className={cn(
        'mb-5 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm',
        sucesso
          ? 'border-green-600/30 bg-green-600/15 text-green-400'
          : 'border-red-600/30 bg-red-600/15 text-red-400'
      )}
    >
      <Icon className="size-4 shrink-0" />
      {mensagem}
    </div>
  );
}
