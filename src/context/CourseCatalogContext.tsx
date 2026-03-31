import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  initialCourseCatalog,
  type Course,
  type CourseCatalog,
  type CourseCategory,
} from '../data/courseCatalog';

type CourseCatalogContextValue = {
  catalog: CourseCatalog;
  addCourse: (category: CourseCategory, course: Course) => void;
  updateCourse: (category: CourseCategory, courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (category: CourseCategory, courseId: string) => void;
  toggleHidden: (category: CourseCategory, courseId: string) => void;
};

const COURSE_CATALOG_STORAGE_KEY = 'course-catalog';

const CourseCatalogContext = createContext<CourseCatalogContextValue | undefined>(undefined);

function loadStoredCatalog() {
  const storedCatalog = window.localStorage.getItem(COURSE_CATALOG_STORAGE_KEY);

  if (!storedCatalog) {
    return initialCourseCatalog;
  }

  try {
    return JSON.parse(storedCatalog) as CourseCatalog;
  } catch {
    window.localStorage.removeItem(COURSE_CATALOG_STORAGE_KEY);
    return initialCourseCatalog;
  }
}

function persistCatalog(nextCatalog: CourseCatalog) {
  window.localStorage.setItem(COURSE_CATALOG_STORAGE_KEY, JSON.stringify(nextCatalog));
  return nextCatalog;
}

export function CourseCatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<CourseCatalog>(() => loadStoredCatalog());

  const value = useMemo<CourseCatalogContextValue>(
    () => ({
      catalog,
      addCourse: (category, course) => {
        setCatalog((currentCatalog) =>
          persistCatalog({
            ...currentCatalog,
            [category]: [...currentCatalog[category], course],
          }),
        );
      },
      updateCourse: (category, courseId, updates) => {
        setCatalog((currentCatalog) =>
          persistCatalog({
            ...currentCatalog,
            [category]: currentCatalog[category].map((course) =>
              course.id === courseId ? { ...course, ...updates } : course,
            ),
          }),
        );
      },
      deleteCourse: (category, courseId) => {
        setCatalog((currentCatalog) =>
          persistCatalog({
            ...currentCatalog,
            [category]: currentCatalog[category].filter((course) => course.id !== courseId),
          }),
        );
      },
      toggleHidden: (category, courseId) => {
        setCatalog((currentCatalog) =>
          persistCatalog({
            ...currentCatalog,
            [category]: currentCatalog[category].map((course) =>
              course.id === courseId ? { ...course, hidden: !course.hidden } : course,
            ),
          }),
        );
      },
    }),
    [catalog],
  );

  return <CourseCatalogContext.Provider value={value}>{children}</CourseCatalogContext.Provider>;
}

export function useCourseCatalog() {
  const context = useContext(CourseCatalogContext);

  if (!context) {
    throw new Error('useCourseCatalog must be used within a CourseCatalogProvider');
  }

  return context;
}
