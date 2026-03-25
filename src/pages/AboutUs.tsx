export default function AboutUs() {
    return (
        <>
            {/* Page Header */}
            <section className="page-header about-hero">
                <div className="container">
                    <h1>About CISS</h1>
                    <p>Empowering Minds. Advancing Science. Transforming Lives.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div className="about-intro">
                        <h2 style={{ color: 'var(--primary-blue)' }}>About CISS</h2>
                        <p>CISS is a multidisciplinary educational and scientific institution delivering knowledge, community impact, and personal transformation.</p>
                    </div>

                    <div className="about-cards">
                        <div className="card">
                            <div className="card-icon"><i className="fas fa-eye"></i></div>
                            <div>
                                <h3>Vision</h3>
                                <p>To become a globally recognized institution of scientific learning, research and human development.</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-icon"><i className="fas fa-bullseye"></i></div>
                            <div>
                                <h3>Mission</h3>
                                <p>To empower individuals through transformative education, impactful research, and supportive wellbeing services.</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-values">
                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Core Values</h3>
                        <div className="about-values-grid">
                            <div className="value-card">Integrity</div>
                            <div className="value-card">Excellence</div>
                            <div className="value-card">Innovation</div>
                            <div className="value-card">Compassion</div>
                            <div className="value-card">Growth</div>
                        </div>
                    </div>

                    <div className="about-legal">
                        <div className="card">
                            <h3 style={{ color: 'var(--primary-blue)' }}>Legal Registration</h3>
                            <p>Colombo Institute of Scientific Studies (Private) Limited, legally registered under Sri Lanka Companies Act No. 07 of 2007, operates in accordance with approved business objectives, including:</p>
                        </div>

                        <div className="card">
                            <h3 style={{ color: 'var(--primary-blue)' }}>Services</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.1rem', marginTop: '1rem' }}>
                                <li>Academic programs</li>
                                <li>Digital learning platforms</li>
                                <li>Research center</li>
                                <li>Counselling center</li>
                                <li>Recruitment services</li>
                                <li>Home Care & wellness center</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
