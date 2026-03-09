interface SetorPromoCardProps {
  setorSlug: string;
}

export default function SetorPromoCard({ setorSlug }: SetorPromoCardProps) {
  return (
    <a 
      href={`/setor/promocoes?setor=${setorSlug}`}
      className="flex items-center justify-between gap-3 bg-[#0d213d] rounded-lg overflow-hidden no-underline transition-all duration-300 hover:bg-[#132d4d] border border-white/5 px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 xs:w-8 xs:h-8 xxs:w-8 xxs:h-8 rounded-full bg-[#1a5fa8] flex items-center justify-center">
          <i className="fa-solid fa-tags text-white text-sm"></i>
        </div>
        <span className="text-white font-roboto text-[0.9rem] xs:text-[0.8rem] xxs:text-[0.75rem] font-medium">
          Promoções e Ofertas
        </span>
      </div>
      <i className="fa-solid fa-chevron-right text-white/50 text-sm"></i>
    </a>
  );
}
