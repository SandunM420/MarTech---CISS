/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { api, ApiError, type ImageSlots, type SiteSettings, type SiteText } from '../lib/api';
import { initialCourseCatalog, type CourseCatalog } from '../data/courseCatalog';
import { defaultSettings, defaultText } from '../data/siteDefaults';
import { resolveSlot } from '../data/imageSlots';
import { defaultNews, type NewsItem } from '../data/news';

/**
 * All editable site content, loaded once from the API.
 *
 * The defining behaviour here is that content is never *missing*. Each document
 * falls back to its bundled default when the API has nothing stored, and again
 * when the API cannot be reached at all. A backend outage degrades the site to
 * exactly what it renders today - it does not blank it.
 *
 * This replaces the previous localStorage-backed catalog, where "saved" edits
 * only ever existed in the editor's own browser and no visitor ever saw them.
 */

type DocumentState<T> = {
    value: T;
    version: number;
    /** False while the bundled default is standing in for stored data. */
    stored: boolean;
};

type SiteContentValue = {
    courses: CourseCatalog;
    coursesVersion: number;
    news: NewsItem[];
    newsVersion: number;
    settings: SiteSettings;
    settingsVersion: number;
    text: SiteText;
    textVersion: number;
    slots: ImageSlots;
    slotsVersion: number;

    /** True until the first load settles, either way. */
    loading: boolean;
    /** Set when the API could not be reached; the site is on bundled content. */
    offline: boolean;

    /** Resolve an image slot to a URL, falling back to the bundled asset. */
    image: (slotKey: string) => string;
    /** Read a text key, falling back to the bundled default. */
    copy: (key: string) => string;

    refresh: () => Promise<void>;
    applyCourses: (catalog: CourseCatalog, version: number) => void;
    applyNews: (news: NewsItem[], version: number) => void;
    applySettings: (settings: SiteSettings, version: number) => void;
    applyText: (text: SiteText, version: number) => void;
    applySlots: (slots: ImageSlots, version: number) => void;
};

const SiteContentContext = createContext<SiteContentValue | undefined>(undefined);

function initial<T>(value: T): DocumentState<T> {
    return { value, version: 0, stored: false };
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
    const [courses, setCourses] = useState<DocumentState<CourseCatalog>>(() => initial(initialCourseCatalog));
    const [news, setNews] = useState<DocumentState<NewsItem[]>>(() => initial(defaultNews));
    const [settings, setSettings] = useState<DocumentState<SiteSettings>>(() => initial(defaultSettings));
    const [text, setText] = useState<DocumentState<SiteText>>(() => initial(defaultText));
    const [slots, setSlots] = useState<DocumentState<ImageSlots>>(() => initial({}));
    const [loading, setLoading] = useState(true);
    const [offline, setOffline] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const bundle = await api.content();

            // A null `data` means nothing has been saved yet, which is the
            // normal state on a fresh install - keep the bundled default.
            setCourses(
                bundle.courses.data
                    ? { value: bundle.courses.data, version: bundle.courses.version, stored: true }
                    : { value: initialCourseCatalog, version: bundle.courses.version, stored: false },
            );

            setNews(
                bundle.news.data
                    ? { value: bundle.news.data, version: bundle.news.version, stored: true }
                    : { value: defaultNews, version: bundle.news.version, stored: false },
            );

            setSettings(
                bundle.settings.data
                    ? {
                          // Merge so a document saved before a new field existed
                          // does not leave that field undefined.
                          value: { ...defaultSettings, ...bundle.settings.data },
                          version: bundle.settings.version,
                          stored: true,
                      }
                    : { value: defaultSettings, version: bundle.settings.version, stored: false },
            );

            setText(
                bundle.text.data
                    ? { value: { ...defaultText, ...bundle.text.data }, version: bundle.text.version, stored: true }
                    : { value: defaultText, version: bundle.text.version, stored: false },
            );

            setSlots({
                value: bundle.slots.data ?? {},
                version: bundle.slots.version,
                stored: bundle.slots.data !== null,
            });

            setOffline(false);
        } catch (error) {
            // Status 0 is a network failure. Anything else means the API
            // answered, so the site is reachable but something is misconfigured;
            // either way the bundled content is the right thing to show.
            setOffline(error instanceof ApiError && error.status === 0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const value = useMemo<SiteContentValue>(
        () => ({
            courses: courses.value,
            coursesVersion: courses.version,
            news: news.value,
            newsVersion: news.version,
            settings: settings.value,
            settingsVersion: settings.version,
            text: text.value,
            textVersion: text.version,
            slots: slots.value,
            slotsVersion: slots.version,
            loading,
            offline,
            image: (slotKey: string) => resolveSlot(slotKey, slots.value),
            copy: (key: string) => text.value[key] ?? defaultText[key] ?? '',
            refresh,
            applyCourses: (catalog, version) => setCourses({ value: catalog, version, stored: true }),
            applyNews: (next, version) => setNews({ value: next, version, stored: true }),
            applySettings: (next, version) => setSettings({ value: next, version, stored: true }),
            applyText: (next, version) => setText({ value: next, version, stored: true }),
            applySlots: (next, version) => setSlots({ value: next, version, stored: true }),
        }),
        [courses, news, settings, text, slots, loading, offline, refresh],
    );

    return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
    const context = useContext(SiteContentContext);

    if (!context) {
        throw new Error('useSiteContent must be used within a SiteContentProvider');
    }

    return context;
}
