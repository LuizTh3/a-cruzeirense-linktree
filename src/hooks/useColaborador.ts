import { useState, useEffect } from 'react';
import type { Colaborador } from '../types';
import { getSetorBySlug } from '../services/setoresService';

interface UseColaboradorResult {
  colaborador: Colaborador | null;
  setorSlug: string | null;
  setorTitle: string | null;
  loading: boolean;
  error: boolean;
}

export function useColaborador(slug: string | undefined, id: string | undefined): UseColaboradorResult {
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [setorSlug, setSetorSlug] = useState<string | null>(null);
  const [setorTitle, setSetorTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug || !id) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    const fetchColaborador = async () => {
      try {
        const setor = getSetorBySlug(slug);
        if (!setor) {
          setError(true);
          return;
        }

        const colab = setor.colaboradores.find((c) => c.id === parseInt(id));
        if (!colab) {
          setError(true);
          return;
        }

        setColaborador(colab);
        setSetorSlug(slug);
        setSetorTitle(setor.title);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchColaborador();
  }, [slug, id]);

  return { colaborador, setorSlug, setorTitle, loading, error };
}
