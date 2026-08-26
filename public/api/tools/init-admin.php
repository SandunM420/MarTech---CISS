<?php

declare(strict_types=1);

/**
 * One-time admin bootstrap.
 *
 * Creates the first admin account and prints its password exactly once. The
 * password is generated here rather than chosen, so it never travels through a
 * chat message, a commit, or a browser form on the way in.
 *
 * Run it from the command line (cPanel -> Terminal, or SSH):
 *
 *     php public_html/api/tools/init-admin.php
 *     php public_html/api/tools/init-admin.php --username=someone
 *
 * It refuses to run over HTTP. If it were web-reachable, anyone who found the
 * URL could mint themselves an account.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    header('Content-Type: text/plain');
    exit("This script only runs from the command line.\n");
}

require __DIR__ . '/../config.php';
require __DIR__ . '/../lib/Response.php';
require __DIR__ . '/../lib/Store.php';

$options = getopt('', ['username::', 'force']);
$username = trim((string) ($options['username'] ?? 'admin'));
$force = array_key_exists('force', $options);

if (!preg_match('/^[A-Za-z0-9._-]{3,40}$/', $username)) {
    exit("Username must be 3-40 characters: letters, numbers, dot, dash, underscore.\n");
}

$store = new Store(CISS_DATA_DIR);
$store->ensureDir();

$existing = $store->readData('admin', []) ?? [];

if ($existing !== [] && !$force) {
    echo "An admin account already exists (" . count($existing) . " user(s)).\n";
    echo "Re-run with --force to REPLACE all accounts.\n";
    exit(1);
}

/** Ambiguous characters removed - this gets read off a screen and retyped. */
$alphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
$password = '';

for ($i = 0; $i < 20; $i++) {
    $password .= $alphabet[random_int(0, strlen($alphabet) - 1)];
}

$store->write('admin', [[
    'username' => $username,
    'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
    'role' => 'admin',
    'createdAt' => gmdate('c'),
]]);

echo "\n";
echo "  Admin account created.\n";
echo "  ----------------------------------------\n";
echo "  Username:  " . $username . "\n";
echo "  Password:  " . $password . "\n";
echo "  ----------------------------------------\n";
echo "  Stored at: " . CISS_DATA_DIR . "/admin.json\n";
echo "\n";
echo "  This password is shown once and is not recoverable - only its hash is\n";
echo "  stored. Save it in a password manager now. To replace it later, sign in\n";
echo "  and use Change password, or re-run this script with --force.\n";
echo "\n";
