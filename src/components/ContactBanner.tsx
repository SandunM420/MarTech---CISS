import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ContactBannerProps = {
    title?: ReactNode;
    description?: string;
    buttonText?: string;
    to?: string;
    iconClassName?: string;
};

export default function ContactBanner({
    title = <>Have questions about your<br />academic journey?</>,
    description = 'Our team is here to guide you anytime - reach out anytime.',
    buttonText = 'Contact us now',
    to = '/contact',
    iconClassName = 'fas fa-comments',
}: ContactBannerProps) {
    return (
        <section className="contact-banner">
            <div className="container">
                <div className="contact-banner-box">
                    <div className="contact-banner-flex">
                        <div className="contact-banner-content">
                            <div className="contact-banner-header">
                                <div className="contact-banner-icon">
                                    <i className={iconClassName}></i>
                                </div>
                                <h2>{title}</h2>
                            </div>
                            <p>{description}</p>
                        </div>
                        <div className="contact-banner-action">
                            <Link to={to} className="btn btn-banner">
                                {buttonText}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
