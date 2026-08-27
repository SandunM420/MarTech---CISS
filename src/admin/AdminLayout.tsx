import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSiteContent } from '../context/SiteContentContext';

/** Sidebar structure. `end` keeps the Dashboard link from matching every child route. */
const navigation = [
    {
        group: 'Overview',
        items: [
            { to: '/admin', label: 'Dashboard', icon: 'fas fa-gauge-high', end: true },
            { to: '/admin/inquiries', label: 'Inquiries', icon: 'fas fa-inbox' },
        ],
    },
    {
        group: 'Content',
        items: [
            { to: '/admin/courses', label: 'Courses', icon: 'fas fa-graduation-cap' },
            { to: '/admin/news', label: 'News', icon: 'fas fa-newspaper' },
            { to: '/admin/images', label: 'Images', icon: 'fas fa-images' },
            { to: '/admin/text', label: 'Page text', icon: 'fas fa-align-left' },
        ],
    },
    {
        group: 'Site',
        items: [
            { to: '/admin/settings', label: 'Settings', icon: 'fas fa-sliders' },
            { to: '/admin/account', label: 'Account', icon: 'fas fa-user-shield' },
        ],
    },
];

export default function AdminLayout() {
    const { user, logout } = useAdminAuth();
    const { offline, image } = useSiteContent();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className={`admin-shell${menuOpen ? ' admin-shell--menu-open' : ''}`}>
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <img src={image('header.logo')} alt="" className="admin-brand-logo" />
                    <div>
                        <p className="admin-brand-name">CISS Admin</p>
                        <p className="admin-brand-host">ciss.lk</p>
                    </div>
                </div>

                <nav className="admin-nav">
                    {navigation.map((section) => (
                        <div key={section.group} className="admin-nav-group">
                            <p className="admin-nav-label">{section.group}</p>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `admin-nav-item${isActive ? ' admin-nav-item--active' : ''}`
                                    }
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <i className={item.icon} aria-hidden="true" />
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <a href="/" className="admin-nav-item" target="_blank" rel="noreferrer">
                        <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
                        <span>View live site</span>
                    </a>
                    <div className="admin-user">
                        <div className="admin-user-avatar" aria-hidden="true">
                            {(user?.username ?? '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="admin-user-meta">
                            <p className="admin-user-name">{user?.username}</p>
                            <p className="admin-user-role">{user?.role}</p>
                        </div>
                        <button type="button" onClick={handleLogout} title="Sign out" className="admin-icon-button">
                            <i className="fas fa-right-from-bracket" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="admin-main">
                <button
                    type="button"
                    className="admin-menu-toggle"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Toggle navigation"
                >
                    <i className={menuOpen ? 'fas fa-xmark' : 'fas fa-bars'} aria-hidden="true" />
                </button>

                {offline ? (
                    <div className="admin-banner admin-banner--warn">
                        <i className="fas fa-triangle-exclamation" aria-hidden="true" />
                        <span>
                            The content API is not responding. You are seeing the site's built-in defaults, and
                            saving will fail until it is reachable.
                        </span>
                    </div>
                ) : null}

                <Outlet />
            </div>

            {menuOpen ? (
                <button
                    type="button"
                    className="admin-scrim"
                    aria-label="Close navigation"
                    onClick={() => setMenuOpen(false)}
                />
            ) : null}
        </div>
    );
}
