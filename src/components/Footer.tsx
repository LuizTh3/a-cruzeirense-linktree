import { MapPin } from 'lucide-react';
import Container from './layout/Container';

const endereco = 'Avenida Desembargador Távora, N° 10 - Centro, Cruzeiro do Sul - AC';
const googleMapsUrl =
  'https://www.google.com/maps/place/A+Cruzeirense+Matriz+-+Roupas,Cama,Mesa,Banho,M%C3%B3veis,Eletrodom%C3%A9sticos,Tecidos/@-7.6376885,-72.6682093,19.04z/data=!4m6!3m5!1s0x9199cdcf3bc9fdc9:0x4f1cb71838f99841!8m2!3d-7.6375806!4d-72.6686198!16s%2Fg%2F11n7bbxqwh!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDMwOS4wIKXMDSoASAFQAw%3D%3D';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-deep">
      <Container className="flex flex-col items-center gap-4 py-6 text-center md:flex-row md:justify-between md:text-left">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <MapPin className="size-4 shrink-0 text-action" />
          {endereco}
        </a>

        <div className="text-xs text-white/50 md:text-right">
          <p>© {new Date().getFullYear()} A Cruzeirense Matriz · Todos os direitos reservados</p>
          <p className="mt-1 text-white/40">
            Desenvolvido por{' '}
            <a
              href="https://www.linkedin.com/in/luiz-gustavo-68a01a149/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Luiz Gustavo
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
