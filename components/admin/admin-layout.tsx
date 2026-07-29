'use client';
import { useRouter } from 'next/navigation';
import { LogOut, FileText, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function handleLogout() {
    try {
      localStorage.removeItem('admin_token');
    } catch { /* ignore */ }
    router.push('/vickymosafan');
  }

  return (
    <div className="flex h-dvh bg-background">
      <aside className="w-56 border-r bg-sidebar flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sidebar-foreground">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground font-medium" onClick={() => router.push('/vickymosafan/dashboard')}>
            <LayoutDashboard className="size-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground font-medium" onClick={() => router.push('/vickymosafan/asi-logs')}>
            <FileText className="size-4" /> ASI Logs
          </Button>
        </nav>
        <div className="p-3 border-t mt-auto space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="size-4" /> Keluar
          </Button>
          <div className="px-2 text-[10px] text-muted-foreground/60 font-mono tracking-tight text-center">
            © 2026 vickymosafan
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
