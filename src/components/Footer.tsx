import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Column 1: Contact Details */}
                    <div className="footer-col" style={{ marginTop: '0.2rem' }}>
                        <ul className="footer-contact-list">
                            <li>
                                <div className="contact-icon-wrapper"><i className="fas fa-map-marker-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Address:</span>
                                    <p>Colombo Institute of Scientific Studies (Pvt) Ltd.<br />No 523/3B, Madagodalanda Road, Athurugiriya. Sri Lanka.</p>
                                </div>
                            </li>
                            <li>
                                <div className="contact-icon-wrapper"><i className="fas fa-phone-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Contact:</span>
                                    <p>+94702 88 99 00</p>
                                </div>
                            </li>
                            <li>
                                <div className="contact-icon-wrapper"><i className="fas fa-envelope"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Email:</span>
                                    <p>info@ciss.lk</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/courses">All Courses</Link></li>
                            <li><Link to="/v-care">V-Care</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Colombo Institute of Scientific Studies (CISS). All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
