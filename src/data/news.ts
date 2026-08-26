export type NewsStatus = 'draft' | 'published';

export type NewsItem = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    cover: string;
    author: string;
    date: string;
    status: NewsStatus;
    hidden: boolean;
};

export const defaultNews: NewsItem[] = [];

export function formatNewsDate(value: string) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export function slugifyNewsTitle(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90);
}

export function createEmptyNews(): NewsItem {
    return {
        id: `news-${Date.now()}`,
        title: '',
        slug: '',
        excerpt: '',
        body: '',
        cover: '',
        author: 'CISS Admin',
        date: new Date().toISOString().slice(0, 10),
        status: 'draft',
        hidden: false,
    };
}
