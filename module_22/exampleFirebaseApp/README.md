# 🔥 Firebase Authentication Demo App

A complete Firebase application demonstrating user authentication, real-time database, and cloud functions. Perfect for learning Firebase fundamentals!

## 🎯 What You'll Build

This app teaches you how to:
- ✅ Create user accounts with email/password
- ✅ Log in and out securely
- ✅ Store data in Firestore (real-time database)
- ✅ Create, read, and delete notes
- ✅ Protect routes (only logged-in users can access dashboard)
- ✅ Understand Firebase security rules

## 🚀 Quick Start

### Prerequisites

Before starting, make sure you have:
- [ ] A Google account
- [ ] Internet connection
- [ ] A code editor (VS Code recommended)
- [ ] A modern web browser (Chrome, Firefox, Safari, or Edge)

### Step 1: Create Your Firebase Project (5 minutes)

1. **Go to Firebase Console**
   - Open https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "+ Create a project"
   - Enter a project name (e.g., "my-firebase-demo")
   - Click "Continue"
   - Google Analytics: Choose "Not right now" (optional)
   - Click "Create project"
   - Wait for project to be created
   - Click "Continue"

### Step 2: Enable Authentication (3 minutes)

1. **Navigate to Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Get started" button

2. **Enable Email/Password**
   - Click on "Email/Password" in the sign-in providers list
   - Toggle the first switch to "Enabled"
   - Click "Save"

✅ You should now see "Email/Password" listed as enabled!

### Step 3: Create Firestore Database (3 minutes)

1. **Navigate to Firestore**
   - In the left sidebar, click "Firestore Database"
   - Click "Create database" button

2. **Choose Mode**
   - Select "Start in test mode" (easier for learning)
   - Click "Next"

3. **Choose Location**
   - Select a location closest to you (e.g., "us-central")
   - Click "Enable"
   - Wait for database to be created

✅ You should now see your empty Firestore database!

### Step 4: Get Your Firebase Configuration (5 minutes)

1. **Go to Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Click "Project settings"

2. **Add a Web App**
   - Scroll down to "Your apps"
   - Click the web icon `</>`
   - Enter app nickname: "Firebase Demo App"
   - Don't check "Firebase Hosting" yet
   - Click "Register app"

3. **Copy Configuration**
   - You'll see a code block with `firebaseConfig`
   - Copy these values:
     ```javascript
     apiKey: "AIza..."
     authDomain: "your-project.firebaseapp.com"
     projectId: "your-project"
     storageBucket: "your-project.appspot.com"
     messagingSenderId: "123456789"
     appId: "1:123456789:web:abc123"
     ```

### Step 5: Update Your Code (2 minutes)

1. **Open `firebase-config.js`**
   - Find and open `firebase-config.js` in this folder

2. **Replace Placeholder Values**
   - Replace the placeholder values with YOUR values from Step 4:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",           // Replace this
       authDomain: "YOUR_AUTH_DOMAIN",   // Replace this
       projectId: "YOUR_PROJECT_ID",     // Replace this
       storageBucket: "YOUR_STORAGE_BUCKET", // Replace this
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace this
       appId: "YOUR_APP_ID"              // Replace this
   };
   ```
   - Save the file (Ctrl+S or Cmd+S)

### Step 6: Set Up Security Rules (3 minutes)

1. **Go to Firestore Rules**
   - In Firebase Console, click "Firestore Database"
   - Click on the "Rules" tab at the top

2. **Copy and Paste Rules**
   - Delete everything in the editor
   - Copy and paste this code:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection - users can only read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Notes collection - users can only access their own notes
       match /notes/{noteId} {
         allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
         allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
       }
     }
   }
   ```
   - Click "Publish"

✅ Your database is now secure!

### Step 7: Run the Application (2 minutes)

**Option A: VS Code Live Server (Easiest)**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Click "Open with Live Server"
4. Your browser will open automatically!

**Option B: Python HTTP Server**
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser

**Option C: Any other local server**
- Use your preferred local development server

### Step 8: Test the App! (5 minutes)

1. **Create an Account**
   - Click "Sign Up" button
   - Enter your name, email, and password
   - Click "Create Account"
   - You should be redirected to the dashboard!

2. **Add a Note**
   - Type a note title and content
   - Click "Add Note"
   - Your note should appear instantly!

3. **Log Out and Log In**
   - Click "Log Out"
   - Click "Log In" on the home page
   - Enter your credentials
   - You should see your notes!

✅ **Congratulations! Your Firebase app is working!** 🎉

## 📁 Project Structure

```
exampleFirebaseApp/
├── index.html              # Landing page
├── auth.html               # Login/Signup page
├── dashboard.html          # Protected dashboard
├── styles.css              # All styling
├── firebase-config.js      # Firebase setup (ADD YOUR CREDENTIALS HERE!)
├── auth.js                 # Authentication logic
├── dashboard.js            # Dashboard functionality
└── functions/              # Cloud Functions (optional)
    └── index.js            # Example cloud functions
```

## 📚 Key Concepts You'll Learn

### 1. Firebase Authentication

**Creating a User:**
```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';

const userCredential = await createUserWithEmailAndPassword(auth, email, password);
```

**Logging In:**
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';

const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

**Checking Auth State:**
```javascript
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log('User:', user.email);
  } else {
    // User is signed out
    console.log('No user signed in');
  }
});
```

