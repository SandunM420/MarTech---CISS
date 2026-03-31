import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollTopButton from '../components/ScrollTopButton';
import CourseEditorModal from '../components/CourseEditorModal';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCourseCatalog } from '../context/CourseCatalogContext';
import { createEmptyCourse, type Course, type DetailedCourse } from '../data/courseCatalog';
import { assetUrl } from '../utils/assets';

export default function NVQCourses() {
    const { isAuthenticated } = useAdminAuth();
    const { catalog, addCourse, updateCourse, deleteCourse, toggleHidden } = useCourseCatalog();
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
    const [addingCourse, setAddingCourse] = useState<Course | null>(null);
    const courses = (isAuthenticated ? catalog.nvq : catalog.nvq.filter((course) => !course.hidden)) as DetailedCourse[];
    const editingCourse = (catalog.nvq.find((course) => course.id === editingCourseId) || null) as DetailedCourse | null;

    return (
        <>
            <section
                className="page-header nvq-hero"
                style={{ backgroundImage: `url(${assetUrl('images/nvq-hero.jpg')})` }}
            >
                <div className="container">
                    <h1>NVQ Level Courses</h1>
                    <p>Build your practical skills with our Nationally Vocational Qualification programs.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    {courses.length ? (
                        <div className="course-cards-grid">
                            {courses.map((course) => (
                                <div key={course.id} className={`course-card ${course.hidden ? 'course-card-hidden' : ''}`}>
                                    {course.hidden ? <span className="course-visibility-badge">Hidden</span> : null}
                                    <h3 className="course-card-title">{course.title}</h3>
                                    <ul className="course-card-list">
                                        <li><strong>Level:</strong> {course.level}</li>
                                        <li><strong>Method:</strong> {course.method}</li>
                                        <li><strong>Medium:</strong> {course.medium}</li>
                                        <li>
                                            <strong>Duration:</strong><br />
                                            <span className="muted">{course.duration}</span>
                                        </li>
                                        <li className="spaced">
                                            <strong>Entry Requirements:</strong>
                                            <ul className="nested-list">
                                                {course.entryRequirements.map((item: string) => <li key={item}>{item}</li>)}
                                            </ul>
                                        </li>
                                        <li className="spaced">
                                            <strong>Course Structure and Modules:</strong><br />
                                            <span className="muted">{course.modulesInfo}</span>
                                        </li>
                                        <li className="spaced">
                                            <strong>Programme Fees & Investment:</strong><br />
                                            <span className="muted">{course.feesInfo}</span>
                                        </li>
                                    </ul>

                                    {isAuthenticated ? (
                                        <div className="course-admin-actions">
                                            <button type="button" className="btn course-admin-btn" onClick={() => setEditingCourseId(course.id)}>
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn course-admin-btn course-admin-btn-danger"
                                                onClick={() => {
                                                    if (window.confirm(`Delete "${course.title}"?`)) {
                                                        deleteCourse('nvq', course.id);
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                type="button"
                                                className="btn course-admin-btn course-admin-btn-secondary"
                                                onClick={() => toggleHidden('nvq', course.id)}
                                            >
                                                {course.hidden ? 'Unhide' : 'Hide'}
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="course-empty-state">No courses are currently visible in this section.</p>
                    )}

                    <div className="course-cta-card">
                        <h3 style={{ marginBottom: '1rem' }}>Ready to Take the Next Step?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Contact us for more information on admissions, modules, and schedules.</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
                    </div>
                </div>
            </section>

            {editingCourse ? (
                <CourseEditorModal
                    course={editingCourse}
                    onClose={() => setEditingCourseId(null)}
                    onSave={(updates) => updateCourse('nvq', editingCourse.id, updates)}
                />
            ) : null}

            {addingCourse ? (
                <CourseEditorModal
                    course={addingCourse}
                    mode="add"
                    onClose={() => setAddingCourse(null)}
                    onSave={(updates) => addCourse('nvq', { ...addingCourse, ...updates } as Course)}
                />
            ) : null}

            {isAuthenticated ? (
                <button
                    type="button"
                    className="floating-add-course-button"
                    aria-label="Add course"
                    onClick={() => setAddingCourse(createEmptyCourse('nvq'))}
                >
                    <i className="fas fa-plus"></i>
                </button>
            ) : null}

            <ScrollTopButton />
        </>
    );
}
