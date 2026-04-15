// ============================================================
// LOAD DATA DARI FIREBASE
// ============================================================
window.loadFromFirebase = async function () {
    try {
        // Ambil semua data dashboard sekaligus
        const dashResult = await ApiService.dashboard.get();

        if (!dashResult.success) {
            console.warn('Dashboard fetch failed:', dashResult.message);
            loadFromStorage();
            return;
        }

        const data = dashResult.data;

        // Update nama user
        document.getElementById('userName').textContent = data.user.name || 'Pengguna';

        // Set latest result ke state
        if (data.latestAssessment) {
            appState.lastResult = {
                totalScore: data.latestAssessment.totalScore,
                categoryScores: data.latestAssessment.categoryScores || {},
                riskLevel: data.latestAssessment.riskLevel,
                userProfile: data.latestAssessment.userProfile,
                recommendations: data.latestAssessment.recommendations || [],
                impactProjection: data.latestAssessment.impactProjection || [],
                recommendedModules: data.latestAssessment.recommendedModules || [],
                timestamp: data.latestAssessment.completedAt
            };
        } else {
            appState.lastResult = null;
        }

        // Set history
        appState.history = data.recentAssessments.map(item => ({
            id: item.id,
            totalScore: item.totalScore,
            riskLevel: item.riskLevel,
            userProfile: item.userProfile || { name: 'Profil', icon: '📊' },
            recommendations: item.recommendations || [],
            categoryScores: item.categoryScores || {},
            timestamp: item.completedAt,
            trend: item.trend || null
        }));

        // Set completed modules
        const progressMap = data.moduleProgress || {};
        appState.completedModules = Object.entries(progressMap)
            .filter(([id, prog]) => prog.status === 'completed')
            .map(([id]) => id);

        // Update semua UI
        updateDashboard();
        updateStats();
        renderModules();
        renderHistory();

    } catch (error) {
        console.error('Error loading from Firebase:', error);
        loadFromStorage();
    }
};

// ============================================================
// OVERRIDE submitAssessment untuk Firebase
// ============================================================
async function submitAssessment() {
    if (appState.answeredCount < appState.totalQuestions) {
        showToast('Jawab semua pertanyaan terlebih dahulu!', 'warning');
        return;
    }

    const startTime = appState.assessmentStartTime || Date.now();
    const duration = Math.round((Date.now() - startTime) / 1000);

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menganalisis dengan AI...';
    submitBtn.disabled = true;

    try {
        // Hitung analisis di client
        const categoryScores = {};
        Object.keys(ASSESSMENT_QUESTIONS).forEach(cat => {
            categoryScores[cat] = RiskEngine.calculateCategoryScore(
                cat, appState.answers
            );
        });

        const totalScore = RiskEngine.calculateTotalScore(appState.answers);
        const riskLevel = RiskEngine.getRiskLevel(totalScore);
        const recommendations = RiskEngine.generateRecommendations(
            appState.answers, categoryScores
        );
        const impactProjection = RiskEngine.calculateImpactProjection(
            totalScore, recommendations
        );
        const recommendedModules = RiskEngine.getRecommendedModules(
            categoryScores, appState.answers
        );
        const userProfile = RiskEngine.getUserProfile(totalScore, categoryScores);

        const analysisResult = {
            answers: appState.answers,
            totalScore,
            categoryScores,
            riskLevel,
            userProfile,
            recommendations,
            impactProjection,
            recommendedModules,
            duration
        };

        // Cek login Firebase
        if (ApiService.auth.isLoggedIn()) {
            showLoading('Menyimpan ke Firebase...');

            const saveResult = await ApiService.assessment.submitWithAnalysis(analysisResult);

            hideLoading();

            if (saveResult.success) {
                showToast(`Asesmen disimpan! Skor: ${totalScore}/100`);
                // Reload data dari Firebase
                await loadFromFirebase();
            } else {
                showToast('Gagal menyimpan ke cloud, tersimpan lokal', 'warning');
                saveLocally(analysisResult);
            }
        } else {
            // Mode offline
            saveLocally(analysisResult);
            showToast('Mode offline: Skor ' + totalScore + '/100');
        }

        // Tampilkan hasil
        const result = {
            ...analysisResult,
            timestamp: new Date().toISOString()
        };

        appState.lastResult = result;
        showResults(result);
        updateDashboard();
        updateStats();

    } catch (error) {
        console.error('Submit error:', error);
        showToast('Terjadi kesalahan. Coba lagi.', 'warning');
    } finally {
        submitBtn.innerHTML =
            '<i class="fas fa-brain"></i> Analisis Risiko dengan AI';
        submitBtn.disabled = false;
    }
}

