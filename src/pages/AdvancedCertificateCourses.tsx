import { Link } from 'react-router-dom';

const courses = [
    { title: "Advanced Certificate in Psychology", id: "ACP" },
    { title: "Advanced Certificate in Child Psychology", id: "ACCP" },
    { title: "Advanced Certificate in Geriatric Psychology", id: "ACGP" },
    { title: "Advanced Certificate in Human Resource Management", id: "ACHRM" },
    { title: "Advanced Certificate in Marketing Management", id: "ACMM" },
    { title: "Advanced Certificate in Basic Life Support", id: "ACBLC" },
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
                    
                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginBottom: '4rem' }}>
                        {courses.map((course) => (
                            <div key={course.id} style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--primary-blue)' }}>
                                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1.25rem', fontSize: '1.15rem', lineHeight: '1.4' }}>
                                    {course.title}
                                    <br />
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 'normal' }}>(COURSE ID: {course.id})</span>
                                </h3>
                                <ul style={{ listStyleType: 'none', padding: 0, fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Level:</strong> Advanced Certificate Programme</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Method:</strong> Full Time</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Medium:</strong> English & Sinhala</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Duration:</strong> 03 Months</li>
                                    <li style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
                                        <strong>Entry Requirements:</strong>
                                        <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                            <li>G.C.E. A/L – 03 Passes, OR</li>
                                            <li>G.C.E. O/L six passes plus one year working experience OR</li>
                                            <li>Students following any other professional qualification.</li>
                                        </ul>
                                    </li>
                                    <li style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
                                        <strong>Course Structure and Modules:</strong><br />
                                        <span style={{ color: 'var(--text-light)' }}>For further details, contact us. +94702 88 99 00</span>
                                    </li>
                                    <li style={{ marginTop: '1rem' }}>
                                        <strong>Programme Fees & Investment:</strong><br />
                                        <span style={{ color: 'var(--text-light)' }}>LOCAL PARTICIPANT COURSE FEE - LKR 30,000 (payable in 3 installments)</span>
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--border-radius-lg)', padding: '3rem 2rem', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Ready to Take the Next Step?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Contact us for more information on admissions, modules, and schedules.</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
                    </div>

                </div>
            </section>
        </>
    );
}
