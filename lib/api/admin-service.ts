export interface AdminDocument {
  id: string; title: string; filename: string; type: string;
  total_pages: number; total_images: number; total_tables: number;
  status: string; version: number;
  created_at: string; updated_at: string;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

async function api(path: string, options?: RequestInit) {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    if (typeof window !== 'undefined') window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  return res.json();
}

export const adminService = {
  async login(username: string, password: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json() as Promise<{ token: string; expiresAt: number }>;
  },

  async getDocuments() {
    const data = await api('/api/admin/documents') as { documents: AdminDocument[] };
    return data.documents || [];
  },

  async getDocument(id: string) {
    return api(`/api/admin/documents/${id}`);
  },

  async deleteDocument(id: string) {
    return api(`/api/admin/documents/${id}`, { method: 'DELETE' });
  },

  async uploadDocument(file: File, docId: string, title: string) {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docId', docId);
    formData.append('title', title);
    const res = await fetch('/api/admin/documents/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
