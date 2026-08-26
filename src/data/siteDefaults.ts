import type { SiteSettings, SiteText } from '../lib/api';

/**
 * Bundled defaults for editable content.
 *
 * These are what the site renders before an admin has saved anything, and what
 * it falls back to if the API is unreachable - so the public site is never
 * blank or broken because of a backend problem.
 *
 * The contact details below are deliberately a single source of truth. The same
 * phone number was previously written nine times across four files in three
 * different formats (`+947 02 88 99 00`, `+94702 88 99 00`, `+94 702 88 99 00`),
 * which meant changing it required finding every one of them.
 */

export const defaultSettings: SiteSettings = {
    siteName: 'Colombo Institute of Scientific Studies',
    tagline: 'Advancing knowledge through scientific study',
    // Digits only (plus a leading +) - this is what tel: links use.
    phone: '+94702889900',
    // How the number is written on the page.
    phoneDisplay: '+94 702 88 99 00',
    email: 'info@ciss.lk',
    address: 'No 523/3B, Madagodalanda Road, Athurugiriya, Sri Lanka.',
    facebook: '',
    linkedin: '',
    instagram: '',
    tiktok: '',
};

/**
 * Editable page copy, keyed by position.
 *
 * Only copy that genuinely turns over is listed here. Navigation labels,
 * structural headings and form labels stay in the components: making them
 * editable buys nothing and offers a way to break the layout.
 */
export const defaultText: SiteText = {
    'home.hero.title': 'Where Knowledge Meets Innovation!',
    'home.hero.subtitle': 'Empowering Minds. Advancing Science. Transforming Lives.',
    'home.mission.title': 'Nurturing Minds Through Knowledge and Compassion',
    'home.mission.body':
        'The Colombo Institute of Scientific Studies (CISS) inspires learners, researchers, and communities through high-quality education, innovative research, compassionate counseling, and wellness services. We believe in accessible, student-centered learning blended with scientific excellence.',
    'footer.blurb':
        'CISS empowers learners through education, research, wellbeing, and community-focused services designed for meaningful impact.',
};

/** Labels and help text for the admin text editor, in display order. */
export const textFieldMeta: { key: string; label: string; group: string; multiline: boolean; help?: string }[] = [
    {
        key: 'home.hero.title',
        label: 'Hero headline',
        group: 'Home page',
        multiline: false,
        help: 'The large line over the hero image. Keep it short - it wraps awkwardly on phones past about 45 characters.',
    },
    { key: 'home.hero.subtitle', label: 'Hero sub-line', group: 'Home page', multiline: false },
    { key: 'home.mission.title', label: 'Mission heading', group: 'Home page', multiline: false },
    { key: 'home.mission.body', label: 'Mission paragraph', group: 'Home page', multiline: true },
    { key: 'footer.blurb', label: 'Footer description', group: 'Footer', multiline: true },
];

/** A tel: href built from the dialable number. */
export function telHref(settings: SiteSettings): string {
    return `tel:${settings.phone.replace(/[^+\d]/g, '')}`;
}
