'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check, Trash2, ShieldAlert, Key, Terminal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminService } from '@/lib/api/admin-service';

export function RecoveryGuide() {
  const [copied, setCopied] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  const command = 'npx wrangler secret put GEMINI_API_KEY';

  function handleCopy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleClearCache() {
    setClearing(true);
    setClearMessage(null);
    try {
      const res = await adminService.clearCache();
      setClearMessage(`✓ Cache berhasil dibersihkan! (${res.deleted || 0} kunci KV dihapus)`);
    } catch {
      setClearMessage('❌ Gagal membersihkan cache. Pastikan Anda sudah login.');
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Panduan Pemulihan API Key & Maintenance System</h3>
            <p className="text-xs text-muted-foreground">
              Jika AI mengembalikan respon &ldquo;Maaf, informasi tidak ditemukan&rdquo;, ikuti 3 langkah pemulihan cepat berikut:
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30 shrink-0 self-start sm:self-auto">
          Emergency Playbook
        </span>
      </div>

      {/* 3 Steps Container */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* Step 1 */}
        <div className="p-4 rounded-lg border bg-card/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <Key className="size-4 shrink-0" />
              <span>1. Buat API Key Baru</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Buka Google AI Studio untuk membuat atau mengganti kunci API Gemini yang telah dinonaktifkan oleh Google.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5 text-xs h-8 mt-2"
            onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
          >
            Google AI Studio <ExternalLink className="size-3.5" />
          </Button>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-lg border bg-card/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              <Terminal className="size-4 shrink-0" />
              <span>2. Update Secret Cloudflare</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jalankan perintah ini pada terminal folder <code className="bg-muted px-1 py-0.5 rounded text-[11px]">backend</code>:
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-950 text-zinc-100 p-2 rounded-md font-mono text-[11px] justify-between border border-zinc-800">
            <span className="truncate">{command}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={handleCopy}
            >
              {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
            </Button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-lg border bg-card/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
              <Trash2 className="size-4 shrink-0" />
              <span>3. Bersihkan KV Cache</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hapus seluruh KV Cache RAG agar respon &ldquo;Maaf&rdquo; yang lama langsung diperbarui dengan jawaban akurat.
            </p>
          </div>
          <div className="space-y-1.5 mt-2">
            <Button
              size="sm"
              variant="default"
              className="w-full gap-1.5 text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white"
              onClick={handleClearCache}
              disabled={clearing}
            >
              {clearing ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              Bersihkan Cache Sekarang
            </Button>
            {clearMessage && (
              <div className={`text-[11px] p-1.5 rounded font-medium text-center ${clearMessage.startsWith('✓') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'}`}>
                {clearMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
