import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { buscarAvaliacoes } from '../services/avaliacoesService';
import type { AvaliacaoFirestore } from '../services/avaliacoesService';
import { getAllSetores } from '../services/setoresService';
import Footer from '../components/Footer';

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
        const data = await buscarAvaliacoes();
        const setores = getAllSetores();

        const avaliacoesCompletas: AvaliacaoCompleta[] = data.map((avaliacao) => {
          const setor = setores.find((s) => s.slug === avaliacao.setorSlug);
          const colaborador = setor?.colaboradores.find(
            (c) => c.id === parseInt(avaliacao.colaboradorId)
          );

          return {
            ...avaliacao,
            nomeColaborador: colaborador?.nome || 'Desconhecido',
            fotoColaborador: colaborador?.avatarSrc || '',
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

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getIntervaloPaginas = () => {
    const paginas: (number | string)[] = [];
    const maxVisiveis = 5;

    if (totalPaginas <= maxVisiveis) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (paginaAtual <= 3) {
        for (let i = 1; i <= 4; i++) paginas.push(i);
        paginas.push('...');
        paginas.push(totalPaginas);
      } else if (paginaAtual >= totalPaginas - 2) {
        paginas.push(1);
        paginas.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) paginas.push(i);
      } else {
        paginas.push(1);
        paginas.push('...');
        for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++) paginas.push(i);
        paginas.push('...');
        paginas.push(totalPaginas);
      }
    }

    return paginas;
  };

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

        <h1 className="text-[1.8rem] font-roboto font-bold text-white mt-6 mb-4 text-center">
          Avaliações
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
          <select
            value={filtroColaborador}
            onChange={(e) => {
              setFiltroColaborador(e.target.value);
              setPaginaAtual(1);
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none text-sm"
          >
            <option value="" style={{ color: '#94a3b8' }}>Todos os funcionários</option>
            {colaboradoresUnicos.map((nome) => (
              <option key={nome} value={nome} style={{ color: 'white' }}>
                {nome}
              </option>
            ))}
          </select>

          <select
            value={filtroData}
            onChange={(e) => {
              setFiltroData(e.target.value);
              setPaginaAtual(1);
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none text-sm"
          >
            <option value="" style={{ color: '#94a3b8' }}>Todas as datas</option>
            <option value="7" style={{ color: 'white' }}>Últimos 7 dias</option>
            <option value="30" style={{ color: 'white' }}>Últimos 30 dias</option>
            <option value="90" style={{ color: 'white' }}>Últimos 90 dias</option>
            <option value="ano" style={{ color: 'white' }}>Este ano</option>
          </select>
        </div>

        {avaliacoesFiltradas.length === 0 ? (
          <div className="bg-[#0d2137] rounded-2xl p-8 text-center w-full">
            <p className="text-white/60 font-roboto">Nenhuma avaliação encontrada.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {avaliacoesPagina.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="bg-[#0d2137] rounded-2xl p-4 flex gap-4"
                >
                  <img
                    src={avaliacao.fotoColaborador}
                    alt={avaliacao.nomeColaborador}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-roboto font-bold">
                        {avaliacao.nomeColaborador}
                      </h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`text-sm ${
                              star <= avaliacao.rating
                                ? 'fa-solid fa-star text-yellow-400'
                                : 'fa-regular fa-star text-white/30'
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>

                    <p className="text-white/50 text-xs mb-2">
                      {avaliacao.nomeSetor}
                    </p>

                    {avaliacao.feedback && (
                      <p className="text-white/80 font-roboto text-sm mb-2">
                        "{avaliacao.feedback}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{avaliacao.telefone ? `Tel: ${formatTelefone(avaliacao.telefone)}` : ''}</span>
                      <span>{formatDate(avaliacao.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8 pb-8">
                <p className="text-white/60 text-sm">
                  Página {paginaAtual} de {totalPaginas}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => irParaPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                    className="px-3 py-2 bg-[#1a2d4a] text-white rounded-lg font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2a4d7a] transition-colors"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  {getIntervaloPaginas().map((pagina, index) => (
                    typeof pagina === 'number' ? (
                      <button
                        key={index}
                        onClick={() => irParaPagina(pagina)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                          pagina === paginaAtual
                            ? 'bg-[#1a5fa8] text-white'
                            : 'bg-[#1a2d4a] text-white hover:bg-[#2a4d7a]'
                        }`}
                      >
                        {pagina}
                      </button>
                    ) : (
                      <span key={index} className="px-2 text-white/40">
                        {pagina}
                      </span>
                    )
                  ))}

                  <button
                    onClick={() => irParaPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                    className="px-3 py-2 bg-[#1a2d4a] text-white rounded-lg font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2a4d7a] transition-colors"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
