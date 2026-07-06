# SecureLearn Dashboard

SecureLearn adalah dashboard web interaktif untuk membantu pengguna memahami keamanan data publik melalui asesmen risiko, modul pembelajaran, dan riwayat pemantauan keamanan.

## Fitur Utama

- Dashboard ringkasan hasil asesmen
- Asesmen risiko keamanan data
- Modul belajar berbasis topik keamanan
- Riwayat hasil asesmen sebelumnya
- Autentikasi pengguna untuk menyimpan progres
- Tampilan responsif untuk desktop dan mobile

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript Vanilla
- Chart.js
- Font Awesome
- Firebase (untuk autentikasi dan penyimpanan data)

## Struktur Folder

```text
.
├── assets/           # File statis seperti gambar dan ikon
├── data/             # Data soal dan konten
├── js/               # File JavaScript aplikasi
├── index.html        # Halaman utama
├── style.css         # Styling utama
└── README.md         # Dokumentasi proyek
```

## Cara Menjalankan

Karena proyek ini adalah aplikasi web statis, Anda dapat menjalankannya dengan server lokal sederhana.

### Opsi 1: Menggunakan Python

```bash
python -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

### Opsi 2: Menggunakan VS Code Live Server

Jika Anda menggunakan VS Code, cukup klik kanan pada file index.html lalu pilih Open with Live Server.

## Catatan

Agar fitur autentikasi dan integrasi data berjalan dengan baik, pastikan konfigurasi Firebase sudah disetup dengan benar pada file JavaScript yang terkait.

## Kontribusi

Jika ingin mengembangkan proyek ini lebih lanjut, Anda dapat menambah modul pembelajaran, memperbaiki desain UI, atau mengintegrasikan fitur analitik yang lebih lengkap.
