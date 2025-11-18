# Firebase Setup Guide

This guide will walk you through setting up Firebase for DogTale Daily, enabling cloud storage, authentication, and real-time data synchronization.

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- A Google account (for Firebase Console access)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `dogtale-daily` (or your preferred name)
4. **Disable Google Analytics** (optional - you can enable it later)
5. Click **"Create project"**
6. Wait for Firebase to provision your project (~30 seconds)
7. Click **"Continue"** when ready

## Step 2: Register Your Web App

1. In the Firebase Console, click the **web icon** (`</>`) to add a web app
2. Enter app nickname: `DogTale Daily Web`
3. **Check** "Also set up Firebase Hosting" (optional but recommended)
4. Click **"Register app"**
5. **Copy the Firebase configuration** - you'll need this in Step 6

The configuration looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 3: Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click the **"Sign-in method"** tab

### Enable Email/Password Authentication:
1. Click **"Email/Password"**
2. Toggle **"Enable"** to ON
3. Leave "Email link (passwordless sign-in)" OFF for now
4. Click **"Save"**

### Enable Google OAuth:
1. Click **"Google"**
2. Toggle **"Enable"** to ON
3. Enter **"Project support email"** (your email)
4. Click **"Save"**

## Step 4: Create Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we have security rules configured)
4. Choose a **Cloud Firestore location** (select closest to your users):
   - `us-central1` (Iowa) - North America
   - `europe-west1` (Belgium) - Europe
   - `asia-northeast1` (Tokyo) - Asia
5. Click **"Enable"**

### Deploy Security Rules:
1. After database is created, click **"Rules"** tab
2. Replace the default rules with the contents of `firestore.rules` from this project
3. Click **"Publish"**

## Step 5: Enable Cloud Storage

1. In Firebase Console sidebar, click **"Storage"**
2. Click **"Get started"**
3. Click **"Next"** (keep production mode)
4. Select the **same location** as your Firestore database
5. Click **"Done"**

### Deploy Storage Rules:
1. Click **"Rules"** tab
2. Replace the default rules with the contents of `storage.rules` from this project
3. Click **"Publish"**

## Step 6: Configure Your App

1. **Copy** `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. **Open** `.env` and replace the placeholder values with your Firebase config from Step 2:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Never commit** `.env` to git (it's already in `.gitignore`)

## Step 7: Test Your Setup

1. **Install dependencies** (if you haven't):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app** in your browser (usually `http://localhost:5173`)

4. **Test authentication**:
   - Click the **"Sign In"** button in the top-left
   - Try creating an account with email/password
   - Try signing in with Google
   - Check if you can see your profile when logged in

5. **Verify data sync**:
   - Create a journal entry
   - Add a favorite image
   - Check Firebase Console > Firestore to see your data
   - Sign out and sign back in - data should persist

## Step 8: Optional - Set Up Firebase Hosting

If you want to deploy your app to Firebase Hosting:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** in your project:
   ```bash
   firebase init
   ```
   - Select **"Hosting"** and **"Firestore"** and **"Storage"**
   - Use an existing project: select your project
   - Firestore rules file: `firestore.rules` (already exists)
   - Storage rules file: `storage.rules` (already exists)
   - Public directory: `dist`
   - Configure as a single-page app: **Yes**
   - Set up automatic builds with GitHub: **No** (optional)

4. **Build your app**:
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

6. Your app will be live at: `https://your-project-id.web.app`

## Step 9: Configure Production Environment Variables

If deploying to a hosting provider other than Firebase:

### Netlify:
1. Go to Site Settings > Environment Variables
2. Add each `VITE_FIREBASE_*` variable
3. Redeploy your site

### Vercel:
1. Go to Project Settings > Environment Variables
2. Add each `VITE_FIREBASE_*` variable for Production, Preview, and Development
3. Redeploy your site

### Other Providers:
Consult your hosting provider's documentation for setting environment variables.

## Troubleshooting

### "Firebase not configured" warning
- Check that `.env` file exists in project root
- Verify all `VITE_FIREBASE_*` variables are set
- Restart the dev server after changing `.env`

### Authentication errors
- Verify Email/Password and Google OAuth are enabled in Firebase Console
- Check that `authDomain` in `.env` matches your Firebase project
- Ensure you're accessing the app via the correct domain (localhost or deployed URL)

### Firestore permission errors
- Verify security rules are deployed (Step 4)
- Check that you're signed in before trying to save data
- Review Firebase Console > Firestore > Rules for any errors

### Storage upload errors
- Verify storage rules are deployed (Step 5)
- Check file size (max 10MB per the rules)
- Ensure file type is an image (jpg, png, gif, webp)

### Data not syncing
- Open browser DevTools > Console to check for errors
- Verify you're signed in (check top-left profile button)
- Check Firebase Console > Firestore to see if data appears
- Try signing out and back in

## Security Best Practices

1. **Never commit `.env` to git** - It contains sensitive API keys
2. **Use environment variables** for production deployments
3. **Review security rules** regularly as your app grows
4. **Enable App Check** (advanced) to prevent API abuse
5. **Set up billing alerts** in Google Cloud Console to avoid surprises

## Cost Considerations

Firebase has a generous free tier (Spark Plan):
- **Authentication**: 50,000 phone/SMS verifications/month (email is free)
- **Firestore**: 1GB storage, 50,000 reads/day, 20,000 writes/day
- **Storage**: 5GB stored, 1GB downloaded/day
- **Hosting**: 10GB storage, 360MB/day bandwidth

For most users, the free tier is sufficient. Upgrade to Blaze (pay-as-you-go) only if needed.

## Next Steps

After Firebase is configured:

1. ✅ Users can create accounts and sign in
2. ✅ Journal entries sync to the cloud
3. ✅ Favorites are stored in Firestore
4. ✅ Data persists across devices
5. 🚧 Add pet profiles (Phase 2)
6. 🚧 Upload custom pet photos (Phase 2)
7. 🚧 Social features (Phase 5)
8. 🚧 Memorial mode (Phase 4)

## Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)
- Project issues: [GitHub Issues](https://github.com/your-username/fetch-familiar-friends/issues)

---

**Congratulations!** Your app now has cloud storage, authentication, and real-time sync powered by Firebase. 🎉
