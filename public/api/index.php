<?php

declare(strict_types=1);

/**
 * CISS admin API - front controller.
 *
 * Every /api/* request lands here (see .htaccess) and is dispatched on method
 * plus path. Content documents are stored whole with an optimistic version
 * check, which is the right trade for a site edited by one person: far simpler
 * than per-record endpoints, and it still refuses to silently clobber an edit
 * made in another tab.
 */

require __DIR__ . '/config.php';
require __DIR__ . '/lib/Response.php';
require __DIR__ . '/lib/Store.php';
require __DIR__ . '/lib/Auth.php';
require __DIR__ . '/lib/Str.php';
require __DIR__ . '/lib/Sanitize.php';
require __DIR__ . '/lib/Content.php';
require __DIR__ . '/lib/Media.php';
require __DIR__ . '/lib/Inquiries.php';

// Never render PHP notices into a JSON response - a stray warning would make
// the body unparseable and mask the real error.
ini_set('display_errors', '0');
error_reporting(E_ALL);

set_exception_handler(static function (Throwable $e): void {
    error_log('[ciss-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    Response::error('Server error.', 500);
});

$store = new Store(CISS_DATA_DIR);
$auth = new Auth($store);
$media = new Media($store);
$inquiries = new Inquiries(CISS_DATA_DIR . '/inquiries');

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
$path = trim((string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH), '/');

// Strip the mount point so the same code works at /api and at a sub-path.
$path = (string) preg_replace('#^.*?api/?#', '', $path);
$segments = array_values(array_filter(explode('/', $path), static fn ($s) => $s !== ''));
$route = $segments[0] ?? '';
$sub = $segments[1] ?? '';

/** Decoded JSON body, or [] for non-JSON requests such as uploads. */
$readBody = static function (): array {
    $raw = file_get_contents('php://input');

    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $parsed = json_decode($raw, true);

    return is_array($parsed) ? $parsed : [];
};

$body = $readBody();

/** Documents the admin may write, and how each is cleaned on the way in. */
$documents = [
    'courses' => [Content::class, 'courses'],
    'news' => [Content::class, 'news'],
    'settings' => [Content::class, 'settings'],
    'text' => [Content::class, 'text'],
    'slots' => [Content::class, 'slots'],
];

switch (true) {
    // ---- health -----------------------------------------------------------
    // Deliberately unauthenticated: it reports environment readiness, not data,
    // and is the first thing to check when a deploy misbehaves.
    case $route === 'health' && $method === 'GET':
        Response::ok([
            'php' => PHP_VERSION,
            'dataDir' => CISS_DATA_DIR,
            'dataDirWritable' => is_dir(CISS_DATA_DIR) && is_writable(CISS_DATA_DIR),
            'uploadDir' => CISS_UPLOAD_DIR,
            // A fresh install has no uploads directory until the first image.
            // It is ready when the directory is writable OR PHP can create it
            // inside a writable parent directory.
            'uploadDirWritable' => is_dir(CISS_UPLOAD_DIR)
                ? is_writable(CISS_UPLOAD_DIR)
                : is_writable(dirname(CISS_UPLOAD_DIR)),
            'gd' => function_exists('imagecreatetruecolor'),
            'dom' => class_exists('DOMDocument'),
            'adminConfigured' => $auth->hasAnyUser(),
        ]);

    // ---- auth -------------------------------------------------------------
    case $route === 'auth' && $sub === 'login' && $method === 'POST':
        if (!$auth->hasAnyUser()) {
            Response::error('No admin account exists yet. Run tools/init-admin.php once.', 503);
        }

        $user = $auth->attempt((string) ($body['username'] ?? ''), (string) ($body['password'] ?? ''));

        if ($user === null) {
            usleep(300000); // Blunt the speed of automated guessing.
            Response::error('Invalid username or password.', 401);
        }

        Response::ok($user);

    case $route === 'auth' && $sub === 'logout' && $method === 'POST':
        $auth->logout();
        Response::ok(null);

    case $route === 'auth' && $sub === 'me' && $method === 'GET':
        Response::ok($auth->current());

    case $route === 'auth' && $sub === 'password' && $method === 'POST':
        $currentUser = $auth->require();
        $auth->changePassword(
            (string) $currentUser['username'],
            (string) ($body['currentPassword'] ?? ''),
            (string) ($body['newPassword'] ?? '')
        );
        Response::ok(null);

    // ---- public content bundle -------------------------------------------
    // One request gives the site everything it needs. Each document is null
    // until an admin saves it, and the frontend falls back to its bundled
    // defaults for anything null - so the site renders correctly on day one
    // and keeps rendering if the API ever goes away.
    case $route === 'content' && $method === 'GET':
        $bundle = [];

        foreach (array_keys($documents) as $name) {
            $envelope = $store->read($name);
            $bundle[$name] = [
                'version' => (int) ($envelope['version'] ?? 0),
                'updatedAt' => $envelope['updatedAt'] ?? null,
                'data' => $envelope['data'] ?? null,
            ];
        }

        Response::ok($bundle);

    // ---- individual documents --------------------------------------------
    case isset($documents[$route]) && $method === 'GET':
        Response::ok($store->read($route));

    case isset($documents[$route]) && $method === 'PUT':
        $auth->require();

        if (!array_key_exists('data', $body)) {
            Response::error('Request body needs a "data" property.', 422);
        }

        $expected = array_key_exists('version', $body) ? (int) $body['version'] : null;
        $clean = call_user_func($documents[$route], $body['data']);

        Response::ok($store->write($route, $clean, $expected));

    // ---- media ------------------------------------------------------------
    case $route === 'media' && $method === 'GET':
        Response::ok($media->all());

    case $route === 'media' && $method === 'POST':
        $auth->require();

        if (empty($_FILES['file'])) {
            Response::error('No file field in the request.', 422);
        }

        Response::ok($media->upload($_FILES['file']), 201);

    case $route === 'media' && $method === 'DELETE' && $sub !== '':
        $auth->require();
        $media->delete($sub);
        Response::ok(null);

    // ---- inquiries --------------------------------------------------------
    // POST is public - this is the contact form. Everything else needs auth,
    // because these records hold visitors' names, emails and phone numbers.
    case $route === 'inquiries' && $method === 'POST':
        Response::ok($inquiries->create($body), 201);

    case $route === 'inquiries' && $method === 'GET':
        $auth->require();
        Response::ok($inquiries->all());

    case $route === 'inquiries' && $method === 'PATCH' && $sub !== '':
        $auth->require();
        Response::ok($inquiries->markRead($sub, (bool) ($body['read'] ?? true)));

    case $route === 'inquiries' && $method === 'DELETE' && $sub !== '':
        $auth->require();
        $inquiries->delete($sub);
        Response::ok(null);

    default:
        Response::error('No such endpoint: ' . $method . ' /' . $path, 404);
}
