'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AsiLearningLogs } from '@/components/admin/asi-learning-logs';
import { adminService } from '@/lib/api/admin-service';
import type { LearningLogEntry, LearningStats } from '@/lib/api/admin-service';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function AsiLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LearningLogEntry[]>([]);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/vickymosafan'); return; }
    loadData(true);

    // Auto refresh every 6 seconds for real-time Agent-2 transparency (only when tab is visible)
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadData(false);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  async function loadData(showLoadingSpinner = false) {
    if (showLoadingSpinner) setLoading(true);
    try {
      const [logsData, statsData] = await Promise.all([
        adminService.getLearningLogs(50),
        adminService.getLearningStats()
      ]);
      setLogs(logsData);
      setStats(statsData);
    } catch { 
      /* handle error or token expiry silently */
    } finally { 
      if (showLoadingSpinner) setLoading(false); 
    }
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-full 2xl:max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Artificial Super Intelligence (ASI) Transparency Logs</h1>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 whitespace-nowrap shrink-0">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" /> Live (6s)
            </span>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => loadData(true)}
              disabled={loading}
              className="h-8 px-3 text-xs font-medium gap-1.5 touch-manipulation whitespace-nowrap shrink-0"
            >
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Memuat...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          Transparansi kerja otonom dari Dynamic Quad-Fusion Engine (D-RRF), Merkle Fact-Tree Hashing, GraphRAG &amp; Epistemic Firewall yang berjalan secara background.
        </p>

        <AsiLearningLogs logs={logs} stats={stats} loading={loading} />
      </div>
    </AdminLayout>
  );
}
