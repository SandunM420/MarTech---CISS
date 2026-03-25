import { Link } from 'react-router-dom';

const courses = [
    "Diploma in Psychology",
    "Diploma in Psychological Counselling",
    "Diploma in Education",
    "Diploma in Business Management",
    "Diploma in Accounting",
    "Diploma in Child Care Center Management",
    "Diploma in Early Childhood Development Education",
    "Diploma in Event Management",
    "Diploma in Fashion Design Technology",
    "Diploma in Hospitality Management",
    "Diploma in Human Resource Management",
    "Diploma in Marketing Management",
    "Diploma in Nursing",
    "Diploma in Teaching English as a Second Language"
];

export default function Diplomas() {
    return (
        <>
            <section className="page-header">
                <div className="container">
                    <h1>Diploma Programs</h1>
                    <p>Achieve professional excellence with our comprehensive Diploma courses.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    
                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginBottom: '4rem' }}>
                        {courses.map((course, index) => (
                            <div key={index} style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--primary-blue)' }}>
                                <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1.25rem', fontSize: '1.2rem', lineHeight: '1.4' }}>
                                    {course}
                                </h3>
                                <ul style={{ listStyleType: 'none', padding: 0, fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: '1.6' }}>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Level:</strong> NVQ Level 5/6 Certificate Programme</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Method:</strong> Full Time/ Part Time</li>
                                    <li style={{ marginBottom: '0.5rem' }}><strong>Medium:</strong> English & Sinhala</li>
                                    <li style={{ marginBottom: '0.5rem' }}>
                                        <strong>Duration:</strong><br />
                                        <span style={{ color: 'var(--text-light)' }}>For further details, contact us. +947 02 88 99 00</span>
                                    </li>
                                    <li style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
                                        <strong>Entry Requirements:</strong>
                                        <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '0.25rem', color: 'var(--text-light)' }}>
                                            <li>GCE (A/L) Examination in three (3) subjects OR</li>
                                            <li>Foundation Program equivalent to the GCE (A/L) OR</li>
                                            <li>GCE (O/L) Examination with accredited work experience or accredited prior learning followed by a relevant programme of study equivalent to a minimum of 30 credits OR</li>
                                            <li>Demonstrated competence in the relevant field and potential for future career development OR</li>
                                            <li>Completion of NVQ Level 4 or equivalent qualifications OR</li>
                                            <li>A good working knowledge of the language of instruction of the Diploma program.</li>
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
                        <h3 style={{ marginBottom: '1rem' }}>Ready to Advance Your Career?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Contact us today to learn more about admissions, modules, and schedules for our diploma programs.</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
                    </div>

                </div>
            </section>
        </>
    );
}
