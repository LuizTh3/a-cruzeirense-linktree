import { ExternalLink, Mail, MessageCircle } from 'lucide-react';
import AdminShell from '../components/layout/AdminShell';

const SUPORTE_WHATSAPP = '556899739841';
const SUPORTE_WHATSAPP_EXIBICAO = '+55 68 9973-9841';
const SUPORTE_EMAIL = 'luizgustavo.dev01@gmail.com';
const SUPORTE_MENSAGEM =
  'Olá! Gostaria de solicitar suporte técnico para o sistema da A Cruzeirense Matriz.';

const canais = [
  {
    titulo: 'WhatsApp',
    descricao: '',
    contato: SUPORTE_WHATSAPP_EXIBICAO,
    acao: 'Abrir conversa',
    href: `https://wa.me/${SUPORTE_WHATSAPP}?text=${encodeURIComponent(SUPORTE_MENSAGEM)}`,
    externo: true,
    icon: MessageCircle,
  },
  {
    titulo: 'E-mail',
    descricao: '',
    contato: SUPORTE_EMAIL,
    acao: 'Enviar e-mail',
    href: `mailto:${SUPORTE_EMAIL}?subject=${encodeURIComponent(
      'Suporte Técnico - A Cruzeirense Matriz',
    )}&body=${encodeURIComponent(SUPORTE_MENSAGEM)}`,
    externo: false,
    icon: Mail,
  },
];

export default function SuportePage() {
  return (
    <AdminShell
      title="Suporte Técnico"
      description="Problemas ou dúvidas sobre o sistema? Fale com o desenvolvedor."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
        {canais.map(({ titulo, descricao, contato, acao, href, externo, icon: Icon }) => (
          <div
            key={titulo}
            className="flex flex-col gap-4 rounded-xl border border-white/10 bg-surface-card p-4 md:p-5"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 grow">
                <span className="block font-semibold text-white">{titulo}</span>
                <span className="block truncate text-sm text-white/65">{contato}</span>
              </span>
            </div>
            <p className="text-sm text-white/65">{descricao}</p>
            <a
              href={href}
              {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
            >
              {acao}
              {externo && <ExternalLink className="size-4" />}
            </a>
          </div>
        ))}
      </div>

    </AdminShell>
  );
}
