'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Users, LayoutDashboard, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onOpenQuickInput?: () => void;
}

export function Navbar({ onOpenQuickInput }: NavbarProps) {
  const pathname = usePathname();

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

  return (
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

        {/* Navigation Tabs */}
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
                <span>{item.label}</span>
              </Link>
            );
          })}

          {onOpenQuickInput && (
            <Button
              onClick={onOpenQuickInput}
              size="sm"
              className="ml-2 hidden sm:flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Kas Cepat</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
