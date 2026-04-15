// ============================================================
// AUTH UI HANDLER
// Mengelola tampilan modal login/register
// ============================================================

// Tampilkan modal auth
function showAuthModal(tab = 'login') {
    document.getElementById('authModal').style.display = 'flex';
    switchAuthTab(tab);
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = '';
    clearAuthErrors();
}

// Switch tab login/register
function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        document.getElementById('loginEmail').focus();
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        document.getElementById('registerName').focus();
    }
    clearAuthErrors();
}

// Toggle show/hide password
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eyeId = inputId === 'loginPassword' ? 'eye-login' : 'eye-register';
    const eye = document.getElementById(eyeId);

    if (input.type === 'password') {
        input.type = 'text';
        eye.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        eye.className = 'fas fa-eye';
    }
}

// Password strength indicator
document.getElementById('registerPassword')?.addEventListener('input', function () {
    const password = this.value;
    const strengthEl = document.getElementById('passwordStrength');
    if (!strengthEl) return;

    const checks = {
        length: password.length >= 8,
        number: /\d/.test(password),
        upper: /[A-Z]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password)
    };

    const passed = Object.values(checks).filter(Boolean).length;

    const levels = [
        { text: '', color: '' },
        { text: 'Sangat Lemah', color: '#dc2626' },
        { text: 'Lemah', color: '#f97316' },
        { text: 'Sedang', color: '#eab308' },
        { text: 'Kuat', color: '#22c55e' }
    ];

    const level = levels[passed] || levels[0];
    strengthEl.innerHTML = password.length > 0
        ? `<span style="color: ${level.color}; font-size: 0.75rem; font-weight: 600;">
             ${level.text}
           </span>`
        : '';
});

// Clear errors
function clearAuthErrors() {
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    if (loginError) loginError.style.display = 'none';
    if (registerError) registerError.style.display = 'none';
}

// ============================================================
// HANDLE LOGIN
// ============================================================
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');

    if (!email || !password) {
        errorEl.textContent = '⚠️ Email dan password wajib diisi';
        errorEl.style.display = 'block';
        return;
    }

    setButtonLoading(btn, true, 'Sedang login...');
    errorEl.style.display = 'none';

    try {
        const result = await ApiService.auth.login(email, password);

        if (result.success) {
            document.getElementById('userName').textContent = result.data.name;
            // Auth state listener akan menangani sisanya
            showToast(`Selamat datang kembali, ${result.data.name}! 👋`);
        } else {
            errorEl.textContent = `⚠️ ${result.message}`;
            errorEl.style.display = 'block';
        }
    } catch (error) {
        errorEl.textContent = '⚠️ Gagal terhubung ke Firebase. Cek koneksi internet.';
        errorEl.style.display = 'block';
    } finally {
        setButtonLoading(btn, false, '<i class="fas fa-sign-in-alt"></i> Login');
    }
}

// ============================================================
// HANDLE REGISTER
// ============================================================
async function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('registerError');
    const btn = document.getElementById('registerBtn');

    // Validasi
    if (!name || !email || !password) {
        errorEl.textContent = '⚠️ Semua field wajib diisi';
        errorEl.style.display = 'block';
        return;
    }

    if (name.length < 2) {
        errorEl.textContent = '⚠️ Nama minimal 2 karakter';
        errorEl.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = '⚠️ Password minimal 6 karakter';
        errorEl.style.display = 'block';
        return;
    }

    if (!/\d/.test(password)) {
        errorEl.textContent = '⚠️ Password harus mengandung minimal 1 angka';
        errorEl.style.display = 'block';
        return;
    }

    setButtonLoading(btn, true, 'Mendaftarkan...');
    errorEl.style.display = 'none';

    try {
        const result = await ApiService.auth.register(name, email, password);

        if (result.success) {
            document.getElementById('userName').textContent = result.data.name;
            showToast(`Selamat datang di SecureLearn, ${result.data.name}! 🎉`);
        } else {
            errorEl.textContent = `⚠️ ${result.message}`;
            errorEl.style.display = 'block';
        }
    } catch (error) {
        errorEl.textContent = '⚠️ Gagal mendaftar. Cek koneksi internet.';
        errorEl.style.display = 'block';
    } finally {
        setButtonLoading(btn, false, '<i class="fas fa-user-plus"></i> Daftar Sekarang');
    }
}

// ============================================================
// HANDLE LOGOUT
// ============================================================
async function handleLogout() {
    if (!confirm('Yakin ingin logout?')) return;

    try {
        await ApiService.auth.logout();
        showToast('Logout berhasil! Sampai jumpa 👋');

        // Reset semua state
        appState.history = [];
        appState.lastResult = null;
        appState.completedModules = [];

        // Reset stat UI
        updateStats();
        updateDashboard();
        renderModules();
        showPage('dashboard');

    } catch (error) {
        showToast('Gagal logout', 'warning');
    }
}

// Skip login - mode offline
function skipLogin() {
    closeAuthModal();
    loadFromStorage();
    showToast('Mode offline: Data tersimpan di browser saja', 'warning');
}

// ============================================================
// LOADING HELPERS
// ============================================================
function showLoading(text = 'Memuat...') {
    const overlay = document.getElementById('loadingOverlay');
    const textEl = document.getElementById('loadingText');
    if (overlay) {
        overlay.style.display = 'flex';
        if (textEl) textEl.textContent = text;
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

function setButtonLoading(btn, isLoading, originalHTML) {
    if (isLoading) {
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${originalHTML}`;
        btn.disabled = true;
    } else {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}