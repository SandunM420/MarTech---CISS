import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { telHref } from '../data/siteDefaults';
import RichContent from './RichContent';

export default function Footer() {
    const { settings, copy } = useSiteContent();
    const socials = [
        { url: settings.facebook, label: 'Facebook', icon: 'fab fa-facebook-f' },
        { url: settings.linkedin, label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
        { url: settings.instagram, label: 'Instagram', icon: 'fab fa-instagram' },
        { url: settings.tiktok, label: 'TikTok', icon: 'fab fa-tiktok' },
    ].filter((item) => item.url);

    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3 className="footer-brand-title">{settings.siteName}</h3>
                        <RichContent className="footer-text rich-content" html={copy('footer.blurb')} />
                        {socials.length ? (
                            <div className="footer-social-links">
                                {socials.map((item) => <a key={item.label} href={item.url} target="_blank" rel="noreferrer" aria-label={item.label}><i className={item.icon} /></a>)}
                            </div>
                        ) : null}
                    </div>

                    <div className="footer-links-area">
                        <div className="footer-col">
                            <h3 className="footer-heading">Explore</h3>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/news">News</Link></li>
                                <li><Link to="/v-care">V-Care</Link></li>
                                <li><Link to="/elevate">Elevate</Link></li>
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
                                <div className="contact-icon-wrapper"><i className="fas fa-phone-alt"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Phone</span>
                                    <p><a href={telHref(settings)}>{settings.phoneDisplay}</a></p>
                                </div>
                            </div>

                            <div className="footer-contact-card">
                                <div className="contact-icon-wrapper"><i className="fas fa-envelope"></i></div>
                                <div className="contact-details">
                                    <span className="contact-label">Email</span>
                                    <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} {settings.siteName} (CISS). All rights reserved.</p>
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
