import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { assetUrl } from '../utils/assets';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((current) => ({
            ...current,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await fetch('https://formsubmit.co/ajax/info@ciss.lk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    _subject: `New contact form message from ${formData.name}`,
                    _captcha: 'false',
                }),
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            setSubmitStatus({
                type: 'success',
                message: 'Your message has been sent successfully. We will get back to you soon.',
            });
            setFormData({
                name: '',
                email: '',
                message: '',
            });
        } catch {
            setSubmitStatus({
                type: 'error',
                message: 'We could not send your message right now. Please try again in a moment.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: stretch;
        }
        .contact-column {
            height: 100%;
        }
        .contact-info-panel,
        .contact-form {
            background-color: var(--white);
            padding: 2.5rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-md);
            height: 100%;
        }
        .contact-info-panel {
            display: flex;
            flex-direction: column;
        }
        .contact-info-card {
            background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
            padding: 2rem;
            border-radius: var(--border-radius);
            border: 1px solid rgba(46, 90, 255, 0.08);
            box-shadow: 0 10px 28px rgba(11, 22, 45, 0.05);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        .contact-info-card i {
            font-size: 2rem;
            color: var(--accent-blue);
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .form-control {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #E5E7EB;
            border-radius: var(--border-radius);
            font-family: var(--font-main);
            transition: border-color var(--transition-fast);
        }
        .form-control:focus {
            outline: none;
            border-color: var(--primary-blue);
        }
        .form-status {
            margin-bottom: 1rem;
            padding: 0.85rem 1rem;
            border-radius: var(--border-radius);
            font-size: 0.95rem;
            line-height: 1.5;
        }
        .form-status.success {
            background-color: #ECFDF5;
            color: #166534;
            border: 1px solid #BBF7D0;
        }
        .form-status.error {
            background-color: #FEF2F2;
            color: #991B1B;
            border: 1px solid #FECACA;
        }
        .map-placeholder {
            width: 100%;
            height: 300px;
            background-color: #E5E7EB;
            border-radius: var(--border-radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-light);
            font-size: 1.25rem;
            margin-top: 3rem;
            box-shadow: var(--shadow-sm);
            border: 2px dashed #D1D5DB;
        }
        .contact-map-section {
            padding: 0 0 var(--section-spacing);
            background-color: var(--secondary-color);
        }
        .contact-map-card {
            max-width: 760px;
            margin: 0 auto;
            background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
            border: 1px solid rgba(46, 90, 255, 0.08);
            border-radius: var(--border-radius-lg);
            box-shadow: 0 14px 34px rgba(11, 22, 45, 0.08);
            overflow: hidden;
        }
        .contact-map-header {
            padding: 1.25rem 1.5rem 0.75rem;
            text-align: center;
        }
        .contact-map-header h3 {
            margin-bottom: 0.35rem;
            color: var(--heading-blue);
        }
        .contact-map-header p {
            margin: 0;
            color: var(--text-light);
        }
        .contact-map-frame {
            width: 100%;
            height: 280px;
            border: 0;
            display: block;
        }
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            .contact-info-panel,
            .contact-form {
                padding: 1.5rem;
            }
            .contact-info-card {
                padding: 1.25rem;
                gap: 1rem;
                align-items: flex-start;
            }
            .contact-info-card i {
                font-size: 1.5rem;
            }
            .map-placeholder {
                height: 220px;
                font-size: 1rem;
            }
            .contact-map-card {
                max-width: 100%;
            }
            .contact-map-frame {
                height: 240px;
            }
        }
        @media (max-width: 480px) {
            .contact-info-panel,
            .contact-form {
                padding: 1.25rem;
            }
            .contact-info-card h3 {
                font-size: 0.95rem !important;
            }
            .contact-info-card p {
                font-size: 0.9rem !important;
                line-height: 1.6;
            }
            .contact-map-header {
                padding: 1rem 1rem 0.65rem;
            }
            .contact-map-frame {
                height: 220px;
            }
        }
      `}</style>

            {/* Page Header */}
            <section
                className="page-header contact-hero"
                style={{ backgroundImage: `url(${assetUrl('images/contact-hero.jpg')})` }}
            >
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>We are here to help and answer any questions you might have.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0', backgroundColor: 'var(--secondary-color)' }}>
                <div className="container">

                    <div className="contact-grid">
                        {/* Contact Information */}
                        <div className="contact-column">
                            <div className="contact-info-panel">
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--heading-blue)' }}>Get In Touch</h3>

                                <div className="contact-info-card">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--text-dark)' }}>Our Location</h3>
                                        <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.8 }}>Colombo Institute of Scientific Studies (Pvt) Ltd.<br />No 523/3B, Madagodalanda Road, Athurugiriya. Sri Lanka.</p>
                                    </div>
                                </div>

                                <div className="contact-info-card">
                                    <i className="fas fa-phone-alt"></i>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--text-dark)' }}>Phone</h3>
                                        <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.8 }}>+94702 88 99 00</p>
                                    </div>
                                </div>

                                <div className="contact-info-card" style={{ marginBottom: 0 }}>
                                    <i className="fas fa-envelope"></i>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--text-dark)' }}>Email</h3>
                                        <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.8 }}>info@ciss.lk</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-column">
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--heading-blue)' }}>Send us a Message</h3>

                                {submitStatus && (
                                    <div className={`form-status ${submitStatus.type}`} role="status">
                                        {submitStatus.message}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="form-label" htmlFor="name">Full Name</label>
                                    <input type="text" id="name" className="form-control" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <input type="email" id="email" className="form-control" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="message">Your Message</label>
                                    <textarea id="message" className="form-control" rows={5} placeholder="How can we help you?" required value={formData.message} onChange={handleChange}></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>



                </div>
            </section>

            <section className="contact-map-section">
                <div className="container">
                    <div className="contact-map-card">
                        <div className="contact-map-header">
                            <h3>Find Us</h3>
                        </div>
                        <iframe
                            className="contact-map-frame"
                            title="CISS Location Map"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps?q=No%20523%2F3B%2C%20Madagodalanda%20Road%2C%20Athurugiriya%2C%20Sri%20Lanka&z=15&output=embed"
                        ></iframe>
                    </div>
                </div>
            </section>
        </>
    );
}
