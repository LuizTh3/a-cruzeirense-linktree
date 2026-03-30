import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTotalAcessos, getAcessosSemana, getAcessosPorDia, getTotalCliquesWhatsApp, getCliquesWhatsAppPorSetor, getCliquesWhatsAppPorTipo, getCliquesWhatsAppPorDia } from '../services/acessosService';
import Footer from '../components/Footer';

interface DadosAcesso {
  total: number;
  semana: number;
  porDia: { data: string; quantidade: number }[];
}

interface DadosWhatsApp {
  total: number;
  porSetor: { setor: string; quantidade: number }[];
  porTipo: { tipo: string; quantidade: number }[];
  porDia: { data: string; quantidade: number }[];
}

export default function RelatoriosPage() {
  const [dados, setDados] = useState<DadosAcesso | null>(null);
  const [dadosWhatsApp, setDadosWhatsApp] = useState<DadosWhatsApp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [total, semana, porDia, totalWA, porSetor, porTipo, porDiaWA] = await Promise.all([
          getTotalAcessos(),
          getAcessosSemana(),
          getAcessosPorDia(7),
          getTotalCliquesWhatsApp(),
          getCliquesWhatsAppPorSetor(),
          getCliquesWhatsAppPorTipo(),
          getCliquesWhatsAppPorDia(7),
        ]);

        setDados({ total, semana, porDia });
        setDadosWhatsApp({ total: totalWA, porSetor, porTipo, porDia: porDiaWA });
      } catch (error) {
        console.error('Erro ao buscar dados de acesso:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const maxAcesso = dados ? Math.max(...dados.porDia.map(d => d.quantidade), 1) : 1;

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col overflow-x-hidden pb-10">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="
      relative max-w-120 mx-auto min-h-screen
      bg-container-radial border-x border-white/5
      shadow-lateral flex flex-col
      overflow-x-hidden
    ">
      <div className="flex-1 px-6 pb-10">
      <Link
        to="/admin/dashboard"
        className="self-start mt-6 text-white/70 hover:text-white transition-colors flex items-center gap-2"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Voltar
      </Link>

      <h1 className="text-[1.8rem] font-roboto font-bold text-white mt-6 mb-6 text-center">
        Relatórios de Acesso
      </h1>

      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0d2137] rounded-2xl p-5 text-center">
            <p className="text-white/60 text-xs font-roboto uppercase tracking-wider mb-1">
              Total de Acessos
            </p>
            <p className="text-white text-3xl font-roboto font-bold">
              {dados?.total || 0}
            </p>
          </div>

          <div className="bg-[#0d2137] rounded-2xl p-5 text-center">
            <p className="text-white/60 text-xs font-roboto uppercase tracking-wider mb-1">
              Esta Semana
            </p>
            <p className="text-white text-3xl font-roboto font-bold">
              {dados?.semana || 0}
            </p>
          </div>
        </div>

        <div className="bg-[#0d2137] rounded-2xl p-5">
          <h2 className="text-white font-roboto font-bold mb-4 text-center">
            Últimos 7 Dias
          </h2>
          
          <div className="flex items-end justify-between gap-2 h-32">
            {dados?.porDia.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1 gap-2">
                <span className="text-white/60 text-xs">
                  {item.quantidade}
                </span>
                <div 
                  className="w-full bg-[#1a5fa8] rounded-t-md transition-all duration-300"
                  style={{ 
                    height: `${Math.max((item.quantidade / maxAcesso) * 100, 4)}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <span className="text-white/50 text-xs">
                  {item.data}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d2137] rounded-2xl p-5">
          <h2 className="text-white font-roboto font-bold mb-4 text-center">
            Resumo
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 font-roboto">Média diária (7 dias)</span>
              <span className="text-white font-roboto font-bold">
                {dados ? Math.round(dados.porDia.reduce((acc, d) => acc + d.quantidade, 0) / 7) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 font-roboto">Maior acesso (7 dias)</span>
              <span className="text-white font-roboto font-bold">
                {Math.max(...(dados?.porDia.map(d => d.quantidade) || [0]))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60 font-roboto">Menor acesso (7 dias)</span>
              <span className="text-white font-roboto font-bold">
                {Math.min(...(dados?.porDia.map(d => d.quantidade) || [0]))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-white font-roboto font-bold text-[1.3rem] mb-4 text-center">
          Contatos via WhatsApp
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#0d2137] rounded-2xl p-5 text-center">
            <p className="text-white/60 text-xs font-roboto uppercase tracking-wider mb-1">
              Total de Cliques
            </p>
            <p className="text-white text-3xl font-roboto font-bold">
              {dadosWhatsApp?.total || 0}
            </p>
          </div>
        </div>

        <div className="bg-[#0d2137] rounded-2xl p-5 mb-4">
          <h3 className="text-white font-roboto font-bold mb-4 text-center">
            Por Tipo
          </h3>
          <div className="flex justify-around">
            {dadosWhatsApp?.porTipo.map((item) => (
              <div key={item.tipo} className="text-center">
                <p className="text-white/60 text-xs font-roboto uppercase mb-1">
                  {item.tipo === 'promocao' ? 'Promoções' : item.tipo === 'oferta' ? 'Ofertas' : 'Contato'}
                </p>
                <p className="text-white text-2xl font-roboto font-bold">{item.quantidade}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d2137] rounded-2xl p-5 mb-4">
          <h3 className="text-white font-roboto font-bold mb-4 text-center">
            Por Setor
          </h3>
          <div className="space-y-2">
            {dadosWhatsApp?.porSetor.map((item) => (
              <div key={item.setor} className="flex justify-between items-center">
                <span className="text-white/70 font-roboto capitalize">{item.setor}</span>
                <span className="text-white font-roboto font-bold">{item.quantidade}</span>
              </div>
            ))}
            {(!dadosWhatsApp?.porSetor || dadosWhatsApp.porSetor.length === 0) && (
              <p className="text-white/50 text-center font-roboto">Nenhum clique registrado</p>
            )}
          </div>
        </div>

        <div className="bg-[#0d2137] rounded-2xl p-5">
          <h3 className="text-white font-roboto font-bold mb-4 text-center">
            Últimos 7 Dias
          </h3>
          <div className="flex items-end justify-between gap-2 h-24">
            {dadosWhatsApp?.porDia.map((item, index) => {
              const maxCliques = Math.max(...(dadosWhatsApp.porDia.map(d => d.quantidade) || [1]), 1);
              return (
                <div key={index} className="flex flex-col items-center flex-1 gap-1">
                  <span className="text-white/60 text-xs">{item.quantidade}</span>
                  <div 
                    className="w-full bg-[#25D366] rounded-t-md transition-all duration-300"
                    style={{ 
                      height: `${Math.max((item.quantidade / maxCliques) * 100, 4)}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-white/50 text-xs">{item.data}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </main>
  );
}
