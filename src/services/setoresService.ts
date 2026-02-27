import type { Setor } from '../types';
import { setores } from '../data/setores';

export interface SectorCardData {
  slug: string;
  title: string;
  cardImage: string;
  cardTags: string;
  cardDesc: string;
}

export function getSectorCards(): SectorCardData[] {
  return setores.map((setor) => ({
    slug: setor.slug,
    title: setor.title,
    cardImage: setor.cardImage,
    cardTags: setor.cardTags,
    cardDesc: setor.cardDesc,
  }));
}

export function getSetorBySlug(slug: string): Setor | undefined {
  return setores.find((s) => s.slug === slug);
}

export function getAllSetores(): Setor[] {
  return setores;
}
