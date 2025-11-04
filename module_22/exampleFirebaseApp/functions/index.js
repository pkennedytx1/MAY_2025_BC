/**
 * Firebase Cloud Functions Example
 * 
 * These functions run on Firebase servers and can be triggered by:
 * - HTTPS requests
 * - Firestore changes
 * - Authentication events
 * - And more!
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Example 1: Callable HTTPS Function
 * This function can be called directly from the client app
 * 
 * Usage from client:
 * const helloWorld = httpsCallable(functions, 'helloWorld');
 * const result = await helloWorld({ name: 'Student' });
 */
exports.helloWorld = functions.https.onCall((data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to call this function.'
    );
  }

  const name = data.name || 'User';
  
  console.log(`Hello World function called by user: ${context.auth.uid}`);
  
  return {
    message: `Hello ${name}! This is a response from a Firebase Cloud Function.`,
    timestamp: new Date().toISOString(),
    userId: context.auth.uid,
    userEmail: context.auth.token.email
  };
});

/**
 * Example 2: Firestore Trigger
 * This function automatically runs when a new note is created
 */
exports.onNoteCreated = functions.firestore
  .document('notes/{noteId}')
  .onCreate(async (snap, context) => {
    const noteData = snap.data();
    const noteId = context.params.noteId;
    
    console.log(`New note created: ${noteId}`);
    console.log(`Note title: ${noteData.title}`);
    
    // Example: Update user's note count
    const userId = noteData.userId;
    const userRef = admin.firestore().collection('users').doc(userId);
    
    try {
      await userRef.update({
        noteCount: admin.firestore.FieldValue.increment(1),
        lastNoteCreated: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Updated note count for user: ${userId}`);
    } catch (error) {
      console.error('Error updating user note count:', error);
    }
    
    return null;
  });

/**
 * Example 3: Firestore Trigger on Delete
 * This function automatically runs when a note is deleted
 */
exports.onNoteDeleted = functions.firestore
  .document('notes/{noteId}')
  .onDelete(async (snap, context) => {
    const noteData = snap.data();
    const noteId = context.params.noteId;
    
    console.log(`Note deleted: ${noteId}`);
    
    // Update user's note count
    const userId = noteData.userId;
    const userRef = admin.firestore().collection('users').doc(userId);
    
    try {
      await userRef.update({
        noteCount: admin.firestore.FieldValue.increment(-1)
      });
      
      console.log(`Decremented note count for user: ${userId}`);
    } catch (error) {
      console.error('Error updating user note count:', error);
    }
    
    return null;
  });

/**
 * Example 4: Auth Trigger
 * This function runs when a new user is created
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  console.log(`New user created: ${user.uid}`);
  console.log(`Email: ${user.email}`);
  
  // Example: Send welcome email (you'd need to set up email service)
  // Example: Create default user settings
  
  const userRef = admin.firestore().collection('users').doc(user.uid);
  
  try {
    // Ensure user document exists with default values
    await userRef.set({
      email: user.email,
      displayName: user.displayName || 'New User',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      noteCount: 0,
      loginCount: 0
    }, { merge: true });
    
    console.log(`Created user document for: ${user.uid}`);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
  
  return null;
});

/**
 * Example 5: Auth Trigger on Delete
 * This function runs when a user account is deleted
 */
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  console.log(`User deleted: ${user.uid}`);
  
  const db = admin.firestore();
  const batch = db.batch();
  
  try {
    // Delete all user's notes
    const notesQuery = await db.collection('notes')
      .where('userId', '==', user.uid)
      .get();
    
    notesQuery.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete user document
    const userRef = db.collection('users').doc(user.uid);
    batch.delete(userRef);
    
    await batch.commit();
    
    console.log(`Cleaned up data for deleted user: ${user.uid}`);
  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
  
  return null;
});

/**
 * Example 6: Scheduled Function
 * This function runs on a schedule (like a cron job)
 * Note: Requires Firebase Blaze (pay-as-you-go) plan
 */
exports.scheduledFunction = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    console.log('Running scheduled function...');
    
    // Example: Clean up old data
    const db = admin.firestore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    try {
      const oldNotesQuery = await db.collection('notes')
        .where('createdAt', '<', thirtyDaysAgo)
        .get();
      
      const batch = db.batch();
      oldNotesQuery.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      console.log(`Deleted ${oldNotesQuery.size} old notes`);
    } catch (error) {
      console.error('Error in scheduled function:', error);
    }
    
    return null;
  });

/**
 * Example 7: HTTPS Endpoint Function
 * This creates a traditional HTTP endpoint
 */
exports.api = functions.https.onRequest((req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }
  
  // Handle different routes
  if (req.path === '/health') {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } else if (req.path === '/stats') {
    // Example: Return some statistics
    admin.firestore().collection('users').count().get()
      .then((snapshot) => {
        res.json({
          totalUsers: snapshot.data().count,
          timestamp: new Date().toISOString()
        });
      })
      .catch((error) => {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

