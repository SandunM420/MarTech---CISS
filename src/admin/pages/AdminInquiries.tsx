import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type Inquiry } from '../../lib/api';
import { EmptyState, PageHeader, StatusMessage, type Status } from '../components/AdminUI';

function formatDate(value: string, long = false) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(undefined, long
        ? { dateStyle: 'full', timeStyle: 'short' }
        : { dateStyle: 'medium' }).format(date);
}

export default function AdminInquiries() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<Status>(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        let current = true;
        void api.inquiries.list()
            .then((data) => {
                if (!current) return;
                setItems(data);
            })
            .catch((error: unknown) => {
                if (!current) return;
                setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not load inquiries.' });
            })
            .finally(() => {
                if (current) setLoading(false);
            });
        return () => { current = false; };
    }, []);

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return items;
        return items.filter((item) => `${item.name} ${item.email} ${item.subject} ${item.message}`.toLowerCase().includes(needle));
    }, [items, query]);

    const requestedId = searchParams.get('id');
    const selected = items.find((item) => item.id === requestedId) ?? visible[0] ?? null;
    const unread = items.filter((item) => !item.read).length;

    const open = async (item: Inquiry) => {
        setSearchParams({ id: item.id }, { replace: true });
        if (item.read) return;

        try {
            const updated = await api.inquiries.markRead(item.id, true);
            setItems((current) => current.map((entry) => entry.id === item.id ? updated : entry));
        } catch (error) {
            setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not update the inquiry.' });
        }
    };

    const toggleRead = async () => {
        if (!selected) return;
        setBusy(true);
        try {
            const updated = await api.inquiries.markRead(selected.id, !selected.read);
            setItems((current) => current.map((entry) => entry.id === selected.id ? updated : entry));
            setStatus({ tone: 'success', message: updated.read ? 'Marked as read.' : 'Marked as unread.' });
        } catch (error) {
            setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not update the inquiry.' });
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!selected || !window.confirm(`Delete the inquiry from ${selected.name}? This cannot be undone.`)) return;
        setBusy(true);
        try {
            await api.inquiries.remove(selected.id);
            const next = items.filter((item) => item.id !== selected.id);
            setItems(next);
            const nextId = next[0]?.id;
            setSearchParams(nextId ? { id: nextId } : {}, { replace: true });
            setStatus({ tone: 'success', message: 'Inquiry deleted.' });
        } catch (error) {
            setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not delete the inquiry.' });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <PageHeader
                crumb="Overview"
                title="Inquiries"
                description={`${unread} unread · ${items.length} total. Messages are private and only available to signed-in administrators.`}
            />
            <StatusMessage status={status} />

            {loading ? (
                <EmptyState icon="fas fa-spinner">Loading inquiries…</EmptyState>
            ) : items.length === 0 ? (
                <EmptyState icon="fas fa-inbox">No contact-form inquiries have arrived yet.</EmptyState>
            ) : (
                <div className="admin-inbox">
                    <section className="admin-inbox-list">
                        <div className="admin-search admin-search--inbox">
                            <i className="fas fa-magnifying-glass" aria-hidden="true" />
                            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inquiries…" />
                        </div>
                        <div className="admin-inbox-scroll">
                            {visible.map((item) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    className={`admin-inbox-row${selected?.id === item.id ? ' admin-inbox-row--active' : ''}`}
                                    onClick={() => void open(item)}
                                >
                                    <span className={`admin-unread-dot${item.read ? ' admin-unread-dot--read' : ''}`} />
                                    <span>
                                        <strong>{item.name}</strong>
                                        <span>{item.subject || 'Website inquiry'}</span>
                                    </span>
                                    <time>{formatDate(item.receivedAt)}</time>
                                </button>
                            ))}
                            {visible.length === 0 ? <p className="admin-list-empty">No inquiries match your search.</p> : null}
                        </div>
                    </section>

                    {selected ? (
                        <article className="admin-inquiry-detail">
                            <div className="admin-inquiry-detail-header">
                                <div>
                                    <p className="admin-crumb">{formatDate(selected.receivedAt, true)}</p>
                                    <h2>{selected.subject || 'Website inquiry'}</h2>
                                </div>
                                <div className="admin-row-actions">
                                    <button type="button" className="admin-icon-button" onClick={toggleRead} disabled={busy} title={selected.read ? 'Mark unread' : 'Mark read'}>
                                        <i className={selected.read ? 'fas fa-envelope' : 'fas fa-envelope-open'} aria-hidden="true" />
                                    </button>
                                    <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={remove} disabled={busy} title="Delete">
                                        <i className="fas fa-trash" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                            <dl className="admin-inquiry-sender">
                                <div><dt>From</dt><dd>{selected.name}</dd></div>
                                <div><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
                                {selected.phone ? <div><dt>Phone</dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd></div> : null}
                            </dl>
                            <div className="admin-inquiry-message">{selected.message}</div>
                            <a className="admin-button admin-button--primary" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || 'Your CISS inquiry'}`)}`}>
                                <i className="fas fa-reply" aria-hidden="true" /> Reply by email
                            </a>
                        </article>
                    ) : null}
                </div>
            )}
        </>
    );
}
