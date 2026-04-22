// ============================================================
// AUTH UI - FIXED LOGOUT & LOGIN
// ============================================================

function showAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'flex';
    switchAuthTab(tab);
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
    clearAuthErrors();
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (tab === 'login') {
        if (loginForm) loginForm.style.display = 'flex';
        if (registerForm) registerForm.style.display = 'none';
        if (tabLogin) tabLogin.classList.add('active');
        if (tabRegister) tabRegister.classList.remove('active');
        setTimeout(() => document.getElementById('loginEmail')?.focus(), 100);
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'flex';
        if (tabLogin) tabLogin.classList.remove('active');
        if (tabRegister) tabRegister.classList.add('active');
        setTimeout(() => document.getElementById('registerName')?.focus(), 100);
    }
    clearAuthErrors();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eyeId = inputId === 'loginPassword' ? 'eye-login' : 'eye-register';
    const eye = document.getElementById(eyeId);
    if (!input || !eye) return;

    if (input.type === 'password') {
        input.type = 'text';
        eye.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        eye.className = 'fas fa-eye';
    }
}

function clearAuthErrors() {
    ['loginError', 'registerError'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = 'none'; el.textContent = ''; }
    });
}

function showAuthError(formType, message) {
    const el = document.getElementById(`${formType}Error`);
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

// ============================================================
// HANDLE LOGIN
// ============================================================
async function handleLogin() {
    const email = (document.getElementById('loginEmail')?.value || '').trim();
    const password = document.getElementById('loginPassword')?.value || '';
    const btn = document.getElementById('loginBtn');

    if (!email || !password) {
        showAuthError('login', '⚠️ Email dan password wajib diisi');
        return;
    }

    setButtonLoading(btn, true);
    clearAuthErrors();

    try {
        const result = await ApiService.auth.login(email, password);

        if (result.success) {
            // Semua handling dilakukan di onAuthStateChange
            showToast(`Selamat datang, ${result.data.name}! 👋`);
        } else {
            showAuthError('login', `⚠️ ${result.message}`);
        }
    } catch (error) {
        showAuthError('login', '⚠️ Gagal terhubung. Cek koneksi internet.');
    } finally {
        setButtonLoading(btn, false,
            '<i class="fas fa-sign-in-alt"></i> Login');
    }
}

// ============================================================
// HANDLE REGISTER
// ============================================================
async function handleRegister() {
    const name = (document.getElementById('registerName')?.value || '').trim();
    const email = (document.getElementById('registerEmail')?.value || '').trim();
    const password = document.getElementById('registerPassword')?.value || '';
    const btn = document.getElementById('registerBtn');

    if (!name || !email || !password) {
        showAuthError('register', '⚠️ Semua field wajib diisi');
        return;
    }
    if (name.length < 2) {
        showAuthError('register', '⚠️ Nama minimal 2 karakter');
        return;
    }
    if (password.length < 6) {
        showAuthError('register', '⚠️ Password minimal 6 karakter');
        return;
    }
    if (!/\d/.test(password)) {
        showAuthError('register', '⚠️ Password harus mengandung angka');
        return;
    }

    setButtonLoading(btn, true);
    clearAuthErrors();

    try {
        const result = await ApiService.auth.register(name, email, password);

        if (result.success) {
            showToast(`Selamat datang, ${result.data.name}! 🎉`);
        } else {
            showAuthError('register', `⚠️ ${result.message}`);
        }
    } catch (error) {
        showAuthError('register', '⚠️ Gagal mendaftar. Coba lagi.');
    } finally {
        setButtonLoading(btn, false,
            '<i class="fas fa-user-plus"></i> Daftar Sekarang');
    }
}

// ============================================================
// HANDLE LOGOUT — FIXED
// ============================================================
async function handleLogout() {
    showConfirm({
        title: 'Logout',
        message: 'Yakin ingin keluar dari SecureLearn?',
        icon: '🚪',
        okText: 'Ya, Logout',
        okColor: '#dc2626',
        onConfirm: async () => {
            try {
                showLoading('Logging out...');
                await ApiService.auth.logout();
                hideLoading();
                showToast('Logout berhasil! Sampai jumpa 👋');
            } catch (error) {
                hideLoading();
                showToast('Logout gagal. Coba lagi.', 'warning');
            }
        }
    });
}

// ============================================================
// CUSTOM CONFIRM MODAL
// Pengganti confirm() bawaan browser
// ============================================================

let confirmCallback = null;

// Tampilkan modal konfirmasi
function showConfirm({
    title = 'Konfirmasi',
    message = 'Yakin?',
    icon = '⚠️',
    okText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    okColor = '#dc2626',
    onConfirm = null
}) {
    // Set konten
    document.getElementById('confirmIcon').textContent = icon;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmOkBtn').textContent = okText;
    document.getElementById('confirmOkBtn').style.background = okColor;
    document.getElementById('confirmCancelBtn').textContent = cancelText;

    // Simpan callback
    confirmCallback = onConfirm;

    // Tampilkan modal
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Focus ke tombol batal (lebih aman)
    setTimeout(() => {
        document.getElementById('confirmCancelBtn')?.focus();
    }, 100);
}

// Tutup modal dan jalankan callback
function closeConfirmModal(confirmed) {
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';

    if (confirmed && typeof confirmCallback === 'function') {
        confirmCallback();
    }

    confirmCallback = null;
}

// Tutup jika klik overlay
document.getElementById('confirmOverlay')?.addEventListener('click', () => {
    closeConfirmModal(false);
});

// Tutup dengan tombol Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('confirmModal');
        if (modal && modal.style.display === 'flex') {
            closeConfirmModal(false);
        }
    }
});

function skipLogin() {
    closeAuthModal();
    // Load dari localStorage jika ada
    loadFromStorage();
    showToast('Mode offline: Data hanya tersimpan di browser', 'warning');
}

function setButtonLoading(btn, isLoading, originalHTML = '') {
    if (!btn) return;
    if (isLoading) {
        btn.setAttribute('data-original', btn.innerHTML);
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
        btn.disabled = true;
    } else {
        btn.innerHTML = originalHTML || btn.getAttribute('data-original') || 'Submit';
        btn.disabled = false;
    }
}