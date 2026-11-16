import { useState, useEffect, useMemo } from 'react';
import type { Colaborador, Setor } from '../types';
import { getSetorBySlug } from '../services/setoresService';
import { getColaboradoresDoSetor } from '../services/colaboradoresService';

interface UseSetorResult {
  setor: Setor | null;
  colaboradores: Colaborador[];
  loading: boolean;
  error: boolean;
}

interface ColaboradoresCarregados {
  slug: string;
  colaboradores: Colaborador[];
}

export function useSetor(slug: string | undefined): UseSetorResult {
  const setor = useMemo(() => (slug ? getSetorBySlug(slug) ?? null : null), [slug]);
  const [carregados, setCarregados] = useState<ColaboradoresCarregados | null>(null);

  useEffect(() => {
    if (!setor) return;

    let cancelado = false;
    getColaboradoresDoSetor(setor.slug)
      .catch((err) => {
        // O setor continua acessível mesmo se a lista de funcionários falhar.
        console.error('Erro ao buscar funcionários:', err);
        return [] as Colaborador[];
      })
      .then((colaboradores) => {
        if (!cancelado) setCarregados({ slug: setor.slug, colaboradores });
      });

    return () => {
      cancelado = true;
    };
  }, [setor]);

  const pronto = !!setor && carregados?.slug === setor.slug;

  return {
    setor,
    colaboradores: pronto ? carregados!.colaboradores : [],
    loading: !!setor && !pronto,
    error: !setor,
  };
}
