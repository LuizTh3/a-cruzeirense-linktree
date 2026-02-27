// src/data/setores.ts

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
    colaboradores: [
      {
        id: 1,
        nome: "Elisangela",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/ELISANGELA.png",
        whatsappHref: "https://wa.me/SEU_NUMERO",
      },
      {
        id: 2,
        nome: "Jamisson",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/JAMISSON.png",
        whatsappHref: "https://wa.me/SEU_NUMERO",
      },
      {
        id: 3,
        nome: "Lerivaldo",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/LERIVALDO.png",
        whatsappHref: "https://wa.me/SEU_NUMERO",
      },
      {
        id: 4,
        nome: "Vanda",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/VANDA.png",
        whatsappHref: "https://wa.me/SEU_NUMERO",
      },
    ],
  },
  {
    slug: "confeccao",
    title: "Confecção e Calçados",
    subtitle: "As melhores marcas e estilos para você",
    heroImage: "/assets/images/cards-setores/calcados.webp",
    cardImage: "/assets/images/cards-setores/calcados.webp",
    cardTags: "Estilo . Conforto . Moda .",
    cardDesc: "Encontre as melhores peças para renovar o seu guarda-roupa.",
    colaboradores: [
      {
        id: 1,
        nome: "David",
        cargo: "Setor: Confecção e Calçados",
        avatarSrc: "/assets/images/funcionarios/confeccao/DAVID.png",
        whatsappHref: "#",
      },
      {
        id: 2,
        nome: "Denyse",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/DENYSE.png",
        whatsappHref: "#",
      },
      {
        id: 3,
        nome: "Fabiula",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/FABIULA.png",
        whatsappHref: "#",
      },
      {
        id: 4,
        nome: "Francisca",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/FRANCISCA.png",
        whatsappHref: "#",
      },
      {
        id: 5,
        nome: "Janaira",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/JANAIRA.png",
        whatsappHref: "#",
      },
      {
        id: 6,
        nome: "Mônica",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/MONICA.png",
        whatsappHref: "#",
      },
      {
        id: 7,
        nome: "Zenaide",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/ZENAIDE.png",
        whatsappHref: "#",
      },
    ],
  },
  {
    slug: "tecidos",
    title: "Tecidos, Cama, Mesa",
    subtitle: "Detalhes que transformam sua casa em um verdadeiro refúgio",
    heroImage: "/assets/images/cards-setores/tecidos.webp",
    cardImage: "/assets/images/cards-setores/tecidos.webp",
    cardTags: "Comfort . Softness . Elegance .",
    cardDesc: "Detalhes que transformam sua casa em um verdadeiro refúgio.",
    colaboradores: [
      {
        id: 1,
        nome: "Conceição",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/tecidos/CONCEICAO.png",
        whatsappHref: "#",
      },
      {
        id: 2,
        nome: "Damiana",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/tecidos/DAMIANA.png",
        whatsappHref: "#",
      },
      {
        id: 3,
        nome: "Sumaya",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/tecidos/SUMAYA.png",
        whatsappHref: "#",
      },
    ],
  },
  {
    slug: "pagamento",
    title: "Pagamentos de Faturas",
    subtitle: "Comodidade e organização para o seu dia a dia",
    heroImage: "/assets/images/cards-setores/financeiro.jpg",
    cardImage: "/assets/images/cards-setores/financeiro.jpg",
    cardTags: "Dialogue . Value . Precision .",
    cardDesc: "Comodidade e organização para facilitar seu dia a dia no pagamento de faturas.",
    colaboradores: [
      {
        id: 1,
        nome: "Colaborador 1",
        cargo: "Atendente",
        avatarSrc: "/assets/images/agente.png",
        whatsappHref: "#",
      },
    ],
  },
  {
    slug: "negociacao",
    title: "Crediários e Negociações",
    subtitle: "Soluções justas para reorganizar suas finanças com tranquilidade",
    heroImage: "/assets/images/cards-setores/negociacao.jpg",
    cardImage: "/assets/images/cards-setores/negociacao.jpg",
    cardTags: "Agreement . Planning . Growth .",
    cardDesc: "Soluções justas para reorganizar suas finanças com tranquilidade.",
    colaboradores: [
      {
        id: 1,
        nome: "Colaborador 1",
        cargo: "Atendente",
        avatarSrc: "/assets/images/agente.png",
        whatsappHref: "#",
      },
    ],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

// Busca um setor pelo slug — usado nas páginas de rota dinâmica
export function getSetorBySlug(slug: string): Setor | undefined {
  return setores.find((s) => s.slug === slug);
}