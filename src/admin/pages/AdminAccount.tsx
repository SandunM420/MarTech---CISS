import { useEffect, useState, type FormEvent } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api, type HealthReport } from '../../lib/api';
import { Card, Field, PageHeader, StatusMessage, type Status } from '../components/AdminUI';

export default function AdminAccount() {
    const { user, changePassword } = useAdminAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<Status>(null);
    const [health, setHealth] = useState<HealthReport | null>(null);

    useEffect(() => {
        void api.health().then(setHealth).catch(() => setHealth(null));
    }, []);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setStatus(null);

        if (newPassword.length < 10) {
            setStatus({ tone: 'error', message: 'The new password must be at least 10 characters.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus({ tone: 'error', message: 'The two new-password fields do not match.' });
            return;
        }

        setBusy(true);
        const result = await changePassword(currentPassword, newPassword);
        setBusy(false);

        if (!result.ok) {
            setStatus({ tone: 'error', message: result.error });
            return;
        }

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setStatus({ tone: 'success', message: 'Password changed successfully.' });
    };

    return (
        <>
            <PageHeader crumb="Site" title="Account" description="Manage your administrator credentials and check server readiness." />
            <StatusMessage status={status} />

            <div className="admin-account-grid">
                <Card title="Administrator" description="This account is stored securely outside the public website.">
                    <dl className="admin-definition-list">
                        <div><dt>Username</dt><dd>{user?.username}</dd></div>
                        <div><dt>Role</dt><dd>{user?.role}</dd></div>
                    </dl>
                </Card>

                <Card title="System status" description="A quick check of the PHP environment used by the admin portal.">
                    {health ? (
                        <div className="admin-health-list">
                            <HealthRow label={`PHP ${health.php}`} ok />
                            <HealthRow label="Private data storage" ok={health.dataDirWritable} />
                            <HealthRow label="Image upload storage" ok={health.uploadDirWritable} />
                            <HealthRow label="Admin account configured" ok={health.adminConfigured} />
                            <HealthRow label="Image resizing support" ok={health.gd} optional />
                            <HealthRow label="Rich-text sanitising support" ok={health.dom} optional />
                        </div>
                    ) : (
                        <p className="admin-muted">The health check is unavailable.</p>
                    )}
                </Card>
            </div>

            <form onSubmit={submit} className="admin-form-stack admin-form-stack--narrow">
                <Card
                    title="Change password"
                    description="Use at least 10 characters. A longer passphrase is easier to remember and safer."
                    footer={
                        <button type="submit" className="admin-button admin-button--primary" disabled={busy}>
                            <i className="fas fa-lock" aria-hidden="true" /> {busy ? 'Changing…' : 'Change password'}
                        </button>
                    }
                >
                    <Field label="Current password">
                        <input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
                    </Field>
                    <Field label="New password">
                        <input type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={10} />
                    </Field>
                    <Field label="Confirm new password">
                        <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={10} />
                    </Field>
                </Card>
            </form>
        </>
    );
}

function HealthRow({ label, ok, optional = false }: { label: string; ok: boolean; optional?: boolean }) {
    return (
        <div>
            <i className={ok ? 'fas fa-circle-check' : optional ? 'fas fa-circle-info' : 'fas fa-circle-xmark'} aria-hidden="true" />
            <span>{label}</span>
            <strong>{ok ? 'Ready' : optional ? 'Unavailable' : 'Action needed'}</strong>
        </div>
    );
}
