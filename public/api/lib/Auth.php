<?php

declare(strict_types=1);

/**
 * Server-side admin authentication.
 *
 * The credentials this replaces were constants in the React bundle, which meant
 * they shipped to every visitor and were readable via view-source. Here the
 * password only ever exists as a password_hash() digest in the data directory,
 * which is not web-reachable, and the browser holds nothing but a session cookie.
 *
 * On first run, if no admin file exists, one is created from a generated
 * password that is printed exactly once by tools/init-admin.php.
 */
final class Auth
{
    private const STORE = 'admin';

    public function __construct(private readonly Store $store)
    {
    }

    public function startSession(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'httponly' => true,
            'secure' => $secure,
            'samesite' => 'Lax',
        ]);

        session_name('ciss_admin');
        session_start();
    }

    public function users(): array
    {
        return $this->store->readData(self::STORE, []) ?? [];
    }

    public function hasAnyUser(): bool
    {
        return $this->users() !== [];
    }

    public function attempt(string $username, string $password): ?array
    {
        $users = $this->users();
        $username = strtolower(trim($username));

        foreach ($users as $user) {
            if (strtolower((string) $user['username']) !== $username) {
                continue;
            }

            if (!password_verify($password, (string) $user['passwordHash'])) {
                return null;
            }

            $this->startSession();
            session_regenerate_id(true);

            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'] ?? 'admin';
            $_SESSION['expiresAt'] = time() + CISS_SESSION_LIFETIME;

            return $this->publicUser($user);
        }

        // Equalise timing so a wrong username is not measurably faster than a
        // wrong password.
        password_verify($password, '$2y$12$usesomesillystringfor.beforeitbecomesanactualhashvalue');

        return null;
    }

    public function current(): ?array
    {
        $this->startSession();

        if (empty($_SESSION['username']) || empty($_SESSION['expiresAt'])) {
            return null;
        }

        if (time() > (int) $_SESSION['expiresAt']) {
            $this->logout();
            return null;
        }

        // Sliding expiry: activity keeps the session alive.
        $_SESSION['expiresAt'] = time() + CISS_SESSION_LIFETIME;

        return [
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role'] ?? 'admin',
            'expiresAt' => $_SESSION['expiresAt'],
        ];
    }

    public function require(): array
    {
        $user = $this->current();

        if ($user === null) {
            Response::error('Not signed in.', 401);
        }

        return $user;
    }

    public function logout(): void
    {
        $this->startSession();
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'httponly' => true,
                'secure' => $params['secure'],
                'samesite' => 'Lax',
            ]);
        }

        session_destroy();
    }

    public function changePassword(string $username, string $currentPassword, string $newPassword): void
    {
        if (strlen($newPassword) < 10) {
            Response::error('New password must be at least 10 characters.', 422);
        }

        $users = $this->users();
        $found = false;

        foreach ($users as $index => $user) {
            if (strtolower((string) $user['username']) !== strtolower($username)) {
                continue;
            }

            if (!password_verify($currentPassword, (string) $user['passwordHash'])) {
                Response::error('Current password is incorrect.', 403);
            }

            $users[$index]['passwordHash'] = password_hash($newPassword, PASSWORD_DEFAULT);
            $found = true;
            break;
        }

        if (!$found) {
            Response::error('No such user.', 404);
        }

        $this->store->write(self::STORE, array_values($users));
    }

    private function publicUser(array $user): array
    {
        return [
            'username' => $user['username'],
            'role' => $user['role'] ?? 'admin',
            'expiresAt' => $_SESSION['expiresAt'] ?? null,
        ];
    }
}
