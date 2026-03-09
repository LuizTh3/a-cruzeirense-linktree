export default function Footer() {
  const endereco = "R. Des. Távora, 10 - Centro, Cruzeiro do Sul - AC";
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;

  return (
    <footer className="w-full bg-[#0a1929] border-t border-white/10 py-5 px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-3 sm:gap-6 mb-4">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white/70 text-sm font-roboto hover:text-white transition-colors"
          >
            <i className="fa-solid fa-location-dot text-action"></i>
            {endereco}
          </a>
        </div>

        <div className="text-center border-t border-white/10 pt-4">
          <p className="text-white/50 text-xs font-roboto mb-1">
            © {new Date().getFullYear()} A Cruzeirense Matriz - Todos os direitos reservados
          </p>
          <p className="text-white/30 text-[0.7rem] font-roboto">
            Desenvolvido por{' '}
            <a
              href="https://www.linkedin.com/in/luiz-gustavo-68a01a149/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              Luiz Gustavo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
