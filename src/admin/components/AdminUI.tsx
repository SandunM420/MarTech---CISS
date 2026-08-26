import type { ReactNode } from 'react';

/** Shared chrome for the admin pages, so every screen frames itself the same way. */

export function PageHeader({
    crumb,
    title,
    description,
    actions,
}: {
    crumb: string;
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    return (
        <header className="admin-page-header">
            <div className="admin-page-heading">
                <p className="admin-crumb">{crumb}</p>
                <h1>{title}</h1>
                {description ? <p className="admin-page-description">{description}</p> : null}
            </div>
            {actions ? <div className="admin-page-actions">{actions}</div> : null}
        </header>
    );
}

export type StatusTone = 'success' | 'error' | 'info';

export type Status = { tone: StatusTone; message: string } | null;

export function StatusMessage({ status }: { status: Status }) {
    if (!status) {
        return null;
    }

    const icon =
        status.tone === 'success'
            ? 'fas fa-circle-check'
            : status.tone === 'error'
              ? 'fas fa-circle-exclamation'
              : 'fas fa-circle-info';

    return (
        <p className={`admin-status admin-status--${status.tone}`} role="status">
            <i className={icon} aria-hidden="true" />
            <span>{status.message}</span>
        </p>
    );
}

export function EmptyState({ icon, children }: { icon: string; children: ReactNode }) {
    return (
        <div className="admin-empty">
            <i className={icon} aria-hidden="true" />
            <p>{children}</p>
        </div>
    );
}

export function Card({
    title,
    description,
    children,
    footer,
}: {
    title?: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
}) {
    return (
        <section className="admin-card">
            {title ? (
                <div className="admin-card-header">
                    <h2>{title}</h2>
                    {description ? <p>{description}</p> : null}
                </div>
            ) : null}
            <div className="admin-card-body">{children}</div>
            {footer ? <div className="admin-card-footer">{footer}</div> : null}
        </section>
    );
}

export function Field({
    label,
    help,
    children,
}: {
    label: string;
    help?: string;
    children: ReactNode;
}) {
    return (
        <label className="admin-field">
            <span className="admin-field-label">{label}</span>
            {children}
            {help ? <span className="admin-field-help">{help}</span> : null}
        </label>
    );
}

export function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    label: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`admin-toggle${checked ? ' admin-toggle--on' : ''}`}
        >
            <span className="admin-toggle-knob" />
        </button>
    );
}
