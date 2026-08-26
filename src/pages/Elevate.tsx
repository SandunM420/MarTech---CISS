import ContactBanner from '../components/ContactBanner';
import ScrollTopButton from '../components/ScrollTopButton';
import { useSiteContent } from '../context/SiteContentContext';
import {
    additionalServices,
    approachSteps,
    pricingPackages,
    trainingAreas,
    trainingFormats,
    whyChooseHighlights,
} from '../data/elevateContent';

export default function Elevate() {
    const { image } = useSiteContent();

    return (
        <>
            <section
                className="page-header elevate-hero"
                style={{ backgroundImage: `url(${image('elevate.header')})` }}
            >
                <div className="container">
                    <p className="elevate-hero-eyebrow">CISS Corporate Training Program</p>
                    <h1>ELEVATE Corporate Training</h1>
                    <p>Sustainable Dynamics for Business Growth</p>
                </div>
            </section>

            {/* About ELEVATE */}
            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div className="about-intro elevate-intro">
                        <h2>About ELEVATE</h2>
                        <p>
                            The "ELEVATE" is a professional training and capacity-building program
                            committed to enhancing workforce performance, organizational effectiveness,
                            and employee well-being. At CISS, we understand that every organization is
                            unique — we specialize in customized, tailored corporate training programs
                            designed to meet the identified needs, challenges, and goals of each company.
                            Our approach combines practical knowledge, modern industry practices,
                            psychological insights, and experiential learning to ensure measurable
                            results and sustainable organizational growth.
                        </p>
                    </div>

                    <div className="feature-cards elevate-feature-cards">
                        <div className="feature-card">
                            <div className="feature-icon"><i className="fas fa-bullseye"></i></div>
                            <div>
                                <h3>Mission</h3>
                                <p>
                                    To empower businesses and individuals through transformative
                                    education, impactful research, and supportive wellbeing services.
                                </p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon"><i className="fas fa-eye"></i></div>
                            <div>
                                <h3>Vision</h3>
                                <p>
                                    To become a globally recognized institution of scientific learning,
                                    research, and human development.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Training approach */}
            <section className="elevate-section bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h3>Our Corporate Training Approach</h3>
                    </div>

                    <div className="elevate-approach-grid">
                        {approachSteps.map((step) => (
                            <div key={step.title} className="elevate-step-card">
                                <div className="elevate-step-header">
                                    <div className="elevate-step-icon"><i className={step.icon}></i></div>
                                    <h3>{step.title}</h3>
                                </div>
                                <ul className="elevate-check-list">
                                    {step.items.map((item) => (
                                        <li key={item}>
                                            <i className="fas fa-check"></i>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Areas of training */}
            <section className="elevate-section">
                <div className="container">
                    <div className="section-heading">
                        <h3>Areas of Corporate Training</h3>
                    </div>

                    <div className="elevate-area-grid">
                        {trainingAreas.map((area) => (
                            <div key={area.title} className="elevate-area-card">
                                <div className="elevate-area-header">
                                    <div className="elevate-area-icon"><i className={area.icon}></i></div>
                                    <h3>{area.title}</h3>
                                </div>
                                <ul className="elevate-dot-list">
                                    {area.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why choose CISS */}
            <section className="elevate-section bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h3>Why Choose CISS?</h3>
                    </div>

                    <div className="elevate-why-grid">
                        {whyChooseHighlights.map((highlight) => (
                            <div key={highlight.text} className="elevate-why-card">
                                <div className="elevate-why-icon"><i className={highlight.icon}></i></div>
                                <p>{highlight.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Formats + commitment */}
            <section className="elevate-section">
                <div className="container">
                    <div className="elevate-formats-layout">
                        <div className="elevate-formats">
                            <h2>Our Training Formats</h2>
                            <ul className="programs-list">
                                {trainingFormats.map((format) => (
                                    <li key={format}>
                                        <i className="fas fa-check-circle"></i> {format}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="elevate-commitment">
                            <h3>Our Commitment</h3>
                            <p>
                                "At CISS, we believe every organization is unique. Therefore, our
                                training programs are designed around your specific goals, challenges,
                                and workforce requirements. We offer flexible and cost-effective
                                solutions that deliver measurable results and lasting organizational
                                impact."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="elevate-section bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h3>Pricing Options</h3>
                        <p>Final pricing depends on topic, duration, participants, venue, and materials.</p>
                    </div>

                    <div className="elevate-pricing-grid">
                        {pricingPackages.map((pkg) => (
                            <div key={pkg.title} className="elevate-price-card">
                                <h3>{pkg.title}</h3>
                                <p className="elevate-price-ideal">Ideal for: {pkg.idealFor}</p>
                                <p className="elevate-price-value">{pkg.price}</p>
                                <ul className="elevate-check-list">
                                    {pkg.items.map((item) => (
                                        <li key={item}>
                                            <i className="fas fa-check"></i>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <p className="elevate-terms">T &amp; C Apply</p>
                </div>
            </section>

            {/* Additional services */}
            <section className="elevate-section">
                <div className="container">
                    <div className="elevate-services-shell">
                        <div className="section-heading">
                            <h3>Additional Services</h3>
                            <p>All training programs are customized to meet the specific needs of each organization.</p>
                        </div>

                        <div className="elevate-services-panel">
                            {additionalServices.map((service) => (
                                <div key={service} className="elevate-service-row">
                                    <span className="elevate-service-name">{service}</span>
                                    <span className="elevate-service-note">Quotation Based</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <ContactBanner
                title={<>Let's build your<br />workforce together</>}
                description="Tailored training solutions for high-performing organizations. Reach out to design your ELEVATE program."
                buttonText="Talk to Us"
                to="/contact"
                iconClassName="fas fa-briefcase"
            />

            <ScrollTopButton />
        </>
    );
}
