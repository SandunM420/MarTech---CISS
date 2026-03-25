import { Link } from 'react-router-dom';

export default function VCare() {
    return (
        <>
            <section className="page-header vcare-hero">
                <div className="container">
                    <h1>V-Care Wellness Initiative</h1>
                    <p>Compassionate support and counseling for a balanced life.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container vcare-shell">
                    <div className="vcare-section">
                        <i className="fas fa-hands-holding-circle" style={{ fontSize: '4rem', color: 'var(--primary-blue)', marginBottom: '1.5rem' }}></i>
                        <h2>Counselling & Psychological Services</h2>
                        <h4 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Your Wellbeing Matters</h4>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            We offer private, professional, and friendly support;
                        </p>
                        <ul className="programs-list vcare-list" style={{ fontSize: '1.1rem' }}>
                            <li><i className="fas fa-check-circle"></i> Individual counselling</li>
                            <li><i className="fas fa-check-circle"></i> Academic & career counselling</li>
                            <li><i className="fas fa-check-circle"></i> Psychological assessments</li>
                        </ul>
                    </div>

                    <div className="vcare-card">
                        <i className="fas fa-heartbeat" style={{ fontSize: '3.5rem', color: 'var(--primary-blue)', marginBottom: '1.5rem' }}></i>
                        <h2 style={{ marginBottom: '1rem' }}>Care & Wellness Services</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                            We offer,
                        </p>
                        <ul className="programs-list vcare-list" style={{ fontSize: '1.1rem' }}>
                            <li><i className="fas fa-check-circle"></i> Nursing & Home Care Service</li>
                            <li><i className="fas fa-check-circle"></i> Wellness Center</li>
                            <li><i className="fas fa-check-circle"></i> Personal Care Assistance</li>
                            <li><i className="fas fa-check-circle"></i> Medical Care</li>
                            <li><i className="fas fa-check-circle"></i> Home Care Support</li>
                            <li><i className="fas fa-check-circle"></i> Companionship</li>
                            <li><i className="fas fa-check-circle"></i> 24/7 Support</li>
                        </ul>
                        <div className="vcare-action">
                            <Link to="/contact" className="btn btn-primary">Schedule a Session</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
