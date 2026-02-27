// src/components/SocialPill.tsx

interface SocialPillProps {
  href: string;
  iconClass: string;
  label: string;
}

export default function SocialPill({ href, iconClass, label }: SocialPillProps) {
  return (
    <a
      href={href}
      className="group flex items-center relative w-full py-4.5 px-6.25 bg-[#e0e0e0] text-[#333] no-underline rounded-2xl font-bold text-[1rem] border border-[rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#ffffff] hover:brightness-110 hover:-translate-y-0.75 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
    >
      <i 
        // scale-[1.2] reflete exatamente o seu scale(1.2) do CSS
        className={`${iconClass} mr-3.75 text-[1.6rem] transition-transform duration-300 ease-in-out group-hover:scale-[1.2]`}
      ></i>
      
      <span className="grow text-center mr-7.5">
        {label}
      </span>
    </a>
  );
}