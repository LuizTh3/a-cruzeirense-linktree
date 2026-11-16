import { useEffect, useState } from 'react';
import { getTotalAcessos, getAcessosSemana, getAcessosPorDia, getTotalCliquesWhatsApp, getCliquesWhatsAppPorSetor, getCliquesWhatsAppPorTipo, getCliquesWhatsAppPorDia } from '../services/acessosService';
import AdminShell from '../components/layout/AdminShell';
import { PageLoading } from '../components/layout/PageShell';

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

const painel = 'rounded-xl border border-white/10 bg-surface-card p-5';

function Indicador({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className={painel}>
      <p className="text-sm text-white/65">{rotulo}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-white">{valor}</p>
    </div>
  );
}

function GraficoBarras({
  titulo,
  dados,
  corClass,
}: {
  titulo: string;
  dados: { data: string; quantidade: number }[];
  corClass: string;
}) {
  const maximo = Math.max(...dados.map((d) => d.quantidade), 1);

  return (
    <div className={painel}>
      <h3 className="mb-4 font-semibold text-white">{titulo}</h3>
      <div className="flex h-40 items-end justify-between gap-2">
        {dados.map((item, index) => (
          <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-xs tabular-nums text-white/65">{item.quantidade}</span>
            <div
              className={`w-full max-w-12 rounded-t-md ${corClass}`}
              style={{ height: `${Math.max((item.quantidade / maximo) * 100, 3)}%` }}
            />
            <span className="text-xs text-white/50">{item.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
      <span className="text-sm capitalize text-white/70">{rotulo}</span>
      <span className="font-semibold tabular-nums text-white">{valor}</span>
    </div>
  );
}

const rotuloTipo: Record<string, string> = {
  promocao: 'Promoções',
  oferta: 'Ofertas',
  contato: 'Contato',
};

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

  if (loading) {
    return <PageLoading />;
  }

  const porDia = dados?.porDia ?? [];
  const quantidades = porDia.length > 0 ? porDia.map((d) => d.quantidade) : [0];
  const mediaDiaria = Math.round(quantidades.reduce((acc, q) => acc + q, 0) / 7);

  return (
    <AdminShell title="Relatórios" description="Acessos ao site e contatos pelo WhatsApp.">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Acessos</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          <Indicador rotulo="Total de acessos" valor={dados?.total || 0} />
          <Indicador rotulo="Esta semana" valor={dados?.semana || 0} />
          <Indicador rotulo="Média diária (7 dias)" valor={mediaDiaria} />
          <Indicador rotulo="Maior acesso (7 dias)" valor={Math.max(...quantidades)} />
          <Indicador rotulo="Menor acesso (7 dias)" valor={Math.min(...quantidades)} />
        </div>

        <div className="mt-3 lg:mt-4">
          <GraficoBarras titulo="Acessos nos últimos 7 dias" dados={porDia} corClass="bg-brand" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-white">Contatos via WhatsApp</h2>
        <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          <div className="grid gap-3 lg:gap-4">
            <Indicador rotulo="Total de cliques" valor={dadosWhatsApp?.total || 0} />

            <div className={painel}>
              <h3 className="mb-2 font-semibold text-white">Por tipo</h3>
              {dadosWhatsApp?.porTipo.map((item) => (
                <Linha key={item.tipo} rotulo={rotuloTipo[item.tipo] || item.tipo} valor={item.quantidade} />
              ))}
            </div>
          </div>

          <div className={painel}>
            <h3 className="mb-2 font-semibold text-white">Por setor</h3>
            {dadosWhatsApp?.porSetor.map((item) => (
              <Linha key={item.setor} rotulo={item.setor} valor={item.quantidade} />
            ))}
            {(!dadosWhatsApp?.porSetor || dadosWhatsApp.porSetor.length === 0) && (
              <p className="py-4 text-center text-sm text-white/50">Nenhum clique registrado</p>
            )}
          </div>

          <GraficoBarras
            titulo="Cliques nos últimos 7 dias"
            dados={dadosWhatsApp?.porDia ?? []}
            corClass="bg-whatsapp"
          />
        </div>
      </section>
    </AdminShell>
  );
}
