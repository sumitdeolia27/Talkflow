import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const getToken = async () => {
        if (!auth.currentUser) return null;
        return auth.currentUser.getIdToken();
    };

    const signOut = () => firebaseSignOut(auth);

    return (
        <AuthContext.Provider value={{ user, loading, getToken, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const { user, loading } = useAuth();
    return { user, isLoaded: !loading };
};
