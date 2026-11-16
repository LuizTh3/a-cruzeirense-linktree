export interface Colaborador {
  id: string;
  setorSlug: string;
  nome: string;
  cargo: string;
  avatarSrc: string;
  /** Apenas dígitos, com código do país (ex.: 5568999999999). */
  whatsapp: string;
  ordem: number;
  ativo: boolean;
  profileHref?: string;
  whatsappHref?: string;
}

export interface Avaliacao {
  id?: string;
  colaboradorId: string;
  setorSlug: string;
  rating: number;
  feedback: string;
  telefone?: string;
  ipAvaliador: string;
  createdAt: Date;
}

export interface Setor {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  cardImage: string;
  cardTags: string;
  cardDesc: string;
}

export interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  href?: string;
}

export interface CarouselSlide {
  id: string;
  src: string;
  srcPublicId?: string;
  href: string;
  alt?: string;
  ordem: number;
}

export interface SocialLink {
  href: string;
  iconClass: string;
  label: string;
}

export interface Produto {
  id: string;
  titulo: string;
  preco: number;
  precoPromocional?: number;
  imagem: string;
  imagemPublicId?: string;
  categoria?: string;
  destaque?: boolean;
  tipo?: 'promocao' | 'oferta';
}
