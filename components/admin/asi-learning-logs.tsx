import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CheckCircle2, XCircle, Brain, Target, ArrowRight, Zap, Database, KeySquare, Loader2 } from 'lucide-react';
import type { LearningLogEntry, LearningStats } from '@/lib/api/admin-service';

export function AsiLearningLogs({ 
  logs, 
  stats, 
  loading 
}: { 
  logs: LearningLogEntry[]; 
  stats: LearningStats | null;
  loading: boolean;
}) {
  const [selectedLog, setSelectedLog] = useState<LearningLogEntry | null>(null);

  if (loading) {
    return <div className="h-40 flex items-center justify-center text-muted-foreground animate-pulse">Memuat log ASI...</div>;
  }

  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-card/50 text-muted-foreground">
        <Brain className="size-10 mb-4 opacity-20" />
        <p>Belum ada log pembelajaran dari Agent-2.</p>
        <p className="text-sm opacity-60">Lakukan query di sistem RAG untuk mentrigger Agent ke-2.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* STATS CARDS */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Total Analisis</span>
            <span className="text-3xl font-bold">{stats.totalLogs}</span>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Berhasil Improved</span>
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.totalImproved}
            </span>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Tingkat Kesuksesan</span>
            <span className="text-3xl font-bold">
              {(stats.improvementRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Rata-rata Gap Ditemukan</span>
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {(stats.avgGapScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* LOGS TABLE */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/40 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-primary" /> Riwayat Transparansi Agent-2
          </div>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer flex flex-col gap-3 ${selectedLog?.id === log.id ? 'bg-muted/50' : ''}`}
              onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {log.providerUsed === 'in-progress' ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                        <Loader2 className="size-3 animate-spin" /> Sedang Diproses (Agent-2)
                      </span>
                    ) : log.wasImproved ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-800">
                        <CheckCircle2 className="size-3" /> Berhasil Improved
                      </span>
                    ) : log.providerUsed === 'verified-absent' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        <XCircle className="size-3" /> Dokumen Tidak Memuat (Verified Absent)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <CheckCircle2 className="size-3" /> Verifikasi Saja (Optimal)
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: idLocale })}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-1">"{log.query}"</h4>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Gap Ditemukan</span>
                    <span className="font-mono font-medium text-amber-600 dark:text-amber-400">{(log.gapScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">Score Peningkatan</span>
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-muted-foreground">{log.originalScore.toFixed(2)}</span>
                      {log.wasImproved && log.improvedScore && (
                        <>
                          <ArrowRight className="size-3 text-muted-foreground" />
                          <span className="text-green-600 dark:text-green-400 font-bold">{log.improvedScore.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {selectedLog?.id === log.id && (
                <div className="mt-2 pt-4 border-t border-dashed space-y-4 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        <Database className="size-3" /> Alasan / Insight
                      </div>
                      <p className="bg-muted p-3 rounded-md text-muted-foreground text-xs leading-relaxed">
                        {log.improvementReason || 'Tidak ada catatan khusus.'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        <KeySquare className="size-3" /> Missing Keywords
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {log.missingKeywords?.length > 0 ? (
                          log.missingKeywords.slice(0, 8).map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Tidak ada gap signifikan.</span>
                        )}
                        {log.missingKeywords?.length > 8 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">+{log.missingKeywords.length - 8} lagi</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {log.wasImproved && log.improvedAnswer && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400 text-xs uppercase tracking-wider">
                        <Zap className="size-3" /> Jawaban yang Diperbaiki (Otomatis masuk Cache)
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 p-4 rounded-md text-xs prose prose-sm max-w-none dark:prose-invert max-h-60 overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: log.improvedAnswer.replace(/\n/g, '<br/>') }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground flex justify-end">
                        Di-generate menggunakan model: <span className="font-mono ml-1">{log.providerUsed}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