// Simpan lokal jika offline
function saveLocally(result) {
    appState.lastResult = { ...result, timestamp: new Date().toISOString() };
    appState.history.unshift(appState.lastResult);
    if (appState.history.length > 10) appState.history.pop();
    saveToStorage();
}

// ============================================================
// OVERRIDE completeModule untuk Firebase
// ============================================================
async function completeModule() {
    if (!appState.currentModule) return;

    const moduleId = appState.currentModule;
    const isCompleted = appState.completedModules.includes(moduleId);

    if (isCompleted) {
        showToast('Modul sudah ditandai selesai');
        closeModule();
        return;
    }

    try {
        if (ApiService.auth.isLoggedIn()) {
            const result = await ApiService.modules.completeModule(moduleId);

            if (result.success) {
                appState.completedModules.push(moduleId);
                showToast(
                    `Modul selesai! Total: ${result.data?.totalCompleted || ''} modul 🎉`
                );
            }
        } else {
            appState.completedModules.push(moduleId);
            saveToStorage();
            showToast('Modul selesai! 🎉');
        }
    } catch (error) {
        appState.completedModules.push(moduleId);
        saveToStorage();
        showToast('Modul selesai! 🎉');
    }

    updateStats();
    renderModules();
    closeModule();
}

// ============================================================
// OVERRIDE clearHistory untuk Firebase
// ============================================================
async function clearHistory() {
    if (!confirm('Hapus semua riwayat asesmen?')) return;

    try {
        if (ApiService.auth.isLoggedIn()) {
            showLoading('Menghapus riwayat...');
            const result = await ApiService.assessment.deleteAll();
            hideLoading();

            if (result.success) {
                showToast(`${result.data.deletedCount} riwayat dihapus`);
            }
        }
    } catch (error) {
        console.warn('Error deleting from Firebase:', error);
    }

    appState.history = [];
    appState.lastResult = null;
    localStorage.removeItem('securelearn_history');
    localStorage.removeItem('securelearn_last_result');

    renderHistory();
    updateStats();
    updateDashboard();
}



// ============================================================
// MAIN APPLICATION CONTROLLER
// ============================================================

// State aplikasi
let appState = {
    currentPage: 'dashboard',
    answers: {},
    totalQuestions: 0,
    answeredCount: 0,
    lastResult: null,
    history: [],
    completedModules: [],
    currentModule: null,
    charts: {}
};

// ============================================================
// INISIALISASI
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load data dari localStorage
    loadFromStorage();

    // Render pertanyaan assessment
    renderQuestions();

    // Render modul
    renderModules();

    // Update dashboard
    updateDashboard();

    // Update stats
    updateStats();
});

function loadFromStorage() {
    try {
        const history = localStorage.getItem('securelearn_history');
        const completed = localStorage.getItem('securelearn_completed');
        const lastResult = localStorage.getItem('securelearn_last_result');

        if (history) appState.history = JSON.parse(history);
        if (completed) appState.completedModules = JSON.parse(completed);
        if (lastResult) appState.lastResult = JSON.parse(lastResult);
    } catch (e) {
        console.log('No stored data found');
    }
}

