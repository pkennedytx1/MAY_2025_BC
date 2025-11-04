// Dashboard Logic
import { auth, db, functions, onAuthStateChanged, signOut } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    deleteDoc,
    doc, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    serverTimestamp,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { httpsCallable } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js';

let currentUser = null;
let notesUnsubscribe = null;

// Check authentication state
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await loadDashboard();
    } else {
        // User is not signed in, redirect to login
        window.location.href = 'auth.html?mode=login';
    }
});

// Load dashboard data
async function loadDashboard() {
    const loadingState = document.getElementById('loadingState');
    const dashboardContent = document.getElementById('dashboardContent');
    
    try {
        // Display user profile information
        document.getElementById('userName').textContent = currentUser.displayName || 'User';
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userId').textContent = currentUser.uid;
        
        const createdDate = new Date(currentUser.metadata.creationTime);
        document.getElementById('accountCreated').textContent = createdDate.toLocaleDateString();
        
        // Load user statistics from Firestore
        await loadUserStats();
        
        // Load notes in real-time
        loadNotes();
        
        // Show dashboard content
        loadingState.style.display = 'none';
        dashboardContent.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        loadingState.innerHTML = '<p style="color: var(--error-color);">Error loading dashboard. Please refresh the page.</p>';
    }
}

// Load user statistics
async function loadUserStats() {
    try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('loginCount').textContent = userData.loginCount || 0;
            
            if (userData.lastLogin) {
                const lastLogin = userData.lastLogin.toDate();
                document.getElementById('lastLogin').textContent = lastLogin.toLocaleDateString();
            }
        }
    } catch (error) {
        console.error('Error loading user stats:', error);
    }
}

// Load notes from Firestore with real-time updates
function loadNotes() {
    const notesList = document.getElementById('notesList');
    
    // Create query for user's notes
    const notesQuery = query(
        collection(db, 'notes'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
    );
    
    // Listen for real-time updates
    notesUnsubscribe = onSnapshot(notesQuery, (snapshot) => {
        notesList.innerHTML = '';
        
        if (snapshot.empty) {
            notesList.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No notes yet. Create your first note above!</p>';
            document.getElementById('noteCount').textContent = '0';
            return;
        }
        
        document.getElementById('noteCount').textContent = snapshot.size;
        
        snapshot.forEach((doc) => {
            const note = doc.data();
            const noteElement = createNoteElement(doc.id, note);
            notesList.appendChild(noteElement);
        });
    }, (error) => {
        console.error('Error loading notes:', error);
        notesList.innerHTML = '<p style="color: var(--error-color);">Error loading notes. Please refresh the page.</p>';
    });
}

// Create note HTML element
function createNoteElement(noteId, note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    
    const createdDate = note.createdAt ? note.createdAt.toDate().toLocaleString() : 'Just now';
    
    noteDiv.innerHTML = `
        <h4>${escapeHtml(note.title)}</h4>
        <p>${escapeHtml(note.content)}</p>
        <div class="note-meta">Created: ${createdDate}</div>
        <div class="note-actions">
            <button class="btn btn-danger btn-small" onclick="deleteNote('${noteId}')">Delete</button>
        </div>
    `;
    
    return noteDiv;
}

// Add new note
const noteForm = document.getElementById('noteForm');
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    
    try {
        await addDoc(collection(db, 'notes'), {
            userId: currentUser.uid,
            title: title,
            content: content,
            createdAt: serverTimestamp()
        });
        
        // Clear form
        noteForm.reset();
        
    } catch (error) {
        console.error('Error adding note:', error);
        alert('Error adding note. Please try again.');
    }
});

// Delete note (exposed globally for inline onclick handler)
window.deleteNote = async function(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'notes', noteId));
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note. Please try again.');
    }
};

// Test Cloud Function
const testCloudFunctionBtn = document.getElementById('testCloudFunction');
const cloudFunctionResult = document.getElementById('cloudFunctionResult');

testCloudFunctionBtn.addEventListener('click', async () => {
    cloudFunctionResult.style.display = 'block';
    cloudFunctionResult.textContent = 'Calling cloud function...';
    
    try {
        // Call a sample cloud function
        // Note: This function needs to be deployed to your Firebase project
        const helloWorld = httpsCallable(functions, 'helloWorld');
        const result = await helloWorld({ name: currentUser.displayName || 'User' });
        
        cloudFunctionResult.textContent = `✅ Success! Response: ${JSON.stringify(result.data)}`;
        cloudFunctionResult.style.borderColor = 'var(--success-color)';
    } catch (error) {
        console.error('Cloud function error:', error);
        cloudFunctionResult.textContent = `⚠️ Cloud function not available. This is expected if you haven't deployed functions yet. Error: ${error.message}`;
        cloudFunctionResult.style.borderColor = 'var(--accent-color)';
    }
});

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', async () => {
    try {
        // Unsubscribe from real-time listeners
        if (notesUnsubscribe) {
            notesUnsubscribe();
        }
        
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
});

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

