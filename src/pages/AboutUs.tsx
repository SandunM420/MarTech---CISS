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
                        <h2 style={{ color: 'var(--primary-blue)' }}>Institutional Overview</h2>
                        <p>The Colombo Institute of Scientific Studies (CISS) is a premier higher education and research institution dedicated to fostering academic excellence, innovation, and holistic student development. Founded with the purpose of bridging the gap between scientific knowledge and real-world application, CISS offers globally recognized programs designed to equip learners with the skills they need to excel in the modern workforce.</p>

                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Our Vision</h3>
                        <p>To be a globally recognized center of excellence in scientific studies, research, and holistic wellness, nurturing visionary leaders who drive positive change in society.</p>

                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Our Mission</h3>
                        <p>To inspire learners, researchers, and communities through high-quality education, innovative research, compassionate counseling, and wellness services. We are committed to providing accessible, student-centered learning blended with scientific rigor and ethical principles.</p>

                        <h3 className="mt-4" style={{ color: 'var(--primary-blue)' }}>Why Choose CISS?</h3>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '1rem', color: 'var(--text-light)' }}>
                            <li><strong>Academic Excellence:</strong> Programs designed with industry experts to ensure relevance and rigor.</li>
                            <li><strong>Innovation-Driven Research:</strong> A dedicated research center that encourages discovery and application.</li>
                            <li><strong>Holistic Support:</strong> Through our V-Care initiative, we provide compassionate counseling and wellness services.</li>
                            <li><strong>Modern Facilities:</strong> State-of-the-art learning environments that foster collaboration and creativity.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
}
