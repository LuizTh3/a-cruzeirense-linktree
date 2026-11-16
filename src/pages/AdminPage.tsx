import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AdminShell from '../components/layout/AdminShell';
import { adminNav } from '../components/layout/adminNav';

const atalhos = adminNav.filter((item) => item.to !== '/admin/dashboard');

export default function AdminPage() {
  return (
    <AdminShell title="Painel de administração" description="Escolha o que deseja gerenciar.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {atalhos.map(({ to, label, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-surface-card p-4 transition-colors hover:border-white/25 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action md:p-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 grow">
              <span className="block font-semibold text-white">{label}</span>
              <span className="block text-sm text-white/65">{description}</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
