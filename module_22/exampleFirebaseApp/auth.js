// Authentication Logic
import { auth, db, onAuthStateChanged } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});

// Tab switching functionality
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

function switchTab(mode) {
    if (mode === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

loginTab.addEventListener('click', () => switchTab('login'));
signupTab.addEventListener('click', () => switchTab('signup'));

// Check URL parameter for initial tab
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
if (mode === 'signup') {
    switchTab('signup');
}

// Login Form Handler
const loginFormElement = document.getElementById('loginFormElement');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');

loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Hide previous messages
    loginError.style.display = 'none';
    loginSuccess.style.display = 'none';
    
    try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Update last login in Firestore
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
            lastLogin: serverTimestamp(),
            loginCount: increment(1)
        }, { merge: true });
        
        loginSuccess.textContent = 'Login successful! Redirecting...';
        loginSuccess.style.display = 'block';
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = getErrorMessage(error.code);
        loginError.style.display = 'block';
    }
});

// Signup Form Handler
const signupFormElement = document.getElementById('signupFormElement');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');

signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    
    // Hide previous messages
    signupError.style.display = 'none';
    signupSuccess.style.display = 'none';
    
    // Validate passwords match
    if (password !== passwordConfirm) {
        signupError.textContent = 'Passwords do not match!';
        signupError.style.display = 'block';
        return;
    }
    
    try {
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile with display name
        await updateProfile(userCredential.user, {
            displayName: name
        });
        
        // Create user document in Firestore
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
            name: name,
            email: email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            loginCount: 1
        });
        
        signupSuccess.textContent = 'Account created successfully! Redirecting...';
        signupSuccess.style.display = 'block';
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Signup error:', error);
        signupError.textContent = getErrorMessage(error.code);
        signupError.style.display = 'block';
    }
});

// Helper function to convert Firebase error codes to user-friendly messages
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
        'auth/weak-password': 'Password should be at least 6 characters long.',
        'auth/user-disabled': 'This account has been disabled. Please contact support.',
        'auth/user-not-found': 'No account found with this email. Please sign up.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/too-many-requests': 'Too many failed login attempts. Please try again later.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// Helper for incrementing values
import { increment } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

