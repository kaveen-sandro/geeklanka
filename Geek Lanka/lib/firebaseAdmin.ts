import admin from 'firebase-admin'

if (!admin.apps.length) {
  const cred = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : undefined

  admin.initializeApp({
    credential: cred ? admin.credential.cert(cred) : admin.credential.applicationDefault(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  })
}

export const adminDb = admin.firestore()
export { admin }
