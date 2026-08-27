import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSiteContent } from '../context/SiteContentContext';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, checking, login } = useAdminAuth();
  const { image, settings } = useSiteContent();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const locationState = location.state as LoginLocationState | null;
  const nextPath = locationState?.from?.pathname || '/admin';

  if (!checking && isAuthenticated) {
    return <Navigate to={nextPath} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await login(username, password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(nextPath, { replace: true });
  };

  return (
    <section className="admin-login-page">
        <div className="admin-login-panel">
          <div className="admin-login-copy">
            <img
              src={image('header.logo')}
              alt={`${settings.siteName} logo`}
              className="admin-login-logo"
            />
            <div className="admin-login-heading">
              <span className="admin-login-eyebrow">Secure administration</span>
              <h1>CISS Admin</h1>
              <p>Sign in to manage the website.</p>
            </div>
          </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-login-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="admin-login-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary admin-login-submit" disabled={submitting || checking}>
            {submitting ? 'Signing in…' : checking ? 'Checking session…' : 'Sign in'}
          </button>
        </form>
      </div>
    </section>
  );
}
