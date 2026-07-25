# 💬 Smart Agentic AI Chat - Frontend Application

Aplikasi web modern berbasis **Next.js 16 (App Router)**, **React 19**, **TailwindCSS**, dan **Shadcn UI** yang berfungsi sebagai antarmuka antaraksi cerdas untuk sistem **Agentic RAG AI**.

---

## ✨ Fitur Utama

- **Antarmuka Chat Interaktif & Responsif**:
  - Tampilan *dark mode* modern dengan efek *glassmorphic* & animasi halus.
  - Virtualisasi daftar pesan menggunakan `@tanstack/react-virtual` untuk performa cepat 60fps meskipun berisi ribuan pesan.
  - Rendering Markdown lengkap dengan *syntax highlighting* & matematika LaTeX (`katex`).
  - Popover rujukan sumber (*Citations*) interaktif lengkap dengan halaman dokumen pedoman.
- **Admin Dashboard Tersembunyi (*Route Obscuration*)**:
  - Halaman Admin terisolasi pada rute khusus `/vickymosafan` & `/vickymosafan/dashboard` (rute standar `/admin` mengembalikan tampilan *404 Not Found* sebagai perlindungan dari bot/hacker).
  - Ringkasan statistik dokumen & manajemen unggah/hapus file PDF/DOCX.
- **Keamanan Tingkat Tinggi**:
  - Penerapan **HTTP Security Headers** (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
  - Penyaringan pesan input (*Input Sanitizer*) untuk mencegah serangan XSS & Script Injection.
- **Defensive Storage & PWA Support**:
  - Penyimpanan riwayat percakapan lokal di `localStorage` dengan penanganan *try-catch* defensif.
  - Dukungan **Progressive Web App (PWA)** lengkap dengan manifes web & prompt instalasi iOS/Android.

---

## 🎨 Struktur Proyek

```text
frontend1/
├── app/
│   ├── page.tsx               # Halaman Beranda Chat Utama
│   ├── vickymosafan/          # Halaman Login Admin & Dashboard
│   │   ├── page.tsx           # Form Login Admin
│   │   └── dashboard/page.tsx # Panel Manajemen Dokumen & Statistik
│   ├── admin/page.tsx         # Decoy 404 Route
│   ├── error.tsx              # Root Error Boundary
│   ├── not-found.tsx          # Halaman 404 Custom
│   └── globals.css            # Desain Sistem & Tema CSS
├── components/
│   ├── chat/                  # Komponen Chat (Container, MessageList, MessageItem, Input)
│   ├── admin/                 # Komponen Panel Admin (Dashboard Layout, DocumentTable, UploadDialog)
│   ├── layout/                # Sidebar, Header, & Navigation
│   └── ui/                    # Komponen Basis Shadcn UI
├── hooks/                     # Custom React Hooks (useMessages, useChatHistory, useOnboarding, etc.)
├── lib/
│   ├── api/                   # Service API (chat-service.ts, admin-service.ts)
│   ├── constants.ts           # Sentralisasi Kunci Storage & Rute API
│   ├── error-handler.ts       # Centralized Error Logger
│   └── utils.ts               # Utility Helper & Input Sanitizer
├── types/                     # Definisi Tipe Data TypeScript Strict
├── next.config.mjs            # Konfigurasi Next.js, Security Headers, & API Rewrites
└── README.md
```

---

## 🚀 Panduan Memulai

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Jalankan Mode Pengembang (Development)
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### 3. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🔐 Navigasi Rute Rahasia Admin

- **Halaman Utama Chat**: `http://localhost:3000/`
- **Login Admin**: `http://localhost:3000/vickymosafan`
- **Dashboard Admin**: `http://localhost:3000/vickymosafan/dashboard`

---

## 📄 Lisensi
© 2026 - Portfolio Project RAG AI Agentic. All Rights Reserved.
