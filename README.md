Build a VaultFlow Full Web App + Backend (Google AI Studio + Firebase)
VaultFlow is a secure web application designed to store, manage, and retrieve sensitive data (like passwords, notes, or files) using modern full-stack technologies.

Roadmap & Resources
1. User Authentication (Sign Up & Login)
  Initial Configuration.
    Create a Firebase Project
    Register your web app.
    Enable Email/Password + Google Sign-In
    Update the sender name in Firebase email templates.
    Copy the Firebase config.
   
** Google Sign-In Requirement (Important)
Google Sign-In won’t work until your project is deployed on a real domain.
Watch the Deployment Guide:**

2. Store User Data (Firestore).
     Firestore Configuration.
       Create Firestore(Production Mode)
       Add secure user only Firestore rules.
           `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Root user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Anything nested inside this user:
      // subcollections, documents, folders, files, unlimited levels
      match /{allPaths=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
} `   
  
3. File Uploads (Firebase Storage)


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/56b0c055-b7ab-46df-b633-3995976cf906

## Run Locally
**Prerequisites:**  Node.js
1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

Screenshoot Project: 
<img width="1919" height="882" alt="Screenshot 2026-03-27 232148" src="https://github.com/user-attachments/assets/e170204a-34f7-473e-88e0-74e3dd2c4932" />


