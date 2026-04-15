// ============================================================
// AI RISK SCORING ENGINE
// Menganalisis jawaban dan menghasilkan skor + rekomendasi
// ============================================================

const RiskEngine = {

    // Hitung skor per kategori
    calculateCategoryScore(category, answers) {
        const questions = ASSESSMENT_QUESTIONS[category].questions;
        let totalScore = 0;
        let answered = 0;

        questions.forEach(q => {
            if (answers[q.id] !== undefined) {
                totalScore += answers[q.id];
                answered++;
            }
        });

        return answered > 0 ? Math.round(totalScore / answered) : 0;
    },

    // Hitung skor risiko total (weighted)
    calculateTotalScore(answers) {
        const categories = Object.keys(ASSESSMENT_QUESTIONS);
        let weightedScore = 0;

        categories.forEach(cat => {
            const catScore = this.calculateCategoryScore(cat, answers);
            const weight = ASSESSMENT_QUESTIONS[cat].weight;
            weightedScore += catScore * weight;
        });

        return Math.round(weightedScore);
    },

    // Tentukan level risiko berdasarkan skor
    getRiskLevel(score) {
        if (score >= 80) return { level: "Sangat Tinggi", class: "very-high", color: "#991b1b", emoji: "🔴" };
        if (score >= 65) return { level: "Tinggi", class: "high", color: "#dc2626", emoji: "🟠" };
        if (score >= 45) return { level: "Sedang", class: "medium", color: "#d97706", emoji: "🟡" };
        if (score >= 25) return { level: "Rendah", class: "low", color: "#16a34a", emoji: "🟢" };
        return { level: "Sangat Rendah", class: "very-low", color: "#14532d", emoji: "✅" };
    },

    // Generate rekomendasi berdasarkan jawaban
    generateRecommendations(answers, categoryScores) {
        const recommendations = [];

        // ========== REKOMENDASI BERBASIS JAWABAN ==========

        // --- Password Recommendations ---
        if (answers["p1"] >= 50) {
            recommendations.push({
                id: "r-p1",
                category: "password",
                title: "Gunakan Password Unik untuk Setiap Akun",
                urgency: answers["p1"] >= 75 ? "kritis" : "tinggi",
                impactScore: answers["p1"] >= 75 ? 25 : 15,
                description: "Anda menggunakan password yang sama untuk beberapa akun. Ini sangat berbahaya karena jika satu akun dibobol, semua akun lain bisa ikut terkompromi.",
                reason: `⚠️ Risiko: Penggunaan password sama menciptakan efek domino — satu kebocoran dapat menyebabkan semua akun Anda terbobol sekaligus. Teknik ini disebut "credential stuffing" dan sangat umum digunakan hacker.`,
                steps: [
                    "Gunakan password manager seperti Bitwarden, 1Password, atau LastPass",
                    "Generate password unik dan kuat untuk setiap akun",
                    "Prioritaskan akun bank, email, dan medsos utama terlebih dahulu"
                ],
                impact: "Mengurangi risiko credential stuffing attack hingga 80%",
                module: "password-security"
            });
        }

        if (answers["p2"] >= 50) {
            recommendations.push({
                id: "r-p2",
                category: "password",
                title: "Perkuat Kompleksitas Password",
                urgency: answers["p2"] >= 75 ? "kritis" : "tinggi",
                impactScore: answers["p2"] >= 75 ? 20 : 12,
                description: "Password Anda terlalu sederhana dan rentan terhadap serangan brute force atau dictionary attack.",
                reason: `⚠️ Risiko: Password sederhana seperti nama+angka dapat ditebak dalam hitungan menit menggunakan tools otomatis. Password "nama123" butuh kurang dari 1 detik untuk dicrack.`,
                steps: [
                    "Gunakan minimal 12 karakter",
                    "Kombinasikan huruf besar, kecil, angka, dan simbol",
                    "Hindari informasi personal (nama, tanggal lahir, nomor HP)",
                    "Gunakan passphrase: gabungan 4+ kata acak (mis: Langit-Meja-Kucing-2024!)"
                ],
                impact: "Password kuat meningkatkan waktu crack dari detik menjadi jutaan tahun",
                module: "password-security"
            });
        }

        if (answers["p4"] >= 65) {
            recommendations.push({
                id: "r-p4",
                category: "password",
                title: "Implementasikan Password Manager",
                urgency: "tinggi",
                impactScore: 18,
                description: "Cara penyimpanan password Anda saat ini tidak aman dan rentan terhadap pencurian data.",
                reason: `⚠️ Risiko: Menyimpan password di notes atau dokumen biasa mudah diakses jika perangkat hilang atau terkena malware. Mencatat di kertas juga berisiko dilihat orang lain.`,
                steps: [
                    "Install password manager gratis: Bitwarden (open source)",
                    "Migrasikan semua password yang ada",
                    "Buat master password yang sangat kuat",
                    "Aktifkan backup encrypted"
                ],
                impact: "Eliminasi risiko password dicuri dari penyimpanan tidak aman",
                module: "password-manager"
            });
        }

        // --- OTP Recommendations ---
        if (answers["o1"] >= 50) {
            recommendations.push({
                id: "r-o1",
                category: "otp",
                title: "Aktifkan Two-Factor Authentication (2FA)",
                urgency: answers["o1"] >= 75 ? "kritis" : "tinggi",
                impactScore: answers["o1"] >= 75 ? 30 : 20,
                description: "Anda belum mengaktifkan 2FA di sebagian besar akun. 2FA adalah lapisan keamanan paling penting setelah password.",
                reason: `⚠️ Risiko: Tanpa 2FA, jika password Anda bocor (misal dari data breach), akun langsung bisa diakses. Dengan 2FA, hacker tetap tidak bisa masuk meski mengetahui password Anda.`,
                steps: [
                    "Aktifkan 2FA di email utama (Gmail, Outlook) — prioritas #1",
                    "Aktifkan di akun perbankan/finansial",
                    "Aktifkan di media sosial utama",
                    "Gunakan Authenticator App daripada SMS jika tersedia"
                ],
                impact: "2FA mencegah 99.9% serangan akun yang berasal dari password yang bocor",
                module: "two-factor-auth"
            });
        }

        if (answers["o2"] >= 50 || answers["o3"] >= 50) {
            recommendations.push({
                id: "r-o2",
                category: "otp",
                title: "Pahami Keamanan Kode OTP",
                urgency: answers["o3"] >= 65 ? "kritis" : "sedang",
                impactScore: answers["o3"] >= 65 ? 22 : 14,
                description: "Pemahaman Anda tentang penggunaan aman kode OTP perlu ditingkatkan untuk menghindari penipuan.",
                reason: `⚠️ Risiko: SIM Swapping dan social engineering OTP adalah metode penipuan yang sangat umum. Memberikan OTP kepada siapapun — bahkan yang mengaku dari bank — dapat menguras rekening Anda.`,
                steps: [
                    "OTP TIDAK PERNAH diminta oleh CS bank atau platform manapun",
                    "Segera ganti password jika menerima OTP yang tidak diminta",
                    "Laporkan ke bank/platform jika mendapat OTP mencurigakan",
                    "Aktifkan notifikasi transaksi untuk deteksi dini"
                ],
                impact: "Mencegah kerugian finansial akibat social engineering OTP",
                module: "otp-security"
            });
        }

        if (answers["o4"] >= 40 && answers["o1"] < 50) {
            recommendations.push({
                id: "r-o4",
                category: "otp",
                title: "Upgrade ke Authenticator App",
                urgency: "sedang",
                impactScore: 12,
                description: "SMS OTP lebih rentan daripada authenticator app karena risiko SIM swapping.",
                reason: `⚠️ Risiko: SMS OTP dapat diintersep melalui SIM swapping atau SS7 attack. Authenticator app menghasilkan kode secara lokal di perangkat, jauh lebih aman.`,
                steps: [
                    "Install Google Authenticator atau Authy",
                    "Migrate 2FA akun penting ke authenticator app",
                    "Simpan backup codes di tempat aman"
                ],
                impact: "Eliminasi risiko SIM swapping pada autentikasi dua faktor",
                module: "two-factor-auth"
            });
        }

        // --- Sharing Data Recommendations ---
        if (answers["s1"] >= 50) {
            recommendations.push({
                id: "r-s1",
                category: "sharing",
                title: "Biasakan Membaca Kebijakan Privasi",
                urgency: "sedang",
                impactScore: 10,
                description: "Anda jarang membaca kebijakan privasi, sehingga tidak mengetahui bagaimana data Anda digunakan.",
                reason: `⚠️ Risiko: Dengan menyetujui tanpa membaca, Anda mungkin tanpa sadar mengizinkan pengumpulan dan penjualan data pribadi Anda kepada pihak ketiga.`,
                steps: [
                    "Gunakan tools seperti 'Privacy not included' untuk review aplikasi",
                    "Minimal baca bagian 'Data yang Dikumpulkan' dan 'Dibagikan ke Pihak Ketiga'",
                    "Gunakan Tosdr.org untuk ringkasan kebijakan privasi populer",
                    "Jika tidak setuju kebijakan, pertimbangkan alternatif aplikasi lain"
                ],
                impact: "Mencegah berbagi data pribadi yang tidak disadari",
                module: "data-privacy"
            });
        }

        if (answers["s2"] >= 60) {
            recommendations.push({
                id: "r-s2",
                category: "sharing",
                title: "Kurangi Paparan Data di Media Sosial",
                urgency: "tinggi",
                impactScore: 16,
                description: "Terlalu banyak informasi pribadi di media sosial dapat dimanfaatkan untuk social engineering dan doxxing.",
                reason: `⚠️ Risiko: Data publik di medsos (lokasi, rutinitas, info keluarga) digunakan untuk crafting targeted phishing, identity theft, dan bahkan ancaman fisik.`,
                steps: [
                    "Audit semua informasi yang ada di profil medsos",
                    "Set akun ke mode privat",
                    "Hapus atau batasi info: nomor HP, alamat, tempat kerja",
                    "Hindari posting lokasi real-time atau check-in otomatis"
                ],
                impact: "Mengurangi risiko identity theft dan social engineering",
                module: "social-media-security"
            });
        }

        if (answers["s5"] >= 50) {
            recommendations.push({
                id: "r-s5",
                category: "sharing",
                title: "Hentikan Akses Transaksi Sensitif via WiFi Publik",
                urgency: answers["s5"] >= 75 ? "kritis" : "tinggi",
                impactScore: answers["s5"] >= 75 ? 24 : 16,
                description: "Menggunakan WiFi publik untuk transaksi sensitif sangat berbahaya dan rentan terhadap serangan Man-in-the-Middle.",
                reason: `⚠️ Risiko: WiFi publik bisa dimonitoring oleh siapapun dalam jaringan yang sama (Man-in-the-Middle attack). Data login dan transaksi bank Anda bisa dicuri.`,
                steps: [
                    "JANGAN pernah akses internet banking via WiFi publik",
                    "Gunakan mobile data untuk transaksi finansial",
                    "Jika terpaksa, gunakan VPN terpercaya (Mullvad, ProtonVPN)",
                    "Selalu pastikan URL menggunakan HTTPS"
                ],
                impact: "Mencegah pencurian kredensial dan data finansial via jaringan publik",
                module: "network-security"
            });
        }

        // --- Awareness Recommendations ---
        if (answers["a1"] >= 50) {
            recommendations.push({
                id: "r-a1",
                category: "awareness",
                title: "Tingkatkan Kemampuan Deteksi Phishing",
                urgency: answers["a1"] >= 75 ? "tinggi" : "sedang",
                impactScore: 18,
                description: "Kemampuan mendeteksi phishing Anda perlu ditingkatkan untuk melindungi diri dari serangan rekayasa sosial.",
                reason: `⚠️ Risiko: 91% serangan siber dimulai dari email phishing. Ketidakmampuan mendeteksi phishing menjadikan Anda target empuk bagi penjahat siber.`,
                steps: [
                    "Selalu periksa alamat email pengirim dengan teliti",
                    "Hover mouse di atas link sebelum klik untuk lihat URL sebenarnya",
                    "Waspadai urgency yang dibuat-buat ('Akun Anda akan diblokir!')",
                    "Verifikasi langsung ke website resmi, bukan via link di email"
                ],
                impact: "Mencegah 91% serangan siber yang dimulai dari phishing",
                module: "phishing-awareness"
            });
        }

        if (answers["a2"] >= 40) {
            recommendations.push({
                id: "r-a2",
                category: "awareness",
                title: "Rutin Update Sistem & Aplikasi",
                urgency: answers["a2"] >= 70 ? "tinggi" : "sedang",
                impactScore: 14,
                description: "Keterlambatan update meninggalkan celah keamanan yang bisa dieksploitasi oleh malware dan hacker.",
                reason: `⚠️ Risiko: 60% serangan memanfaatkan kerentanan yang sebenarnya sudah ada patchnya. Update otomatis adalah cara termudah menutup celah keamanan.`,
                steps: [
                    "Aktifkan auto-update untuk sistem operasi",
                    "Aktifkan auto-update untuk semua aplikasi",
                    "Prioritaskan update yang berlabel 'security patch'",
                    "Restart perangkat setelah update besar"
                ],
                impact: "Menutup 60% celah keamanan yang dieksploitasi hacker",
                module: "device-security"
            });
        }

        if (answers["a4"] >= 50) {
            recommendations.push({
                id: "r-a4",
                category: "awareness",
                title: "Wajib Logout di Perangkat Publik",
                urgency: answers["a4"] >= 80 ? "kritis" : "tinggi",
                impactScore: 20,
                description: "Tidak logout dari akun di perangkat publik membiarkan siapapun berikutnya mengakses akun Anda.",
                reason: `⚠️ Risiko: Perangkat publik mungkin memiliki keylogger atau malware. Sesi yang tidak ditutup memungkinkan akses tidak sah ke seluruh akun Anda.`,
                steps: [
                    "Selalu logout dari SEMUA akun di perangkat publik",
                    "Hapus history, cookies, dan data browsing",
                    "Gunakan mode Incognito/Private saat di perangkat publik",
                    "Setelah pulang, periksa sesi aktif di akun Google/medsos dan terminate"
                ],
                impact: "Mencegah akses tidak sah ke akun dari perangkat yang ditinggalkan",
                module: "device-security"
            });
        }

        // Jika tidak ada rekomendasi kritis, tambahkan yang positif
        if (recommendations.length < 3) {
            const totalScore = this.calculateTotalScore(answers);
            if (totalScore < 30) {
                recommendations.push({
                    id: "r-maintain",
                    category: "awareness",
                    title: "Pertahankan Kebiasaan Keamanan yang Baik",
                    urgency: "rendah",
                    impactScore: 5,
                    description: "Profil keamanan Anda sudah sangat baik! Terus pertahankan dan tingkatkan pengetahuan keamanan digital.",
                    reason: `✅ Status: Kebiasaan digital Anda sudah berada di level yang baik. Ancaman siber terus berkembang, penting untuk terus update pengetahuan.`,
                    steps: [
                        "Ikuti berita keamanan siber terkini",
                        "Bagikan pengetahuan keamanan kepada keluarga",
                        "Review keamanan akun secara berkala",
                        "Pertimbangkan security audit tahunan"
                    ],
                    impact: "Mempertahankan profil keamanan optimal",
                    module: "phishing-awareness"
                });
            }
        }

        // Sort berdasarkan impactScore (prioritas tertinggi dulu)
        recommendations.sort((a, b) => b.impactScore - a.impactScore);

        // Tambahkan nomor prioritas
        return recommendations.slice(0, 8).map((rec, idx) => ({
            ...rec,
            priority: idx + 1
        }));
    },

    // Hitung proyeksi skor setelah perbaikan
    calculateImpactProjection(currentScore, recommendations) {
        const projection = [{ step: "Saat Ini", score: currentScore }];
        let projectedScore = currentScore;

        const topRecs = recommendations.slice(0, 5);
        topRecs.forEach((rec, idx) => {
            projectedScore = Math.max(5, projectedScore - rec.impactScore);
            projection.push({
                step: `Setelah #${idx + 1}`,
                score: Math.round(projectedScore),
                action: rec.title
            });
        });

        return projection;
    },

    // Tentukan modul yang direkomendasikan
    getRecommendedModules(categoryScores, answers) {
        const moduleScores = [];

        // Map kategori ke modul
        const categoryModuleMap = {
            password: ["password-security", "password-manager"],
            otp: ["two-factor-auth", "otp-security"],
            sharing: ["data-privacy", "social-media-security", "network-security"],
            awareness: ["phishing-awareness", "device-security"]
        };

        Object.entries(categoryScores).forEach(([cat, score]) => {
            if (score >= 30) {
                categoryModuleMap[cat].forEach(moduleId => {
                    if (!moduleScores.find(m => m.id === moduleId)) {
                        moduleScores.push({
                            id: moduleId,
                            priority: score,
                            urgent: score >= 60
                        });
                    }
                });
            }
        });

        return moduleScores.sort((a, b) => b.priority - a.priority);
    },

    // Tentukan profil pengguna
    getUserProfile(totalScore, categoryScores) {
        const maxCat = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0];

        if (totalScore >= 70) {
            return {
                name: "Profil Risiko Tinggi",
                description: "Kebiasaan digital Anda memiliki banyak celah keamanan yang perlu segera diperbaiki.",
                icon: "🚨"
            };
        } else if (totalScore >= 45) {
            return {
                name: "Profil Risiko Menengah",
                description: "Ada beberapa area keamanan yang perlu ditingkatkan, terutama di kategori " + ASSESSMENT_QUESTIONS[maxCat[0]].label,
                icon: "⚠️"
            };
        } else if (totalScore >= 20) {
            return {
                name: "Profil Sadar Keamanan",
                description: "Anda sudah cukup memahami keamanan digital dengan beberapa area kecil yang bisa dioptimalkan.",
                icon: "✅"
            };
        } else {
            return {
                name: "Profil Sangat Aman",
                description: "Kebiasaan keamanan digital Anda sangat baik! Terus pertahankan dan edukasi orang sekitar.",
                icon: "🏆"
            };
        }
    }
};