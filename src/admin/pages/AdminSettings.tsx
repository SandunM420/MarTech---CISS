import { useEffect, useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { api, ApiError, type SiteSettings } from '../../lib/api';
import { Card, Field, PageHeader, StatusMessage, type Status } from '../components/AdminUI';

const contactFields: { key: keyof SiteSettings; label: string; type?: string; help?: string }[] = [
    { key: 'phoneDisplay', label: 'Phone number shown on the site', help: 'Example: +94 702 88 99 00' },
    { key: 'phone', label: 'Dialable phone number', type: 'tel', help: 'Used by tap-to-call links. Use digits and an optional leading +.' },
    { key: 'email', label: 'Contact email', type: 'email' },
    { key: 'address', label: 'Address' },
];

const socialFields: { key: keyof SiteSettings; label: string }[] = [
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'linkedin', label: 'LinkedIn URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'tiktok', label: 'TikTok URL' },
];

export default function AdminSettings() {
    const { settings, settingsVersion, applySettings, loading } = useSiteContent();
    const [draft, setDraft] = useState<SiteSettings>(settings);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<Status>(null);

    useEffect(() => setDraft(settings), [settings]);

    const dirty = JSON.stringify(draft) !== JSON.stringify(settings);
    const set = (key: keyof SiteSettings, value: string) => setDraft((current) => ({ ...current, [key]: value }));

    const save = async () => {
        setBusy(true);
        setStatus(null);

        try {
            const envelope = await api.settings.save(draft, settingsVersion);
            applySettings(envelope.data ?? draft, envelope.version);
            setStatus({ tone: 'success', message: 'Site settings saved and published.' });
        } catch (error) {
            setStatus({
                tone: 'error',
                message:
                    error instanceof ApiError && error.isConflict
                        ? 'These settings changed in another tab. Reload before saving.'
                        : error instanceof Error
                          ? error.message
                          : 'Could not save settings.',
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <PageHeader
                crumb="Site"
                title="Settings"
                description="Manage organisation details used across the header, footer and contact page."
                actions={
                    <button type="button" className="admin-button admin-button--primary" onClick={save} disabled={busy || loading || !dirty}>
                        <i className="fas fa-check" aria-hidden="true" /> {busy ? 'Saving…' : 'Save settings'}
                    </button>
                }
            />

            <StatusMessage status={status} />

            <div className="admin-form-stack">
                <Card title="Organisation" description="The public name and short positioning line.">
                    <Field label="Site name">
                        <input type="text" value={draft.siteName} onChange={(event) => set('siteName', event.target.value)} />
                    </Field>
                    <Field label="Tagline">
                        <input type="text" value={draft.tagline} onChange={(event) => set('tagline', event.target.value)} />
                    </Field>
                </Card>

                <Card title="Contact details" description="Keep the display number and dialable number in sync.">
                    <div className="admin-field-row">
                        {contactFields.slice(0, 2).map((field) => (
                            <Field key={field.key} label={field.label} help={field.help}>
                                <input type={field.type ?? 'text'} value={draft[field.key]} onChange={(event) => set(field.key, event.target.value)} />
                            </Field>
                        ))}
                    </div>
                    {contactFields.slice(2).map((field) => (
                        <Field key={field.key} label={field.label} help={field.help}>
                            {field.key === 'address' ? (
                                <textarea rows={3} value={draft[field.key]} onChange={(event) => set(field.key, event.target.value)} />
                            ) : (
                                <input type={field.type ?? 'text'} value={draft[field.key]} onChange={(event) => set(field.key, event.target.value)} />
                            )}
                        </Field>
                    ))}
                </Card>

                <Card title="Social links" description="Leave a field blank to hide that network from the footer.">
                    {socialFields.map((field) => (
                        <Field key={field.key} label={field.label} help="Use the full https:// URL.">
                            <input type="url" value={draft[field.key]} onChange={(event) => set(field.key, event.target.value)} placeholder="https://" />
                        </Field>
                    ))}
                </Card>
            </div>
        </>
    );
}
