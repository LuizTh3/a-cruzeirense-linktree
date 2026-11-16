import { useEffect, useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { buscarAvaliacoes } from '../services/avaliacoesService';
import type { AvaliacaoFirestore } from '../services/avaliacoesService';
import { getAllSetores } from '../services/setoresService';
import { AVATAR_PADRAO, getTodosColaboradores } from '../services/colaboradoresService';
import { nomesColaboradoresLegado } from '../data/colaboradoresLegado';
import { cloudinaryUrl } from '../services/cloudinaryService';
import AdminShell from '../components/layout/AdminShell';
import { PageLoading } from '../components/layout/PageShell';
import Pagination from '../components/admin/Pagination';
import { AdminEmpty } from '../components/admin/AdminList';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

interface AvaliacaoCompleta extends AvaliacaoFirestore {
  nomeColaborador: string;
  fotoColaborador: string;
  nomeSetor: string;
}

const ITENS_POR_PAGINA = 10;

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroColaborador, setFiltroColaborador] = useState<string>('');
  const [filtroData, setFiltroData] = useState<string>('');

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      try {
        const [data, colaboradores] = await Promise.all([
          buscarAvaliacoes(),
          getTodosColaboradores(),
        ]);
        const setores = getAllSetores();
        const colaboradoresPorId = new Map(colaboradores.map((c) => [c.id, c]));

        const avaliacoesCompletas: AvaliacaoCompleta[] = data.map((avaliacao) => {
          const setor = setores.find((s) => s.slug === avaliacao.setorSlug);
          const colaborador = colaboradoresPorId.get(avaliacao.colaboradorId);
          const nomeLegado =
            nomesColaboradoresLegado[`${avaliacao.setorSlug}-${avaliacao.colaboradorId}`];

          return {
            ...avaliacao,
            nomeColaborador: colaborador?.nome || nomeLegado || 'Desconhecido',
            fotoColaborador: cloudinaryUrl(colaborador?.avatarSrc || AVATAR_PADRAO, 120),
            nomeSetor: setor?.title || avaliacao.setorSlug,
          };
        });

        setAvaliacoes(avaliacoesCompletas);
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvaliacoes();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatTelefone = (telefone: string | undefined) => {
    if (!telefone) return '';
    const digits = telefone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return telefone;
  };

  const colaboradoresUnicos = useMemo(() => {
    const nomes = new Set(avaliacoes.map(a => a.nomeColaborador));
    return Array.from(nomes).sort();
  }, [avaliacoes]);

  const avaliacoesFiltradas = useMemo(() => {
    let filtered = avaliacoes;

    if (filtroColaborador) {
      filtered = filtered.filter(a => a.nomeColaborador === filtroColaborador);
    }

    if (filtroData) {
      const now = new Date();
      let dataLimite: Date;

      switch (filtroData) {
        case '7':
          dataLimite = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30':
          dataLimite = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90':
          dataLimite = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'ano':
          dataLimite = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          return filtered;
      }

      filtered = filtered.filter(a => a.createdAt >= dataLimite);
    }

    return filtered;
  }, [avaliacoes, filtroColaborador, filtroData]);

  const totalPaginas = Math.ceil(avaliacoesFiltradas.length / ITENS_POR_PAGINA);

  const avaliacoesPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    return avaliacoesFiltradas.slice(inicio, fim);
  }, [avaliacoesFiltradas, paginaAtual]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <AdminShell
      title="Avaliações"
      description={`${avaliacoesFiltradas.length} ${
        avaliacoesFiltradas.length === 1 ? 'avaliação encontrada' : 'avaliações encontradas'
      }`}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <NativeSelect
          aria-label="Filtrar por funcionário"
          value={filtroColaborador}
          onChange={(e) => {
            setFiltroColaborador(e.target.value);
            setPaginaAtual(1);
          }}
          className="w-full sm:w-64"
        >
          <NativeSelectOption value="">Todos os funcionários</NativeSelectOption>
          {colaboradoresUnicos.map((nome) => (
            <NativeSelectOption key={nome} value={nome}>
              {nome}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        <NativeSelect
          aria-label="Filtrar por data"
          value={filtroData}
          onChange={(e) => {
            setFiltroData(e.target.value);
            setPaginaAtual(1);
          }}
          className="w-full sm:w-56"
        >
          <NativeSelectOption value="">Todas as datas</NativeSelectOption>
          <NativeSelectOption value="7">Últimos 7 dias</NativeSelectOption>
          <NativeSelectOption value="30">Últimos 30 dias</NativeSelectOption>
          <NativeSelectOption value="90">Últimos 90 dias</NativeSelectOption>
          <NativeSelectOption value="ano">Este ano</NativeSelectOption>
        </NativeSelect>
      </div>

      {avaliacoesFiltradas.length === 0 ? (
        <AdminEmpty>Nenhuma avaliação encontrada.</AdminEmpty>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {avaliacoesPagina.map((avaliacao) => (
            <article
              key={avaliacao.id}
              className="flex gap-4 rounded-xl border border-white/10 bg-surface-card p-4"
            >
              <img
                src={avaliacao.fotoColaborador}
                alt=""
                className="size-12 shrink-0 rounded-full border border-white/15 object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <h3 className="font-semibold text-white">{avaliacao.nomeColaborador}</h3>
                  <div className="flex gap-0.5" aria-label={`${avaliacao.rating} de 5 estrelas`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`size-4 ${
                          star <= avaliacao.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/25'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-white/50">{avaliacao.nomeSetor}</p>

                {avaliacao.feedback && (
                  <p className="mt-2 text-sm text-white/85">“{avaliacao.feedback}”</p>
                )}

                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 text-xs text-white/45">
                  <span>{avaliacao.telefone ? `Tel: ${formatTelefone(avaliacao.telefone)}` : ''}</span>
                  <span>{formatDate(avaliacao.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} onChange={setPaginaAtual} />
    </AdminShell>
  );
}
