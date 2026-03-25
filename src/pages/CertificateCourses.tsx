import { Link } from 'react-router-dom';

export default function CertificateCourses() {
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
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>Available Courses</h2>
                        <ul className="programs-list" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
                            <li><i className="fas fa-check-circle"></i> Basics in Child Psychology</li>
                            <li><i className="fas fa-check-circle"></i> Basics in Geriatric Psychology</li>
                            <li><i className="fas fa-check-circle"></i> English for Professionals</li>
                            <li><i className="fas fa-check-circle"></i> Dementia Care Training</li>
                            <li><i className="fas fa-check-circle"></i> Basic Nursing Care</li>
                            <li><i className="fas fa-check-circle"></i> Psychological First Aid</li>
                            <li><i className="fas fa-check-circle"></i> First Aid</li>
                            <li><i className="fas fa-check-circle"></i> Understanding AI</li>
                        </ul>

                        <div style={{ backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--border-radius-lg)', padding: '3rem 2rem', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Need more information?</h3>
                            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Contact us for details regarding admission, deadlines, and requirements.</p>
                            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
