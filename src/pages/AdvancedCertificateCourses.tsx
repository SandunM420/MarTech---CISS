import { Link } from 'react-router-dom';

const courses = [
    { title: 'Advanced Certificate in Psychology', id: 'ACP' },
    { title: 'Advanced Certificate in Child Psychology', id: 'ACCP' },
    { title: 'Advanced Certificate in Geriatric Psychology', id: 'ACGP' },
    { title: 'Advanced Certificate in Human Resource Management', id: 'ACHRM' },
    { title: 'Advanced Certificate in Marketing Management', id: 'ACMM' },
    { title: 'Advanced Certificate in Basic Life Support', id: 'ACBLC' },
];

export default function AdvancedCertificateCourses() {
    return (
        <>
            <section className="page-header" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(/images/advanced-certificate-header-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="container">
                    <h1>Advanced Certificate Courses</h1>
                    <p>Elevate your expertise with our comprehensive full-time programs.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div className="course-cards-grid">
                        {courses.map((course) => (
                            <div key={course.id} className="course-card">
                                <h3 className="course-card-title">
                                    {course.title}
                                    <br />
                                    <span className="course-card-id">(COURSE ID: {course.id})</span>
                                </h3>
                                <ul className="course-card-list">
                                    <li><strong>Level:</strong> Advanced Certificate Programme</li>
                                    <li><strong>Method:</strong> Full Time</li>
                                    <li><strong>Medium:</strong> English & Sinhala</li>
                                    <li><strong>Duration:</strong> 03 Months</li>
                                    <li className="spaced">
                                        <strong>Entry Requirements:</strong>
                                        <ul className="nested-list">
                                            <li>G.C.E. A/L - 03 Passes, OR</li>
                                            <li>G.C.E. O/L six passes plus one year working experience OR</li>
                                            <li>Students following any other professional qualification.</li>
                                        </ul>
                                    </li>
                                    <li className="spaced">
                                        <strong>Course Structure and Modules:</strong><br />
                                        <span className="muted">For further details, contact us. +94702 88 99 00</span>
                                    </li>
                                    <li className="spaced">
                                        <strong>Programme Fees & Investment:</strong><br />
                                        <span className="muted">LOCAL PARTICIPANT COURSE FEE - LKR 30,000 (payable in 3 installments)</span>
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="course-cta-card">
                        <h3 style={{ marginBottom: '1rem' }}>Ready to Take the Next Step?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Contact us for more information on admissions, modules, and schedules.</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
