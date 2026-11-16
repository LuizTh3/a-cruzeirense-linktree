// src/data/setores.ts
// Dados fixos dos setores. Os funcionários de cada setor ficam no Firestore
// (coleção `colaboradores`) e são gerenciados em /admin/funcionarios.

export type { Colaborador, Setor } from '../types';
import type { Setor } from '../types';

// ─── Dados ────────────────────────────────────────────────────────────────────

export const setores: Setor[] = [
  {
    slug: "moveis",
    title: "Setor de Móveis",
    subtitle: "Transforme sua casa com conforto e sofisticação",
    heroImage: "/assets/images/cards-setores/moveis.webp",
    cardImage: "/assets/images/cards-setores/moveis.webp",
    cardTags: "Modern . Design . practicality .",
    cardDesc: "Transforme sua casa com móveis que unem conforto e sofisticação.",
  },
  {
    slug: "confeccao",
    title: "Confecção e Calçados",
    subtitle: "As melhores marcas e estilos para você",
    heroImage: "/assets/images/cards-setores/calcados.webp",
    cardImage: "/assets/images/cards-setores/calcados.webp",
    cardTags: "Estilo . Conforto . Moda .",
    cardDesc: "Encontre as melhores peças para renovar o seu guarda-roupa.",
  },
  {
    slug: "tecidos",
    title: "Tecidos, Cama, Mesa e Banho",
    subtitle: "Detalhes que transformam sua casa em um verdadeiro refúgio",
    heroImage: "/assets/images/cards-setores/tecidos.webp",
    cardImage: "/assets/images/cards-setores/tecidos.webp",
    cardTags: "Comfort . Softness . Elegance .",
    cardDesc: "Detalhes que transformam sua casa em um verdadeiro refúgio.",
  },
  {
    slug: "pagamento",
    title: "Pagamentos de Faturas",
    subtitle: "Comodidade e organização para o seu dia a dia",
    heroImage: "/assets/images/cards-setores/financeiro.webp",
    cardImage: "/assets/images/cards-setores/financeiro.webp",
    cardTags: "Dialogue . Value . Precision .",
    cardDesc: "Comodidade e organização para facilitar seu dia a dia no pagamento de faturas.",
  },
  {
    slug: "negociacao",
    title: "Crediários e Negociações",
    subtitle: "Soluções justas para reorganizar suas finanças com tranquilidade",
    heroImage: "/assets/images/cards-setores/negociacao.webp",
    cardImage: "/assets/images/cards-setores/negociacao.webp",
    cardTags: "Agreement . Planning . Growth .",
    cardDesc: "Soluções justas para reorganizar suas finanças com tranquilidade.",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

// Busca um setor pelo slug — usado nas páginas de rota dinâmica
export function getSetorBySlug(slug: string): Setor | undefined {
  return setores.find((s) => s.slug === slug);
}
