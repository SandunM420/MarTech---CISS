/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { api, ApiError } from '../lib/api';
import { useSiteContent } from './SiteContentContext';
import type { Course, CourseCatalog, CourseCategory } from '../data/courseCatalog';

/**
 * Course catalog access for the app.
 *
 * Reads come from SiteContentContext, which has already loaded the catalog from
 * the API (or fallen back to the bundled default). Writes go to the server and
 * only update local state once the save has been accepted - so what the editor
 * sees always matches what visitors will get.
 *
 * The previous implementation wrote to localStorage. That looked like it worked,
 * but the edits only existed in the editing browser: visitors kept seeing the
 * bundled catalog, and clearing site data discarded everything.
 */

export type SaveResult = { ok: true } | { ok: false; error: string; conflict: boolean };

type CourseCatalogContextValue = {
    catalog: CourseCatalog;
    /** True while the initial content load is in flight. */
    loading: boolean;
    saveCatalog: (next: CourseCatalog) => Promise<SaveResult>;
    addCourse: (category: CourseCategory, course: Course) => Promise<SaveResult>;
    updateCourse: (category: CourseCategory, courseId: string, updates: Partial<Course>) => Promise<SaveResult>;
    deleteCourse: (category: CourseCategory, courseId: string) => Promise<SaveResult>;
    toggleHidden: (category: CourseCategory, courseId: string) => Promise<SaveResult>;
    moveCourse: (category: CourseCategory, courseId: string, delta: number) => Promise<SaveResult>;
};

const CourseCatalogContext = createContext<CourseCatalogContextValue | undefined>(undefined);

export function CourseCatalogProvider({ children }: { children: ReactNode }) {
    const { courses, coursesVersion, loading, applyCourses } = useSiteContent();

    const value = useMemo<CourseCatalogContextValue>(() => {
        const save = async (next: CourseCatalog): Promise<SaveResult> => {
            try {
                const envelope = await api.courses.save(next, coursesVersion);
                applyCourses(envelope.data ?? next, envelope.version);
                return { ok: true };
            } catch (error) {
                if (error instanceof ApiError) {
                    return { ok: false, error: error.message, conflict: error.isConflict };
                }

                return {
                    ok: false,
                    error: error instanceof Error ? error.message : 'Could not save.',
                    conflict: false,
                };
            }
        };

        /** Applies a change to one category and persists the whole catalog. */
        const mutate = (category: CourseCategory, change: (list: Course[]) => Course[]) =>
            save({ ...courses, [category]: change(courses[category]) });

        return {
            catalog: courses,
            loading,
            saveCatalog: save,
            addCourse: (category, course) => mutate(category, (list) => [...list, course]),
            updateCourse: (category, courseId, updates) =>
                mutate(category, (list) =>
                    list.map((course) =>
                        course.id === courseId ? ({ ...course, ...updates } as Course) : course,
                    ),
                ),
            deleteCourse: (category, courseId) =>
                mutate(category, (list) => list.filter((course) => course.id !== courseId)),
            toggleHidden: (category, courseId) =>
                mutate(category, (list) =>
                    list.map((course) =>
                        course.id === courseId ? ({ ...course, hidden: !course.hidden } as Course) : course,
                    ),
                ),
            moveCourse: (category, courseId, delta) =>
                mutate(category, (list) => {
                    const from = list.findIndex((course) => course.id === courseId);
                    const to = from + delta;

                    if (from < 0 || to < 0 || to >= list.length) {
                        return list;
                    }

                    const next = [...list];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved);

                    return next;
                }),
        };
    }, [courses, coursesVersion, loading, applyCourses]);

    return <CourseCatalogContext.Provider value={value}>{children}</CourseCatalogContext.Provider>;
}

export function useCourseCatalog() {
    const context = useContext(CourseCatalogContext);

    if (!context) {
        throw new Error('useCourseCatalog must be used within a CourseCatalogProvider');
    }

    return context;
}
