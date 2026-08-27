<?php

declare(strict_types=1);

/**
 * Flat-file JSON storage.
 *
 * Writes go to a temp file in the same directory and are then rename()d over
 * the target. rename() is atomic on POSIX, so a reader never sees a half-written
 * file and a crash mid-write cannot corrupt existing data.
 *
 * Every record carries a `version` integer. Saves send the version they loaded;
 * if it no longer matches, the write is rejected rather than silently clobbering
 * an edit made in another tab. See Store::write().
 */
final class Store
{
    public function __construct(private readonly string $dir)
    {
    }

    public function ensureDir(): void
    {
        if (!is_dir($this->dir) && !@mkdir($this->dir, 0770, true) && !is_dir($this->dir)) {
            Response::error(
                'Data directory is missing and could not be created: ' . $this->dir
                . '. Create it via cPanel File Manager and make it writable.',
                500
            );
        }
    }

    public function path(string $name): string
    {
        if (!preg_match('/^[a-z0-9-]+$/', $name)) {
            Response::error('Invalid store name.', 500);
        }

        return $this->dir . '/' . $name . '.json';
    }

    public function exists(string $name): bool
    {
        return is_file($this->path($name));
    }

    /**
     * Returns the stored envelope, or a fresh one when nothing is saved yet.
     * A missing file is a normal state - the site falls back to its bundled
     * defaults until an admin saves for the first time.
     */
    public function read(string $name): array
    {
        $file = $this->path($name);

        if (!is_file($file)) {
            return ['version' => 0, 'updatedAt' => null, 'data' => null];
        }

        $raw = @file_get_contents($file);

        if ($raw === false) {
            Response::error('Could not read ' . $name . '.', 500);
        }

        $parsed = json_decode($raw, true);

        if (!is_array($parsed) || !array_key_exists('data', $parsed)) {
            Response::error('Stored data for ' . $name . ' is corrupt.', 500);
        }

        return $parsed;
    }

    public function readData(string $name, mixed $fallback = null): mixed
    {
        return $this->read($name)['data'] ?? $fallback;
    }

    /**
     * @param int|null $expectedVersion When given, the write fails unless it
     *                                  matches what is currently stored.
     */
    public function write(string $name, mixed $data, ?int $expectedVersion = null): array
    {
        $this->ensureDir();

        $current = $this->read($name);
        $currentVersion = (int) ($current['version'] ?? 0);

        if ($expectedVersion !== null && $expectedVersion !== $currentVersion) {
            Response::error(
                'This content was changed somewhere else since you loaded it. Reload before saving.',
                409,
                ['currentVersion' => $currentVersion]
            );
        }

        $envelope = [
            'version' => $currentVersion + 1,
            'updatedAt' => gmdate('c'),
            'data' => $data,
        ];

        $file = $this->path($name);
        $temp = $file . '.' . bin2hex(random_bytes(6)) . '.tmp';
        $json = json_encode($envelope, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if ($json === false || @file_put_contents($temp, $json, LOCK_EX) === false) {
            @unlink($temp);
            Response::error('Could not save ' . $name . '. Check directory permissions.', 500);
        }

        if (!@rename($temp, $file)) {
            @unlink($temp);
            Response::error('Could not commit ' . $name . '.', 500);
        }

        @chmod($file, 0660);

        return $envelope;
    }
}
