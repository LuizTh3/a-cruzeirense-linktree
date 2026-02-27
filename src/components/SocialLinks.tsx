import SocialPill from './SocialPill';
import { socialLinks } from '../constants/socialLinks';

export default function SocialLinks() {
  return (
    <>
      {socialLinks.map((link) => (
        <SocialPill
          key={link.href}
          href={link.href}
          iconClass={link.iconClass}
          label={link.label}
        />
      ))}
    </>
  );
}
