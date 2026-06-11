import admin from 'firebase-admin';

let initialized = false;

export const initFirebase = () => {
    if (initialized || admin.apps.length) {
        return admin;
    }

    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
    let privateKey = FIREBASE_PRIVATE_KEY?.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

    if (privateKey && !privateKey.includes('BEGIN PRIVATE KEY')) {
        const keyBody = privateKey.replace(/\s/g, '');
        privateKey = `-----BEGIN PRIVATE KEY-----\n${keyBody}\n-----END PRIVATE KEY-----\n`;
    }

    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !privateKey || privateKey.includes('YOUR_PRIVATE_KEY')) {
        console.warn('Firebase Admin credentials are not configured. Protected API routes will fail until server/.env is updated.');
        return null;
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
    });

    initialized = true;
    return admin;
};

export default admin;
