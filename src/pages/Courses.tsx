export default function Courses() {
    return (
        <>
            <style>{`
        .course-card {
            background: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            padding: 2rem;
            margin-bottom: 2rem;
            transition: all var(--transition-medium);
            border-top: 4px solid var(--primary-blue);
        }
        .course-card:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-5px);
        }
        .course-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
      `}</style>

            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Our Academic Programs</h1>
                    <p>Globally aligned courses designed to shape your future.</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="inner-page-content" style={{ padding: 'var(--section-spacing) 0', backgroundColor: 'var(--secondary-color)' }}>
                <div className="container">

                    <div id="certificate" className="course-section mt-4">
                        <h2 style={{ color: 'var(--primary-blue)' }}>Certificate Courses</h2>
                        <p>Foundational programs to jumpstart your career or academic journey.</p>
                        <div className="course-grid">
                            <div className="course-card">
                                <h3>Certificate in Information Technology</h3>
                                <p>Learn the basics of modern computing, software applications, and IT infrastructure.</p>
                                <a href="#" className="btn btn-secondary" style={{ color: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}>Learn More</a>
                            </div>
                            <div className="course-card">
                                <h3>Certificate in Scientific Research Methods</h3>
                                <p>An introduction to quantitative and qualitative research methodologies.</p>
                                <a href="#" className="btn btn-secondary" style={{ color: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}>Learn More</a>
                            </div>
                        </div>
                    </div>

                    <div id="advance" className="course-section" style={{ marginTop: '4rem' }}>
                        <h2 style={{ color: 'var(--primary-blue)' }}>Advance Certificate Courses</h2>
                        <div className="course-grid">
                            <div className="course-card">
                                <h3>Advanced Certificate in Data Science</h3>
                                <p>Dive deeper into data analytics, machine learning basics, and statistical modeling.</p>
                                <a href="#" className="btn btn-secondary" style={{ color: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}>Learn More</a>
                            </div>
                        </div>
                    </div>

                    <div id="nvq" className="course-section" style={{ marginTop: '4rem' }}>
                        <h2 style={{ color: 'var(--primary-blue)' }}>NVQ Level Courses</h2>
                        <div className="course-grid">
                            <div className="course-card">
                                <h3>NVQ Level 4 - Laboratory Technician</h3>
                                <p>National Vocational Qualification accredited training for modern laboratory operations.</p>
                                <a href="#" className="btn btn-secondary" style={{ color: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}>Learn More</a>
                            </div>
                        </div>
                    </div>

                    <div id="diplomas" className="course-section" style={{ marginTop: '4rem' }}>
                        <h2 style={{ color: 'var(--primary-blue)' }}>Diploma Programs</h2>
                        <div className="course-grid">
                            <div className="course-card">
                                <h3>Higher National Diploma in Computing</h3>
                                <p>Comprehensive academic program preparing you for advanced software engineering roles.</p>
                                <a href="#" className="btn btn-secondary" style={{ color: 'var(--primary-blue)', borderColor: 'var(--primary-blue)' }}>Learn More</a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
