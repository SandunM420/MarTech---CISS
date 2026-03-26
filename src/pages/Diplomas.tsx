import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/assets';

const courses = [
    'Diploma in Psychology',
    'Diploma in Psychological Counselling',
    'Diploma in Education',
    'Diploma in Business Management',
    'Diploma in Accounting',
    'Diploma in Child Care Center Management',
    'Diploma in Early Childhood Development Education',
    'Diploma in Event Management',
    'Diploma in Fashion Design Technology',
    'Diploma in Hospitality Management',
    'Diploma in Human Resource Management',
    'Diploma in Marketing Management',
    'Diploma in Nursing',
    'Diploma in Teaching English as a Second Language'
];

export default function Diplomas() {
    return (
        <>
            <section
                className="page-header diplomas-hero"
                style={{ backgroundImage: `url(${assetUrl('images/diplomas-hero.jpg')})` }}
            >
                <div className="container">
                    <h1>Diploma Programs</h1>
                    <p>Achieve professional excellence with our comprehensive Diploma courses.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div className="course-cards-grid">
                        {courses.map((course, index) => (
                            <div key={index} className="course-card">
                                <h3 className="course-card-title">{course}</h3>
                                <ul className="course-card-list">
                                    <li><strong>Level:</strong> NVQ Level 5/6 Certificate Programme</li>
                                    <li><strong>Method:</strong> Full Time/ Part Time</li>
                                    <li><strong>Medium:</strong> English & Sinhala</li>
                                    <li>
                                        <strong>Duration:</strong><br />
                                        <span className="muted">For further details, contact us. +947 02 88 99 00</span>
                                    </li>
                                    <li className="spaced">
                                        <strong>Entry Requirements:</strong>
                                        <ul className="nested-list">
                                            <li>GCE (A/L) Examination in three (3) subjects OR</li>
                                            <li>Foundation Program equivalent to the GCE (A/L) OR</li>
                                            <li>GCE (O/L) Examination with accredited work experience or accredited prior learning followed by a relevant programme of study equivalent to a minimum of 30 credits OR</li>
                                            <li>Demonstrated competence in the relevant field and potential for future career development OR</li>
                                            <li>Completion of NVQ Level 4 or equivalent qualifications OR</li>
                                            <li>A good working knowledge of the language of instruction of the Diploma program.</li>
                                        </ul>
                                    </li>
                                    <li className="spaced">
                                        <strong>Course Structure and Modules:</strong><br />
                                        <span className="muted">For further details, contact us. +947 02 88 99 00</span>
                                    </li>
                                    <li className="spaced">
                                        <strong>Programme Fees & Investment:</strong><br />
                                        <span className="muted">For further details, contact us. +947 02 88 99 00<br />(Payable in 3 installments)</span>
                                    </li>
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="course-cta-card">
                        <h3 style={{ marginBottom: '1rem' }}>Ready to Advance Your Career?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Contact us today to learn more about admissions, modules, and schedules for our diploma programs.</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
