import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCourseCatalog, type SaveResult } from '../../context/CourseCatalogContext';
import {
    createEmptyCourse,
    type Course,
    type CourseCategory,
    type DetailedCourse,
} from '../../data/courseCatalog';
import { Card, EmptyState, Field, PageHeader, StatusMessage, Toggle, type Status } from '../components/AdminUI';
import RichTextEditor from '../components/RichTextEditor';
import { htmlToRequirements, requirementsToHtml } from '../richText';

const categories: { key: CourseCategory; label: string; route: string; variant: 'simple' | 'detailed' }[] = [
    { key: 'certificate', label: 'Certificate Courses', route: '/certificate-courses', variant: 'simple' },
    {
        key: 'advanced-certificate',
        label: 'Advanced Certificate Courses',
        route: '/advanced-certificate-courses',
        variant: 'detailed',
    },
    { key: 'nvq', label: 'NVQ Courses', route: '/nvq-courses', variant: 'detailed' },
    { key: 'diploma', label: 'Diplomas', route: '/diplomas', variant: 'detailed' },
];

function isCategory(value: string | undefined): value is CourseCategory {
    return categories.some((entry) => entry.key === value);
}

export default function AdminCourses() {
    const { category } = useParams();
    const active = isCategory(category) ? category : null;

    return active ? <CategoryEditor category={active} /> : <CategoryIndex />;
}

