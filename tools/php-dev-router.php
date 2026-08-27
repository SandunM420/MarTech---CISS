<?php

declare(strict_types=1);

/**
 * Router for PHP's built-in server during local development.
 *
 * The built-in server ignores .htaccess, so this reproduces the two rewrite
 * rules the live site relies on: /api/* goes to the API front controller, and
 * anything that is not a real file falls through to the SPA shell.
 *
 *   php -S localhost:8787 -t public tools/php-dev-router.php
 */

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$root = dirname(__DIR__) . '/public';

if (str_starts_with($path, '/api')) {
    require $root . '/api/index.php';
    return true;
}

$file = $root . $path;

if ($path !== '/' && is_file($file)) {
    return false; // Let the built-in server serve it with the right MIME type.
}

// No SPA shell in public/ during dev (Vite serves it), so report clearly.
http_response_code(404);
header('Content-Type: text/plain');
echo "dev router: no static file at " . $path . " (the SPA is served by Vite on :5173)\n";
return true;
