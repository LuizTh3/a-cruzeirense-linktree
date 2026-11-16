import Footer from '../Footer';

/** Moldura das páginas públicas: conteúdo ocupa a altura e o rodapé fica no fim. */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <main className="flex-1 pb-14 lg:pb-20">{children}</main>
      <Footer />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Carregando">
      <div className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    </div>
  );
}
