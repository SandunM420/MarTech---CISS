import type { Course, CourseCatalog } from '../data/courseCatalog';
import type { NewsItem } from '../data/news';

/**
 * Typed client for the PHP admin API.
 *
 * Same-origin in production (Apache serves /api out of public_html/api) and
 * proxied to PHP's built-in server in development (see vite.config.ts), so the
 * paths here are identical in both. Session auth rides on an HttpOnly cookie,
 * which is why every request sends credentials and none of them touch a token.
 */

const BASE = '/api';

export type AdminUser = {
    username: string;
    role: string;
    expiresAt: number | null;
};

export type SiteSettings = {
    siteName: string;
    tagline: string;
    /** Digits and +, used for tel: links. */
    phone: string;
    /** How the number is written on the page. */
    phoneDisplay: string;
    email: string;
    address: string;
    facebook: string;
    linkedin: string;
    instagram: string;
    tiktok: string;
};

export type SiteText = Record<string, string>;
export type ImageSlots = Record<string, string>;

export type MediaItem = {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mime: string;
    width: number;
    height: number;
    bytes: number;
    uploadedAt: string;
};

export type Inquiry = {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    read: boolean;
    receivedAt: string;
};

/** Stored documents carry a version so concurrent saves cannot clobber. */
export type Envelope<T> = {
    version: number;
    updatedAt: string | null;
    data: T | null;
};

export type ContentBundle = {
    courses: Envelope<CourseCatalog>;
    news: Envelope<NewsItem[]>;
    settings: Envelope<SiteSettings>;
    text: Envelope<SiteText>;
    slots: Envelope<ImageSlots>;
};

export type HealthReport = {
    php: string;
    dataDir: string;
    dataDirWritable: boolean;
    uploadDir: string;
    uploadDirWritable: boolean;
    gd: boolean;
    dom: boolean;
    adminConfigured: boolean;
};

/** Thrown for any non-2xx response, carrying the status so callers can branch. */
export class ApiError extends Error {
    readonly status: number;
    readonly currentVersion?: number;

    constructor(message: string, status: number, currentVersion?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.currentVersion = currentVersion;
    }

    /** A 409 means someone else saved since this data was loaded. */
    get isConflict() {
        return this.status === 409;
    }

    get isUnauthorized() {
        return this.status === 401;
    }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${BASE}${path}`, {
            // The session cookie is HttpOnly, so it only travels if we ask.
            credentials: 'same-origin',
            ...init,
        });
    } catch {
        // Network-level failure: offline, DNS, server down. Distinguish this
        // from an API error so callers can fall back to bundled content rather
        // than showing an error page.
        throw new ApiError('Could not reach the server.', 0);
    }

    let payload: { ok?: boolean; data?: T; error?: string; currentVersion?: number } | null = null;

    try {
        payload = await response.json();
    } catch {
        payload = null;
    }

    if (!response.ok || !payload?.ok) {
        throw new ApiError(
            payload?.error ?? `Request failed (${response.status}).`,
            response.status,
            payload?.currentVersion,
        );
    }

    return payload.data as T;
}

function jsonInit(method: string, body: unknown): RequestInit {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
}

export const api = {
    health: () => request<HealthReport>('/health'),

    auth: {
        me: () => request<AdminUser | null>('/auth/me'),
        login: (username: string, password: string) =>
            request<AdminUser>('/auth/login', jsonInit('POST', { username, password })),
        logout: () => request<null>('/auth/logout', { method: 'POST' }),
        changePassword: (currentPassword: string, newPassword: string) =>
            request<null>('/auth/password', jsonInit('POST', { currentPassword, newPassword })),
    },

    /** Everything the public site needs, in one round trip. */
    content: () => request<ContentBundle>('/content'),

    courses: {
        get: () => request<Envelope<CourseCatalog>>('/courses'),
        save: (data: CourseCatalog, version: number) =>
            request<Envelope<CourseCatalog>>('/courses', jsonInit('PUT', { data, version })),
    },

    news: {
        save: (data: NewsItem[], version: number) =>
            request<Envelope<NewsItem[]>>('/news', jsonInit('PUT', { data, version })),
    },

    settings: {
        save: (data: SiteSettings, version: number) =>
            request<Envelope<SiteSettings>>('/settings', jsonInit('PUT', { data, version })),
    },

    text: {
        save: (data: SiteText, version: number) =>
            request<Envelope<SiteText>>('/text', jsonInit('PUT', { data, version })),
    },

    slots: {
        save: (data: ImageSlots, version: number) =>
            request<Envelope<ImageSlots>>('/slots', jsonInit('PUT', { data, version })),
    },

    media: {
        list: () => request<MediaItem[]>('/media'),
        upload: (file: File) => {
            const form = new FormData();
            form.append('file', file);

            // No Content-Type header: the browser must set the multipart
            // boundary itself, and overriding it breaks the upload.
            return request<MediaItem>('/media', { method: 'POST', body: form });
        },
        remove: (id: string) => request<null>(`/media/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    },

    inquiries: {
        list: () => request<Inquiry[]>('/inquiries'),
        submit: (input: Pick<Inquiry, 'name' | 'email' | 'message'> & Partial<Pick<Inquiry, 'phone' | 'subject'>>) =>
            request<Inquiry>('/inquiries', jsonInit('POST', input)),
        markRead: (id: string, read: boolean) =>
            request<Inquiry>(`/inquiries/${encodeURIComponent(id)}`, jsonInit('PATCH', { read })),
        remove: (id: string) => request<null>(`/inquiries/${encodeURIComponent(id)}`, { method: 'DELETE' }),
    },
};

export type { Course, CourseCatalog };
