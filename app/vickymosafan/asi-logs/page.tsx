'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AsiLearningLogs } from '@/components/admin/asi-learning-logs';
import { adminService } from '@/lib/api/admin-service';
import type { LearningLogEntry, LearningStats } from '@/lib/api/admin-service';

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
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Artificial Super Intelligence (ASI) Transparency Logs</h1>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500 animate-ping" /> Live Polling (6s)
            </span>
            <button 
              onClick={() => loadData(true)}
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh Manual'}
            </button>
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
