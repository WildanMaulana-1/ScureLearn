// ============================================================
// DATA MODUL KEAMANAN DATA
// ============================================================

const SECURITY_MODULES = [
    {
        id: "password-security",
        title: "Keamanan Password",
        subtitle: "Dasar perlindungan akun digital",
        emoji: "🔑",
        difficulty: "beginner",
        readTime: "8 menit",
        category: "password",
        description: "Pelajari cara membuat dan mengelola password yang kuat untuk melindungi semua akun digitalmu.",
        content: `
            <h3><i class="fas fa-key"></i> Mengapa Password Kuat Itu Penting?</h3>
            <p>Password adalah garis pertahanan pertama akun digitalmu. Password yang lemah dapat dicrack dalam hitungan detik menggunakan tools otomatis yang tersedia di dark web.</p>
            
            <div class="danger-box">
                <strong>⚠️ Fakta Mengejutkan:</strong> Password "123456" telah dipakai oleh 23 juta akun dan dapat dicrack dalam kurang dari 1 detik. Password "nama123" hanya butuh 3 menit untuk dibobol.
            </div>

            <h3><i class="fas fa-ruler"></i> Standar Password yang Kuat</h3>
            <ul>
                <li><strong>Panjang minimal 12 karakter</strong> — semakin panjang, semakin kuat</li>
                <li><strong>Kombinasi karakter</strong> — huruf besar (A-Z), huruf kecil (a-z), angka (0-9), simbol (!@#$%)</li>
                <li><strong>Tidak mengandung info personal</strong> — nama, tanggal lahir, nomor HP</li>
                <li><strong>Tidak berurutan</strong> — hindari "abcdef", "123456", "qwerty"</li>
                <li><strong>Unik untuk setiap akun</strong> — jangan reuse password</li>
            </ul>

            <h3><i class="fas fa-lightbulb"></i> Teknik Passphrase</h3>
            <p>Passphrase adalah kombinasi 4-5 kata acak yang mudah diingat namun sangat sulit dicrack:</p>
            <div class="tip-box">
                <strong>Contoh Passphrase Kuat:</strong><br>
                ✅ "Langit-Hijau-Meja-Kucing-2024!"<br>
                ✅ "Sumber!Air@Pegunungan#Segar"<br>
                ❌ "password123" (sangat lemah)<br>
                ❌ "NamaKamu1990" (mudah ditebak)
            </div>

            <h3><i class="fas fa-exclamation-triangle"></i> Kesalahan Password Paling Umum</h3>
            <ul>
                <li>Menggunakan nama sendiri, pasangan, atau anak</li>
                <li>Menggunakan tanggal lahir atau anniversary</li>
                <li>Menambahkan angka atau "!" di akhir kata biasa</li>
                <li>Menggunakan password sama di banyak akun</li>
                <li>Menulis password di sticky note atau notes HP</li>
            </ul>

            <h3><i class="fas fa-sync"></i> Kapan Harus Ganti Password?</h3>
            <ul>
                <li>Setiap 3-6 bulan untuk akun kritikal (bank, email)</li>
                <li>Segera setelah ada notifikasi data breach</li>
                <li>Setelah berbagi password dengan siapapun</li>
                <li>Jika mencurigai perangkat terkena malware</li>
                <li>Setelah menggunakan perangkat publik</li>
            </ul>

            <h3><i class="fas fa-check-circle"></i> Checklist Keamanan Password</h3>
            <div class="checklist-item"><i class="fas fa-check"></i> Semua akun penting menggunakan password unik</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Password minimal 12 karakter dengan campuran karakter</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Tidak ada info personal dalam password</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Tidak menyimpan password di tempat tidak aman</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Rutin mengganti password akun kritikal</div>
        `
    },
    {
        id: "password-manager",
        title: "Password Manager",
        subtitle: "Kelola ratusan password dengan aman",
        emoji: "🗄️",
        difficulty: "beginner",
        readTime: "6 menit",
        category: "password",
        description: "Pahami cara kerja password manager dan mengapa ini adalah solusi terbaik untuk keamanan password.",
        content: `
            <h3><i class="fas fa-vault"></i> Apa itu Password Manager?</h3>
            <p>Password manager adalah aplikasi yang menyimpan dan mengelola semua passwordmu dalam satu vault terenkripsi. Kamu hanya perlu mengingat satu "master password" yang sangat kuat.</p>
            
            <div class="tip-box">
                <strong>💡 Fakta:</strong> Rata-rata orang memiliki 100+ akun online. Mustahil mengingat 100 password unik dan kuat tanpa bantuan alat. Password manager adalah solusinya.
            </div>

            <h3><i class="fas fa-shield-alt"></i> Bagaimana Password Manager Bekerja?</h3>
            <ol>
                <li><strong>Enkripsi AES-256</strong> — Data dienkripsi sebelum dikirim ke server</li>
                <li><strong>Zero-knowledge architecture</strong> — Bahkan provider tidak bisa melihat passwordmu</li>
                <li><strong>Master password</strong> — Satu-satunya kunci untuk membuka vault</li>
                <li><strong>Auto-fill</strong> — Otomatis isi password saat login</li>
            </ol>

            <h3><i class="fas fa-star"></i> Password Manager yang Direkomendasikan</h3>
            <ul>
                <li><strong>Bitwarden</strong> — Open source, gratis, sangat terpercaya ✅ Rekomendasi terbaik</li>
                <li><strong>1Password</strong> — Premium, fitur lengkap, cocok untuk tim</li>
                <li><strong>Dashlane</strong> — User-friendly, ada dark web monitoring</li>
                <li><strong>KeePassXC</strong> — Offline, open source, untuk yang tidak mau cloud</li>
            </ul>

            <h3><i class="fas fa-exclamation-circle"></i> Hal yang TIDAK Boleh Dilakukan</h3>
            <div class="danger-box">
                <strong>Jangan simpan password di:</strong><br>
                ❌ Notes HP (mudah dibaca jika HP hilang)<br>
                ❌ Dokumen Word/Excel biasa (tidak terenkripsi)<br>
                ❌ Browser tanpa proteksi master password<br>
                ❌ Email atau chat (sangat tidak aman)<br>
                ❌ Sticky note di monitor
            </div>

            <h3><i class="fas fa-rocket"></i> Cara Mulai Menggunakan Password Manager</h3>
            <ol>
                <li>Download Bitwarden (gratis) dari bitwarden.com</li>
                <li>Buat akun dengan email dan master password yang sangat kuat</li>
                <li>Install extension browser</li>
                <li>Mulai tambahkan akun satu per satu</li>
                <li>Aktifkan 2FA untuk vault password manager itu sendiri</li>
            </ol>

            <div class="success-box">
                <strong>✅ Setelah menggunakan password manager:</strong><br>
                Kamu bisa memiliki password unik dan kuat untuk SETIAP akun tanpa perlu mengingat semuanya. Ini adalah peningkatan keamanan terbesar yang bisa kamu lakukan hari ini.
            </div>
        `
    },
    {
        id: "two-factor-auth",
        title: "Two-Factor Authentication",
        subtitle: "Lapisan keamanan kedua yang wajib dimiliki",
        emoji: "📱",
        difficulty: "beginner",
        readTime: "7 menit",
        category: "otp",
        description: "Pelajari pentingnya 2FA dan cara mengaktifkannya di berbagai platform untuk keamanan akun berlapis.",
        content: `
            <h3><i class="fas fa-lock"></i> Apa itu Two-Factor Authentication (2FA)?</h3>
            <p>2FA adalah sistem keamanan yang membutuhkan dua bukti identitas berbeda untuk mengakses akun. Bahkan jika password bocor, hacker tetap tidak bisa masuk tanpa faktor kedua.</p>
            
            <div class="tip-box">
                <strong>💡 Analogi:</strong> 2FA seperti kartu ATM + PIN. Kartu saja (password) tidak cukup — kamu juga butuh PIN (faktor ke-2). Keduanya harus ada.
            </div>

            <h3><i class="fas fa-layers"></i> Jenis 2FA dari Paling Aman ke Kurang Aman</h3>
            <ol>
                <li><strong>Hardware Key (YubiKey)</strong> — Paling aman, fisik, tidak bisa diintercept</li>
                <li><strong>Authenticator App (Google Auth, Authy)</strong> — Sangat aman, kode TOTP 30 detik</li>
                <li><strong>Email OTP</strong> — Aman jika email aman</li>
                <li><strong>SMS OTP</strong> — Rawan SIM swapping, tapi lebih baik dari tidak ada 2FA</li>
            </ol>

            <div class="warning-box">
                <strong>⚠️ Penting:</strong> SMS OTP lebih rentan dari Authenticator App karena bisa diintercept via SIM swapping. Gunakan Authenticator App jika tersedia.
            </div>

            <h3><i class="fas fa-mobile-alt"></i> Cara Aktifkan 2FA</h3>
            <p><strong>Gmail/Google Account:</strong></p>
            <ol>
                <li>Buka myaccount.google.com</li>
                <li>Pilih "Keamanan" → "Verifikasi 2 Langkah"</li>
                <li>Ikuti panduan setup</li>
            </ol>

            <p><strong>Akun Bank:</strong></p>
            <ul>
                <li>Kebanyakan bank sudah otomatis menggunakan SMS OTP</li>
                <li>Beberapa bank menawarkan token fisik — gunakan jika tersedia</li>
                <li>Jangan pernah matikan OTP di akun bank</li>
            </ul>

            <h3><i class="fas fa-save"></i> Simpan Backup Codes!</h3>
            <div class="danger-box">
                <strong>🔴 Kritis:</strong> Saat mengaktifkan 2FA, kamu mendapat "backup codes" untuk darurat. Simpan backup codes ini di tempat yang sangat aman (cetak + simpan di brankas, atau simpan di password manager).
            </div>

            <h3><i class="fas fa-check-circle"></i> Prioritas Akun yang Harus Aktifkan 2FA</h3>
            <div class="checklist-item"><i class="fas fa-check"></i> Email utama (Gmail, Outlook, Yahoo)</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Semua akun perbankan dan dompet digital</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Media sosial utama (Instagram, Twitter, Facebook)</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Platform e-commerce (Shopee, Tokopedia, Lazada)</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Password manager</div>
        `
    },
    {
        id: "otp-security",
        title: "Keamanan OTP & Social Engineering",
        subtitle: "Lindungi diri dari penipuan OTP",
        emoji: "🛡️",
        difficulty: "intermediate",
        readTime: "9 menit",
        category: "otp",
        description: "Pahami modus penipuan OTP terkini dan cara melindungi diri dari social engineering yang semakin canggih.",
        content: `
            <h3><i class="fas fa-user-secret"></i> Apa itu Social Engineering?</h3>
            <p>Social engineering adalah teknik manipulasi psikologis untuk memaksa korban memberikan informasi sensitif secara sukarela. Tidak membutuhkan keahlian hacking — cukup manipulasi!</p>

            <div class="danger-box">
                <strong>🔴 INGAT SELALU:</strong> Tidak ada bank, perusahaan, atau institusi resmi yang akan meminta kode OTP dari kamu. TIDAK ADA. Ini adalah aturan mutlak tanpa pengecualian.
            </div>

            <h3><i class="fas fa-theater-masks"></i> Modus Penipuan OTP yang Paling Umum</h3>
            
            <p><strong>1. Pura-pura CS Bank:</strong></p>
            <p>"Halo Pak/Bu, kami dari bank X. Akun Anda terdeteksi transaksi mencurigakan. Untuk keamanan, mohon berikan kode OTP yang baru saja dikirim..."</p>
            
            <p><strong>2. Hadiah Palsu:</strong></p>
            <p>"Selamat! Anda memenangkan hadiah. Untuk pencairan, kami butuh kode verifikasi OTP..."</p>
            
            <p><strong>3. Akun Akan Diblokir:</strong></p>
            <p>"Akun Anda akan diblokir dalam 24 jam. Verifikasi dengan kode OTP berikut untuk menghindari pemblokiran..."</p>

            <p><strong>4. SIM Swapping:</strong></p>
            <p>Hacker menghubungi operator seluler mengaku sebagai kamu, minta SIM baru — seluruh SMS OTP pindah ke hacker.</p>

            <h3><i class="fas fa-shield-virus"></i> Cara Melindungi Diri</h3>
            <ul>
                <li><strong>Jangan pernah berikan OTP kepada siapapun</strong> — termasuk CS "resmi"</li>
                <li><strong>Tutup sambungan</strong> — lalu hubungi nomor resmi bank secara mandiri</li>
                <li><strong>Waspadai urgency</strong> — "segera", "dalam 5 menit", "atau diblokir"</li>
                <li><strong>Verifikasi identitas penelepon</strong> melalui kanal resmi</li>
                <li><strong>Aktifkan PIN SIM card</strong> untuk cegah SIM swapping</li>
            </ul>

            <h3><i class="fas fa-exclamation-triangle"></i> Apa yang Harus Dilakukan Jika Terlanjur Tertipu?</h3>
            <ol>
                <li>Segera hubungi bank untuk blokir akun dan transaksi</li>
                <li>Ganti semua password terkait</li>
                <li>Laporkan ke pihak berwajib dan BSSN</li>
                <li>Hubungi operator seluler jika SIM card terlibat</li>
                <li>Dokumentasikan semua bukti percakapan</li>
            </ol>

            <div class="success-box">
                <strong>📞 Nomor Darurat:</strong><br>
                • BSSN (Badan Siber dan Sandi Negara): 021-7900-5555<br>
                • Aduan Konsumen OJK: 157<br>
                • Lapor Penipuan Online: www.lapor.go.id
            </div>
        `
    },
    {
        id: "data-privacy",
        title: "Privasi Data Digital",
        subtitle: "Kendalikan data pribadi di era digital",
        emoji: "🔐",
        difficulty: "intermediate",
        readTime: "10 menit",
        category: "sharing",
        description: "Pahami hak privasi datamu, cara membaca kebijakan privasi, dan langkah melindungi data pribadi dari eksploitasi.",
        content: `
            <h3><i class="fas fa-database"></i> Data Apa yang Dikumpulkan dari Kita?</h3>
            <p>Setiap hari, ratusan data point dikumpulkan dari aktivitas digitalmu. Ini mencakup:</p>
            <ul>
                <li><strong>Data Identitas:</strong> Nama, email, nomor HP, alamat, NIK</li>
                <li><strong>Data Perilaku:</strong> Riwayat pencarian, klik, waktu online</li>
                <li><strong>Data Lokasi:</strong> GPS real-time, lokasi yang sering dikunjungi</li>
                <li><strong>Data Finansial:</strong> Pola belanja, kategori transaksi</li>
                <li><strong>Data Biometrik:</strong> Wajah (dari foto), suara (dari asisten suara)</li>
            </ul>

            <div class="warning-box">
                <strong>💰 Nilai Data Pribadimu:</strong> Data pribadi adalah "minyak baru" era digital. Perusahaan data broker menjual profil lengkap seseorang seharga $0.5 - $15 per profil. Semua dari data yang kamu "berikan gratis".
            </div>

            <h3><i class="fas fa-file-contract"></i> Cara Baca Kebijakan Privasi dengan Cepat</h3>
            <p>Gunakan strategi SCAN — fokus pada:</p>
            <ol>
                <li><strong>Data yang dikumpulkan</strong> — Apa saja yang mereka ambil?</li>
                <li><strong>Penggunaan data</strong> — Untuk apa data digunakan?</li>
                <li><strong>Pihak ketiga</strong> — Apakah data dijual/dibagikan?</li>
                <li><strong>Retensi data</strong> — Berapa lama data disimpan?</li>
                <li><strong>Hak pengguna</strong> — Bisakah kamu minta hapus data?</li>
            </ol>

            <h3><i class="fas fa-tools"></i> Tools untuk Lindungi Privasi</h3>
            <ul>
                <li><strong>Tosdr.org</strong> — Ringkasan kebijakan privasi dalam bahasa mudah</li>
                <li><strong>Privacy Badger</strong> — Blokir tracker otomatis di browser</li>
                <li><strong>uBlock Origin</strong> — Ad blocker yang juga blokir tracker</li>
                <li><strong>SimpleLogin</strong> — Email alias untuk daftar layanan</li>
                <li><strong>Firefox/Brave</strong> — Browser lebih privacy-focused</li>
            </ul>

            <h3><i class="fas fa-balance-scale"></i> Hak Privasi Data (UU PDP Indonesia)</h3>
            <p>Berdasarkan UU Perlindungan Data Pribadi No. 27/2022:</p>
            <ul>
                <li>✅ Hak untuk mengetahui data yang dikumpulkan</li>
                <li>✅ Hak untuk mengakses data pribadimu</li>
                <li>✅ Hak untuk mengoreksi data yang salah</li>
                <li>✅ Hak untuk meminta penghapusan data</li>
                <li>✅ Hak untuk menolak pemrosesan data</li>
                <li>✅ Hak mendapat ganti rugi jika terjadi pelanggaran</li>
            </ul>

            <div class="tip-box">
                <strong>💡 Praktik Terbaik:</strong> Gunakan email berbeda untuk akun penting dan akun "tidak penting". Pertimbangkan menggunakan nomor HP sekunder untuk mendaftar layanan yang tidak terlalu penting.
            </div>
        `
    },
    {
        id: "phishing-awareness",
        title: "Deteksi Phishing & Scam",
        subtitle: "Kenali dan hindari serangan phishing",
        emoji: "🎣",
        difficulty: "intermediate",
        readTime: "12 menit",
        category: "awareness",
        description: "Pelajari teknik phishing terbaru dan cara mengidentifikasi serta menghindari serangan social engineering yang semakin canggih.",
        content: `
            <h3><i class="fas fa-fish"></i> Apa itu Phishing?</h3>
            <p>Phishing adalah serangan siber di mana penyerang menyamar sebagai entitas terpercaya untuk mencuri informasi sensitif. Berasal dari kata "fishing" — memancing korban dengan umpan.</p>

            <div class="danger-box">
                <strong>📊 Statistik Mengejutkan:</strong><br>
                • 91% serangan siber dimulai dari phishing<br>
                • 1 dari 99 email adalah phishing<br>
                • Kerugian akibat phishing mencapai $54 miliar/tahun global<br>
                • Indonesia masuk 10 besar target phishing Asia Pasifik
            </div>

            <h3><i class="fas fa-list"></i> Jenis-Jenis Phishing</h3>
            <ul>
                <li><strong>Email Phishing</strong> — Email palsu dari bank, marketplace, atau layanan populer</li>
                <li><strong>Smishing</strong> — Phishing via SMS (link palsu dari "J&T", "Shopee", dll)</li>
                <li><strong>Vishing</strong> — Phishing via telepon (suara)</li>
                <li><strong>Spear Phishing</strong> — Ditargetkan spesifik ke individu tertentu</li>
                <li><strong>Whaling</strong> — Target eksekutif perusahaan</li>
                <li><strong>Clone Phishing</strong> — Duplikasi email legitimate yang dimodifikasi</li>
            </ul>

            <h3><i class="fas fa-search"></i> Cara Mendeteksi Email Phishing</h3>
            <p><strong>Periksa Pengirim:</strong></p>
            <ul>
                <li>Email resmi BCA: cs@bca.co.id — Bukan: cs@bca-alert.com ❌</li>
                <li>Hover nama pengirim untuk lihat email sebenarnya</li>
                <li>Waspada subdomain: paypal.com.evil.com — bukan paypal.com!</li>
            </ul>

            <p><strong>Tanda-tanda Phishing:</strong></p>
            <ul>
                <li>🚩 Urgency berlebihan ("Akun diblokir dalam 1 jam!")</li>
                <li>🚩 Tata bahasa buruk atau kalimat aneh</li>
                <li>🚩 Link tidak sesuai dengan domain resmi</li>
                <li>🚩 Meminta data sensitif via email/pesan</li>
                <li>🚩 Hadiah yang tidak pernah diikuti</li>
                <li>🚩 Lampiran yang tidak diminta</li>
            </ul>

            <h3><i class="fas fa-link"></i> Cara Cek URL Phishing</h3>
            <ol>
                <li>Hover mouse di atas link — lihat URL di pojok bawah browser</li>
                <li>Gunakan VirusTotal.com untuk cek link mencurigakan</li>
                <li>Akses website langsung dengan ketik URL manual</li>
                <li>Periksa sertifikat SSL (🔒) — tapi ini bukan jaminan aman!</li>
                <li>Gunakan Google Safe Browsing: safebrowsing.google.com</li>
            </ol>

            <h3><i class="fas fa-shield-alt"></i> Yang Harus Dilakukan Jika Kena Phishing</h3>
            <ol>
                <li>Jangan panik, segera putuskan dari internet</li>
                <li>Ganti password akun yang terkompromi SEGERA</li>
                <li>Hubungi bank untuk blokir kartu/akun jika data finansial bocor</li>
                <li>Scan perangkat dengan antivirus</li>
                <li>Laporkan ke pihak yang dipalsukan dan ke Kominfo</li>
                <li>Monitor akun bank untuk transaksi mencurigakan</li>
            </ol>

            <div class="success-box">
                <strong>🧪 Uji Phishing Awareness:</strong> Coba simulasi phishing gratis di: phishingquiz.withgoogle.com untuk menguji kemampuanmu mendeteksi phishing.
            </div>
        `
    },
    {
        id: "social-media-security",
        title: "Keamanan Media Sosial",
        subtitle: "Jaga privasi di era over-sharing",
        emoji: "📱",
        difficulty: "beginner",
        readTime: "8 menit",
        category: "sharing",
        description: "Pelajari cara mengatur privasi media sosial dan kebiasaan berbagi yang aman untuk mencegah doxxing dan identity theft.",
        content: `
            <h3><i class="fas fa-share-alt"></i> Bahaya Over-sharing di Media Sosial</h3>
            <p>Setiap postingan di media sosial adalah data yang bisa digunakan untuk melawan kamu. Dari profil publik, seseorang bisa mengetahui: nama lengkap, tempat tinggal, tempat kerja, rutinitas harian, keluarga, dll.</p>

            <div class="danger-box">
                <strong>🔴 OSINT Attack:</strong> Hacker mengumpulkan informasi publik dari medsos (Open Source Intelligence) untuk crafting serangan yang dipersonalisasi — phishing, doxxing, bahkan ancaman fisik.
            </div>

            <h3><i class="fas fa-cog"></i> Pengaturan Privasi yang Wajib Dikonfigurasi</h3>
            
            <p><strong>Instagram:</strong></p>
            <ul>
                <li>Setting → Akun → Privasi Akun → Aktifkan Akun Pribadi</li>
                <li>Nonaktifkan: "Bagikan lokasi secara otomatis"</li>
                <li>Matikan: Story yang bisa di-screenshot oleh yang tidak dikenal</li>
            </ul>

            <p><strong>Facebook:</strong></p>
            <ul>
                <li>Setting → Privasi → Siapa yang bisa melihat postingan = "Teman"</li>
                <li>Hapus atau sembunyikan info: alamat, nomor HP, tempat kerja</li>
                <li>Review: Aplikasi dan Situs Web yang Terhubung</li>
            </ul>

            <h3><i class="fas fa-map-marker-alt"></i> Bahaya Data Lokasi</h3>
            <ul>
                <li>Jangan post lokasi real-time atau "Saya sedang di sini!"</li>
                <li>Hapus metadata EXIF dari foto sebelum upload</li>
                <li>Jangan post foto rumah yang menunjukkan alamat atau landmark dekat</li>
                <li>Hindari check-in otomatis di tempat yang sering dikunjungi</li>
            </ul>

            <h3><i class="fas fa-user-shield"></i> Hygiene Media Sosial yang Baik</h3>
            <ul>
                <li>✅ Audit teman/follower secara berkala — hapus yang tidak dikenal</li>
                <li>✅ Review aplikasi yang punya akses ke akun medsos</li>
                <li>✅ Gunakan foto profil yang tidak terlalu personal</li>
                <li>✅ Jangan share KTP, paspor, atau dokumen penting</li>
                <li>✅ Berpikir dua kali sebelum posting — "Apakah ini aman dibagikan?"</li>
                <li>✅ Aktifkan peringatan login untuk deteksi akses tidak sah</li>
            </ul>

            <div class="tip-box">
                <strong>💡 Tes Privasi:</strong> Coba google namamu sendiri dan lihat apa yang bisa ditemukan. Jika terlalu banyak info personal muncul, saatnya audit dan bersihkan jejak digital.
            </div>
        `
    },
    {
        id: "network-security",
        title: "Keamanan Jaringan & VPN",
        subtitle: "Browsing aman di mana saja",
        emoji: "🌐",
        difficulty: "advanced",
        readTime: "11 menit",
        category: "sharing",
        description: "Pahami risiko jaringan publik, cara kerja VPN, dan praktik keamanan jaringan untuk melindungi data saat online.",
        content: `
            <h3><i class="fas fa-wifi"></i> Bahaya WiFi Publik</h3>
            <p>WiFi publik (cafe, mall, hotel, bandara) adalah surga bagi hacker untuk melakukan serangan. Ribuan orang terhubung tanpa enkripsi yang memadai.</p>

            <div class="danger-box">
                <strong>⚠️ Jenis Serangan di WiFi Publik:</strong><br>
                • <strong>Man-in-the-Middle (MitM):</strong> Hacker menyadap komunikasi antara kamu dan server<br>
                • <strong>Evil Twin:</strong> WiFi palsu dengan nama mirip (Free_Airport_WiFi vs Free_Airport_WiFI)<br>
                • <strong>Packet Sniffing:</strong> Menangkap semua data yang lewat di jaringan<br>
                • <strong>Session Hijacking:</strong> Mencuri session cookies untuk akses akun
            </div>

            <h3><i class="fas fa-ban"></i> Yang TIDAK Boleh Dilakukan di WiFi Publik</h3>
            <ul>
                <li>❌ Internet banking atau transfer uang</li>
                <li>❌ Login ke email tanpa VPN</li>
                <li>❌ Transaksi e-commerce</li>
                <li>❌ Akses dokumen kerja sensitif</li>
                <li>❌ Login ke akun tanpa 2FA</li>
            </ul>

            <h3><i class="fas fa-shield-alt"></i> Apa itu VPN dan Bagaimana Cara Kerjanya?</h3>
            <p>VPN (Virtual Private Network) membuat "terowongan" terenkripsi antara perangkatmu dan server VPN. Semua data yang dikirim melalui terowongan ini dienkripsi dan tidak bisa disadap.</p>

            <h3><i class="fas fa-star"></i> VPN yang Direkomendasikan</h3>
            <ul>
                <li><strong>Mullvad VPN</strong> — Privacy terbaik, tidak simpan log, bayar tunai/kripto</li>
                <li><strong>ProtonVPN</strong> — Open source, gratis tersedia, berbasis Swiss</li>
                <li><strong>Windscribe</strong> — Gratis 10GB/bulan, cukup untuk kebutuhan dasar</li>
                <li><strong>NordVPN / ExpressVPN</strong> — Premium, cepat, mudah digunakan</li>
            </ul>

            <div class="warning-box">
                <strong>⚠️ Hindari VPN Gratis yang Tidak Jelas!</strong> VPN gratis sering justru menjual data browsing penggunanya. Selalu gunakan VPN dari provider terpercaya dengan kebijakan no-log yang terverifikasi.
            </div>

            <h3><i class="fas fa-lock"></i> Tips Keamanan Jaringan Tambahan</h3>
            <ul>
                <li>Selalu pastikan URL menggunakan <strong>HTTPS</strong> (🔒)</li>
                <li>Gunakan DNS terenkripsi: <strong>1.1.1.1 (Cloudflare)</strong> atau <strong>8.8.8.8 (Google)</strong></li>
                <li>Aktifkan firewall pada semua perangkat</li>
                <li>Nonaktifkan WiFi dan Bluetooth jika tidak digunakan</li>
                <li>Jangan auto-connect ke WiFi yang dikenal — bisa dimanfaatkan Evil Twin</li>
                <li>Pertimbangkan menggunakan mobile data untuk transaksi penting</li>
            </ul>

            <div class="success-box">
                <strong>✅ Cek Keamanan Jaringanmu:</strong> Kunjungi ipleak.net untuk cek apakah VPN kamu berfungsi dengan baik dan tidak ada DNS leak.
            </div>
        `
    },
    {
        id: "device-security",
        title: "Keamanan Perangkat",
        subtitle: "Lindungi smartphone dan komputer",
        emoji: "💻",
        difficulty: "beginner",
        readTime: "8 menit",
        category: "awareness",
        description: "Pelajari cara mengamankan perangkat digital dari malware, pencurian, dan akses tidak sah.",
        content: `
            <h3><i class="fas fa-mobile-alt"></i> Mengapa Keamanan Perangkat Itu Penting?</h3>
            <p>Smartphone dan laptop kita menyimpan data yang sangat berharga: foto, dokumen, akun bank, email, kontak, dan lebih banyak lagi. Perangkat yang tidak aman adalah target empuk.</p>

            <h3><i class="fas fa-lock"></i> Keamanan Dasar Perangkat (Checklist)</h3>
            
            <p><strong>Smartphone:</strong></p>
            <div class="checklist-item"><i class="fas fa-check"></i> Aktifkan screen lock (PIN 6 digit minimum, atau biometrik)</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Enkripsi penyimpanan (biasanya aktif default di Android modern & iOS)</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Aktifkan Find My Phone / Google Find My Device</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Update OS dan aplikasi secara rutin</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Hanya install aplikasi dari store resmi</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Review izin aplikasi secara berkala</div>

            <p><strong>Laptop/Komputer:</strong></p>
            <div class="checklist-item"><i class="fas fa-check"></i> Aktifkan password login yang kuat</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Aktifkan enkripsi disk (BitLocker/FileVault)</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Install antivirus terpercaya</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Aktifkan firewall</div>
            <div class="checklist-item"><i class="fas fa-check"></i> Backup data secara rutin (3-2-1 rule)</div>

            <h3><i class="fas fa-bug"></i> Kenali Tanda-tanda Malware</h3>
            <ul>
                <li>🚩 Perangkat tiba-tiba lebih lambat tanpa alasan</li>
                <li>🚩 Baterai habis lebih cepat dari biasanya</li>
                <li>🚩 Data internet terkuras tanpa aktivitas</li>
                <li>🚩 Muncul iklan di tempat yang tidak wajar</li>
                <li>🚩 Aplikasi yang tidak pernah diinstall</li>
                <li>🚩 Perangkat panas meski tidak digunakan</li>
            </ul>

            <h3><i class="fas fa-hdd"></i> Rule 3-2-1 untuk Backup Data</h3>
            <ul>
                <li><strong>3</strong> salinan data (original + 2 backup)</li>
                <li><strong>2</strong> media berbeda (contoh: laptop + external HDD)</li>
                <li><strong>1</strong> offsite/cloud (Google Drive, iCloud, Dropbox)</li>
            </ul>

            <div class="tip-box">
                <strong>💡 Untuk Pengguna Windows:</strong> Aktifkan Windows Defender (sudah built-in, cukup handal) dan pastikan Windows Update selalu aktif. Ini saja sudah meningkatkan keamanan secara signifikan.
            </div>

            <h3><i class="fas fa-trash-alt"></i> Hapus Data dengan Benar</h3>
            <p>Saat menjual atau membuang perangkat:</p>
            <ul>
                <li>Lakukan factory reset — ini saja tidak cukup!</li>
                <li>Untuk HDD: gunakan software wipe seperti DBAN</li>
                <li>Untuk SSD: enkripsi dulu, baru factory reset</li>
                <li>Untuk smartphone: enkripsi dulu, baru factory reset</li>
                <li>Jangan buang perangkat sebelum yakin data terhapus tuntas</li>
            </ul>
        `
    }
];