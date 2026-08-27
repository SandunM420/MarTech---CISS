import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import { groupedImageSlots } from '../../data/imageSlots';
import { api, ApiError, type ImageSlots, type MediaItem } from '../../lib/api';
import { EmptyState, PageHeader, StatusMessage, type Status } from '../components/AdminUI';
import { formatBytes } from '../utils';

function ratioDifference(item: MediaItem, width: number, height: number) {
    if (!item.width || !item.height) return 1;
    return Math.abs(item.width / item.height - width / height) / (width / height);
}

export default function AdminImages() {
    const { slots, slotsVersion, applySlots, image, loading } = useSiteContent();
    const [draft, setDraft] = useState<ImageSlots>(slots);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<Status>(null);
    const [pickerKey, setPickerKey] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => setDraft(slots), [slots]);
    useEffect(() => {
        let current = true;
        void api.media.list()
            .then((data) => { if (current) setMedia(data); })
            .catch((error: unknown) => { if (current) setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not load images.' }); })
            .finally(() => { if (current) setMediaLoading(false); });
        return () => { current = false; };
    }, []);

    const dirty = JSON.stringify(draft) !== JSON.stringify(slots);
    const selectedDefinition = useMemo(
        () => groupedImageSlots().flatMap((group) => group.slots).find((slot) => slot.key === pickerKey) ?? null,
        [pickerKey],
    );

    const upload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;
        setUploading(true);
        setStatus(null);
        const added: MediaItem[] = [];

        try {
            for (const file of files) added.push(await api.media.upload(file));
            setMedia((current) => [...added.slice().reverse(), ...current]);

            if (pickerKey && added[0]) {
                setDraft((current) => ({ ...current, [pickerKey]: added[0].url }));
                setPickerKey(null);
                setStatus({ tone: 'success', message: 'Image uploaded, added to the media library and selected. Save placements to publish it.' });
            } else {
                setStatus({ tone: 'success', message: `${files.length} image${files.length === 1 ? '' : 's'} uploaded to the media library.` });
            }
        } catch (error) {
            if (added.length) setMedia((current) => [...added.slice().reverse(), ...current]);
            setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not upload the image.' });
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const uploadForSlot = (slotKey: string) => {
        setPickerKey(slotKey);
        inputRef.current?.click();
    };

    const save = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const envelope = await api.slots.save(draft, slotsVersion);
            applySlots(envelope.data ?? draft, envelope.version);
            setStatus({ tone: 'success', message: 'Image placements saved and published.' });
        } catch (error) {
            setStatus({
                tone: 'error',
                message: error instanceof ApiError && error.isConflict
                    ? 'Image placements changed in another tab. Reload before saving.'
                    : error instanceof Error ? error.message : 'Could not save image placements.',
            });
        } finally {
            setSaving(false);
        }
    };

    const remove = async (item: MediaItem) => {
        const usedBy = Object.entries(draft).filter(([, url]) => url === item.url).map(([key]) => key);
        if (usedBy.length) {
            setStatus({ tone: 'error', message: 'That image is currently placed on the site. Reset or replace its image slot before deleting it.' });
            return;
        }
        if (!window.confirm(`Delete "${item.originalName}" from the media library?`)) return;

        try {
            await api.media.remove(item.id);
            setMedia((current) => current.filter((entry) => entry.id !== item.id));
            setStatus({ tone: 'success', message: 'Image deleted.' });
        } catch (error) {
            setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Could not delete the image.' });
        }
    };

    return (
        <>
            <PageHeader
                crumb="Content"
                title="Images"
                description="Upload images once, then assign them to named positions without changing the page layout."
                actions={
                    <>
                        <button type="button" className="admin-button admin-button--ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>
                            <i className="fas fa-cloud-arrow-up" aria-hidden="true" /> {uploading ? 'Uploading…' : 'Upload images'}
                        </button>
                        <button type="button" className="admin-button admin-button--primary" onClick={save} disabled={saving || loading || !dirty}>
                            <i className="fas fa-check" aria-hidden="true" /> {saving ? 'Saving…' : 'Save placements'}
                        </button>
                    </>
                }
            />
            <input ref={inputRef} className="admin-visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={upload} />
            <StatusMessage status={status} />

            <div className="admin-image-groups">
                {groupedImageSlots().map((group) => (
                    <section className="admin-card" key={group.group}>
                        <div className="admin-card-header"><h2>{group.group}</h2><p>Choose the image used in each position.</p></div>
                        <div className="admin-slot-grid">
                            {group.slots.map((slot) => (
                                <article className="admin-slot-card" key={slot.key}>
                                    <div className="admin-slot-preview"><img src={draft[slot.key] || image(slot.key)} alt="" /></div>
                                    <div className="admin-slot-copy">
                                        <h3>{slot.label}</h3>
                                        <p>{slot.width} × {slot.height}px recommended</p>
                                        <span>{slot.note}</span>
                                    </div>
                                    <div className="admin-slot-actions">
                                        <button type="button" className="admin-button admin-button--ghost" onClick={() => setPickerKey(slot.key)}><i className="fas fa-images" /> Choose image</button>
                                        <button type="button" className="admin-button admin-button--primary" onClick={() => uploadForSlot(slot.key)} disabled={uploading}><i className="fas fa-cloud-arrow-up" /> {uploading && pickerKey === slot.key ? 'Uploading…' : 'Upload new'}</button>
                                        {draft[slot.key] ? <button type="button" className="admin-text-button" onClick={() => setDraft((current) => ({ ...current, [slot.key]: '' }))}>Use original</button> : null}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            <section className="admin-card admin-media-section">
                <div className="admin-card-header admin-card-header--row">
                    <div><h2>Media library</h2><p>{media.length} uploaded image{media.length === 1 ? '' : 's'}.</p></div>
                    <button type="button" className="admin-button admin-button--ghost" onClick={() => inputRef.current?.click()} disabled={uploading}>Upload</button>
                </div>
                {mediaLoading ? <EmptyState icon="fas fa-spinner">Loading images…</EmptyState> : media.length === 0 ? (
                    <EmptyState icon="fas fa-images">No uploaded images yet. The website is using its built-in originals.</EmptyState>
                ) : (
                    <div className="admin-media-grid">
                        {media.map((item) => (
                            <article className="admin-media-card" key={item.id}>
                                <img src={item.url} alt={item.originalName} />
                                <div><strong title={item.originalName}>{item.originalName}</strong><span>{item.width} × {item.height} · {formatBytes(item.bytes)}</span></div>
                                <button type="button" className="admin-icon-button admin-icon-button--danger" onClick={() => void remove(item)} title="Delete image"><i className="fas fa-trash" aria-hidden="true" /></button>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {selectedDefinition ? (
                <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPickerKey(null); }}>
                    <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="image-picker-title">
                        <div className="admin-modal-header">
                            <div><p className="admin-crumb">Choose image</p><h2 id="image-picker-title">{selectedDefinition.label}</h2><p>{selectedDefinition.width} × {selectedDefinition.height}px recommended</p></div>
                            <div className="admin-modal-header-actions">
                                <button type="button" className="admin-button admin-button--primary" onClick={() => inputRef.current?.click()} disabled={uploading}><i className="fas fa-cloud-arrow-up" /> {uploading ? 'Uploading…' : 'Upload new'}</button>
                                <button type="button" className="admin-icon-button" onClick={() => setPickerKey(null)} aria-label="Close"><i className="fas fa-xmark" /></button>
                            </div>
                        </div>
                        <div className="admin-picker-grid">
                            {media.map((item) => {
                                const mismatch = ratioDifference(item, selectedDefinition.width, selectedDefinition.height) > 0.12;
                                return (
                                    <button type="button" key={item.id} onClick={() => { setDraft((current) => ({ ...current, [selectedDefinition.key]: item.url })); setPickerKey(null); }}>
                                        <img src={item.url} alt="" />
                                        <strong>{item.originalName}</strong>
                                        <span className={mismatch ? 'admin-picker-warning' : ''}>{item.width} × {item.height}{mismatch ? ' · different shape' : ''}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {media.length === 0 ? <EmptyState icon="fas fa-images">Upload an image before choosing a replacement.</EmptyState> : null}
                    </section>
                </div>
            ) : null}
        </>
    );
}
