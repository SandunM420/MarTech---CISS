/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { api, ApiError, type AdminUser } from '../lib/api';

/**
 * Admin authentication, backed by a server session.
 *
 * This replaces an earlier version that compared the username and password
 * against two constants in this file. Those constants were compiled into the
 * JavaScript bundle, so they shipped to every visitor and were readable with
 * view-source; the "session" was a localStorage flag any visitor could set.
 *
 * Now the password only exists as a hash in a file outside the web root, and
 * the browser holds nothing but an HttpOnly cookie it cannot read. Crucially,
 * `isAuthenticated` here only controls what the UI offers - the API enforces
 * authorisation on every write regardless of what the client believes.
 */

type AdminAuthContextValue = {
    user: AdminUser | null;
    isAuthenticated: boolean;
    /** True until the initial session check settles. */
    checking: boolean;
    login: (username: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
    logout: () => Promise<void>;
    changePassword: (
        currentPassword: string,
        newPassword: string,
    ) => Promise<{ ok: true } | { ok: false; error: string }>;
    /** Re-checks the session; call after a 401 from any admin action. */
    revalidate: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [checking, setChecking] = useState(true);

    const revalidate = useCallback(async () => {
        try {
            setUser(await api.auth.me());
        } catch {
            // A failed check means no usable session, whatever the cause.
            setUser(null);
        } finally {
            setChecking(false);
        }
    }, []);

    useEffect(() => {
        void revalidate();
    }, [revalidate]);

    useEffect(() => {
        if (!user?.expiresAt) {
            return undefined;
        }

        // Sessions slide forward on each request, so this only fires when the
        // tab has genuinely sat idle to the expiry point.
        const remaining = user.expiresAt * 1000 - Date.now();

        if (remaining <= 0) {
            setUser(null);
            return undefined;
        }

        const timeout = window.setTimeout(() => void revalidate(), remaining);

        return () => window.clearTimeout(timeout);
    }, [user, revalidate]);

    const value = useMemo<AdminAuthContextValue>(
        () => ({
            user,
            isAuthenticated: user !== null,
            checking,
            login: async (username, password) => {
                try {
                    setUser(await api.auth.login(username.trim(), password));
                    return { ok: true };
                } catch (error) {
                    const message =
                        error instanceof ApiError && error.status === 0
                            ? 'Could not reach the server. Check your connection and try again.'
                            : error instanceof Error
                              ? error.message
                              : 'Sign-in failed.';

                    return { ok: false, error: message };
                }
            },
            logout: async () => {
                try {
                    await api.auth.logout();
                } finally {
                    // Clear locally even if the request failed - the user asked
                    // to be signed out, so the UI must reflect that.
                    setUser(null);
                }
            },
            changePassword: async (currentPassword, newPassword) => {
                try {
                    await api.auth.changePassword(currentPassword, newPassword);
                    return { ok: true };
                } catch (error) {
                    return {
                        ok: false,
                        error: error instanceof Error ? error.message : 'Could not change the password.',
                    };
                }
            },
            revalidate,
        }),
        [user, checking, revalidate],
    );

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);

    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }

    return context;
}
