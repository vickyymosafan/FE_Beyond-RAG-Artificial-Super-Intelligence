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
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Judul</th>
              <th className="text-left p-3 font-medium">Tipe</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-center p-3 font-medium">Halaman</th>
              <th className="text-center p-3 font-medium">Upload</th>
              <th className="text-center p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Memuat...</td></tr>
            ) : docs.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Belum ada dokumen</td></tr>
            ) : docs.map(doc => (
              <tr key={doc.id} className="border-t hover:bg-muted/30">
                <td className="p-3 font-medium">{doc.title}</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full">
                    {doc.type === 'pdf' ? <FileText className="size-3" /> : <File className="size-3" />}
                    {doc.type.toUpperCase()}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    doc.status === 'ready' ? 'bg-green-100 text-green-700' :
                    doc.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>{doc.status}</span>
                </td>
                <td className="p-3 text-center">{doc.total_pages || '-'}</td>
                <td className="p-3 text-center text-xs text-muted-foreground">{doc.created_at?.slice(0, 10)}</td>
                <td className="p-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={onRefresh} />
    </div>
  );
}
