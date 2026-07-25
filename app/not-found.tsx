import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-4 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileQuestion className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Halaman Tidak Ditemukan (404)</h2>
        <p className="text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  )
}
