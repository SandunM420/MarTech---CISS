import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

/**
 * Route guard for the admin portal.
 *
 * This is a convenience, not a security boundary. It decides what the UI
 * renders; the API independently rejects every unauthenticated write, so a
 * visitor who forces their way past this sees an empty shell and gets 401s.
 * Real enforcement lives on the server, where it cannot be bypassed.
 */
export default function RequireAdmin({ children }: { children: ReactNode }) {
    const { isAuthenticated, checking } = useAdminAuth();
    const location = useLocation();

    // The session check is a round trip. Redirecting before it settles would
    // bounce an already-signed-in admin to the login screen on every refresh.
    if (checking) {
        return (
            <div className="admin-boot">
                <div className="admin-spinner" aria-hidden="true" />
                <p>Checking your session…</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
