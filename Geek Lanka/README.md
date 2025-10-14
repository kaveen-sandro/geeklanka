# Geek Lanka — News Blog

This is a Next.js + TypeScript + Tailwind starter for a production-ready news blog called Geek Lanka. It uses Firebase (Firestore) for data storage and Firebase Auth for admin sign-in.

Quick start (Firebase)

1. Copy `.env.example` to `.env.local` and update the Firebase variables.
2. Create a Firebase project and enable Firestore (Native mode) and Authentication (Email/Password).
3. Create a service account and download the JSON key. Store it as the `FIREBASE_SERVICE_ACCOUNT` environment variable (stringified JSON). Example in PowerShell:

```powershell
$json = Get-Content path\to\serviceAccountKey.json -Raw
$env:FIREBASE_SERVICE_ACCOUNT = $json
```

4. Install deps:

```powershell
npm install
```

5. Run development server:

```powershell
npm run dev
```

Admin user setup

- In the Firebase Console -> Authentication, create a user with email/password for your admin.
- In `.env.local` set `ADMIN_EMAILS` to a comma-separated list that includes your admin email (example: `ADMIN_EMAILS=admin@example.com`).

Using the admin UI

- Visit `/admin` and sign in with the admin email/password.
- After sign in you’ll be redirected to `/admin/dashboard` where you can create posts. The dashboard sends an authenticated POST to `/api/posts`.

Notes

- For production on Vercel (or another host), add `FIREBASE_SERVICE_ACCOUNT` and `ADMIN_EMAILS` as environment variables in the project settings.
- Harden Firestore security rules and enable rate limiting and monitoring for production.
# Geek Lanka — News Blog

This is a Next.js + TypeScript + Tailwind starter for a production-ready news blog called Geek Lanka. It uses Firebase (Firestore) for data storage.

Quick start (Firebase)

1. Copy `.env.example` to `.env.local` and update the Firebase variables.
2. Create a Firebase project and enable Firestore (Native mode) and Authentication (if you want auth later).
3. Create a service account and download the JSON key. Store it as the `FIREBASE_SERVICE_ACCOUNT` environment variable (stringified JSON). Example in PowerShell:

```powershell
$json = Get-Content path\to\serviceAccountKey.json -Raw
$env:FIREBASE_SERVICE_ACCOUNT = $json
```

4. Install deps:

```powershell
npm install
```

5. Run development server:

```powershell
npm run dev
```

Environment variables

Update `.env.local` with these variables (example values):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
FIREBASE_SERVICE_ACCOUNT="{...service account json...}"
```

Notes

- The project scaffolds server-side rendering that reads posts from Firestore using the Firebase Admin SDK. For production, set `FIREBASE_SERVICE_ACCOUNT` in your hosting provider (e.g., Vercel) as a secure variable.
- I removed Prisma and replaced the backend with Firestore. If you prefer another DB, tell me and I can switch.
# Geek Lanka — News Blog

This is a Next.js + TypeScript + Tailwind + Prisma starter for a production-ready news blog called Geek Lanka.

Quick start

1. Copy .env.example to .env and set DATABASE_URL (defaults to sqlite)
2. npm install
3. npm run prisma:generate
4. npm run prisma:migrate
5. npm run dev

Deployment notes: Use Postgres in production and set DATABASE_URL accordingly. Vercel is recommended for hosting Next.js sites.