### 2. Firestore Database

**Adding Data:**
```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

await addDoc(collection(db, 'notes'), {
  title: 'My Note',
  content: 'Note content',
  userId: currentUser.uid,
  createdAt: serverTimestamp()
});
```

**Reading Data (Real-time):**
```javascript
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const q = query(
  collection(db, 'notes'),
  where('userId', '==', currentUser.uid),
  orderBy('createdAt', 'desc')
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
  });
});
```

**Deleting Data:**
```javascript
import { doc, deleteDoc } from 'firebase/firestore';

await deleteDoc(doc(db, 'notes', noteId));
```

### 3. Security Rules

Security rules protect your data. The rules we set up mean:
- Users can only read/write their own user document
- Users can only create, read, and delete their own notes
- No one can access data without being authenticated

## 🐛 Troubleshooting

### Problem: "Firebase not defined" error
**Solution**: Make sure you're using a local server (not opening file directly with `file://`)

### Problem: "Permission denied" in Firestore
**Solution**: 
1. Check that you published the security rules in Firebase Console
2. Make sure you're logged in
3. Verify the rules match what we set up in Step 6

### Problem: Can't create account
**Solution**:
1. Check Firebase Console → Authentication
2. Verify Email/Password is enabled
3. Check browser console (F12) for error messages

### Problem: Notes don't appear
**Solution**:
1. Check browser console (F12) for errors
2. Verify Firestore rules are published
3. Make sure you're logged in
4. Check that `userId` matches your current user's ID

### Problem: "Invalid API key" or config errors
**Solution**:
1. Double-check your `firebase-config.js` values
2. Make sure you copied all values correctly
3. Verify there are no extra spaces or typos
4. Check that you saved the file

## 💡 Common Code Patterns

### Protected Route
```javascript
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = 'auth.html?mode=login';
  }
});
```

### Error Handling
```javascript
try {
  await createUserWithEmailAndPassword(auth, email, password);
  // Success!
} catch (error) {
  // Handle error
  console.error('Error:', error.code);
  alert('Error: ' + error.message);
}
```

### Loading State
```javascript
// Show loading
loadingElement.style.display = 'block';
contentElement.style.display = 'none';

// After data loads
loadingElement.style.display = 'none';
contentElement.style.display = 'block';
```

## 🎓 What to Explore Next

Now that your app is running:

1. **Try the Features**
   - Create multiple notes
   - Delete notes
   - Log out and back in
   - Notice how notes persist (they're in the database!)

2. **Look at the Code**
   - Open `auth.js` to see authentication logic
   - Open `dashboard.js` to see Firestore operations
   - Open `styles.css` to customize the design

3. **Check Firebase Console**
   - Go to Authentication → Users (see your account!)
   - Go to Firestore → Data (see your notes in real-time!)
   - Try editing a note in the console and watch it update in your app!

4. **Experiment**
   - Change colors in `styles.css`
   - Add a new field to notes
   - Try adding note editing functionality

## 🚀 Extension Ideas

### Beginner
- [ ] Add password reset functionality
- [ ] Display user profile picture
- [ ] Add note colors/themes
- [ ] Add search functionality

### Intermediate
- [ ] Implement note editing
- [ ] Add categories/tags to notes
- [ ] Add timestamps to note display
- [ ] Add note character count

### Advanced
- [ ] Add rich text editor
- [ ] Implement note sharing between users
- [ ] Add image uploads (Firebase Storage)
- [ ] Create cloud functions for data validation

## 📖 Additional Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Auth Guide**: https://firebase.google.com/docs/auth
- **Security Rules**: https://firebase.google.com/docs/rules
- **JavaScript Promises**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
- **Async/Await**: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await

## 🔒 Security Notes

**Firebase API Keys**: Firebase API keys are safe to use in client-side code. Firebase uses them to identify your project, and security is enforced through Firebase Security Rules, not by hiding the API key.

**Best Practices**:
- Always use security rules (never leave Firestore in test mode for production)
- Validate user input
- Never trust client-side data alone
- Use authentication checks in your code

## 🆘 Need Help?

If you're stuck:
1. **Check Browser Console** - Press F12 and look for error messages
2. **Check Firebase Console** - Look for any error indicators
3. **Verify Your Setup** - Go through the steps again
4. **Ask Your Instructor** - They're here to help!

## ✅ Checklist

Before you start:
- [ ] I have a Google account
- [ ] I have a code editor installed
- [ ] I can run a local server

Setup:
- [ ] Created Firebase project
- [ ] Enabled Authentication (Email/Password)
- [ ] Created Firestore database
- [ ] Got Firebase credentials
- [ ] Updated firebase-config.js
- [ ] Published security rules

Testing:
- [ ] App runs locally
- [ ] Can create account
- [ ] Can add notes
- [ ] Can delete notes
- [ ] Can logout and login
- [ ] Notes persist after logout

## 🎉 Success!

If you've completed the checklist above, you've successfully:
- ✅ Set up a Firebase project
- ✅ Implemented user authentication
- ✅ Created a real-time database
- ✅ Built a functional web app
- ✅ Understood Firebase security rules

**You're ready to build more complex Firebase applications!** 🚀

---

**Happy Learning!** 👨‍💻👩‍💻

*Created for MIT Bootcamp MAY_2025 students*
