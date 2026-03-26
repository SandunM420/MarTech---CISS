import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3 className="footer-brand-title">Colombo Institute of Scientific Studies</h3>
                        <p className="footer-text">
                            CISS empowers learners through education, research, wellbeing, and
                            community-focused services designed for meaningful impact.
                        </p>
                    </div>

                    <div className="footer-links-area">
                        <div className="footer-col">
                            <h3 className="footer-heading">Explore</h3>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/v-care">V-Care</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3 className="footer-heading">Programs</h3>
                            <ul className="footer-links">
                                <li><Link to="/certificate-courses">Certificate Courses</Link></li>
                                <li><Link to="/advanced-certificate-courses">Advanced Certificates</Link></li>
                                <li><Link to="/nvq-courses">NVQ Courses</Link></li>
                                <li><Link to="/diplomas">Diploma Programs</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-col footer-contact-column">
                        <h3 className="footer-heading">Contact</h3>
                        <div className="footer-contact-cards">
                            <div className="footer-contact-card">
                                <div className="contact-icon-wrapper"><i className="fas fa-map-marker-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Address</span>
                                    <p>No 523/3B, Madagodalanda Road, Athurugiriya, Sri Lanka.</p>
                                </div>
                            </div>

                            <div className="footer-contact-card">
                                <div className="contact-icon-wrapper"><i className="fas fa-phone-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Phone</span>
                                    <p>+94 702 88 99 00</p>
                                </div>
                            </div>

                            <div className="footer-contact-card">
                                <div className="contact-icon-wrapper"><i className="fas fa-envelope"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Email</span>
                                    <p>info@ciss.lk</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Colombo Institute of Scientific Studies (CISS). All rights reserved.</p>
                    <a
                        href="https://www.instagram.com/martechmedia.digi/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Website by MarTech Media
                    </a>
                </div>
            </div>
        </footer>
    );
}
