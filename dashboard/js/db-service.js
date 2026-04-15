// ============================================================
// FIRESTORE DATABASE SERVICE
// CRUD operations untuk Assessment dan Module Progress
// ============================================================

import { db } from './firebase-config.js';
import { auth } from './firebase-config.js';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    setDoc,
    serverTimestamp,
    getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { updateUserStats } from './auth-service.js';

// ============================================================
// ===== ASSESSMENT OPERATIONS =====
// ============================================================

// ============================================================
// SUBMIT ASSESSMENT BARU
// ============================================================
export const submitAssessment = async (assessmentData) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        // Simpan assessment ke Firestore
        const docRef = await addDoc(
            collection(db, 'users', user.uid, 'assessments'),
            {
                ...assessmentData,
                userId: user.uid,
                completedAt: serverTimestamp(),
                createdAt: serverTimestamp()
            }
        );

        // Ambil semua skor untuk update stats
        const allAssessments = await getAllAssessments(user.uid);
        const allScores = allAssessments.map(a => a.totalScore);

        // Update stats user
        await updateUserStats(user.uid, assessmentData.totalScore, allScores);

        return {
            success: true,
            message: 'Asesmen berhasil disimpan!',
            data: {
                id: docRef.id,
                ...assessmentData
            }
        };

    } catch (error) {
        console.error('Error submitting assessment:', error);
        return { success: false, message: error.message };
    }
};

// ============================================================
// GET SEMUA ASSESSMENT USER
// ============================================================
const getAllAssessments = async (userId) => {
    try {
        const q = query(
            collection(db, 'users', userId, 'assessments'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error getting assessments:', error);
        return [];
    }
};

// ============================================================
// GET RIWAYAT ASSESSMENT (dengan pagination)
// ============================================================
export const getAssessmentHistory = async (limitCount = 20) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        const q = query(
            collection(db, 'users', user.uid, 'assessments'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        const assessments = snapshot.docs.map((doc, idx) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                completedAt: data.completedAt?.toDate?.()?.toISOString() ||
                             data.createdAt?.toDate?.()?.toISOString() ||
                             new Date().toISOString()
            };
        });

        // Tambahkan tren (bandingkan dengan asesmen berikutnya)
        const assessmentsWithTrend = assessments.map((assessment, idx) => {
            if (idx < assessments.length - 1) {
                const prev = assessments[idx + 1];
                const diff = assessment.totalScore - prev.totalScore;
                return {
                    ...assessment,
                    trend: {
                        diff,
                        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
                        label: diff > 0 ? `+${diff} Risiko Naik` :
                               diff < 0 ? `${diff} Risiko Turun ✅` : 'Sama'
                    }
                };
            }
            return { ...assessment, trend: null };
        });

        return {
            success: true,
            data: {
                assessments: assessmentsWithTrend,
                total: assessments.length
            }
        };

    } catch (error) {
        console.error('Error getting history:', error);
        return { success: false, message: error.message };
    }
};