/** Landing view: one card per course page. */
function CategoryIndex() {
    const { catalog, loading } = useCourseCatalog();

    return (
        <>
            <PageHeader
                crumb="Content"
                title="Courses"
                description="Each card is one page on the site. Open a page to add, edit, reorder or hide the courses it lists."
            />

            {loading ? (
                <EmptyState icon="fas fa-spinner">Loading the catalog…</EmptyState>
            ) : (
                <div className="admin-grid admin-grid--cards">
                    {categories.map((entry) => {
                        const list = catalog[entry.key] ?? [];
                        const hidden = list.filter((course) => course.hidden).length;

                        return (
                            <Link key={entry.key} to={`/admin/courses/${entry.key}`} className="admin-course-card">
                                <div className="admin-course-card-body">
                                    <h2>{entry.label}</h2>
                                    <p className="admin-course-card-route">{entry.route}</p>
                                    <div className="admin-pill-row">
                                        <span className="admin-pill">
                                            {list.length} course{list.length === 1 ? '' : 's'}
                                        </span>
                                        <span className={`admin-pill${hidden ? ' admin-pill--warn' : ''}`}>
                                            {hidden ? `${hidden} hidden` : 'all visible'}
                                        </span>
                                    </div>
                                    <p className="admin-course-card-variant">
                                        {entry.variant === 'simple'
                                            ? 'Title-only list'
                                            : 'Full detail cards'}
                                    </p>
                                </div>
                                <i className="fas fa-chevron-right" aria-hidden="true" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </>
    );
}

function CategoryEditor({ category }: { category: CourseCategory }) {
    const { catalog, addCourse, updateCourse, deleteCourse, toggleHidden, moveCourse } = useCourseCatalog();
    const meta = categories.find((entry) => entry.key === category)!;
    const list = catalog[category];

    const [editing, setEditing] = useState<Course | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [status, setStatus] = useState<Status>(null);
    const [busy, setBusy] = useState(false);
    const [query, setQuery] = useState('');

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (!needle) {
            return list;
        }

        return list.filter((course) => course.title.toLowerCase().includes(needle));
    }, [list, query]);

    /** Every mutation funnels through here so status handling is consistent. */
    const run = async (action: () => Promise<SaveResult>, successMessage: string) => {
        setBusy(true);
        const result = await action();
        setBusy(false);

        if (result.ok) {
            setStatus({ tone: 'success', message: successMessage });
            return true;
        }

        setStatus({
            tone: 'error',
            message: result.conflict
                ? 'Someone else saved changes since this page loaded. Reload before saving again.'
                : result.error,
        });

        return false;
    };

    const handleDelete = async (course: Course) => {
        if (!window.confirm(`Delete "${course.title || 'Untitled course'}"? This cannot be undone.`)) {
            return;
        }

        await run(() => deleteCourse(category, course.id), 'Course deleted.');
    };

    const startNew = () => {
        setEditing(createEmptyCourse(category));
        setIsNew(true);
        setStatus(null);
    };

    const handleSave = async (course: Course) => {
        if (!course.title.trim()) {
            setStatus({ tone: 'error', message: 'A course needs a title.' });
            return;
        }

        const saved = isNew
            ? await run(() => addCourse(category, course), 'Course added.')
            : await run(() => updateCourse(category, course.id, course), 'Course saved.');

        if (saved) {
            setEditing(null);
            setIsNew(false);
        }
    };

    if (editing) {
        return (
            <CourseForm
                course={editing}
                isNew={isNew}
                categoryLabel={meta.label}
                busy={busy}
                status={status}
                onChange={setEditing}
                onCancel={() => {
                    setEditing(null);
                    setIsNew(false);
                    setStatus(null);
                }}
                onSave={handleSave}
            />
        );
    }

    return (
        <>
            <PageHeader
                crumb="Courses"
                title={meta.label}
                description={`Shown on ${meta.route}. Hidden courses stay listed here but are removed from the public page.`}
                actions={
                    <>
                        <Link to="/admin/courses" className="admin-button admin-button--ghost">
                            <i className="fas fa-chevron-left" aria-hidden="true" /> All pages
                        </Link>
                        <button type="button" className="admin-button admin-button--primary" onClick={startNew}>
                            <i className="fas fa-plus" aria-hidden="true" /> Add course
                        </button>
                    </>
                }
            />

            <StatusMessage status={status} />

            {list.length > 6 ? (
                <div className="admin-search">
                    <i className="fas fa-magnifying-glass" aria-hidden="true" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={`Search ${list.length} courses…`}
                    />
                </div>
            ) : null}

            {visible.length === 0 ? (
                <EmptyState icon="fas fa-graduation-cap">
                    {list.length === 0 ? 'No courses on this page yet.' : 'No courses match that search.'}
                </EmptyState>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-col-index">#</th>
                                <th>Course</th>
                                {meta.variant === 'detailed' ? <th>Level</th> : null}
                                <th className="admin-col-status">On site</th>
                                <th className="admin-col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((course) => {
                                const index = list.indexOf(course);
                                const detailed = course.variant === 'detailed' ? (course as DetailedCourse) : null;

                                return (
                                    <tr key={course.id} className={course.hidden ? 'admin-row--hidden' : undefined}>
                                        <td className="admin-col-index">{index + 1}</td>
                                        <td>
                                            <p className="admin-cell-title">{course.title || 'Untitled course'}</p>
                                            <p className="admin-cell-sub">
                                                {detailed?.courseId
                                                    ? `COURSE ID: ${detailed.courseId}`
                                                    : course.id}
                                            </p>
                                        </td>
                                        {meta.variant === 'detailed' ? (
                                            <td>
                                                <p className="admin-cell-meta">{detailed?.level || '—'}</p>
                                                <p className="admin-cell-sub">{detailed?.duration || ''}</p>
                                            </td>
                                        ) : null}
                                        <td className="admin-col-status">
                                            <span
                                                className={`admin-pill${course.hidden ? ' admin-pill--warn' : ' admin-pill--ok'}`}
                                            >
                                                {course.hidden ? 'Hidden' : 'Visible'}
                                            </span>
                                        </td>
                                        <td className="admin-col-actions">
                                            <div className="admin-row-actions">
                                                <button
                                                    type="button"
                                                    className="admin-icon-button"
                                                    title="Move up"
                                                    disabled={busy || index === 0}
                                                    onClick={() =>
                                                        run(() => moveCourse(category, course.id, -1), 'Order updated.')
                                                    }
                                                >
                                                    <i className="fas fa-arrow-up" aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="admin-icon-button"
                                                    title="Move down"
                                                    disabled={busy || index === list.length - 1}
                                                    onClick={() =>
                                                        run(() => moveCourse(category, course.id, 1), 'Order updated.')
                                                    }
                                                >
                                                    <i className="fas fa-arrow-down" aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="admin-icon-button"
                                                    title={course.hidden ? 'Show on site' : 'Hide from site'}
                                                    disabled={busy}
                                                    onClick={() =>
                                                        run(
                                                            () => toggleHidden(category, course.id),
                                                            course.hidden
                                                                ? 'Course is now visible.'
                                                                : 'Course hidden from the site.',
                                                        )
                                                    }
                                                >
                                                    <i
                                                        className={course.hidden ? 'fas fa-eye' : 'fas fa-eye-slash'}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="admin-icon-button admin-icon-button--primary"
                                                    title="Edit"
                                                    disabled={busy}
                                                    onClick={() => {
                                                        setEditing({ ...course });
                                                        setIsNew(false);
                                                        setStatus(null);
                                                    }}
                                                >
                                                    <i className="fas fa-pen" aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="admin-icon-button admin-icon-button--danger"
                                                    title="Delete"
                                                    disabled={busy}
                                                    onClick={() => handleDelete(course)}
                                                >
                                                    <i className="fas fa-trash" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

function CourseForm({
    course,
    isNew,
    categoryLabel,
    busy,
    status,
    onChange,
    onCancel,
    onSave,
}: {
    course: Course;
    isNew: boolean;
    categoryLabel: string;
    busy: boolean;
    status: Status;
    onChange: (next: Course) => void;
    onCancel: () => void;
    onSave: (course: Course) => void;
}) {
    const detailed = course.variant === 'detailed' ? (course as DetailedCourse) : null;

    const set = <K extends keyof DetailedCourse>(key: K, value: DetailedCourse[K]) => {
        onChange({ ...course, [key]: value } as Course);
    };

    return (
        <>
            <PageHeader
                crumb={categoryLabel}
                title={isNew ? 'New course' : 'Edit course'}
                actions={
                    <>
                        <button type="button" className="admin-button admin-button--ghost" onClick={onCancel}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="admin-button admin-button--primary"
                            disabled={busy}
                            onClick={() => onSave(course)}
                        >
                            <i className="fas fa-check" aria-hidden="true" /> {busy ? 'Saving…' : 'Save course'}
                        </button>
                    </>
                }
            />

            <StatusMessage status={status} />

            <Card>
                <Field label="Course title">
                    <input
                        type="text"
                        value={course.title}
                        onChange={(event) => onChange({ ...course, title: event.target.value })}
                        placeholder="Diploma in Psychology"
                    />
                </Field>

                {detailed ? (
                    <>
                        <div className="admin-field-row">
                            <Field label="Course ID" help="Shown under the title. Leave blank to hide it.">
                                <input
                                    type="text"
                                    value={detailed.courseId ?? ''}
                                    onChange={(event) => set('courseId', event.target.value)}
                                    placeholder="ACP"
                                />
                            </Field>
                            <Field label="Level">
                                <input
                                    type="text"
                                    value={detailed.level}
                                    onChange={(event) => set('level', event.target.value)}
                                />
                            </Field>
                        </div>

                        <div className="admin-field-row">
                            <Field label="Method">
                                <input
                                    type="text"
                                    value={detailed.method}
                                    onChange={(event) => set('method', event.target.value)}
                                    placeholder="Full Time"
                                />
                            </Field>
                            <Field label="Medium">
                                <input
                                    type="text"
                                    value={detailed.medium}
                                    onChange={(event) => set('medium', event.target.value)}
                                    placeholder="English & Sinhala"
                                />
                            </Field>
                            <Field label="Duration">
                                <input
                                    type="text"
                                    value={detailed.duration}
                                    onChange={(event) => set('duration', event.target.value)}
                                    placeholder="03 Months"
                                />
                            </Field>
                        </div>

                        <Field
                            label="Entry requirements"
                            help="Keep each requirement as a bullet. You can format text and add links within each item."
                        >
                            <RichTextEditor
                                ariaLabel="Entry requirements"
                                minHeight={180}
                                value={requirementsToHtml(detailed.entryRequirements)}
                                onChange={(html) => set('entryRequirements', htmlToRequirements(html))}
                            />
                        </Field>

                        <Field label="Course structure and modules">
                            <RichTextEditor
                                ariaLabel="Course structure and modules"
                                value={detailed.modulesInfo}
                                onChange={(html) => set('modulesInfo', html)}
                            />
                        </Field>

                        <Field label="Programme fees">
                            <RichTextEditor
                                ariaLabel="Programme fees"
                                value={detailed.feesInfo}
                                onChange={(html) => set('feesInfo', html)}
                            />
                        </Field>
                    </>
                ) : null}

                <div className="admin-field admin-field--inline">
                    <div>
                        <span className="admin-field-label">Hide from the public site</span>
                        <span className="admin-field-help">
                            Hidden courses stay in this list but are removed from the live page.
                        </span>
                    </div>
                    <Toggle
                        checked={course.hidden}
                        onChange={(next) => onChange({ ...course, hidden: next })}
                        label="Hide from the public site"
                    />
                </div>
            </Card>
        </>
    );
}
