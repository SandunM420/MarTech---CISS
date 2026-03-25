import { Link } from 'react-router-dom';

const courses = [
    { title: "NVQ Level 3 – Child Care & Therapy Assistant (Special Needs)", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Caregiver", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Child Caregiver", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Child Care Center Operations", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Early Childhood Development Centre Assistant", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 2 – Health Care and Supportive Assistant", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 4 – Nurse Assistant", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Human Resources Associate", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Mental Health Care Assistant", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Hairdresser", level: "NVQ Level 3 Certificate Programme" },
    { title: "NVQ Level 3 – Beautician", level: "NVQ Level 3 Certificate Programme" }
];

export default function NVQCourses() {
    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>NVQ Level Courses</h1>
                    <p>Build your practical skills with our Nationally Vocational Qualification programs.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    
                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginBottom: '4rem' }}>
                        {courses.map((course, index) => (
                            <div key={index} style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--primary-blue)' }}>
                                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1.25rem', fontSize: '1.2rem', lineHeight: '1.4' }}>
                                    {course.title}
                                </h3>
                                <ul style={{ listStyleType: 'none', padding: 0, fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Level:</strong> {course.level}</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Method:</strong> Full Time/ Part Time</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Medium:</strong> English & Sinhala</li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        <strong>Duration:</strong><br />
                                        <span style={{ color: 'var(--text-light)' }}>For further details, contact us. +947 02 88 99 00</span>
                                    </li>
                                    <li style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
                                        <strong>Entry Requirements:</strong>
                                        <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                            <li>G.C.E. O/L OR</li>
                                            <li>Completion of NVQ Level 2 or equivalent qualifications.</li>
                                        </ul>
                                    </li>
                                    <li style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
                                        <strong>Course Structure and Modules:</strong><br />
                                        <span style={{ color: 'var(--text-light)' }}>For further details, contact us. +947 02 88 99 00</span>
                                    </li>
                                    <li style={{ marginTop: '1rem' }}>
                                        <strong>Programme Fees & Investment:</strong><br />
                                        <span style={{ color: 'var(--text-light)' }}>For further details, contact us. +947 02 88 99 00<br/>(Payable in 3 installments)</span>
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
