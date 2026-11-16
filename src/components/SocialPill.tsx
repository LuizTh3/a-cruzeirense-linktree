interface SocialPillProps {
  href: string;
  iconClass: string;
  label: string;
}

export default function SocialPill({ href, iconClass, label }: SocialPillProps) {
  return (
    <a
      href={href.trim()}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center gap-2.5 rounded-full border border-white/10 bg-white/5 pl-3 pr-4 text-sm font-medium text-white/90 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
    >
      <i className={`${iconClass} w-5 shrink-0 text-center text-lg`} aria-hidden="true"></i>
      <span className="truncate">{label}</span>
    </a>
  );
}
