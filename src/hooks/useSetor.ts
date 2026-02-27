import { useState, useEffect } from 'react';
import type { Setor } from '../types';
import { getSetorBySlug } from '../services/setoresService';

interface UseSetorResult {
  setor: Setor | null;
  loading: boolean;
  error: boolean;
}

export function useSetor(slug: string | undefined): UseSetorResult {
  const [setor, setSetor] = useState<Setor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    const fetchSetor = async () => {
      try {
        const data = await Promise.resolve(getSetorBySlug(slug));
        setSetor(data ?? null);
        if (!data) {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSetor();
  }, [slug]);

  return { setor, loading, error };
}
