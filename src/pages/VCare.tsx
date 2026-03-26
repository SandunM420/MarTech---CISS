import { assetUrl } from '../utils/assets';
import ContactBanner from '../components/ContactBanner';

export default function VCare() {
    return (
        <>
            <section
                className="page-header vcare-hero"
                style={{ backgroundImage: `url(${assetUrl('images/vcare-hero.jpg')})` }}
            >
                <div className="container">
                    <h1>V-Care Wellness Initiative</h1>
                    <p>Compassionate support and counseling for a balanced life.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container vcare-shell">
                    <div className="vcare-section vcare-card">
                        <i className="fas fa-hands-holding-circle vcare-icon"></i>
                        <h2>Counselling & Psychological Services</h2>
                        <h4 className="vcare-subtitle">Your Wellbeing Matters</h4>
                        <p className="vcare-copy">
                            We offer private, professional, and friendly support;
                        </p>
                        <ul className="programs-list vcare-list">
                            <li><i className="fas fa-check-circle"></i> Individual counselling</li>
                            <li><i className="fas fa-check-circle"></i> Academic & career counselling</li>
                            <li><i className="fas fa-check-circle"></i> Psychological assessments</li>
                        </ul>
                    </div>

                    <div className="vcare-card">
                        <i className="fas fa-heartbeat vcare-icon"></i>
                        <h2 className="vcare-title">Care & Wellness Services</h2>
                        <p className="vcare-copy">
                            We offer,
                        </p>
                        <ul className="programs-list vcare-list">
                            <li><i className="fas fa-check-circle"></i> Nursing & Home Care Service</li>
                            <li><i className="fas fa-check-circle"></i> Wellness Center</li>
                            <li><i className="fas fa-check-circle"></i> Personal Care Assistance</li>
                            <li><i className="fas fa-check-circle"></i> Medical Care</li>
                            <li><i className="fas fa-check-circle"></i> Home Care Support</li>
                            <li><i className="fas fa-check-circle"></i> Companionship</li>
                            <li><i className="fas fa-check-circle"></i> 24/7 Support</li>
                        </ul>
                    </div>
                </div>
            </section>

            <ContactBanner
                title={<>Ready to begin your<br />wellness journey?</>}
                description="Connect with our team to schedule a session and get the support you need."
                buttonText="Schedule a Session"
                to="/contact"
                iconClassName="fas fa-heartbeat"
            />
        </>
    );
}
