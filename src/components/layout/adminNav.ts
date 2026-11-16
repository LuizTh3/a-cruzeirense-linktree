import { ChartColumn, Images, LayoutDashboard, LifeBuoy, Star, Tag, Users } from 'lucide-react';

export const adminNav = [
  { to: '/admin/dashboard', label: 'Painel', icon: LayoutDashboard, description: 'Visão geral da administração' },
  { to: '/admin/relatorios', label: 'Relatórios', icon: ChartColumn, description: 'Acessos ao site e cliques no WhatsApp' },
  { to: '/admin/avaliacoes', label: 'Avaliações', icon: Star, description: 'O que os clientes disseram do atendimento' },
  { to: '/admin/promocoes', label: 'Promoções', icon: Tag, description: 'Produtos em promoção e ofertas' },
  { to: '/admin/carrossel', label: 'Carrossel', icon: Images, description: 'Banners da página inicial' },
  { to: '/admin/funcionarios', label: 'Funcionários', icon: Users, description: 'Equipe exibida em cada setor' },
  { to: '/admin/suporte', label: 'Suporte Técnico', icon: LifeBuoy, description: 'Fale com o desenvolvedor do sistema' },
];
