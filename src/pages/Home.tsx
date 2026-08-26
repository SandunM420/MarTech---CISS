import { Link } from 'react-router-dom';
import ContactBanner from '../components/ContactBanner';
import RichContent from '../components/RichContent';
import { useSiteContent } from '../context/SiteContentContext';
import LatestNewsCarousel from '../components/LatestNewsCarousel';

export default function Home() {
    const { image, copy } = useSiteContent();

    return (
        <>
            {/* Hero Section */}
            <section
                className="hero-section"
                style={{ backgroundImage: `url(${image('home.hero')})` }}
            >
                <div className="container hero-content">
                    <h1 className="hero-title">{copy('home.hero.title')}</h1>
                    <p className="hero-subtitle">{copy('home.hero.subtitle')}</p>
                    <div className="hero-actions">
                        <Link to="/certificate-courses" className="btn btn-primary">Explore Programs</Link>
                        <Link to="/about" className="btn btn-secondary">Learn More</Link>
                    </div>
                </div>
            </section>

            <LatestNewsCarousel />

            {/* Intro / Mission Section */}
            <section className="mission-section">
                <div className="container mission-container">
                    <h2>{copy('home.mission.title')}</h2>
                    <RichContent className="mission-text rich-content" html={copy('home.mission.body')} />
                </div>
            </section>

            {/* Academic Programs Section */}
            <section className="programs-section">
                <div className="container split-layout">
                    <div className="split-image-container">
                        <img src={image('home.programs')} alt="Students engaged in learning at CISS" className="split-image" />
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

            {/* Contact Us Banner (Home Only) */}
            <ContactBanner />
        </>
    );
}
