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

// ============================================================
// PROFILE DROPDOWN
// ============================================================

function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    const overlay  = document.getElementById('profileOverlay');
    const arrow    = document.getElementById('profileArrow');
    const trigger  = document.getElementById('profileTrigger');

    const isOpen = dropdown.classList.contains('open');

    if (isOpen) {
        closeProfileMenu();
    } else {
        const rect = trigger.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 8) + 'px';
        dropdown.style.right = (window.innerWidth - rect.right) + 'px';
        dropdown.style.left  = 'auto';

        dropdown.classList.add('open');
        overlay.style.display  = 'block';
        arrow.classList.add('rotated');
        trigger.classList.add('active');

        // Update stats di dropdown
        updateDropdownStats();
    }
}

function closeProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    const overlay  = document.getElementById('profileOverlay');
    const arrow    = document.getElementById('profileArrow');
    const trigger  = document.getElementById('profileTrigger');

    if (!dropdown) return;

    dropdown.classList.remove('open');
    if (overlay)  overlay.style.display = 'none';
    if (arrow)    arrow.classList.remove('rotated');
    if (trigger)  trigger.classList.remove('active');
    
}

// Update stats di dropdown
function updateDropdownStats() {
    const score = appState.lastResult?.totalScore;
    const assessments = appState.history?.length || 0;
    const completed = appState.completedModules?.length || 0;
    const total = typeof SECURITY_MODULES !== 'undefined'
        ? SECURITY_MODULES.length : 9;

    const ddScore = document.getElementById('ddStatScore');
    const ddAss   = document.getElementById('ddStatAssessments');
    const ddMod   = document.getElementById('ddStatModules');

    if (ddScore) ddScore.textContent = score !== null && score !== undefined
        ? score : '--';
    if (ddAss)   ddAss.textContent   = assessments;
    if (ddMod)   ddMod.textContent   = `${completed}/${total}`;
}

// Update info navbar setelah login
function updateNavbarProfile(user) {
    if (!user) return;

    const initial = (user.name || user.email || 'U')[0].toUpperCase();

    // Navbar avatar
    const navAvatarText = document.getElementById('navAvatarText');
    if (navAvatarText) navAvatarText.textContent = initial;

    // Navbar username
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = user.name || 'Pengguna';

    // Dropdown avatar & info
    const ddAvText  = document.getElementById('dropdownAvatarText');
    const ddName    = document.getElementById('dropdownName');
    const ddEmail   = document.getElementById('dropdownEmail');
    const ddRole    = document.getElementById('dropdownRole');

    if (ddAvText)  ddAvText.textContent  = initial;
    if (ddName)    ddName.textContent    = user.name || 'Pengguna';
    if (ddEmail)   ddEmail.textContent   = user.email || '';
    if (ddRole)    ddRole.textContent    = user.role === 'admin' ? 'Admin' : 'User';

    // Profile modal avatar
    const pmAvLarge = document.getElementById('profileAvatarLarge');
    const pmAvName  = document.getElementById('profileAvatarName');
    const pmAvEmail = document.getElementById('profileAvatarEmail');

    if (pmAvLarge) pmAvLarge.textContent = initial;
    if (pmAvName)  pmAvName.textContent  = user.name || 'Pengguna';
    if (pmAvEmail) pmAvEmail.textContent = user.email || '';

    // Pre-fill form edit profil
    const editName  = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    if (editName)  editName.value  = user.name || '';
    if (editEmail) editEmail.value = user.email || '';
}

// ============================================================
// MODAL EDIT PROFIL
// ============================================================
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Reset feedback
        hideFormFeedback('profileError');
        hideFormFeedback('profileSuccess');

        setTimeout(() => document.getElementById('editName')?.focus(), 100);
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

