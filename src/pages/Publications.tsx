export default function Publications() {
    return (
        <>
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Research & Publications</h1>
                    <p>Advancing knowledge through dedicated scientific inquiry.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h2 style={{ color: 'var(--primary-blue)', textAlign: 'center', marginBottom: '3rem' }}>Recent Journals & Articles</h2>

                        <div className="publication-item" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-dark)' }}>Impact of AI on Modern Educational Methodologies</a></h3>
                            <p style={{ color: '#6B7280', fontSize: '10px', marginBottom: '1rem' }}>Published formatting: CISS Journal of Science, Vol 4, Issue 2. Date: Feb 2026</p>
                            <p>An extensive review of how artificial intelligence tools are reshaping pedagogy and student engagement in tertiary education...</p>
                            <a href="#" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Read Full Article <i className="fas fa-arrow-right"></i></a>
                        </div>

                        <div className="publication-item" style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '2rem', marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--text-dark)' }}>Sustainable Urban Development Metrics</a></h3>
                            <p style={{ color: '#6B7280', fontSize: '10px', marginBottom: '1rem' }}>Published formatting: International Research Review. Date: Jan 2026</p>
                            <p>A comprehensive study proposing new infrastructural metrics to measure sustainability in rapidly growing metropolitan areas...</p>
                            <a href="#" style={{ color: 'var(--primary-blue)', fontWeight: '500' }}>Read Full Article <i className="fas fa-arrow-right"></i></a>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <a href="#" className="btn btn-primary">Visit Our Academic Resources Portal</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
