import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [coursesOpen, setCoursesOpen] = useState(false);
    const location = useLocation();
    const [logoSize, setLogoSize] = useState<number>(75);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('logoSize');
            if (stored) setLogoSize(Number(stored));
        } catch (e) { /* ignore */ }
    }, []);

    // Logo size is read from localStorage on mount; controls removed per request.

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => { setIsMenuOpen(false); setCoursesOpen(false); };

    const toggleCourses = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        setCoursesOpen(!coursesOpen);
    };

    // Helper for active class
    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    return (
        <header className="main-header">
            <div className="container header-container">
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src="/images/logo.png" alt="CISS Logo" style={{ height: `${logoSize}px`, objectFit: 'contain', margin: '5px 0' }} />
                    </Link>

                    {/* Logo size controls removed — keeping current size */}
                </div>

                <button className="menu-toggle" aria-label="Toggle navigation" onClick={toggleMenu}>
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li><Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/about" className={isActive('/about')} onClick={closeMenu}>About Us</Link></li>

                        <li className={`dropdown ${coursesOpen ? 'active' : ''}`}>
                            <button type="button" className={`dropdown-toggle ${isActive('/courses')}`} onClick={toggleCourses} aria-expanded={coursesOpen} aria-haspopup="true">
                                Courses <i className="fas fa-chevron-down"></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to="/certificate-courses" onClick={closeMenu}>Certificate Courses</Link></li>
                                <li><Link to="/advanced-certificate-courses" onClick={closeMenu}>Advanced Certificate Courses</Link></li>
                                <li><Link to="/nvq-courses" onClick={closeMenu}>NVQ Level Courses</Link></li>
                                <li><Link to="/diplomas" onClick={closeMenu}>Diplomas</Link></li>
                            </ul>
                        </li>

                        <li><Link to="/v-care" className={isActive('/v-care')} onClick={closeMenu}>V-Care</Link></li>
                        <li><Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>Contact</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