function saveToStorage() {
    localStorage.setItem('securelearn_history', JSON.stringify(appState.history));
    localStorage.setItem('securelearn_completed', JSON.stringify(appState.completedModules));
    if (appState.lastResult) {
        localStorage.setItem('securelearn_last_result', JSON.stringify(appState.lastResult));
    }
}

// ============================================================
// NAVIGASI
// ============================================================

function showPage(pageId) {
    // Update active page
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const navEl = document.getElementById(`nav-${pageId}`);
    if (navEl) navEl.classList.add('active');

    appState.currentPage = pageId;

    // Page-specific actions
    if (pageId === 'history') renderHistory();
    if (pageId === 'dashboard') updateDashboard();
    if (pageId === 'modules') renderModules();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// RENDER PERTANYAAN ASSESSMENT
// ============================================================

function renderQuestions() {
    let totalQ = 0;

    Object.entries(ASSESSMENT_QUESTIONS).forEach(([catKey, catData]) => {
        const container = document.getElementById(`questions-${catKey}`);
        if (!container) return;

        catData.questions.forEach((q, idx) => {
            totalQ++;
            const globalIdx = totalQ;

            const questionEl = document.createElement('div');
            questionEl.className = 'question-item';
            questionEl.id = `question-${q.id}`;

            questionEl.innerHTML = `
                <div class="question-text">
                    <span class="question-number">Q${globalIdx}.</span> ${q.text}
                </div>
                <div class="options-list">
                    ${q.options.map((opt, optIdx) => `
                        <label class="option-item" id="opt-${q.id}-${optIdx}" 
                               onclick="selectOption('${catKey}', '${q.id}', ${opt.score}, ${optIdx}, '${opt.risk}')">
                            <input type="radio" name="${q.id}" value="${opt.score}">
                            <span>${opt.text}</span>
                            <span class="risk-indicator risk-${opt.risk}">
                                ${opt.risk === 'high' ? '⚠ Risiko Tinggi' : opt.risk === 'medium' ? '~ Sedang' : '✓ Aman'}
                            </span>
                        </label>
                    `).join('')}
                </div>
            `;

            container.appendChild(questionEl);
        });
    });

    appState.totalQuestions = totalQ;
    document.getElementById('progressText').textContent = `0 / ${totalQ} pertanyaan`;
}

function selectOption(category, questionId, score, optionIdx, riskLevel) {
    // Update state
    appState.answers[questionId] = score;

    // Update UI - highlight selected option
    const questionEl = document.getElementById(`question-${questionId}`);
    if (questionEl) {
        questionEl.classList.add('answered');
        questionEl.querySelectorAll('.option-item').forEach((opt, idx) => {
            opt.classList.toggle('selected', idx === optionIdx);
        });
        // Set radio button
        const radios = questionEl.querySelectorAll('input[type="radio"]');
        if (radios[optionIdx]) radios[optionIdx].checked = true;
    }

    // Update answered count
    appState.answeredCount = Object.keys(appState.answers).length;

    // Update progress
    const progress = (appState.answeredCount / appState.totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = 
        `${appState.answeredCount} / ${appState.totalQuestions} pertanyaan`;

    // Update category score preview
    updateCategoryScorePreview(category);

    // Enable/disable submit button
    document.getElementById('submitBtn').disabled = 
        appState.answeredCount < appState.totalQuestions;
}

function updateCategoryScorePreview(category) {
    const score = RiskEngine.calculateCategoryScore(category, appState.answers);
    const el = document.getElementById(`score-${category}`);
    if (el) {
        el.textContent = `${score}`;
        el.classList.add('scored');
    }
}

// ============================================================
// SUBMIT & ANALISIS
// ============================================================

function submitAssessment() {
    if (appState.answeredCount < appState.totalQuestions) {
        showToast('Jawab semua pertanyaan terlebih dahulu!', 'warning');
        return;
    }

    // Hitung skor
    const categoryScores = {};
    Object.keys(ASSESSMENT_QUESTIONS).forEach(cat => {
        categoryScores[cat] = RiskEngine.calculateCategoryScore(cat, appState.answers);
    });

    const totalScore = RiskEngine.calculateTotalScore(appState.answers);
    const riskLevel = RiskEngine.getRiskLevel(totalScore);
    const recommendations = RiskEngine.generateRecommendations(appState.answers, categoryScores);
    const impactProjection = RiskEngine.calculateImpactProjection(totalScore, recommendations);
    const recommendedModules = RiskEngine.getRecommendedModules(categoryScores, appState.answers);
    const userProfile = RiskEngine.getUserProfile(totalScore, categoryScores);

    // Simpan hasil
    const result = {
        timestamp: new Date().toISOString(),
        totalScore,
        categoryScores,
        riskLevel,
        recommendations,
        impactProjection,
        recommendedModules,
        userProfile,
        answers: { ...appState.answers }
    };

    appState.lastResult = result;
    appState.history.unshift(result);
    if (appState.history.length > 10) appState.history.pop(); // Max 10 riwayat

    saveToStorage();

    // Tampilkan hasil
    showResults(result);
    updateDashboard();
    updateStats();
}

function showResults(result) {
    document.getElementById('assessmentForm').style.display = 'none';
    document.getElementById('assessmentResult').style.display = 'block';

    // Render score gauge
    renderScoreGauge(result.totalScore, result.riskLevel);

    // Render breakdown
    renderScoreBreakdown(result.categoryScores);

    // Render category chart
    renderCategoryChart(result.categoryScores);

    // Render recommendations
    renderRecommendations(result.recommendations);

    // Render impact chart
    renderImpactChart(result.impactProjection);

    // Render module recommendations
    renderModuleRecommendations(result.recommendedModules);

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast(`Analisis selesai! Skor Risiko: ${result.totalScore}/100`);
}

function resetAssessment() {
    appState.answers = {};
    appState.answeredCount = 0;

    // Reset UI
    document.getElementById('assessmentForm').style.display = 'block';
    document.getElementById('assessmentResult').style.display = 'none';

    // Reset questions
    document.querySelectorAll('.question-item').forEach(q => {
        q.classList.remove('answered');
        q.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
        q.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    });

    // Reset progress
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressText').textContent = `0 / ${appState.totalQuestions} pertanyaan`;

    // Reset category scores
    ['password', 'otp', 'sharing', 'awareness'].forEach(cat => {
        const el = document.getElementById(`score-${cat}`);
        if (el) { el.textContent = '-'; el.classList.remove('scored'); }
    });

    document.getElementById('submitBtn').disabled = true;

    // Destroy charts
    Object.values(appState.charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    appState.charts = {};

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// RENDER CHARTS
// ============================================================

function renderScoreGauge(score, riskLevel) {
    // Update number
    const scoreEl = document.getElementById('scoreNumber');
    animateNumber(scoreEl, 0, score, 1500);

    // Update risk badge
    const badge = document.getElementById('riskBadge');
    badge.className = `risk-badge ${riskLevel.class}`;
    badge.innerHTML = `<i class="fas fa-circle"></i> <span>${riskLevel.emoji} ${riskLevel.level}</span>`;

    document.getElementById('riskCategoryLabel').textContent =
        score >= 70 ? 'Perlu tindakan segera!' :
        score >= 45 ? 'Perlu perbaikan signifikan' :
        score >= 25 ? 'Cukup baik, masih bisa ditingkatkan' :
        'Keamanan digital yang sangat baik!';

    // Draw gauge chart
    const canvas = document.getElementById('scoreGauge');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score arc
    const scoreAngle = (score / 100) * Math.PI * 1.5;
    const color = score >= 70 ? '#dc2626' :
                  score >= 45 ? '#d97706' :
                  score >= 25 ? '#2563eb' : '#16a34a';

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 0.75 + scoreAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function renderScoreBreakdown(categoryScores) {
    const container = document.getElementById('scoreBreakdown');
    const categoryColors = {
        password: '#2563eb',
        otp: '#16a34a',
        sharing: '#d97706',
        awareness: '#7c3aed'
    };

    const categoryNames = {
        password: 'Password',
        otp: 'OTP & Auth',
        sharing: 'Berbagi Data',
        awareness: 'Kesadaran'
    };

    container.innerHTML = Object.entries(categoryScores).map(([cat, score]) => `
        <div class="breakdown-item">
            <div class="breakdown-label">${categoryNames[cat]}</div>
            <div class="breakdown-bar">
                <div class="breakdown-fill" 
                     style="width: ${score}%; background: ${categoryColors[cat]};"
                     data-width="${score}"></div>
            </div>
            <div class="breakdown-value">${score}</div>
        </div>
    `).join('');
}

function renderCategoryChart(categoryScores) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    if (appState.charts.category) appState.charts.category.destroy();

    appState.charts.category = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Password', 'OTP & Auth', 'Berbagi Data', 'Kesadaran'],
            datasets: [{
                label: 'Skor Risiko',
                data: [
                    categoryScores.password,
                    categoryScores.otp,
                    categoryScores.sharing,
                    categoryScores.awareness
                ],
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                borderColor: '#2563eb',
                borderWidth: 2,
                pointBackgroundColor: '#2563eb',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        font: { size: 10 }
                    },
                    grid: { color: '#e5e7eb' },
                    pointLabels: {
                        font: { size: 12, weight: '600' }
                    }
                }
            }
        }
    });
}

