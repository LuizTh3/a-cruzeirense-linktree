import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AdminPage() {
  return (
    <main className="
      relative max-w-120 mx-auto min-h-screen
      bg-container-radial border-x border-white/5
      shadow-lateral flex flex-col
      overflow-x-hidden
    ">
      <div className="flex-1 px-6 pb-10">
      <h1 className="text-[2rem] font-roboto font-bold text-white mt-10 mb-8">
        Painel de Administrador
      </h1>

      <div className="flex flex-col gap-4 w-full">
        <Link
          to="/admin/relatorios"
          className="
            flex items-center justify-center w-full py-4.5
            bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
            text-white no-underline rounded-2xl
            font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
            border-none transition-all duration-300
            ease-[cubic-bezier(0.25,0.8,0.25,1)]
            hover:brightness-110 hover:-translate-y-0.75
            hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
          "
        >
          Relatórios de Acesso
        </Link>

        <Link
          to="/admin/avaliacoes"
          className="
            flex items-center justify-center w-full py-4.5
            bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
            text-white no-underline rounded-2xl
            font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
            border-none transition-all duration-300
            ease-[cubic-bezier(0.25,0.8,0.25,1)]
            hover:brightness-110 hover:-translate-y-0.75
            hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
          "
        >
          Ver Avaliações
        </Link>

        <Link
          to="/admin/promocoes"
          className="
            flex items-center justify-center w-full py-4.5
            bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
            text-white no-underline rounded-2xl
            font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
            border-none transition-all duration-300
            ease-[cubic-bezier(0.25,0.8,0.25,1)]
            hover:brightness-110 hover:-translate-y-0.75
            hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
          "
        >
          Gerenciar Promoções/Ofertas
        </Link>

        <Link
          to="/admin/carrossel"
          className="
            flex items-center justify-center w-full py-4.5
            bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
            text-white no-underline rounded-2xl
            font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
            border-none transition-all duration-300
            ease-[cubic-bezier(0.25,0.8,0.25,1)]
            hover:brightness-110 hover:-translate-y-0.75
            hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
          "
        >
          Gerenciar Carrossel
        </Link>
      </div>

      <Link
        to="/admin"
        className="
          flex items-center justify-center w-full py-4.5 mt-8
          bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
          text-white no-underline rounded-2xl
          font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
          border-none transition-all duration-300
          ease-[cubic-bezier(0.25,0.8,0.25,1)]
          hover:brightness-110 hover:-translate-y-0.75
          hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
        "
      >
        Sair
      </Link>
      </div>

      <Footer />
    </main>
  );
}
