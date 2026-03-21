import { Link } from 'react-router-dom';

export default function VCare() {
    return (
        <>
            <section className="page-header" style={{ backgroundColor: '#E8F0FE', color: 'var(--text-dark)' }}>
                <div className="container">
                    <h1 style={{ color: 'var(--primary-blue)' }}>V-Care Wellness Initiative</h1>
                    <p>Compassionate support and counseling for a balanced life.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>

                    <i className="fas fa-hands-holding-circle" style={{ fontSize: '4rem', color: 'var(--primary-blue)', marginBottom: '1.5rem' }}></i>

                    <h2>Your Mental Health Matters</h2>
                    <p style={{ fontSize: '10px', color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '2rem' }}>
                        At CISS, we believe that academic and professional success is deeply intertwined with personal well-being. The <strong>V-Care Initiative</strong> is dedicated to providing a safe, confidential, and compassionate space for students and staff to seek counseling, mental health support, and wellness guidance.
                    </p>

                    <div style={{ backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-md)', borderRadius: 'var(--border-radius-lg)', padding: '3rem 2rem', marginTop: '3rem' }}>
                        <h3>Need to talk? We are here to listen.</h3>
                        <p style={{ marginBottom: '2rem' }}>Our professional counselors are available for confidential sessions regarding academic stress, personal challenges, or career guidance.</p>
                        <Link to="/contact" className="btn btn-primary">Schedule a Session</Link>
                    </div>

                </div>
            </section>
        </>
    );
}
