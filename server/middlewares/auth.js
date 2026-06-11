import { initFirebase } from '../configs/firebase.js';

export const protect = async (req, res, next) => {
    try {
        const firebaseAdmin = initFirebase();
        if (!firebaseAdmin) {
            return res.json({ success: false, message: 'Firebase is not configured on the server' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'not authenticated' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await firebaseAdmin.auth().verifyIdToken(token);
        req.userId = decoded.uid;
        req.authUser = decoded;
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
