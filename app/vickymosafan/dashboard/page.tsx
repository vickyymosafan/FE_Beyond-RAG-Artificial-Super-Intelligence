'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/admin-layout';
import { StatsCards } from '@/components/admin/stats-cards';
import { DocumentTable } from '@/components/admin/document-table';
import { adminService } from '@/lib/api/admin-service';
import type { AdminDocument } from '@/lib/api/admin-service';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [docs, setDocs] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/vickymosafan'); return; }
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      const data = await adminService.getDocuments();
      setDocs(data);
    } catch { /* token expired */ } finally { setLoading(false); }
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <StatsCards docs={docs} />
        <DocumentTable docs={docs} loading={loading} onRefresh={loadDocs} />
      </div>
    </AdminLayout>
  );
}
