import { Link } from 'react-router-dom';
import ContactBanner from '../components/ContactBanner';

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1 className="hero-title">Where Knowledge Meets Innovation!</h1>
                    <p className="hero-subtitle">Empowering Minds. Advancing Science. Transforming Lives.</p>
                    <div className="hero-actions">
                        <Link to="/certificate-courses" className="btn btn-primary">Explore Programs</Link>
                        <Link to="/about" className="btn btn-secondary">Learn More</Link>
                    </div>
                </div>
            </section>

            {/* Intro / Mission Section */}
            <section className="mission-section">
                <div className="container mission-container">
                    <h2>Nurturing Minds Through Knowledge and Compassion</h2>
                    <p className="mission-text">
                        The Colombo Institute of Scientific Studies (CISS) inspires learners, researchers, and communities through high-quality education, innovative research, compassionate counseling, and wellness services. We believe in accessible, student-centered learning blended with scientific excellence.
                    </p>
                </div>
            </section>

            {/* Academic Programs Section */}
            <section className="programs-section">
                <div className="container split-layout">
                    <div className="split-image-container">
                        <img src="/images/programs.png" alt="Students engaged in learning at CISS" className="split-image" />
                    </div>
                    <div className="split-content left-padding">
                        <h2>Academic Programs</h2>
                        <p className="section-lead">Explore globally aligned programs that prepare you for the future:</p>
                        <ul className="programs-list">
                            <li><i className="fas fa-check-circle"></i> Certificate Courses</li>
                            <li><i className="fas fa-check-circle"></i> Advance Certificate Courses</li>
                            <li><i className="fas fa-check-circle"></i> NVQ Level Courses</li>
                            <li><i className="fas fa-check-circle"></i> Diploma Programs</li>
                        </ul>
                        <Link to="/certificate-courses" className="btn btn-primary mt-4">View Courses</Link>
                    </div>
                </div>
            </section>

            {/* Research & Innovation Section */}
            <section className="research-section bg-light">
                <div className="container split-layout">
                    <div className="split-content right-padding">
                        <h2>Research & Innovation</h2>
                        <h3 className="subsection-title">Scientific Research for Real-World Impact</h3>
                        <p className="section-text">
                            Our Research Center encourages applied research, publications, grants, and industry collaborations. We are committed to fostering an environment where scientific innovation drives meaningful change.
                        </p>
                    </div>
                    <div className="split-image-container">
                        <img src="/images/research.png" alt="Advanced scientific research laboratory at CISS" className="split-image shadow-effect" />
                    </div>
                </div>
            </section>

            {/* Contact Us Banner (Home Only) */}
            <ContactBanner />
        </>
    );
}
