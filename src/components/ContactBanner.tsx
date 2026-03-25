import { Link } from 'react-router-dom';

export default function ContactBanner() {
    return (
        <section className="contact-banner">
            <div className="container">
                <div className="contact-banner-box">
                    <div className="contact-banner-flex">
                        <div className="contact-banner-content">
                            <h2>Have questions about your<br />academic journey?</h2>
                            <p>Our team is here to guide you — reach out anytime.</p>
                        </div>
                        <div className="contact-banner-action">
                            <Link to="/contact" className="btn btn-banner">
                                Contact us now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
