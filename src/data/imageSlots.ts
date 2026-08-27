import { assetUrl } from '../utils/assets';

/**
 * Every image on the public site, addressed by a stable key.
 *
 * A slot is a named position in a layout, not a free-for-all upload target.
 * The admin replaces what fills a slot; it cannot invent new ones. That keeps
 * the page structure intact - nobody can drop a portrait photo into a wide hero
 * band and break the band - and it gives the media picker something concrete to
 * validate uploaded dimensions against.
 *
 * `fallback` is the file currently bundled in public/images. It is what renders
 * until an admin uploads a replacement, and what renders if the API is ever
 * unreachable, so the site never comes up image-less.
 */

export type ImageSlotDefinition = {
    key: string;
    label: string;
    group: string;
    /** Bundled image used when no upload has replaced it. */
    fallback: string;
    /** What fits this position. Shown in the admin as guidance. */
    width: number;
    height: number;
    note: string;
};

export const imageSlots: ImageSlotDefinition[] = [
    {
        key: 'header.logo',
        label: 'Site logo',
        group: 'Branding',
        fallback: 'images/logo.png',
        width: 800,
        height: 240,
        note: 'Appears in the header and on the admin sign-in screen. Transparent PNG.',
    },
    {
        key: 'home.hero',
        label: 'Home hero background',
        group: 'Home',
        fallback: 'images/home-hero.jpg',
        width: 1920,
        height: 800,
        note: 'Full-width band behind the headline. Keep the subject central - the edges crop on mobile.',
    },
    {
        key: 'home.programs',
        label: 'Academic programs image',
        group: 'Home',
        fallback: 'images/programs.png',
        width: 1200,
        height: 900,
        note: 'Sits beside the Academic Programs copy.',
    },
    {
        key: 'about.hero',
        label: 'About hero background',
        group: 'About',
        fallback: 'images/about-hero.jpg',
        width: 1920,
        height: 800,
        note: 'Full-width band at the top of the About page.',
    },
    {
        key: 'about.values-side',
        label: 'Values section image',
        group: 'About',
        fallback: 'images/values-side.jpg',
        width: 1200,
        height: 900,
        note: 'Sits beside the values list.',
    },
    {
        key: 'certificate.header',
        label: 'Certificate Courses header',
        group: 'Course pages',
        fallback: 'images/certificate-header-bg-2.jpg',
        width: 1600,
        height: 600,
        note: 'Header strip behind a dark overlay, so detail is mostly lost - pick for tone, not detail.',
    },
    {
        key: 'advanced-certificate.header',
        label: 'Advanced Certificate header',
        group: 'Course pages',
        fallback: 'images/advanced-certificate-header-bg.jpg',
        width: 1600,
        height: 600,
        note: 'Header strip behind a dark overlay.',
    },
    {
        key: 'nvq.header',
        label: 'NVQ Courses header',
        group: 'Course pages',
        fallback: 'images/nvq-hero.jpg',
        width: 1600,
        height: 600,
        note: 'Header strip behind a dark overlay.',
    },
    {
        key: 'diplomas.header',
        label: 'Diplomas header',
        group: 'Course pages',
        fallback: 'images/diplomas-hero.jpg',
        width: 1600,
        height: 600,
        note: 'Header strip behind a dark overlay.',
    },
    {
        key: 'vcare.hero',
        label: 'V-Care hero background',
        group: 'Other pages',
        fallback: 'images/vcare-hero.jpg',
        width: 1920,
        height: 800,
        note: 'Full-width band at the top of the V-Care page.',
    },
    {
        key: 'elevate.header',
        label: 'Elevate header',
        group: 'Other pages',
        // Elevate currently reuses the certificate image. Giving it its own
        // slot means the two can diverge without touching code.
        fallback: 'images/certificate-header-bg-2.jpg',
        width: 1600,
        height: 600,
        note: 'Header strip behind a dark overlay. Currently shares the Certificate image.',
    },
    {
        key: 'contact.hero',
        label: 'Contact hero background',
        group: 'Other pages',
        fallback: 'images/contact-hero.jpg',
        width: 1920,
        height: 800,
        note: 'Full-width band at the top of the Contact page.',
    },
];

export const imageSlotsByKey: Record<string, ImageSlotDefinition> = Object.fromEntries(
    imageSlots.map((slot) => [slot.key, slot]),
);

/** Slot keys grouped for display, preserving the order declared above. */
export function groupedImageSlots(): { group: string; slots: ImageSlotDefinition[] }[] {
    const groups: { group: string; slots: ImageSlotDefinition[] }[] = [];

    for (const slot of imageSlots) {
        const existing = groups.find((entry) => entry.group === slot.group);

        if (existing) {
            existing.slots.push(slot);
            continue;
        }

        groups.push({ group: slot.group, slots: [slot] });
    }

    return groups;
}

/**
 * Resolves a slot to a URL. Uploaded images are absolute paths from the API;
 * fallbacks are bundled assets and need the base-URL prefix.
 */
export function resolveSlot(key: string, overrides: Record<string, string> | null | undefined): string {
    const override = overrides?.[key];

    if (override && override.trim() !== '') {
        return override;
    }

    const definition = imageSlotsByKey[key];

    return definition ? assetUrl(definition.fallback) : '';
}
