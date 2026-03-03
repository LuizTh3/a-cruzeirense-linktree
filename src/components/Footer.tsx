export default function Footer() {
  return (
    <footer className="w-full bg-[#0a1929] border-t border-white/10 py-6 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-3">
        <p className="text-white/60 text-sm font-roboto">
          © Todos os direitos reservados A Cruzeirense Matriz
        </p>
        <p className="text-white/40 text-xs font-roboto">
          Desenvolvido por{' '}
          <a
            href="https://www.linkedin.com/in/luiz-gustavo-68a01a149/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors underline"
          >
            Luiz Gustavo
          </a>
        </p>
      </div>
    </footer>
  );
}
