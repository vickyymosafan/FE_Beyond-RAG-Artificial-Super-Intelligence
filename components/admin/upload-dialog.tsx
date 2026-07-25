'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminService } from '@/lib/api/admin-service';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

export function UploadDialog({ open, onOpenChange, onSuccess }: {
  open: boolean; onOpenChange: (v: boolean) => void; onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return;
    setLoading(true);
    try {
      const docId = `doc-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      await adminService.uploadDocument(file, docId, title);
      toast.success('Dokumen berhasil diupload');
      onOpenChange(false);
      setFile(null);
      setTitle('');
      onSuccess();
    } catch (err) { toast.error('Gagal upload: ' + (err instanceof Error ? err.message : err)); console.error(err); } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Upload Dokumen</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">File (PDF/DOCX)</label>
            <Input type="file" accept=".pdf,.docx" onChange={e => setFile(e.target.files?.[0] || null)} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Judul Dokumen</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama dokumen" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <Upload className="size-4 mr-1" /> {loading ? 'Mengupload...' : 'Upload'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
