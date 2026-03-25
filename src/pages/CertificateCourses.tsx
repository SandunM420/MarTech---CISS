import { Link } from 'react-router-dom';

export default function CertificateCourses() {
    const courses = [
        'Basics in Child Psychology',
        'Basics in Geriatric Psychology',
        'English for Professionals',
        'Dementia Care Training',
        'Basic Nursing Care',
        'Psychological First Aid',
        'First Aid',
        'Understanding AI',
    ];

    return (
        <>
            <section className="page-header" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/certificate-header-bg-2.jpg)',
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

                        <div className="certificate-course-grid">
                            {courses.map((course) => (
                                <div key={course} className="certificate-course-card">
                                    <div className="certificate-course-icon">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <p>{course}</p>
                                </div>
                            ))}
                        </div>

                        <div className="course-info-callout">
                            <div className="course-info-icon"><i className="fas fa-circle-info"></i></div>
                            <h3>Need more information?</h3>
                            <p>Contact us for details regarding admission, deadlines, and requirements.</p>
                            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
