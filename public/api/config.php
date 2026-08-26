<?php
/**
 * Runtime configuration.
 *
 * The data directory holds admin credentials and visitor inquiries, so it must
 * NOT be web-reachable. On Namecheap the FTP account is scoped to public_html,
 * but PHP runs as the account user and can reach the whole home directory - so
 * the default puts data one level ABOVE the web root.
 *
 * Create it once via cPanel File Manager:  /home/<account>/ciss-data
 *
 * To override (local development, or a different layout), copy
 * config.local.php.example to config.local.php and set CISS_DATA_DIR there.
 * config.local.php is gitignored and never deployed.
 */

declare(strict_types=1);

if (is_file(__DIR__ . '/config.local.php')) {
    require __DIR__ . '/config.local.php';
}

if (!defined('CISS_DATA_DIR')) {
    // public/api -> public -> web root -> one above web root.
    define('CISS_DATA_DIR', dirname(__DIR__, 2) . '/ciss-data');
}

// Uploaded images must be web-reachable, so these live inside the web root.
if (!defined('CISS_UPLOAD_DIR')) {
    define('CISS_UPLOAD_DIR', dirname(__DIR__) . '/uploads');
}

if (!defined('CISS_UPLOAD_URL')) {
    define('CISS_UPLOAD_URL', '/uploads');
}

// Sessions idle out after this long. Matches the 30 minutes the old
// client-side auth used, so admin behaviour does not change.
if (!defined('CISS_SESSION_LIFETIME')) {
    define('CISS_SESSION_LIFETIME', 30 * 60);
}

if (!defined('CISS_MAX_UPLOAD_BYTES')) {
    define('CISS_MAX_UPLOAD_BYTES', 8 * 1024 * 1024);
}

// Longest edge an uploaded image is resized down to. The site currently ships a
// 7.7MB logo-white.png; this stops uploads repeating that mistake.
if (!defined('CISS_MAX_IMAGE_EDGE')) {
    define('CISS_MAX_IMAGE_EDGE', 2400);
}
