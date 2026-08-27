import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseCatalog } from '../../context/CourseCatalogContext';
import { api, type Inquiry, type MediaItem } from '../../lib/api';
import { EmptyState, PageHeader, StatusMessage, type Status } from '../components/AdminUI';

const quickActions = [
    { to: '/admin/courses', icon: 'fas fa-plus', label: 'Add or edit a course' },
    { to: '/admin/news', icon: 'fas fa-newspaper', label: 'Create a news article' },
    { to: '/admin/text', icon: 'fas fa-align-left', label: 'Update page text' },
    { to: '/admin/images', icon: 'fas fa-cloud-arrow-up', label: 'Upload an image' },
    { to: '/admin/settings', icon: 'fas fa-sliders', label: 'Change site details' },
];

function formatReceived(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function AdminDashboard() {
    const { catalog, loading } = useCourseCatalog();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [status, setStatus] = useState<Status>(null);

    useEffect(() => {
        let current = true;

        void Promise.all([api.inquiries.list(), api.media.list()])
            .then(([nextInquiries, nextMedia]) => {
                if (!current) return;
                setInquiries(nextInquiries);
                setMedia(nextMedia);
            })
            .catch((error: unknown) => {
                if (!current) return;
                setStatus({
                    tone: 'error',
                    message: error instanceof Error ? error.message : 'Some dashboard data could not be loaded.',
                });
            });

        return () => {
            current = false;
        };
    }, []);

    const courseCounts = useMemo(() => {
        const all = Object.values(catalog).flat();
        return { total: all.length, hidden: all.filter((course) => course.hidden).length };
    }, [catalog]);

    const unread = inquiries.filter((inquiry) => !inquiry.read).length;
    const stats = [
        {
            label: 'Courses',
            value: loading ? '—' : courseCounts.total,
            note: courseCounts.hidden ? `${courseCounts.hidden} hidden` : 'all visible',
            icon: 'fas fa-graduation-cap',
            to: '/admin/courses',
        },
        {
            label: 'Image files',
            value: media.length,
            note: 'in the media library',
            icon: 'fas fa-images',
            to: '/admin/images',
        },
        {
            label: 'New inquiries',
            value: unread,
            note: `${inquiries.length} total`,
            icon: 'fas fa-inbox',
            to: '/admin/inquiries',
        },
    ];

    return (
        <>
            <PageHeader
                crumb="Overview"
                title="Dashboard"
                description="A quick view of the content and messages behind ciss.lk."
                actions={
                    <a className="admin-button admin-button--ghost" href="/" target="_blank" rel="noreferrer">
                        <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" /> View website
                    </a>
                }
            />

            <StatusMessage status={status} />

            <div className="admin-stat-grid">
                {stats.map((stat) => (
                    <Link to={stat.to} className="admin-stat-card" key={stat.label}>
                        <span className="admin-stat-icon"><i className={stat.icon} aria-hidden="true" /></span>
                        <span className="admin-stat-copy">
                            <span className="admin-stat-label">{stat.label}</span>
                            <strong>{stat.value}</strong>
                            <span>{stat.note}</span>
                        </span>
                        <i className="fas fa-chevron-right admin-stat-arrow" aria-hidden="true" />
                    </Link>
                ))}
            </div>

            <div className="admin-dashboard-grid">
                <section className="admin-card">
                    <div className="admin-card-header admin-card-header--row">
                        <div>
                            <h2>Recent inquiries</h2>
                            <p>Messages submitted through the contact page.</p>
                        </div>
                        <Link to="/admin/inquiries" className="admin-text-link">View all</Link>
                    </div>
                    {inquiries.length ? (
                        <div className="admin-inquiry-preview-list">
                            {inquiries.slice(0, 4).map((inquiry) => (
                                <Link to={`/admin/inquiries?id=${encodeURIComponent(inquiry.id)}`} key={inquiry.id}>
                                    <span className={`admin-unread-dot${inquiry.read ? ' admin-unread-dot--read' : ''}`} />
                                    <span className="admin-inquiry-preview-copy">
                                        <strong>{inquiry.name}</strong>
                                        <span>{inquiry.subject || inquiry.message}</span>
                                    </span>
                                    <time>{formatReceived(inquiry.receivedAt)}</time>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="fas fa-inbox">No inquiries have arrived yet.</EmptyState>
                    )}
                </section>

                <section className="admin-card">
                    <div className="admin-card-header">
                        <h2>Quick actions</h2>
                        <p>Jump straight to a common task.</p>
                    </div>
                    <div className="admin-quick-list">
                        {quickActions.map((action) => (
                            <Link to={action.to} key={action.to}>
                                <i className={action.icon} aria-hidden="true" />
                                <span>{action.label}</span>
                                <i className="fas fa-chevron-right" aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
