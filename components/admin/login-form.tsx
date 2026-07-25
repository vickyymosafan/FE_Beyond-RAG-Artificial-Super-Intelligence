'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminService } from '@/lib/api/admin-service';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await adminService.login(username, password);
      localStorage.setItem('admin_token', token);
      toast.success('Login berhasil');
      router.push('/vickymosafan/dashboard');
    } catch {
      toast.error('Username atau password salah');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Masuk'}
      </Button>
    </form>
  );
}
