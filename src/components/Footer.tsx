export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-grid">

                    {/* Column 1: Contact Icons (Aligned without heading) */}
                    <div className="footer-col" style={{ marginTop: '0.2rem' }}>
                        <ul className="footer-contact-list">
                            <li>
                                <div className="contact-icon-wrapper"><i className="fas fa-map-marker-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Address:</span>
                                    <p>Street Name, NY 38954</p>
                                </div>
                            </li>
                            <li>
                                <div className="contact-icon-wrapper"><i className="fas fa-phone-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Phone:</span>
                                    <p>578-393-4937</p>
                                </div>
                            </li>
                            <li>
                                <div className="contact-icon-wrapper"><i className="fas fa-mobile-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Mobile:</span>
                                    <p>578-393-4937</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Contact Info Text */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Contact Info</h3>
                        <p className="footer-text">Nunc lobortis mattis aliquam faucibus purus in massa arcu odio ut sem nulla pharetra diam amet.</p>
                    </div>

                    {/* Column 3: About us */}
                    <div className="footer-col">
                        <h3 className="footer-heading">About us</h3>
                        <ul className="footer-links">
                            <li><a href="#">About Organization</a></li>
                            <li><a href="#">Our Clients</a></li>
                            <li><a href="#">Our Partners</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Quick Links */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#">Introduction</a></li>
                            <li><a href="#">Organisation Team</a></li>
                            <li><a href="#">Press Enquiries</a></li>
                        </ul>
                    </div>

                    {/* Column 5: Important Links */}
                    <div className="footer-col">
                        <h3 className="footer-heading">Important Links</h3>
                        <ul className="footer-links">
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Cookies Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
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