// ============================================================
// GET ASSESSMENT TERBARU
// ============================================================
export const getLatestAssessment = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        const q = query(
            collection(db, 'users', user.uid, 'assessments'),
            orderBy('createdAt', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return {
                success: false,
                message: 'Belum ada asesmen. Mulai asesmen pertama Anda!'
            };
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
            success: true,
            data: {
                assessment: {
                    id: doc.id,
                    ...data,
                    completedAt: data.completedAt?.toDate?.()?.toISOString() ||
                                 new Date().toISOString()
                }
            }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// GET STATISTIK ASSESSMENT
// ============================================================
export const getAssessmentStats = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        const assessments = await getAllAssessments(user.uid);

        if (!assessments.length) {
            return {
                success: true,
                data: {
                    total: 0,
                    averageScore: null,
                    bestScore: null,
                    latestScore: null,
                    trend: null,
                    categoryAverages: null,
                    history: []
                }
            };
        }

        const scores = assessments.map(a => a.totalScore).reverse(); // Kronologis
        const avgScore = Math.round(scores.reduce((s, n) => s + n, 0) / scores.length);
        const bestScore = Math.min(...scores);
        const latestScore = scores[scores.length - 1];

        // Rata-rata per kategori
        const categoryTotals = { password: 0, otp: 0, sharing: 0, awareness: 0 };
        const categoryCounts = { password: 0, otp: 0, sharing: 0, awareness: 0 };

        assessments.forEach(a => {
            if (a.categoryScores) {
                Object.entries(a.categoryScores).forEach(([cat, score]) => {
                    if (categoryTotals[cat] !== undefined) {
                        categoryTotals[cat] += score;
                        categoryCounts[cat]++;
                    }
                });
            }
        });

        const categoryAverages = {};
        Object.keys(categoryTotals).forEach(cat => {
            categoryAverages[cat] = categoryCounts[cat] > 0
                ? Math.round(categoryTotals[cat] / categoryCounts[cat])
                : 0;
        });

        // Tren
        let trend = null;
        if (scores.length >= 2) {
            const last = scores[scores.length - 1];
            const secondLast = scores[scores.length - 2];
            const diff = last - secondLast;
            trend = {
                diff,
                direction: diff < 0 ? 'improving' : diff > 0 ? 'worsening' : 'stable',
                label: diff < 0 ? `Risiko turun ${Math.abs(diff)} poin ✅` :
                       diff > 0 ? `Risiko naik ${diff} poin ⚠️` : 'Tidak ada perubahan'
            };
        }

        // History untuk chart
        const history = [...assessments].reverse().map(a => ({
            date: a.completedAt,
            score: a.totalScore,
            riskLevel: a.riskLevel?.level || '-'
        }));

        return {
            success: true,
            data: {
                total: assessments.length,
                averageScore: avgScore,
                bestScore,
                latestScore,
                trend,
                categoryAverages,
                history
            }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// HAPUS SEMUA ASSESSMENT
// ============================================================
export const deleteAllAssessments = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        const q = query(
            collection(db, 'users', user.uid, 'assessments')
        );
        const snapshot = await getDocs(q);

        // Hapus satu per satu (Firestore tidak ada bulk delete)
        const deletePromises = snapshot.docs.map(d =>
            deleteDoc(doc(db, 'users', user.uid, 'assessments', d.id))
        );
        await Promise.all(deletePromises);

        // Reset stats user
        await updateDoc(doc(db, 'users', user.uid), {
            'stats.totalAssessments': 0,
            'stats.lastScore': null,
            'stats.bestScore': null,
            'stats.averageScore': null
        });

        return {
            success: true,
            message: `${snapshot.docs.length} asesmen berhasil dihapus`,
            data: { deletedCount: snapshot.docs.length }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// ===== MODULE PROGRESS OPERATIONS =====
// ============================================================

const VALID_MODULES = [
    'password-security', 'password-manager', 'two-factor-auth',
    'otp-security', 'data-privacy', 'phishing-awareness',
    'social-media-security', 'network-security', 'device-security'
];

// ============================================================
// GET MODULE PROGRESS
// ============================================================
export const getModuleProgress = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        const q = query(
            collection(db, 'users', user.uid, 'moduleProgress')
        );
        const snapshot = await getDocs(q);

        // Build progress map
        const progressMap = {};
        VALID_MODULES.forEach(moduleId => {
            progressMap[moduleId] = {
                status: 'not_started',
                startedAt: null,
                completedAt: null,
                readDuration: 0,
                quizScore: null,
                attempts: 0
            };
        });

        snapshot.docs.forEach(docSnap => {
            const data = docSnap.data();
            if (progressMap[data.moduleId] !== undefined) {
                progressMap[data.moduleId] = {
                    status: data.status,
                    startedAt: data.startedAt?.toDate?.()?.toISOString() || null,
                    completedAt: data.completedAt?.toDate?.()?.toISOString() || null,
                    readDuration: data.readDuration || 0,
                    quizScore: data.quizScore || null,
                    attempts: data.attempts || 0
                };
            }
        });

        const completedCount = Object.values(progressMap)
            .filter(p => p.status === 'completed').length;

        const inProgressCount = Object.values(progressMap)
            .filter(p => p.status === 'in_progress').length;

        return {
            success: true,
            data: {
                progress: progressMap,
                summary: {
                    total: VALID_MODULES.length,
                    completed: completedCount,
                    inProgress: inProgressCount,
                    notStarted: VALID_MODULES.length - completedCount - inProgressCount,
                    completionRate: Math.round((completedCount / VALID_MODULES.length) * 100)
                }
            }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// START MODULE
// ============================================================
export const startModule = async (moduleId) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    if (!VALID_MODULES.includes(moduleId)) {
        return { success: false, message: 'ID modul tidak valid' };
    }

    try {
        const moduleRef = doc(db, 'users', user.uid, 'moduleProgress', moduleId);
        const existing = await getDoc(moduleRef);

        if (existing.exists() && existing.data().status === 'completed') {
            return { success: true, message: 'Modul sudah selesai sebelumnya' };
        }

        await setDoc(moduleRef, {
            moduleId,
            userId: user.uid,
            status: 'in_progress',
            startedAt: serverTimestamp(),
            attempts: (existing.data()?.attempts || 0) + 1,
            completedAt: null,
            readDuration: 0,
            quizScore: null
        }, { merge: true });

        return { success: true, message: 'Modul dimulai' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// COMPLETE MODULE
// ============================================================
export const completeModule = async (moduleId, readDuration = 0, quizScore = null) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    if (!VALID_MODULES.includes(moduleId)) {
        return { success: false, message: 'ID modul tidak valid' };
    }

    try {
        const moduleRef = doc(db, 'users', user.uid, 'moduleProgress', moduleId);
        const existing = await getDoc(moduleRef);

        const updateData = {
            moduleId,
            userId: user.uid,
            status: 'completed',
            completedAt: serverTimestamp(),
            readDuration: readDuration || 0
        };

        if (quizScore !== null) updateData.quizScore = quizScore;

        if (!existing.exists()) {
            updateData.startedAt = serverTimestamp();
            updateData.attempts = 1;
        }

        await setDoc(moduleRef, updateData, { merge: true });

        // Hitung total completed
        const allProgress = await getDoc(
            collection(db, 'users', user.uid, 'moduleProgress')
        );
        const completedCount = await getCompletedModulesCount(user.uid);

        // Update stats user
        await updateDoc(doc(db, 'users', user.uid), {
            'stats.completedModules': completedCount
        });

        return {
            success: true,
            message: `Modul selesai! 🎉`,
            data: { totalCompleted: completedCount }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

// Helper: hitung total completed modules
const getCompletedModulesCount = async (userId) => {
    try {
        const q = query(
            collection(db, 'users', userId, 'moduleProgress'),
            where('status', '==', 'completed')
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch {
        return 0;
    }
};

// ============================================================
// RESET SEMUA MODULE PROGRESS
// ============================================================
export const resetAllModuleProgress = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        const q = query(
            collection(db, 'users', user.uid, 'moduleProgress')
        );
        const snapshot = await getDocs(q);

        const deletePromises = snapshot.docs.map(d =>
            deleteDoc(doc(db, 'users', user.uid, 'moduleProgress', d.id))
        );
        await Promise.all(deletePromises);

        await updateDoc(doc(db, 'users', user.uid), {
            'stats.completedModules': 0
        });

        return {
            success: true,
            message: 'Semua progress direset',
            data: { deletedCount: snapshot.docs.length }
        };

    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// ===== DASHBOARD =====
// ============================================================
export const getDashboardData = async () => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        // Parallel fetch
        const [
            userDocSnap,
            latestResult,
            historyResult,
            moduleResult
        ] = await Promise.all([
            getDoc(doc(db, 'users', user.uid)),
            getLatestAssessment(),
            getAssessmentHistory(5),
            getModuleProgress()
        ]);

        const userData = userDocSnap.data();

        return {
            success: true,
            data: {
                user: {
                    uid: user.uid,
                    name: userData?.name || user.displayName,
                    email: userData?.email || user.email,
                    stats: userData?.stats || {}
                },
                overview: {
                    totalAssessments: userData?.stats?.totalAssessments || 0,
                    completedModules: userData?.stats?.completedModules || 0,
                    totalModules: VALID_MODULES.length,
                    latestScore: userData?.stats?.lastScore || null,
                    bestScore: userData?.stats?.bestScore || null,
                    averageScore: userData?.stats?.averageScore || null,
                    activeRecommendations: latestResult.success
                        ? (latestResult.data.assessment.recommendations?.length || 0)
                        : 0
                },
                latestAssessment: latestResult.success
                    ? latestResult.data.assessment
                    : null,
                recentAssessments: historyResult.success
                    ? historyResult.data.assessments
                    : [],
                moduleProgress: moduleResult.success
                    ? moduleResult.data.progress
                    : {}
            }
        };

    } catch (error) {
        console.error('Error getting dashboard:', error);
        return { success: false, message: error.message };
    }
};