# SecureLearn Dashboard

SecureLearn adalah aplikasi dashboard web interaktif yang dirancang untuk membantu pengguna memahami keamanan data publik melalui asesmen risiko, modul pembelajaran, dan riwayat pemantauan keamanan. Aplikasi ini cocok digunakan sebagai media edukasi digital untuk meningkatkan kesadaran pengguna terhadap keamanan informasi.

## Tujuan Proyek

Proyek ini bertujuan untuk:

- memberi pemahaman dasar tentang keamanan data publik;
- membantu pengguna melakukan asesmen risiko keamanan;
- menyediakan modul belajar yang terstruktur;
- menyimpan hasil asesmen dan progres pengguna secara terkelola.

## Fitur Utama

- Dashboard utama yang menampilkan ringkasan hasil asesmen
- Form asesmen risiko keamanan data
- Modul pembelajaran interaktif
- Riwayat hasil asesmen sebelumnya
- Fitur login dan registrasi pengguna
- Penyimpanan data pengguna melalui Firebase
- Tampilan responsif untuk desktop dan mobile

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript Vanilla
- Chart.js
- Font Awesome
- Firebase Authentication
- Firebase Firestore

## Persyaratan Sistem

Sebelum menginstal, pastikan perangkat Anda sudah memiliki:

- Browser modern (Chrome, Edge, Firefox)
- VS Code (disarankan) atau editor teks lain
- Python 3.x, jika ingin menjalankan server lokal melalui Python
- Akun Firebase untuk fitur autentikasi dan database

## Langkah Instalasi

### 1. Clone atau unduh proyek

Jika Anda menggunakan Git, jalankan:

```bash
git clone <url-repository>
cd elearning-security/dashboard
```

Jika belum menggunakan Git, unduh file proyek sebagai ZIP lalu ekstrak ke folder lokal.

### 2. Buka folder proyek

Buka folder proyek di VS Code atau editor lain.

### 3. Konfigurasi Firebase

Aplikasi ini menggunakan Firebase untuk login, registrasi, dan penyimpanan data. Pastikan Anda melakukan langkah berikut:

1. Buka Firebase Console.
2. Buat project baru atau pilih project yang sudah ada.
3. Aktifkan Authentication.
4. Aktifkan Email/Password sebagai metode login.
5. Aktifkan Firestore Database.
6. Ambil konfigurasi project Anda dari menu Project Settings.
7. Buka file js/firebase-config.js lalu ganti nilai konfigurasi Firebase dengan konfigurasi Anda.

Contoh struktur konfigurasi:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

> Jika konfigurasi Firebase belum diperbarui, fitur login dan penyimpanan data mungkin tidak berjalan.

## Cara Menjalankan Aplikasi

Karena proyek ini adalah aplikasi web statis, Anda tidak perlu menjalankan build tools. Cukup jalankan server lokal.

### Opsi 1: Menggunakan Python

Jalankan perintah berikut di folder proyek:

```bash
python -m http.server 8000
```

Setelah itu buka browser dan akses:

```text
http://localhost:8000
```

### Opsi 2: Menggunakan VS Code Live Server

Jika Anda menggunakan VS Code:

1. Instal ekstensi Live Server.
2. Klik kanan pada file index.html.
3. Pilih Open with Live Server.

Browser akan terbuka secara otomatis dan aplikasi siap digunakan.

## Cara Menggunakan Aplikasi

Setelah aplikasi berjalan, Anda dapat:

1. Membuka halaman dashboard.
2. Melakukan asesmen risiko keamanan data.
3. Menjelajahi modul pembelajaran.
4. Mendaftar atau login untuk menyimpan progres.
5. Melihat riwayat hasil asesmen Anda.

## Struktur Folder Proyek

```text
.
├── assets/              # File gambar, ikon, dan aset statis
├── data/                # Data pertanyaan dan konten modul
├── js/                  # Script aplikasi dan integrasi Firebase
│   ├── api.js
│   ├── app.js
│   ├── auth-service.js
│   ├── auth-ui.js
│   ├── db-service.js
│   ├── firebase-config.js
│   └── modules.js
├── index.html           # Halaman utama aplikasi
├── style.css            # File stylesheet utama
└── README.md            # Dokumentasi proyek
```

## Troubleshooting

Jika aplikasi tidak berjalan dengan baik, cek beberapa hal berikut:

- Pastikan Anda membuka proyek melalui server lokal, bukan langsung membuka file HTML dari sistem.
- Pastikan konfigurasi Firebase sudah benar.
- Pastikan browser tidak memblokir akses ke CDN eksternal seperti Chart.js atau Font Awesome.
- Periksa console browser jika ada error JavaScript.

## Kontribusi

Jika Anda ingin mengembangkan proyek ini lebih lanjut, saran yang bisa ditambahkan antara lain:

- menambah modul pembelajaran;
- memperbaiki desain antarmuka;
- menambahkan dashboard analitik yang lebih lengkap;
- mengintegrasikan fitur notifikasi atau rekomendasi otomatis.

## Penutup

Proyek ini siap digunakan sebagai aplikasi edukasi keamanan data publik yang sederhana namun fungsional. Dengan langkah instalasi di atas, Anda dapat menjalankan aplikasi secara lokal dan mulai menggunakannya dengan cepat.

## Klompok D8 
```
Judul Aplikasi: Aplikasi E-Learning Edukasi Keamanan Data Publik dengan AI Risk Awareness.
Dibuat Oleh:
1.Azaky Qolby Prawiro
2.Sabda Aidilah Farel Raihan
3.Wildan Maulana
```