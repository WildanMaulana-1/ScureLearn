// ============================================================
// FIREBASE AUTH SERVICE
// Register, Login, Logout, Profile management
// ============================================================

import { auth, db } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ============================================================
// REGISTER
// ============================================================
export const registerUser = async (name, email, password) => {
    try {
        // Buat akun di Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth, email, password
        );
        const user = userCredential.user;

        // Update display name
        await updateProfile(user, { displayName: name });

        // Simpan data tambahan ke Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name,
            email,
            role: 'user',
            isActive: true,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            stats: {
                totalAssessments: 0,
                completedModules: 0,
                lastScore: null,
                bestScore: null,
                averageScore: null
            }
        });

        return {
            success: true,
            message: 'Registrasi berhasil!',
            data: {
                uid: user.uid,
                name,
                email,
                role: 'user'
            }
        };

    } catch (error) {
        return {
            success: false,
            message: getAuthErrorMessage(error.code)
        };
    }
};

// ============================================================
// LOGIN
// ============================================================
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth, email, password
        );
        const user = userCredential.user;

        // Update lastLogin di Firestore
        await updateDoc(doc(db, 'users', user.uid), {
            lastLogin: serverTimestamp()
        });

        // Ambil data user dari Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        return {
            success: true,
            message: 'Login berhasil!',
            data: {
                uid: user.uid,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                stats: userData.stats
            }
        };

    } catch (error) {
        return {
            success: false,
            message: getAuthErrorMessage(error.code)
        };
    }
};

// ============================================================
// LOGOUT
// ============================================================
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true, message: 'Logout berhasil!' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// GET CURRENT USER DATA
// ============================================================
export const getCurrentUserData = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            return { uid: user.uid, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

// ============================================================
// UPDATE PROFILE
// ============================================================
export const updateUserProfile = async (updateData) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        const firestoreUpdate = {};
        if (updateData.name) {
            await updateProfile(user, { displayName: updateData.name });
            firestoreUpdate.name = updateData.name;
        }

        if (Object.keys(firestoreUpdate).length > 0) {
            await updateDoc(doc(db, 'users', user.uid), firestoreUpdate);
        }

        return { success: true, message: 'Profil berhasil diperbarui' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ============================================================
// CHANGE PASSWORD
// ============================================================
export const changePassword = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user) return { success: false, message: 'Tidak ada user yang login' };

    try {
        // Re-autentikasi dulu
        const credential = EmailAuthProvider.credential(
            user.email, currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, newPassword);

        return { success: true, message: 'Password berhasil diubah' };
    } catch (error) {
        return {
            success: false,
            message: error.code === 'auth/wrong-password' ?
                'Password saat ini salah' : error.message
        };
    }
};

// ============================================================
// UPDATE USER STATS
// ============================================================
export const updateUserStats = async (userId, newScore, allScores) => {
    try {
        const avgScore = allScores.length > 0
            ? Math.round(allScores.reduce((s, n) => s + n, 0) / allScores.length)
            : newScore;

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        const currentStats = userDoc.data()?.stats || {};

        const bestScore = currentStats.bestScore === null || currentStats.bestScore === undefined
            ? newScore
            : Math.min(currentStats.bestScore, newScore);

        await updateDoc(userRef, {
            'stats.totalAssessments': allScores.length,
            'stats.lastScore': newScore,
            'stats.bestScore': bestScore,
            'stats.averageScore': avgScore
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating stats:', error);
        return { success: false };
    }
};

// ============================================================
// AUTH STATE LISTENER
// ============================================================
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// ============================================================
// IS LOGGED IN
// ============================================================
export const isLoggedIn = () => {
    return auth.currentUser !== null;
};

export const getCurrentUser = () => auth.currentUser;

// ============================================================
// ERROR MESSAGE HELPER
// ============================================================
const getAuthErrorMessage = (code) => {
    const messages = {
        'auth/email-already-in-use': 'Email sudah terdaftar. Silakan login.',
        'auth/weak-password': 'Password terlalu lemah. Minimal 6 karakter.',
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/user-not-found': 'Email tidak terdaftar.',
        'auth/wrong-password': 'Password salah.',
        'auth/invalid-credential': 'Email atau password salah.',
        'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti.',
        'auth/network-request-failed': 'Gagal terhubung. Periksa koneksi internet.',
        'auth/user-disabled': 'Akun ini telah dinonaktifkan.'
    };
    return messages[code] || 'Terjadi kesalahan. Silakan coba lagi.';
};