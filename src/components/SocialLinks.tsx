import SocialPill from './SocialPill';
import Container from './layout/Container';
import { promoWhatsAppGroup, socialLinks } from '../constants/socialLinks';

interface SocialSectionProps {
  subtitle?: string;
  /** Mostra o atalho do grupo de clientes no WhatsApp. */
  showGroup?: boolean;
}

/** Bloco "Redes sociais", igual em todas as páginas públicas. */
export default function SocialSection({
  subtitle = 'Confira as melhores promoções da cidade',
  showGroup = true,
}: SocialSectionProps) {
  return (
    <section id="redes-sociais" className="mt-12 scroll-mt-6 lg:mt-16">
      <Container>
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface-card/70 p-5 backdrop-blur-sm lg:px-6">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-white md:text-lg">Redes sociais</h2>
            <p className="mt-0.5 text-sm text-white/60">{subtitle}</p>
          </div>

          <div className="grid gap-2 sm:flex sm:flex-wrap">
            {socialLinks.map((link) => (
              <SocialPill key={link.href} href={link.href} iconClass={link.iconClass} label={link.label} />
            ))}

            {showGroup && (
              <a
                href={promoWhatsAppGroup}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2.5 rounded-full bg-brand pl-3 pr-4 text-sm font-medium text-white transition-colors hover:bg-bg-container-mid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
              >
                <i className="fa-solid fa-user-group w-5 shrink-0 text-center text-base" aria-hidden="true"></i>
                <span className="truncate">Grupo de clientes (promoções)</span>
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
