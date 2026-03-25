import type { FormEvent } from 'react';

export default function Contact() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert('Message sent successfully!');
    };

    return (
        <>
            <style>{`
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
        }
        .contact-info-card {
            background-color: var(--white);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        .contact-info-card i {
            font-size: 2rem;
            color: var(--primary-blue);
        }
        .contact-form {
            background-color: var(--white);
            padding: 2.5rem;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-md);
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
        @media (max-width: 768px) {
            .contact-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
        }
      `}</style>

            {/* Page Header */}
            <section className="page-header">
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
                        <div>
                            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '2rem' }}>Get In Touch</h2>

                            <div className="contact-info-card">
                                <i className="fas fa-map-marker-alt"></i>
                                <div>
                                    <h3 style={{ fontSize: '13px', marginBottom: '0.25rem' }}>Our Location</h3>
                                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '10px' }}>Colombo Institute of Scientific Studies (Pvt) Ltd.<br />No 523/3B, Madagodalanda Road, Athurugiriya. Sri Lanka.</p>
                                </div>
                            </div>

                            <div className="contact-info-card">
                                <i className="fas fa-phone-alt"></i>
                                <div>
                                    <h3 style={{ fontSize: '13px', marginBottom: '0.25rem' }}>Phone</h3>
                                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '10px' }}>+94702 88 99 00</p>
                                </div>
                            </div>

                            <div className="contact-info-card">
                                <i className="fas fa-envelope"></i>
                                <div>
                                    <h3 style={{ fontSize: '13px', marginBottom: '0.25rem' }}>Email</h3>
                                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '10px' }}>info@ciss.lk</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Send us a Message</h3>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="name">Full Name</label>
                                    <input type="text" id="name" className="form-control" placeholder="John Doe" required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <input type="email" id="email" className="form-control" placeholder="john@example.com" required />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="message">Your Message</label>
                                    <textarea id="message" className="form-control" rows={5} placeholder="How can we help you?" required></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                            </form>
                        </div>
                    </div>



                </div>
            </section>
        </>
    );
}
