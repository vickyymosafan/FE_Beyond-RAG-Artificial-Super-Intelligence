import { FileText, FileIcon, CheckCircle, Clock } from 'lucide-react';
import type { AdminDocument } from '@/lib/api/admin-service';

export function StatsCards({ docs }: { docs: AdminDocument[] }) {
  const total = docs.length;
  const ready = docs.filter(d => d.status === 'ready').length;
  const processing = docs.filter(d => d.status === 'processing').length;
  const pdfs = docs.filter(d => d.type === 'pdf').length;
  const docxs = docs.filter(d => d.type === 'docx').length;

  const cards = [
    { label: 'Total Dokumen', value: total, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Siap', value: ready, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Diproses', value: processing, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'PDF / DOCX', value: `${pdfs} / ${docxs}`, icon: FileIcon, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map(card => (
        <div key={card.label} className="rounded-xl border bg-card text-card-foreground p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xs transition-all hover:shadow-sm">
          <div className={`p-2.5 rounded-lg border ${card.bg} shrink-0`}>
            <card.icon className={`size-5 sm:size-6 ${card.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xl sm:text-2xl font-black tracking-tight text-foreground font-mono">{card.value}</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
