'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wallet, Users, LayoutDashboard, PlusCircle, Lock, LogOut, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoginModal } from '@/components/auth/LoginModal';
import { logoutAdminAction } from '@/app/actions/auth';
import { toast } from 'sonner';

interface NavbarProps {
  onOpenQuickInput?: () => void;
  isAdmin?: boolean;
}

export function Navbar({ onOpenQuickInput, isAdmin = false }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      label: 'Data Anggota',
      href: '/anggota',
      icon: Users,
      active: pathname.startsWith('/anggota'),
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAdminAction();
    setIsLoggingOut(false);
    toast.success('Berhasil logout. Status kembali menjadi Guest.');
    window.location.reload();
  };

  const handleQuickInputClick = () => {
    if (isAdmin) {
      if (onOpenQuickInput) onOpenQuickInput();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                KasMinggu
                <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                  v1.0
                </span>
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">
                Pencatat Kas Mingguan Cepat & Transparan
              </p>
            </div>
          </Link>

          {/* Navigation Tabs & Auth */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
                    item.active
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xs:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Status / Login Toggle */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 ml-1 sm:ml-2 pl-2 border-l border-slate-200">
                <Badge variant="success" className="gap-1 hidden sm:flex text-xs py-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 gap-1 px-2.5"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="ml-1 sm:ml-2 pl-2 border-l border-slate-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-xs gap-1.5 text-slate-700 hover:text-emerald-800 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                  title="Login Admin untuk mengelola data"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Login Admin</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          if (onOpenQuickInput) onOpenQuickInput();
        }}
      />
    </>
  );
}
