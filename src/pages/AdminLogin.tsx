import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { assetUrl } from '../utils/assets';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const locationState = location.state as LoginLocationState | null;
  const nextPath = locationState?.from?.pathname || '/certificate-courses';

  if (isAuthenticated) {
    return <Navigate to={nextPath} replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const loggedIn = login(username.trim(), password);

    if (!loggedIn) {
      setError('Invalid username or password.');
      return;
    }

    setError('');
    navigate(nextPath, { replace: true });
  };

  return (
    <section className="admin-login-page">
        <div className="admin-login-panel">
          <div className="admin-login-copy">
            <img
              src={assetUrl('images/logo.png')}
              alt="CISS Logo"
              className="admin-login-logo"
            />
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

          <button type="submit" className="btn btn-primary admin-login-submit">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
