import { useEffect, useMemo, useState } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { textFieldMeta } from '../../data/siteDefaults';
import { api, ApiError, type SiteText } from '../../lib/api';
import { Card, Field, PageHeader, StatusMessage, type Status } from '../components/AdminUI';
import RichTextEditor from '../components/RichTextEditor';

export default function AdminText() {
    const { text, textVersion, applyText, loading } = useSiteContent();
    const [draft, setDraft] = useState<SiteText>(text);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<Status>(null);

    useEffect(() => setDraft(text), [text]);

    const groups = useMemo(
        () => Array.from(new Set(textFieldMeta.map((field) => field.group))),
        [],
    );

    const dirty = textFieldMeta.some((field) => (draft[field.key] ?? '') !== (text[field.key] ?? ''));

    const save = async () => {
        setBusy(true);
        setStatus(null);

        try {
            const envelope = await api.text.save(draft, textVersion);
            applyText(envelope.data ?? draft, envelope.version);
            setStatus({ tone: 'success', message: 'Page text saved and published.' });
        } catch (error) {
            setStatus({
                tone: 'error',
                message:
                    error instanceof ApiError && error.isConflict
                        ? 'This text changed in another tab. Reload the page before saving.'
                        : error instanceof Error
                          ? error.message
                          : 'Could not save page text.',
            });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <PageHeader
                crumb="Content"
                title="Page text"
                description="Edit the key marketing copy that changes most often. Structural labels remain protected in the site code."
                actions={
                    <button type="button" className="admin-button admin-button--primary" onClick={save} disabled={busy || loading || !dirty}>
                        <i className="fas fa-check" aria-hidden="true" /> {busy ? 'Saving…' : 'Save text'}
                    </button>
                }
            />

            <StatusMessage status={status} />

            <div className="admin-form-stack">
                {groups.map((group) => (
                    <Card key={group} title={group} description="Changes appear on the public site as soon as they are saved.">
                        {textFieldMeta.filter((field) => field.group === group).map((field) => (
                            <Field key={field.key} label={field.label} help={field.help}>
                                {field.multiline ? (
                                    <RichTextEditor
                                        ariaLabel={field.label}
                                        value={draft[field.key] ?? ''}
                                        onChange={(html) => setDraft((current) => ({ ...current, [field.key]: html }))}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={draft[field.key] ?? ''}
                                        onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                                    />
                                )}
                            </Field>
                        ))}
                    </Card>
                ))}
            </div>
        </>
    );
}
