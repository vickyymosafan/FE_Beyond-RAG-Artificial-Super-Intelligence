'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('[GlobalError Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-4 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Terjadi Kesalahan Aplikasi</h2>
        <p className="text-sm text-muted-foreground">
          Sistem mengalami kendala tak terduga. Silakan coba muat ulang halaman ini.
        </p>
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    </div>
  )
}
