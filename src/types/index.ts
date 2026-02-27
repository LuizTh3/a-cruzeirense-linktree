export interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  avatarSrc: string;
  profileHref?: string;
  whatsappHref?: string;
}

export interface Setor {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  cardImage: string;
  cardTags: string;
  cardDesc: string;
  colaboradores: Colaborador[];
}

export interface CarouselImage {
  id: number;
  src: string;
  alt: string;
}

export interface SocialLink {
  href: string;
  iconClass: string;
  label: string;
}
