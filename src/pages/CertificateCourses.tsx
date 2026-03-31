import { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollTopButton from '../components/ScrollTopButton';
import CourseEditorModal from '../components/CourseEditorModal';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useCourseCatalog } from '../context/CourseCatalogContext';
import { createEmptyCourse, type Course } from '../data/courseCatalog';
import { assetUrl } from '../utils/assets';

export default function CertificateCourses() {
    const { isAuthenticated } = useAdminAuth();
    const { catalog, addCourse, updateCourse, deleteCourse, toggleHidden } = useCourseCatalog();
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
    const [addingCourse, setAddingCourse] = useState<Course | null>(null);
    const courses = isAuthenticated
        ? catalog.certificate
        : catalog.certificate.filter((course) => !course.hidden);
    const editingCourse = catalog.certificate.find((course) => course.id === editingCourseId) || null;

    return (
        <>
            <section className="page-header" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${assetUrl('images/certificate-header-bg-2.jpg')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="container">
                    <h1>Certificate Courses</h1>
                    <p>Advance your career with our specialized programs.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div className="certificate-page-shell">
                        <div className="section-heading certificate-heading">
                            <h2>Available Courses</h2>
                        </div>

                        {courses.length ? (
                            <div className="certificate-course-grid">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className={`certificate-course-card ${course.hidden ? 'course-card-hidden' : ''}`}
                                    >
                                        <div className="certificate-course-icon">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <div className="certificate-course-copy">
                                            {course.hidden ? <span className="course-visibility-badge">Hidden</span> : null}
                                            <p>{course.title}</p>
                                        </div>

                                        {isAuthenticated ? (
                                            <div className="course-admin-actions course-admin-actions-inline">
                                                <button type="button" className="btn course-admin-btn" onClick={() => setEditingCourseId(course.id)}>
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn course-admin-btn course-admin-btn-danger"
                                                    onClick={() => {
                                                        if (window.confirm(`Delete "${course.title}"?`)) {
                                                            deleteCourse('certificate', course.id);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn course-admin-btn course-admin-btn-secondary"
                                                    onClick={() => toggleHidden('certificate', course.id)}
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

                        <div className="course-info-callout">
                            <div className="course-info-icon"><i className="fas fa-circle-info"></i></div>
                            <h3>Need more information?</h3>
                            <p>Contact us for details regarding admission, deadlines, and requirements.</p>
                            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>

            {editingCourse ? (
                <CourseEditorModal
                    course={editingCourse}
                    onClose={() => setEditingCourseId(null)}
                    onSave={(updates) => updateCourse('certificate', editingCourse.id, updates)}
                />
            ) : null}

            {addingCourse ? (
                <CourseEditorModal
                    course={addingCourse}
                    mode="add"
                    onClose={() => setAddingCourse(null)}
                    onSave={(updates) => addCourse('certificate', { ...addingCourse, ...updates } as Course)}
                />
            ) : null}

            {isAuthenticated ? (
                <button
                    type="button"
                    className="floating-add-course-button"
                    aria-label="Add course"
                    onClick={() => setAddingCourse(createEmptyCourse('certificate'))}
                >
                    <i className="fas fa-plus"></i>
                </button>
            ) : null}

            <ScrollTopButton />
        </>
    );
}
