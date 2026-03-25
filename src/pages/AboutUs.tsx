export default function AboutUs() {
    return (
        <>
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>About CISS</h1>
                    <p>Empowering Minds. Advancing Science. Transforming Lives.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ color: 'var(--primary-blue)' }}>About CISS</h2>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>CISS is a multidisciplinary educational and scientific institution delivering knowledge, community impact, and personal transformation.</p>

                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Vision</h3>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>To become a globally recognized institution of scientific learning, research and human development.</p>

                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Mission</h3>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>To empower individuals through transformative education, impactful research, and supportive wellbeing services.</p>

                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Core Values</h3>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '1rem', color: 'var(--text-light)', lineHeight: '1.8' }}>
                            <li>Integrity</li>
                            <li>Excellence</li>
                            <li>Innovation</li>
                            <li>Compassion</li>
                            <li>Growth</li>
                        </ul>

                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Legal Registration</h3>
                        <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>Colombo Institute of Scientific Studies (Private) Limited, legally registered under Sri Lanka Companies Act No. 07 of 2007, operates in accordance with approved business objectives, including:</p>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '1rem', color: 'var(--text-light)', lineHeight: '1.8' }}>
                            <li>Academic programs</li>
                            <li>Digital learning platforms</li>
                            <li>Research center</li>
                            <li>Counselling center</li>
                            <li>Recruitment services</li>
                            <li>Home Care & wellness center</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}
