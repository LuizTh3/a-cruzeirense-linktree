import { useState, useEffect, useMemo } from 'react';
import type { Colaborador } from '../types';
import { getSetorBySlug } from '../services/setoresService';
import { getColaboradorById } from '../services/colaboradoresService';

interface UseColaboradorResult {
  colaborador: Colaborador | null;
  setorSlug: string | null;
  setorTitle: string | null;
  loading: boolean;
  error: boolean;
}

interface ColaboradorCarregado {
  chave: string;
  colaborador: Colaborador | null;
}

export function useColaborador(slug: string | undefined, id: string | undefined): UseColaboradorResult {
  const setor = useMemo(() => (slug ? getSetorBySlug(slug) ?? null : null), [slug]);
  const chave = setor && id ? `${setor.slug}/${id}` : null;
  const [carregado, setCarregado] = useState<ColaboradorCarregado | null>(null);

  useEffect(() => {
    if (!setor || !id || !chave) return;

    let cancelado = false;
    getColaboradorById(id)
      .catch((err) => {
        console.error('Erro ao buscar funcionário:', err);
        return undefined;
      })
      .then((colab) => {
        if (cancelado) return;
        const valido = !!colab && colab.ativo && colab.setorSlug === setor.slug;
        setCarregado({ chave, colaborador: valido ? colab : null });
      });

    return () => {
      cancelado = true;
    };
  }, [setor, id, chave]);

  const pronto = !!chave && carregado?.chave === chave;
  const colaborador = pronto ? carregado!.colaborador : null;

  return {
    colaborador,
    setorSlug: colaborador && setor ? setor.slug : null,
    setorTitle: colaborador && setor ? setor.title : null,
    loading: !!chave && !pronto,
    error: !chave || (pronto && !colaborador),
  };
}
