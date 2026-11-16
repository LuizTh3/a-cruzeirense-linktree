import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { LogOut, Menu } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Container from './Container';
import { adminNav } from './adminNav';
import Footer from '../Footer';

interface AdminShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function AdminShell({ title, description, children }: AdminShellProps) {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  async function sair() {
    try {
      await signOut(auth);
    } finally {
      navigate('/admin');
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-surface-deep/90 backdrop-blur">
        <Container className="flex h-14 items-center gap-3">
          <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Administração</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-3">
                {adminNav.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMenuAberto(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-brand text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                      )
                    }
                  >
                    <Icon className="size-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/admin/dashboard" className="flex shrink-0 items-center gap-2">
            <img src="/assets/images/ACRUZEIRENSE.png" alt="A Cruzeirense" className="h-7 w-auto" />
            <span className="hidden text-xs font-medium uppercase tracking-wide text-white/50 sm:inline">Admin</span>
          </Link>

          <nav aria-label="Administração" className="ml-4 hidden items-center gap-0.5 lg:flex">
            {adminNav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="lg" asChild className="hidden sm:inline-flex">
              <Link to="/">Ver site</Link>
            </Button>
            <Button variant="outline" size="lg" onClick={sair}>
              <LogOut />
              Sair
            </Button>
          </div>
        </Container>
      </header>

      <main className="flex-1 py-8 lg:py-10">
        <Container>
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h1>
            {description && <p className="mt-1 text-sm text-white/65 md:text-base">{description}</p>}
          </div>
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
