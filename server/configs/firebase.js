import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const formatPrivateKey = (privateKey) => {
    if (!privateKey) return '';

    let formattedKey = privateKey.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');

    if (!formattedKey.includes('BEGIN PRIVATE KEY')) {
        const keyBody = formattedKey.replace(/\s/g, '');
        formattedKey = `-----BEGIN PRIVATE KEY-----\n${keyBody}\n-----END PRIVATE KEY-----\n`;
    }

    return formattedKey;
};

export const initFirebase = () => {
    if (getApps().length) {
        return { auth: getAuth };
    }

    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
    const privateKey = formatPrivateKey(FIREBASE_PRIVATE_KEY);

    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !privateKey || privateKey.includes('YOUR_PRIVATE_KEY')) {
        console.warn('Firebase Admin credentials are not configured. Protected API routes will fail until server/.env is updated.');
        return null;
    }

    initializeApp({
        credential: cert({
            projectId: FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
    });

    return { auth: getAuth };
};