async function saveProfile() {
    const name = (document.getElementById('editName')?.value || '').trim();
    const btn  = document.getElementById('saveProfileBtn');

    if (!name || name.length < 2) {
        showFormError('profileError', 'Nama minimal 2 karakter');
        return;
    }

    setButtonLoading(btn, true);
    hideFormFeedback('profileError');
    hideFormFeedback('profileSuccess');

    try {
        const result = await ApiService.auth.updateProfile({ name });

        if (result.success) {
            // Update navbar & dropdown
            const user = await ApiService.auth.getMe();
            if (user) updateNavbarProfile(user);

            showFormSuccess('profileSuccess', '✅ Profil berhasil diperbarui!');
            showToast('Profil berhasil diperbarui!');

            setTimeout(() => closeProfileModal(), 1500);
        } else {
            showFormError('profileError', result.message || 'Gagal memperbarui profil');
        }
    } catch (error) {
        showFormError('profileError', 'Terjadi kesalahan. Coba lagi.');
    } finally {
        setButtonLoading(btn, false,
            '<i class="fas fa-save"></i> Simpan');
    }
}

// ============================================================
// MODAL GANTI PASSWORD
// ============================================================
function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Reset semua field & feedback
        ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        hideFormFeedback('passwordError');
        hideFormFeedback('passwordSuccess');

        const strengthEl = document.getElementById('newPasswordStrength');
        if (strengthEl) strengthEl.innerHTML = '';

        setTimeout(() => document.getElementById('currentPassword')?.focus(), 100);
    }
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

async function saveNewPassword() {
    const current  = document.getElementById('currentPassword')?.value || '';
    const newPass  = document.getElementById('newPassword')?.value || '';
    const confirm  = document.getElementById('confirmPassword')?.value || '';
    const btn      = document.getElementById('savePasswordBtn');

    // Validasi
    if (!current) {
        showFormError('passwordError', 'Password saat ini wajib diisi');
        return;
    }
    if (newPass.length < 6) {
        showFormError('passwordError', 'Password baru minimal 6 karakter');
        return;
    }
    if (!/\d/.test(newPass)) {
        showFormError('passwordError', 'Password baru harus mengandung angka');
        return;
    }
    if (newPass !== confirm) {
        showFormError('passwordError', 'Konfirmasi password tidak cocok');
        return;
    }
    if (current === newPass) {
        showFormError('passwordError', 'Password baru tidak boleh sama dengan yang lama');
        return;
    }

    setButtonLoading(btn, true);
    hideFormFeedback('passwordError');
    hideFormFeedback('passwordSuccess');

    try {
        const result = await ApiService.auth.changePassword(current, newPass);

        if (result.success) {
            showFormSuccess('passwordSuccess', '✅ Password berhasil diubah!');
            showToast('Password berhasil diubah!');
            setTimeout(() => closeChangePasswordModal(), 1500);
        } else {
            showFormError('passwordError', result.message || 'Gagal mengubah password');
        }
    } catch (error) {
        showFormError('passwordError', 'Terjadi kesalahan. Coba lagi.');
    } finally {
        setButtonLoading(btn, false,
            '<i class="fas fa-save"></i> Simpan Password');
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    const el = document.getElementById('newPasswordStrength');
    if (!el) return;

    if (!password) { el.innerHTML = ''; return; }

    const checks = {
        length:  password.length >= 8,
        number:  /\d/.test(password),
        upper:   /[A-Z]/.test(password),
        symbol:  /[^A-Za-z0-9]/.test(password)
    };

    const passed = Object.values(checks).filter(Boolean).length;

    const levels = [
        { text: 'Sangat Lemah', color: '#dc2626', width: '20%' },
        { text: 'Lemah',        color: '#f97316', width: '40%' },
        { text: 'Sedang',       color: '#eab308', width: '60%' },
        { text: 'Kuat',         color: '#22c55e', width: '80%' },
        { text: 'Sangat Kuat',  color: '#16a34a', width: '100%' }
    ];

    const level = levels[passed] || levels[0];

    el.innerHTML = `
        <div style="height:4px; background:#e5e7eb; border-radius:4px; overflow:hidden; margin-top:6px;">
            <div style="height:100%; width:${level.width}; background:${level.color};
                        border-radius:4px; transition:width 0.3s ease;"></div>
        </div>
        <span style="font-size:0.75rem; color:${level.color}; font-weight:600;">
            ${level.text}
        </span>
    `;
}

// ============================================================
// FORM FEEDBACK HELPERS
// ============================================================
function showFormError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = `⚠️ ${message}`;
        el.style.display = 'block';
    }
}

function showFormSuccess(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

function hideFormFeedback(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.style.display = 'none';
}