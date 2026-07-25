import { FileText, FileIcon, CheckCircle, Clock } from 'lucide-react';
import type { AdminDocument } from '@/lib/api/admin-service';

export function StatsCards({ docs }: { docs: AdminDocument[] }) {
  const total = docs.length;
  const ready = docs.filter(d => d.status === 'ready').length;
  const processing = docs.filter(d => d.status === 'processing').length;
  const pdfs = docs.filter(d => d.type === 'pdf').length;
  const docxs = docs.filter(d => d.type === 'docx').length;

  const cards = [
    { label: 'Total Dokumen', value: total, icon: FileText, color: 'text-blue-600' },
    { label: 'Siap', value: ready, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Diproses', value: processing, icon: Clock, color: 'text-yellow-600' },
    { label: 'PDF / DOCX', value: `${pdfs} / ${docxs}`, icon: FileIcon, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div key={card.label} className="rounded-lg border p-4 flex items-center gap-3">
          <card.icon className={`size-8 ${card.color}`} />
          <div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
