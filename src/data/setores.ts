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
        nome: "Elizângela",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/ELISANGELA.webp",
        profileHref: "/colaborador/moveis/1",
        whatsappHref: "https://wa.me/+5568999588960",
      },
      {
        id: 2,
        nome: "Jamesson",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/JAMISSON.webp",
        profileHref: "/colaborador/moveis/2",
        whatsappHref: "https://wa.me/+5568992258077",
      },
      {
        id: 3,
        nome: "Lerivaldo",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/LERIVALDO.webp",
        profileHref: "/colaborador/moveis/3",
        whatsappHref: "https://wa.me/+5568992271502",
      },
      {
        id: 4,
        nome: "Vanda",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/moveis/VANDA.webp",
        profileHref: "/colaborador/moveis/4",
        whatsappHref: "https://wa.me/+5568999435942",
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
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/DAVID.webp",
        profileHref: "/colaborador/confeccao/1",
        whatsappHref: "https://wa.me/+556896019780",
      },
      {
        id: 2,
        nome: "Denyse",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/DENYSE.webp",
        profileHref: "/colaborador/confeccao/2",
        whatsappHref: "https://wa.me/+556892370253",
      },
      {
        id: 3,
        nome: "Fabíola",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/FABIULA.webp",
        profileHref: "/colaborador/confeccao/3",
        whatsappHref: "https://wa.me/+556896010998",
      },
      {
        id: 4,
        nome: "Maria Francisca",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/FRANCISCA.webp",
        profileHref: "/colaborador/confeccao/4",
        whatsappHref: "https://wa.me/+556899698627",
      },
      {
        id: 5,
        nome: "Janaira",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/JANAIRA.webp",
        profileHref: "/colaborador/confeccao/5",
        whatsappHref: "https://wa.me/+556899575870",
      },
      {
        id: 6,
        nome: "Mônica",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/MONICA.webp",
        profileHref: "/colaborador/confeccao/6",
        whatsappHref: "https://wa.me/+556884035185",
      },
      {
        id: 7,
        nome: "Zenaide",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/ZENAIDE.webp",
        profileHref: "/colaborador/confeccao/7",
        whatsappHref: "https://wa.me/+556899974483",
      },
      {
        id: 8,
        nome: "Maria José",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/confeccao/MARIA.webp",
        profileHref: "/colaborador/confeccao/8",
        whatsappHref: "https://wa.me/+556899335255",
      },
    ],
  },
  {
    slug: "tecidos",
    title: "Tecidos, Cama, Mesa e Banho",
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
        avatarSrc: "/assets/images/funcionarios/tecidos/CONCEICAO.webp",
        profileHref: "/colaborador/tecidos/1",
        whatsappHref: "https://wa.me/+5568999336589",
      },
      {
        id: 2,
        nome: "Damiana",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/tecidos/DAMIANA.webp",
        profileHref: "/colaborador/tecidos/2",
        whatsappHref: "https://wa.me/+5568999147854",
      },
      {
        id: 3,
        nome: "Sumaya",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/tecidos/SUMAYA.webp",
        profileHref: "/colaborador/tecidos/3",
        whatsappHref: "https://wa.me/+5568992244656",
      },
      {
        id: 4,
        nome: "Auxiliadora",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/agente.webp",
        profileHref: "/colaborador/tecidos/4",
        whatsappHref: "https://wa.me/+556899840078",
      },
    ],
  },
  {
    slug: "pagamento",
    title: "Pagamentos de Faturas",
    subtitle: "Comodidade e organização para o seu dia a dia",
    heroImage: "/assets/images/cards-setores/financeiro.webp",
    cardImage: "/assets/images/cards-setores/financeiro.webp",
    cardTags: "Dialogue . Value . Precision .",
    cardDesc: "Comodidade e organização para facilitar seu dia a dia no pagamento de faturas.",
    colaboradores: [
      {
        id: 1,
        nome: "Financeiro",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/faturas/financeiro.webp",
        profileHref: "/colaborador/pagamento/1",
        whatsappHref: "https://wa.me/+5568992257912",
      },
    ],
  },
  {
    slug: "negociacao",
    title: "Crediários e Negociações",
    subtitle: "Soluções justas para reorganizar suas finanças com tranquilidade",
    heroImage: "/assets/images/cards-setores/negociacao.webp",
    cardImage: "/assets/images/cards-setores/negociacao.webp",
    cardTags: "Agreement . Planning . Growth .",
    cardDesc: "Soluções justas para reorganizar suas finanças com tranquilidade.",
    colaboradores: [
      {
        id: 1,
        nome: "Crediário",
        cargo: "Atendente",
        avatarSrc: "/assets/images/funcionarios/negociacoes/negociacao.webp",
        profileHref: "/colaborador/negociacao/1",
        whatsappHref: "https://wa.me/+5568992091053",
      },
    ],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

// Busca um setor pelo slug — usado nas páginas de rota dinâmica
export function getSetorBySlug(slug: string): Setor | undefined {
  return setores.find((s) => s.slug === slug);
}