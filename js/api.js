// ============================================================
// API SERVICE - Firebase Version
// Menggantikan backend Node.js/Express dengan Firebase
// ============================================================

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUserData,
    updateUserProfile,
    changePassword,
    isLoggedIn,
    getCurrentUser,
    onAuthStateChange
} from './auth-service.js';

import {
    submitAssessment as fbSubmitAssessment,
    getAssessmentHistory,
    getLatestAssessment,
    getAssessmentStats,
    deleteAllAssessments,
    getModuleProgress,
    startModule as fbStartModule,
    completeModule as fbCompleteModule,
    resetAllModuleProgress,
    getDashboardData
} from './db-service.js';

// ============================================================
// API SERVICE OBJECT
// Interface yang sama dengan versi backend Node.js
// ============================================================
const ApiService = {

    // ==================== AUTH ====================
    auth: {
        register: (name, email, password) =>
            registerUser(name, email, password),

        login: (email, password) =>
            loginUser(email, password),

        logout: () => logoutUser(),

        getMe: () => getCurrentUserData(),

        updateProfile: (data) => updateUserProfile(data),

        changePassword: (currentPassword, newPassword) =>
            changePassword(currentPassword, newPassword),

        isLoggedIn: () => isLoggedIn(),

        getCurrentUser: () => getCurrentUser(),

        onAuthStateChange: (callback) => onAuthStateChange(callback)
    },

    // ==================== ASSESSMENT ====================
    assessment: {
        submit: (answers, duration = null) => {
            // Risk engine dijalankan di client side
            // Hasil dikirim ke Firestore
            return fbSubmitAssessment({ answers, duration });
        },

        submitWithAnalysis: (analysisResult) => {
            return fbSubmitAssessment(analysisResult);
        },

        getHistory: (limitCount = 20) =>
            getAssessmentHistory(limitCount),

        getLatest: () =>
            getLatestAssessment(),

        getStats: () =>
            getAssessmentStats(),

        deleteAll: () =>
            deleteAllAssessments()
    },

    // ==================== MODULES ====================
    modules: {
        getProgress: () =>
            getModuleProgress(),

        startModule: (moduleId) =>
            fbStartModule(moduleId),

        completeModule: (moduleId, readDuration = null, quizScore = null) =>
            fbCompleteModule(moduleId, readDuration, quizScore),

        resetAll: () =>
            resetAllModuleProgress()
    },

    // ==================== DASHBOARD ====================
    dashboard: {
        get: () => getDashboardData()
    }
};

// Export ke global scope untuk dipakai app.js
window.ApiService = ApiService;
export default ApiService;