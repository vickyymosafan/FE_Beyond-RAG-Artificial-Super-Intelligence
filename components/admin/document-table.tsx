'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, Trash2, FileText, File } from 'lucide-react';
import { UploadDialog } from './upload-dialog';
import { adminService, type AdminDocument } from '@/lib/api/admin-service';
import { toast } from 'sonner';

export function DocumentTable({ docs, loading, onRefresh }: { docs: AdminDocument[]; loading: boolean; onRefresh: () => void }) {
  const [uploadOpen, setUploadOpen] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm('Hapus dokumen ini?')) return;
    try {
      await adminService.deleteDocument(id);
      toast.success('Dokumen dihapus');
      onRefresh();
    } catch { toast.error('Gagal menghapus'); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Dokumen</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}><RefreshCw className="size-4 mr-1" /> Refresh</Button>
          <Button size="sm" onClick={() => setUploadOpen(true)}><Upload className="size-4 mr-1" /> Upload</Button>
        </div>
      </div>
      <div className="rounded-xl border bg-card text-card-foreground shadow-xs overflow-hidden">
        <div className="overflow-x-auto scroll-smooth-native">
          <table className="w-full text-xs sm:text-sm min-w-[640px]">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left p-3 font-semibold text-muted-foreground">Judul Dokumen</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Tipe</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Halaman</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Tgl Upload</th>
                <th className="text-center p-3 font-semibold text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Memuat dokumen...</td></tr>
              ) : docs.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Belum ada dokumen yang diunggah.</td></tr>
              ) : docs.map(doc => (
                <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium text-foreground max-w-[240px] truncate" title={doc.title}>{doc.title}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium bg-muted px-2 py-0.5 rounded-md border">
                      {doc.type === 'pdf' ? <FileText className="size-3 text-red-500" /> : <File className="size-3 text-blue-500" />}
                      {doc.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    {doc.status === 'ready' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        Ready
                      </span>
                    ) : doc.status === 'processing' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                        Processing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-mono">{doc.total_pages || '-'}</td>
                  <td className="p-3 text-center text-xs font-mono text-muted-foreground">{doc.created_at?.slice(0, 10)}</td>
                  <td className="p-3 text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 touch-manipulation">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={onRefresh} />
    </div>
  );
}