function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendationsList');

    const urgencyConfig = {
        kritis: { class: 'urgency-kritis', label: '🔴 Kritis', borderColor: '#dc2626' },
        tinggi: { class: 'urgency-tinggi', label: '🟠 Urgensi Tinggi', borderColor: '#ea580c' },
        sedang: { class: 'urgency-sedang', label: '🟡 Sedang', borderColor: '#d97706' },
        rendah: { class: 'urgency-rendah', label: '🟢 Rendah', borderColor: '#16a34a' }
    };

    container.innerHTML = recommendations.map((rec, idx) => {
        const urgency = urgencyConfig[rec.urgency] || urgencyConfig.sedang;
        return `
            <div class="recommendation-item" style="border-left: 4px solid ${urgency.borderColor}">
                <div class="rec-priority-badge priority-${Math.min(rec.priority, 5)}">
                    #${rec.priority}
                </div>
                <div class="rec-content">
                    <div class="rec-header">
                        <div class="rec-title">${rec.title}</div>
                        <span class="rec-urgency ${urgency.class}">${urgency.label}</span>
                    </div>
                    <div class="rec-description">${rec.description}</div>
                    <div class="rec-reason">${rec.reason}</div>
                    <div class="mb-4" style="margin-top: 8px;">
                        <strong style="font-size: 0.82rem; color: #374151;">Langkah Tindakan:</strong>
                        <ul style="margin-top: 4px; padding-left: 16px;">
                            ${rec.steps.map(s => `<li style="font-size: 0.82rem; color: #4b5563; margin-bottom: 4px;">${s}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="rec-impact">
                        <i class="fas fa-arrow-trend-up"></i>
                        <span>Dampak: ${rec.impact}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderImpactChart(projection) {
    const ctx = document.getElementById('impactChart');
    if (!ctx) return;

    if (appState.charts.impact) appState.charts.impact.destroy();

    const colors = projection.map((p, i) => {
        if (i === 0) return '#6b7280';
        const score = p.score;
        return score >= 70 ? '#dc2626' :
               score >= 45 ? '#d97706' :
               score >= 25 ? '#2563eb' : '#16a34a';
    });

    appState.charts.impact = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: projection.map(p => p.step),
            datasets: [{
                label: 'Skor Risiko',
                data: projection.map(p => p.score),
                backgroundColor: colors.map(c => c + '30'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterBody: (items) => {
                            const idx = items[0].dataIndex;
                            if (idx > 0 && projection[idx].action) {
                                return [`Tindakan: ${projection[idx].action}`];
                            }
                            return [];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 20 },
                    grid: { color: '#f3f4f6' },
                    title: {
                        display: true,
                        text: 'Skor Risiko (lebih rendah = lebih aman)'
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function renderModuleRecommendations(recommendedModules) {
    const container = document.getElementById('moduleRecommendations');

    if (!recommendedModules.length) {
        container.innerHTML = '<p style="color: #6b7280; font-size: 0.9rem;">Keamanan Anda sudah sangat baik! Tetap pelajari semua modul untuk mempertahankan pengetahuan.</p>';
        return;
    }

    const topModules = recommendedModules.slice(0, 6);

    container.innerHTML = `
        <div class="module-rec-grid">
            ${topModules.map(recMod => {
                const moduleData = SECURITY_MODULES.find(m => m.id === recMod.id);
                if (!moduleData) return '';
                return `
                    <div class="module-rec-card ${recMod.urgent ? 'priority' : ''}" 
                         onclick="openModule('${moduleData.id}')">
                        <span class="module-rec-icon">${moduleData.emoji}</span>
                        <div class="module-rec-title">${moduleData.title}</div>
                        ${recMod.urgent ? '<span class="module-rec-badge">Prioritas</span>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}


// ============================================================
// DASHBOARD
// ============================================================

function updateDashboard() {
    if (!appState.lastResult) return;

    const result = appState.lastResult;
    const scoreEl = document.getElementById('stat-score');
    if (scoreEl) scoreEl.textContent = `${result.totalScore}/100`;

    // Update quick risk card
    const content = document.getElementById('quickRiskContent');
    if (content) {
        const riskLevel = result.riskLevel;
        content.innerHTML = `
            <div class="quick-risk-grid">
                <div class="mini-score" style="border-color: ${riskLevel.color}">
                    <div class="mini-score-number" style="color: ${riskLevel.color}">${result.totalScore}</div>
                    <div class="mini-score-label">Skor Total</div>
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; gap: 10px;">
                    <div class="risk-badge ${riskLevel.class}" style="display: inline-flex;">
                        ${riskLevel.emoji} ${riskLevel.level}
                    </div>
                    <div style="font-size: 0.85rem; color: #6b7280;">
                        ${result.userProfile.icon} ${result.userProfile.name}
                    </div>
                    <div style="font-size: 0.8rem; color: #9ca3af;">
                        ${new Date(result.timestamp).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        })}
                    </div>
                </div>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                <div style="font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 8px;">
                    Top Rekomendasi:
                </div>
                ${result.recommendations.slice(0, 3).map((rec, idx) => `
                    <div style="font-size: 0.82rem; color: #6b7280; padding: 6px 0; border-bottom: 1px solid #f9fafb; display: flex; align-items: center; gap: 8px;">
                        <span style="color: #2563eb; font-weight: 700;">#${idx+1}</span>
                        ${rec.title}
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 16px; text-align: center;">
                <button class="btn-primary" onclick="showPage('assessment')" style="width: 100%;">
                    <i class="fas fa-sync-alt"></i> Asesmen Ulang
                </button>
            </div>
        `;
    }
}

function updateStats() {
    const statAssessments = document.getElementById('stat-assessments');
    const statRecommendations = document.getElementById('stat-recommendations');
    const statModules = document.getElementById('stat-modules');
    const statScore = document.getElementById('stat-score');

    if (statAssessments) statAssessments.textContent = appState.history.length;
    if (statRecommendations) {
        statRecommendations.textContent = appState.lastResult ?
            appState.lastResult.recommendations.length : '0';
    }
    if (statModules) {
        statModules.textContent = `${appState.completedModules.length}/${SECURITY_MODULES.length}`;
    }
    if (statScore && appState.lastResult) {
        statScore.textContent = `${appState.lastResult.totalScore}/100`;
    }
}

// ============================================================
// MODULES
// ============================================================

function renderModules() {
    const container = document.getElementById('modulesGrid');
    if (!container) return;

    container.innerHTML = SECURITY_MODULES.map(mod => {
        const isCompleted = appState.completedModules.includes(mod.id);
        const isRecommended = appState.lastResult &&
            appState.lastResult.recommendedModules.find(r => r.id === mod.id && r.urgent);

        return `
            <div class="module-card ${isCompleted ? 'completed' : ''}" onclick="openModule('${mod.id}')">
                ${isRecommended ? '<div style="background: #fee2e2; color: #dc2626; font-size: 0.7rem; font-weight: 700; padding: 4px 12px; text-align: center;">⚠️ Direkomendasikan untuk Anda</div>' : ''}
                <div class="module-card-header">
                    <div class="module-emoji">${mod.emoji}</div>
                    <div>
                        <div class="module-card-title">${mod.title}</div>
                        <div class="module-card-sub">${mod.subtitle}</div>
                    </div>
                </div>
                <div class="module-card-body">${mod.description}</div>
                <div class="module-card-footer">
                    <span class="module-difficulty diff-${mod.difficulty}">
                        ${mod.difficulty === 'beginner' ? '📗 Pemula' :
                          mod.difficulty === 'intermediate' ? '📘 Menengah' : '📕 Lanjutan'}
                    </span>
                    <span class="module-read-time">
                        <i class="fas fa-clock"></i> ${mod.readTime}
                    </span>
                    <span class="module-status ${isCompleted ? 'done' : 'pending'}">
                        ${isCompleted ? '✅ Selesai' : '📖 Belum dibaca'}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function openModule(moduleId) {
    const module = SECURITY_MODULES.find(m => m.id === moduleId);
    if (!module) return;

    appState.currentModule = moduleId;

    // Set modal content
    document.getElementById('modalTitle').textContent = `${module.emoji} ${module.title}`;
    document.getElementById('modalSubtitle').textContent = module.subtitle;
    document.getElementById('modalBody').innerHTML = module.content;

    // Update complete button
    const completeBtn = document.getElementById('completeBtn');
    const isCompleted = appState.completedModules.includes(moduleId);
    completeBtn.innerHTML = isCompleted ?
        '<i class="fas fa-check-circle"></i> Sudah Selesai' :
        '<i class="fas fa-check"></i> Tandai Selesai';
    completeBtn.style.opacity = isCompleted ? '0.6' : '1';

    document.getElementById('moduleModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModule() {
    document.getElementById('moduleModal').style.display = 'none';
    document.body.style.overflow = '';
    appState.currentModule = null;
}

function completeModule() {
    if (!appState.currentModule) return;

    if (!appState.completedModules.includes(appState.currentModule)) {
        appState.completedModules.push(appState.currentModule);
        saveToStorage();
        updateStats();
        renderModules();
        showToast(`Modul selesai! Bagus sekali 🎉`);
    } else {
        showToast('Modul sudah ditandai selesai sebelumnya');
    }

    closeModule();
}

// ============================================================
// HISTORY
// ============================================================

function renderHistory() {
    const container = document.getElementById('historyList');
    const clearBtn = document.getElementById('clearHistoryBtn');
    const chartContainer = document.getElementById('historyChartContainer');

    if (!appState.history.length) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard"></i>
                <p>Belum ada riwayat asesmen pengguna</p>
                <button class="btn-primary" onclick="showPage('assessment')">
                    Mulai Asesmen Pertama
                </button>
            </div>
        `;
        if (clearBtn) clearBtn.style.display = 'none';
        if (chartContainer) chartContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <p>Belum ada data untuk ditampilkan</p>
            </div>
        `;
        return;
    }

    if (clearBtn) clearBtn.style.display = 'inline-flex';

    // Render trend chart
    renderHistoryChart();

    // Render history list
    container.innerHTML = appState.history.map((item, idx) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const prevItem = appState.history[idx + 1];
        let trendHtml = '';
        if (prevItem) {
            const diff = item.totalScore - prevItem.totalScore;
            if (diff > 0) {
                trendHtml = `<div class="history-trend trend-up"><i class="fas fa-arrow-up"></i> +${diff} (Risiko Naik)</div>`;
            } else if (diff < 0) {
                trendHtml = `<div class="history-trend trend-down"><i class="fas fa-arrow-down"></i> ${diff} (Risiko Turun ✅)</div>`;
            } else {
                trendHtml = `<div class="history-trend trend-same"><i class="fas fa-minus"></i> Sama</div>`;
            }
        }

        const scoreColor = item.totalScore >= 70 ? '#dc2626' :
                           item.totalScore >= 45 ? '#d97706' :
                           item.totalScore >= 25 ? '#2563eb' : '#16a34a';

        return `
            <div class="history-item">
                <div class="history-rank">#${idx + 1}</div>
                <div class="history-score-badge" style="background: ${scoreColor}">
                    ${item.totalScore}
                </div>
                <div class="history-info">
                    <div class="history-date"><i class="fas fa-calendar"></i> ${dateStr}</div>
                    <div class="history-profile">
                        <span class="history-profile-name">
                            ${item.userProfile.icon} ${item.userProfile.name}
                        </span>
                        <span class="risk-badge ${item.riskLevel.class}" style="font-size: 0.7rem; padding: 2px 8px;">
                            ${item.riskLevel.level}
                        </span>
                    </div>
                    <div class="history-stats">
                        <span><i class="fas fa-list-ol"></i> ${item.recommendations.length} Rekomendasi</span>
                        <span><i class="fas fa-key"></i> Password: ${item.categoryScores.password}</span>
                        <span><i class="fas fa-mobile-alt"></i> OTP: ${item.categoryScores.otp}</span>
                        <span><i class="fas fa-share-alt"></i> Sharing: ${item.categoryScores.sharing}</span>
                    </div>
                </div>
                <div class="history-action">
                    ${trendHtml}
                </div>
            </div>
        `;
    }).join('');
}

function renderHistoryChart() {
    const container = document.getElementById('historyChartContainer');

    // Destroy existing chart
    if (appState.charts.history) {
        appState.charts.history.destroy();
    }

    container.innerHTML = '<canvas id="historyChart" height="120"></canvas>';
    const ctx = document.getElementById('historyChart');
    if (!ctx) return;

    // Reverse untuk urutan kronologis
    const chronological = [...appState.history].reverse();

    appState.charts.history = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chronological.map((_, idx) => `Asesmen ${idx + 1}`),
            datasets: [{
                label: 'Skor Risiko',
                data: chronological.map(h => h.totalScore),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: chronological.map(h => {
                    return h.totalScore >= 70 ? '#dc2626' :
                           h.totalScore >= 45 ? '#d97706' :
                           h.totalScore >= 25 ? '#2563eb' : '#16a34a';
                }),
                pointRadius: 8,
                pointHoverRadius: 10,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterBody: (items) => {
                            const item = chronological[items[0].dataIndex];
                            return [
                                `Profil: ${item.userProfile.name}`,
                                `Level: ${item.riskLevel.level}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { stepSize: 25 },
                    title: {
                        display: true,
                        text: 'Skor Risiko (lebih rendah = lebih aman)'
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function clearHistory() {
    if (confirm('Hapus semua riwayat asesmen? Tindakan ini tidak bisa dibatalkan.')) {
        appState.history = [];
        appState.lastResult = null;
        localStorage.removeItem('securelearn_history');
        localStorage.removeItem('securelearn_last_result');
        renderHistory();
        updateStats();
        updateDashboard();
        showToast('Riwayat asesmen berhasil dihapus');
    }
}

// ============================================================
// UTILITIES
// ============================================================

function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

let toastTimeout;
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');

    toastMsg.textContent = message;
    toastIcon.className = type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
    toastIcon.style.color = type === 'warning' ? '#f59e0b' : '#4ade80';

    toast.style.display = 'flex';

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 3500);
}