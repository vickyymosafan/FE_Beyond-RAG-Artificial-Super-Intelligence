'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LogOut, 
  FileText, 
  LayoutDashboard, 
  Menu, 
  Sun, 
  Moon, 
  Settings, 
  Palette, 
  Circle, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/providers/theme-provider';
import { UI_STRINGS } from '@/lib/constants';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleLogout() {
    try {
      localStorage.removeItem('admin_token');
    } catch { /* ignore */ }
    router.push('/vickymosafan');
  }

  const navItems = [
    { label: 'Dashboard', path: '/vickymosafan/dashboard', icon: LayoutDashboard },
    { label: 'ASI Logs', path: '/vickymosafan/asi-logs', icon: FileText },
  ];

  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-background">
      {/* ─── UNIFIED HEADER (MATCHES CHAT UI HEADER) ─────────────────────────── */}
      <header className="h-14 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center justify-between px-3 sm:px-4 shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Sheet Trigger Button (< md) */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 touch-manipulation">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu admin</span>
              </Button>
            </SheetTrigger>

            {/* Mobile Sheet Drawer (Matches mobile-nav.tsx) */}
            <SheetContent side="left" className="w-[85vw] max-w-80 p-0 flex flex-col justify-between bg-sidebar border-r border-sidebar-border">
              <SheetHeader className="p-4 border-b border-sidebar-border text-left">
                <div className="flex items-center gap-2.5">
                  <Image 
                    src={UI_STRINGS.UMJ_LOGO_PATH} 
                    alt="UMJ Logo" 
                    width={32} 
                    height={32} 
                    className="h-8 w-8 rounded-full shrink-0" 
                  />
                  <div>
                    <SheetTitle className="text-sm font-bold text-sidebar-foreground">Admin Panel</SheetTitle>
                    <p className="text-[11px] text-muted-foreground">Smartchat AI Superpowers</p>
                  </div>
                </div>
              </SheetHeader>

              {/* Navigation Items in Drawer */}
              <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigasi Utama
                </div>
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`w-full justify-start gap-2.5 text-xs sm:text-sm h-10 touch-manipulation font-medium ${
                        isActive 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs' 
                          : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                      onClick={() => {
                        router.push(item.path);
                        setMobileOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-primary" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Footer in Drawer */}
              <div className="p-3 border-t border-sidebar-border space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs sm:text-sm h-10 touch-manipulation font-medium"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Keluar Sesi</span>
                </Button>
                <div className="px-2 text-[10px] text-muted-foreground/70 font-mono tracking-tight text-center">
                  © 2026 vickymosafan
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo & Title Header */}
          <div className="flex items-center gap-2">
            <Image 
              src={UI_STRINGS.UMJ_LOGO_PATH} 
              alt="UMJ Logo" 
              width={28} 
              height={28} 
              className="h-7 w-7 rounded-full shrink-0" 
            />
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">Admin Panel</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="size-3" /> Superpowers Active
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions (Settings & Theme Dropdown - Matches Chat Header) */}
        <div className="flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 touch-manipulation" title="Pengaturan Tampilan">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Buka menu pengaturan</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Tampilan Perangkat</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 mr-2" />
                Mode Terang
                {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                Mode Gelap
                {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Settings className="h-4 w-4 mr-2" />
                Sistem
                {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Skema Warna</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setColorScheme('default')}>
                <Palette className="h-4 w-4 mr-2 text-cyan-500" />
                Default
                {colorScheme === 'default' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColorScheme('ungu')}>
                <Palette className="h-4 w-4 mr-2 text-purple-500" />
                Ungu
                {colorScheme === 'ungu' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColorScheme('netral')}>
                <Circle className="h-4 w-4 mr-2 text-gray-500" />
                Netral
                {colorScheme === 'netral' && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ─── BODY CONTAINER (SIDEBAR + MAIN CONTENT AREA) ─────────────────────── */}
      <div className="flex flex-1 min-w-0 h-0 overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile < md) */}
        <aside className="hidden md:flex w-56 border-r bg-sidebar flex-col shrink-0">
          <div className="p-3.5 border-b border-sidebar-border flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span className="font-semibold text-xs text-sidebar-foreground uppercase tracking-wider">Navigasi Admin</span>
          </div>

          <nav className="flex-1 p-2.5 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-2.5 text-xs sm:text-sm h-9 font-medium transition-colors ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs' 
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                  onClick={() => router.push(item.path)}
                >
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border mt-auto space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs sm:text-sm h-8 font-medium" 
              onClick={handleLogout}
            >
              <LogOut className="size-4" /> Keluar
            </Button>
            <div className="px-2 text-[10px] text-muted-foreground/60 font-mono tracking-tight text-center">
              © 2026 vickymosafan
            </div>
          </div>
        </aside>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth-native bg-background">{children}</main>
      </div>
    </div>
  );
}
