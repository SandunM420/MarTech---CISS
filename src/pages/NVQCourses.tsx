import { Link } from 'react-router-dom';
import { assetUrl } from '../utils/assets';
import ScrollTopButton from '../components/ScrollTopButton';

const courses = [
    { title: 'NVQ Level 3 - Child Care & Therapy Assistant (Special Needs)', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Caregiver', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Child Caregiver', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Child Care Center Operations', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Early Childhood Development Centre Assistant', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 2 - Health Care and Supportive Assistant', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 4 - Nurse Assistant', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Human Resources Associate', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Mental Health Care Assistant', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Hairdresser', level: 'NVQ Level 3 Certificate Programme' },
    { title: 'NVQ Level 3 - Beautician', level: 'NVQ Level 3 Certificate Programme' }
];

export default function NVQCourses() {
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
                    <div className="course-cards-grid">
                        {courses.map((course, index) => (
                            <div key={index} className="course-card">
                                <h3 className="course-card-title">{course.title}</h3>
                                <ul className="course-card-list">
                                    <li><strong>Level:</strong> {course.level}</li>
                                    <li><strong>Method:</strong> Full Time/ Part Time</li>
                                    <li><strong>Medium:</strong> English & Sinhala</li>
                                    <li>
                                        <strong>Duration:</strong><br />
                                        <span className="muted">For further details, contact us. +947 02 88 99 00</span>
                                    </li>
                                    <li className="spaced">
                                        <strong>Entry Requirements:</strong>
                                        <ul className="nested-list">
                                            <li>G.C.E. O/L OR</li>
                                            <li>Completion of NVQ Level 2 or equivalent qualifications.</li>
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
                        <h3 style={{ marginBottom: '1rem' }}>Ready to Take the Next Step?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Contact us for more information on admissions, modules, and schedules.</p>
                        <Link to="/contact" className="btn btn-primary">Contact Us Now</Link>
                    </div>
                </div>
            </section>
            <ScrollTopButton />
        </>
    );
}
