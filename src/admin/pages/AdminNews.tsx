import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../context/SiteContentContext';
import { api, ApiError, type MediaItem } from '../../lib/api';
import { createEmptyNews, slugifyNewsTitle, type NewsItem } from '../../data/news';
import { EmptyState, Field, PageHeader, StatusMessage, Toggle, type Status } from '../components/AdminUI';
import RichTextEditor from '../components/RichTextEditor';
import { formatBytes } from '../utils';

export default function AdminNews() {
    const { news, newsVersion, applyNews, loading } = useSiteContent();
    const [editing, setEditing] = useState<NewsItem | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<Status>(null);
    const [query, setQuery] = useState('');

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return news.filter((item) => !needle || `${item.title} ${item.excerpt} ${item.author}`.toLowerCase().includes(needle));
    }, [news, query]);

    const saveCollection = async (next: NewsItem[], message: string) => {
        setBusy(true);
        setStatus(null);
        try {
            const envelope = await api.news.save(next, newsVersion);
            applyNews(envelope.data ?? next, envelope.version);
            setStatus({ tone: 'success', message });
            return true;
        } catch (error) {
            setStatus({
                tone: 'error',
                message: error instanceof ApiError && error.isConflict
                    ? 'News changed in another tab. Reload before saving.'
                    : error instanceof Error ? error.message : 'Could not save news.',
            });
            return false;
        } finally {
            setBusy(false);
        }
    };

    const startNew = () => {
        setEditing(createEmptyNews());
        setIsNew(true);
        setStatus(null);
    };

    const saveItem = async (item: NewsItem) => {
        if (!item.title.trim() || !item.slug.trim() || !item.excerpt.trim() || !item.body.trim()) {
            setStatus({ tone: 'error', message: 'Title, URL slug, short summary and article body are required.' });
            return;
        }
        if (news.some((entry) => entry.slug === item.slug && entry.id !== item.id)) {
            setStatus({ tone: 'error', message: 'Another news item already uses that URL slug.' });
            return;
        }

        const next = isNew ? [item, ...news] : news.map((entry) => entry.id === item.id ? item : entry);
        if (await saveCollection(next, isNew ? 'News item created.' : 'News item saved.')) {
            setEditing(null);
            setIsNew(false);
        }
    };

    const mutate = (item: NewsItem, changes: Partial<NewsItem>, message: string) =>
        saveCollection(news.map((entry) => entry.id === item.id ? { ...entry, ...changes } : entry), message);

    const remove = async (item: NewsItem) => {
        if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
        await saveCollection(news.filter((entry) => entry.id !== item.id), 'News item deleted.');
    };

    if (editing) {
        return (
            <NewsForm
                item={editing}
                isNew={isNew}
                busy={busy}
                status={status}
                onChange={setEditing}
                onCancel={() => { setEditing(null); setIsNew(false); setStatus(null); }}
                onSave={() => void saveItem(editing)}
            />
        );
    }

    return (
        <>
            <PageHeader
                crumb="Content"
                title="News"
                description="Create announcements and stories for the homepage carousel and news pages. Draft or hidden items never appear publicly."
                actions={<button type="button" className="admin-button admin-button--primary" onClick={startNew}><i className="fas fa-plus" /> Add news</button>}
            />
            <StatusMessage status={status} />

            {news.length > 5 ? <div className="admin-search"><i className="fas fa-magnifying-glass" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${news.length} news items…`} /></div> : null}

            {loading ? <EmptyState icon="fas fa-spinner">Loading news…</EmptyState> : visible.length === 0 ? (
                <EmptyState icon="fas fa-newspaper">{news.length ? 'No news matches that search.' : 'No news yet. Add the first story to activate the homepage carousel.'}</EmptyState>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table admin-news-table">
                        <thead><tr><th>Article</th><th>Date</th><th>Status</th><th>On site</th><th className="admin-col-actions">Actions</th></tr></thead>
                        <tbody>
                            {visible.map((item) => (
                                <tr key={item.id} className={item.hidden ? 'admin-row--hidden' : undefined}>
                                    <td><div className="admin-news-cell">{item.cover ? <img src={item.cover} alt="" /> : <span><i className="fas fa-newspaper" /></span>}<div><p className="admin-cell-title">{item.title}</p><p className="admin-cell-sub">/news/{item.slug}</p></div></div></td>
                                    <td><p className="admin-cell-meta">{item.date}</p><p className="admin-cell-sub">{item.author}</p></td>
                                    <td><span className={`admin-pill${item.status === 'published' ? ' admin-pill--ok' : ' admin-pill--warn'}`}>{item.status === 'published' ? 'Published' : 'Draft'}</span></td>
                                    <td><span className={`admin-pill${item.hidden ? ' admin-pill--warn' : ' admin-pill--ok'}`}>{item.hidden ? 'Hidden' : 'Visible'}</span></td>
                                    <td className="admin-col-actions"><div className="admin-row-actions">
                                        {item.status === 'published' && !item.hidden ? <a className="admin-icon-button" href={`/news/${item.slug}`} target="_blank" rel="noreferrer" title="View article"><i className="fas fa-arrow-up-right-from-square" /></a> : null}
                                        <button type="button" className="admin-icon-button" disabled={busy} title={item.status === 'published' ? 'Move to drafts' : 'Publish'} onClick={() => void mutate(item, { status: item.status === 'published' ? 'draft' : 'published' }, item.status === 'published' ? 'Moved to drafts.' : 'News published.')}><i className={item.status === 'published' ? 'fas fa-file' : 'fas fa-bullhorn'} /></button>
                                        <button type="button" className="admin-icon-button" disabled={busy} title={item.hidden ? 'Show on site' : 'Hide from site'} onClick={() => void mutate(item, { hidden: !item.hidden }, item.hidden ? 'News is now visible.' : 'News hidden from the site.')}><i className={item.hidden ? 'fas fa-eye' : 'fas fa-eye-slash'} /></button>
                                        <button type="button" className="admin-icon-button admin-icon-button--primary" disabled={busy} title="Edit" onClick={() => { setEditing({ ...item }); setIsNew(false); setStatus(null); }}><i className="fas fa-pen" /></button>
                                        <button type="button" className="admin-icon-button admin-icon-button--danger" disabled={busy} title="Delete" onClick={() => void remove(item)}><i className="fas fa-trash" /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

function NewsForm({ item, isNew, busy, status, onChange, onCancel, onSave }: { item: NewsItem; isNew: boolean; busy: boolean; status: Status; onChange: (item: NewsItem) => void; onCancel: () => void; onSave: () => void }) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<Status>(null);
    const uploadRef = useRef<HTMLInputElement>(null);

    useEffect(() => { void api.media.list().then(setMedia).catch(() => setMedia([])); }, []);
    const set = <K extends keyof NewsItem>(key: K, value: NewsItem[K]) => onChange({ ...item, [key]: value });

    const changeTitle = (title: string) => {
        const previousAutomatic = !item.slug || item.slug === slugifyNewsTitle(item.title);
        onChange({ ...item, title, slug: previousAutomatic ? slugifyNewsTitle(title) : item.slug });
    };

    const openPicker = async () => {
        setPickerOpen(true);
        try { setMedia(await api.media.list()); } catch { setMedia([]); }
    };

    const uploadCover = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadStatus(null);
        try {
            const uploaded = await api.media.upload(file);
            setMedia((current) => [uploaded, ...current.filter((entry) => entry.id !== uploaded.id)]);
            set('cover', uploaded.url);
            setPickerOpen(false);
            setUploadStatus({ tone: 'success', message: 'Image uploaded, added to the media library and selected as the cover.' });
        } catch (error) {
            setUploadStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not upload the image.' });
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    return (
        <>
            <PageHeader crumb="News" title={isNew ? 'New article' : 'Edit article'} description="Drafts can be saved safely and published when they are ready." actions={<><button type="button" className="admin-button admin-button--ghost" onClick={onCancel}>Cancel</button><button type="button" className="admin-button admin-button--primary" onClick={onSave} disabled={busy}><i className="fas fa-check" /> {busy ? 'Saving…' : 'Save article'}</button></>} />
            <StatusMessage status={status} />

            <div className="admin-news-form-layout">
                <section className="admin-card"><div className="admin-card-header"><h2>Story</h2><p>The title, summary and full article shown to visitors.</p></div><div className="admin-card-body">
                    <Field label="Headline"><input type="text" value={item.title} onChange={(event) => changeTitle(event.target.value)} placeholder="CISS announces…" /></Field>
                    <Field label="URL slug" help={`Public URL: /news/${item.slug || 'article-name'}`}><input type="text" value={item.slug} onChange={(event) => set('slug', slugifyNewsTitle(event.target.value))} placeholder="article-name" /></Field>
                    <Field label="Short summary" help="Shown in the homepage carousel and news cards. Keep it to one or two sentences."><textarea rows={3} maxLength={600} value={item.excerpt} onChange={(event) => set('excerpt', event.target.value)} /></Field>
                    <Field label="Article body" group><RichTextEditor ariaLabel="Article body" minHeight={320} value={item.body} onChange={(html) => set('body', html)} /></Field>
                </div></section>

                <div className="admin-form-stack">
                    <section className="admin-card"><div className="admin-card-header"><h2>Publishing</h2></div><div className="admin-card-body">
                        <Field label="Publication date"><input type="date" value={item.date} onChange={(event) => set('date', event.target.value)} /></Field>
                        <Field label="Author"><input type="text" value={item.author} onChange={(event) => set('author', event.target.value)} /></Field>
                        <Field label="Status"><select value={item.status} onChange={(event) => set('status', event.target.value as NewsItem['status'])}><option value="draft">Draft</option><option value="published">Published</option></select></Field>
                        <div className="admin-field admin-field--inline"><div><span className="admin-field-label">Hide from public site</span><span className="admin-field-help">Useful for temporarily removing a published article.</span></div><Toggle checked={item.hidden} onChange={(value) => set('hidden', value)} label="Hide news from public site" /></div>
                    </div></section>

                    <section className="admin-card"><div className="admin-card-header"><h2>Cover image</h2><p>Landscape images work best in the carousel.</p></div><div className="admin-card-body">
                        <div className={`admin-news-cover-preview${item.cover ? '' : ' admin-news-cover-preview--empty'}`}>{item.cover ? <img src={item.cover} alt="" /> : <><i className="fas fa-image" /><span>No cover selected</span></>}</div>
                        <StatusMessage status={uploadStatus} />
                        <div className="admin-image-action-grid">
                            <button type="button" className="admin-button admin-button--ghost" onClick={() => void openPicker()}><i className="fas fa-images" /> Choose from library</button>
                            <button type="button" className="admin-button admin-button--primary" onClick={() => uploadRef.current?.click()} disabled={uploading}><i className="fas fa-cloud-arrow-up" /> {uploading ? 'Uploading…' : 'Upload new image'}</button>
                        </div>
                        <input ref={uploadRef} className="admin-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadCover} />
                        {item.cover ? <button type="button" className="admin-text-button" onClick={() => set('cover', '')}>Remove cover</button> : null}
                        <Link to="/admin/images" target="_blank" rel="noreferrer" className="admin-text-link">Open full media library</Link>
                    </div></section>
                </div>
            </div>

            {pickerOpen ? <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPickerOpen(false); }}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="news-cover-picker"><div className="admin-modal-header"><div><p className="admin-crumb">News</p><h2 id="news-cover-picker">Choose cover image</h2><p>A 16:9 or 3:2 landscape image is recommended.</p></div><button type="button" className="admin-icon-button" onClick={() => setPickerOpen(false)} aria-label="Close"><i className="fas fa-xmark" /></button></div><div className="admin-picker-grid">{media.map((mediaItem) => <button type="button" key={mediaItem.id} onClick={() => { set('cover', mediaItem.url); setPickerOpen(false); }}><img src={mediaItem.url} alt="" /><strong>{mediaItem.originalName}</strong><span>{mediaItem.width} × {mediaItem.height} · {formatBytes(mediaItem.bytes)}</span></button>)}</div>{media.length === 0 ? <EmptyState icon="fas fa-images">No uploaded images yet. Upload one in Images first.</EmptyState> : null}</section></div> : null}
        </>
    );
}
