# 💬 Smart Agentic AI Chat - Frontend Application

![License: PolyForm Noncommercial](https://img.shields.io/badge/License-PolyForm_Noncommercial-blue.svg)
![Architecture: Public Showcase](https://img.shields.io/badge/Architecture-Public_Showcase_%2F_Protected_Core-orange.svg)
![Mode: Mock Enabled](https://img.shields.io/badge/Dev_Mode-Mock_Support-green.svg)

Aplikasi antarmuka web modern berbasis **Next.js** dan **React** yang dirancang sebagai sarana interaksi cerdas, cepat, dan intuitif antara pengguna dengan sistem kecerdasan buatan **Agentic RAG AI**.

---

> [!NOTE]
> **💡 Information for Recruiters & Hiring Managers**
> 
> Repositori antarmuka ini dipublikasikan secara terbuka untuk demonstrasi kemampuan *Frontend Architecture*, *Design System*, dan *Integration Quality*.
> - **Local Development**: Menjalankan `npm run dev` pada lingkungan lokal terhubung ke **Mock Engine Mode** dengan *synthetic streaming data* untuk menguji responsivitas UI tanpa memerlukan setup kredensial LLM/API Key asli.
> - **Production Live Demo**: Versi terpasang secara *live* terhubung ke Cloudflare Workers Edge API resmi milik pemilik project.

---

## 📄 Deskripsi Aplikasi

Aplikasi frontend ini menyajikan pengalaman obrolan (*conversational UI*) yang responsif dan elegan. Pengguna dapat mengajukan berbagai pertanyaan terkait pedoman dan dokumen akademik, lalu menerima jawaban yang akurat, terstruktur, lengkap dengan rujukan kutipan halaman dokumen asli secara *real-time*.

Aplikasi dibangun dengan memprioritaskan kenyamanan pengguna (*User Experience*), kecepatan rendering, estetika modern, serta standar keamanan antarmuka yang ketat.

---

## ✨ Fitur-Fitur Utama

- **Antarmuka Obrolan AI Modern & Interaktif**:
  - Desain *Dark Mode* eksklusif dengan sentuhan estetika *glassmorphism* dan animasi mikro yang halus.
  - Performa tinggi dengan teknik virtualisasi daftar pesan untuk pengalaman obrolan yang tetap lancar (*60fps*) tanpa kendala.

- **Rendering Konten Kaya (*Rich Content Rendering*)**:
  - Dukungan lengkap untuk format Markdown, tabel data, serta penulisan rumus matematika LaTeX.
  - Fitur rujukan kutipan sumber (*Citations*) interaktif yang menampilkan asal halaman dokumen pendukung.

- **Manajemen Riwayat Obrolan**:
  - Penyimpanan riwayat percakapan yang aman dan terorganisir untuk memudahkan pengguna mengakses kembali obrolan sebelumnya.

- **Panel Manajemen Admin**:
  - Antarmuka khusus untuk administrator dalam memantau statistik sistem serta mengelola dokumen pedoman (unggah dan hapus dokumen).

- **Keamanan Antarmuka & Responsivitas Tingkat Tinggi**:
  - Penerapan proteksi keamanan *Security Headers* dan penyaringan teks input untuk mencegah potensi ancaman skrip berbahaya.
  - Responsif penuh untuk berbagai ukuran layar (Desktop, Tablet, dan Mobile).
  - Dukungan *Progressive Web App (PWA)* untuk pengalaman penggunaan layaknya aplikasi native.

---

## 🛠️ Teknologi Utama

- **Core Framework**: Next.js & React
- **Styling & Components**: TailwindCSS & Shadcn UI
- **State & Virtualization**: TanStack Virtual
- **Icons & Typography**: Lucide Icons & Google Fonts

---

## ⚖️ License

Aplikasi frontend ini dilindungi di bawah **[PolyForm Noncommercial License 1.0](LICENSE)**.
