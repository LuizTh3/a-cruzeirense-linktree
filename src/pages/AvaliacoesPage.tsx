import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buscarAvaliacoes } from '../services/avaliacoesService';
import type { AvaliacaoFirestore } from '../services/avaliacoesService';
import { getAllSetores } from '../services/setoresService';

interface AvaliacaoCompleta extends AvaliacaoFirestore {
  nomeColaborador: string;
  fotoColaborador: string;
  nomeSetor: string;
}

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCompleta[]>([]);
  const [loading, setLoading] = useState(true);

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
      shadow-lateral flex flex-col items-center
      overflow-x-hidden pb-10 px-6
    ">
      <Link
        to="/admin/dashboard"
        className="self-start mt-6 text-white/70 hover:text-white transition-colors flex items-center gap-2"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Voltar
      </Link>

      <h1 className="text-[1.8rem] font-roboto font-bold text-white mt-6 mb-6 text-center">
        Avaliações
      </h1>

      {avaliacoes.length === 0 ? (
        <div className="bg-[#0d2137] rounded-2xl p-8 text-center w-full">
          <p className="text-white/60 font-roboto">Nenhuma avaliação encontrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {avaliacoes.map((avaliacao) => (
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
                  <span>IP: {avaliacao.ipAvaliador}</span>
                  <span>{formatDate(avaliacao.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
