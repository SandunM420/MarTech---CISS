import { assetUrl } from '../utils/assets';

export default function AboutUs() {
    return (
        <>
            <section
                className="page-header about-hero"
                style={{ backgroundImage: `url(${assetUrl('images/about-hero.jpg')})` }}
            >
                <div className="container">
                    <h1>About CISS</h1>
                    <p>Empowering Minds. Advancing Science. Transforming Lives.</p>
                </div>
            </section>

            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div className="about-grid">
                        <div className="about-main">
                            <div className="about-intro">
                                <h2>Where Knowledge Meets Innovation!</h2>
                                <p>
                                    CISS is a multidisciplinary educational and scientific institution
                                    delivering knowledge, community impact, and personal transformation.
                                </p>
                            </div>

                            <div className="feature-cards">
                                <div className="feature-card">
                                    <div className="feature-icon"><i className="fas fa-eye"></i></div>
                                    <div>
                                        <h3>Vision</h3>
                                        <p>
                                            To become a globally recognized institution of scientific
                                            learning, research, and human development.
                                        </p>
                                    </div>
                                </div>

                                <div className="feature-card">
                                    <div className="feature-icon"><i className="fas fa-bullseye"></i></div>
                                    <div>
                                        <h3>Mission</h3>
                                        <p>
                                            To empower individuals through transformative education,
                                            impactful research, and supportive wellbeing services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="about-values">
                                <div className="section-heading">
                                    <h3>Core Values</h3>
                                </div>

                                <div className="about-values-wrapper">
                                    <div className="about-values-grid">
                                        <div className="value-card">
                                            <div className="value-icon"><i className="fas fa-shield-alt"></i></div>
                                            <div className="value-copy">
                                                <div className="value-text">Integrity</div>
                                                <p>We act with honesty, accountability, and respect in all we do.</p>
                                            </div>
                                        </div>

                                        <div className="value-card">
                                            <div className="value-icon"><i className="fas fa-star"></i></div>
                                            <div className="value-copy">
                                                <div className="value-text">Excellence</div>
                                                <p>We pursue high standards in education, research, and service delivery.</p>
                                            </div>
                                        </div>

                                        <div className="value-card">
                                            <div className="value-icon"><i className="fas fa-lightbulb"></i></div>
                                            <div className="value-copy">
                                                <div className="value-text">Innovation</div>
                                                <p>We encourage fresh thinking and practical solutions that create impact.</p>
                                            </div>
                                        </div>

                                        <div className="value-card">
                                            <div className="value-icon"><i className="fas fa-hands-helping"></i></div>
                                            <div className="value-copy">
                                                <div className="value-text">Compassion</div>
                                                <p>We build supportive environments that value people and wellbeing.</p>
                                            </div>
                                        </div>

                                        <div className="value-card">
                                            <div className="value-icon"><i className="fas fa-seedling"></i></div>
                                            <div className="value-copy">
                                                <div className="value-text">Growth</div>
                                                <p>We invest in continuous learning, development, and meaningful progress.</p>
                                            </div>
                                        </div>

                                        <div className="value-card">
                                            <div className="value-icon"><i className="fas fa-users"></i></div>
                                            <div className="value-copy">
                                                <div className="value-text">Collaboration</div>
                                                <p>We believe shared knowledge and teamwork create stronger outcomes for everyone.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <aside className="values-media">
                                        <img src={assetUrl('images/values-side.jpg')} alt="Learners collaborating in a group session" />
                                    </aside>
                                </div>
                            </div>

                            <div className="about-legal">
                                <div className="card">
                                    <div>
                                        <div className="card-header">
                                            <div className="card-icon"><i className="fas fa-balance-scale"></i></div>
                                            <h3>Legal Registration</h3>
                                        </div>
                                        <p>
                                            Colombo Institute of Scientific Studies (Private) Limited is
                                            legally registered under the Sri Lanka Companies Act No. 07 of
                                            2007 and operates in accordance with its approved business
                                            objectives.
                                        </p>
                                    </div>
                                </div>

                                <div className="card">
                                    <div>
                                        <div className="card-header">
                                            <div className="card-icon"><i className="fas fa-concierge-bell"></i></div>
                                            <h3>Services</h3>
                                        </div>
                                        <ul className="services-list">
                                            <li>Academic programs</li>
                                            <li>Digital learning platforms</li>
                                            <li>Research center</li>
                                            <li>Counselling center</li>
                                            <li>Recruitment services</li>
                                            <li>Home Care and wellness center</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
