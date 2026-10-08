import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { getAuth, onAuthStateChanged, type User, } from '@react-native-firebase/auth';
import { checkDeveloperAccess } from '../developer/developer.service';

import * as authService from './auth.service';

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    roleLoading: boolean;
    isDeveloper: boolean;
    refreshDeveloperAccess: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

export const AuthProvider = ({children,}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [roleLoading, setRoleLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), currentUser => {
            setRoleLoading(!!currentUser);
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const handleSignIn = async (
        email: string,
        password: string,
    ) => {
        await authService.signIn(email, password);
    };

    const refreshDeveloperAccess = useCallback(async () => {
        if (!user?.email) {
            setIsDeveloper(false);
            setRoleLoading(false);
            return;
        }

        try {
            setRoleLoading(true);

            const developer = await checkDeveloperAccess(
                user.email,
            );

            setIsDeveloper(developer);
        } finally {
            setRoleLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            setIsDeveloper(false);
            return;
        }

        refreshDeveloperAccess().catch(error => {
            console.error(
                'Unable to determine developer access:',
                error,
            );
        });
    }, [user, refreshDeveloperAccess]);

    const handleSignOut = async () => {
        await authService.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn: handleSignIn,
                signOut: handleSignOut,
                isDeveloper,
                roleLoading,
                refreshDeveloperAccess
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider',
        );
    }

    return context;
};