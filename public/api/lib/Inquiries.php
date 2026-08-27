<?php

declare(strict_types=1);

/**
 * Contact-form submissions.
 *
 * These are the one thing here written by visitors rather than by the admin, so
 * they are the one thing that can genuinely race: two people submitting at the
 * same instant. Rather than lock a shared array, each submission gets its own
 * file - concurrent writes touch different paths and cannot collide at all.
 *
 * Files live in the data directory, which sits outside public_html. That
 * matters: these records hold names, emails and phone numbers, and would be a
 * personal-data leak if they were web-reachable.
 */
final class Inquiries
{
    public function __construct(private readonly string $dir)
    {
    }

    private function ensureDir(): void
    {
        if (!is_dir($this->dir) && !@mkdir($this->dir, 0770, true) && !is_dir($this->dir)) {
            Response::error('Inquiry directory could not be created.', 500);
        }
    }

    public function create(array $input): array
    {
        $name = Sanitize::plain((string) ($input['name'] ?? ''));
        $email = trim((string) ($input['email'] ?? ''));
        $message = Sanitize::plain((string) ($input['message'] ?? ''));
        $phone = Sanitize::plain((string) ($input['phone'] ?? ''));
        $subject = Sanitize::plain((string) ($input['subject'] ?? ''));

        if ($name === '' || $message === '') {
            Response::error('Name and message are required.', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('That email address does not look right.', 422);
        }

        $this->ensureDir();
        $ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|ciss');

        // Cheap flood guard: a bot hammering the endpoint gets one record per
        // minute per address rather than thousands. Only the newest files need
        // inspecting because filenames sort chronologically.
        $recentFiles = glob($this->dir . '/*.json') ?: [];
        rsort($recentFiles, SORT_STRING);

        foreach (array_slice($recentFiles, 0, 50) as $recentFile) {
            $recent = json_decode((string) @file_get_contents($recentFile), true);

            if (!is_array($recent) || ($recent['ip'] ?? '') !== $ipHash) {
                continue;
            }

            $received = strtotime((string) ($recent['receivedAt'] ?? '')) ?: 0;

            if ($received > time() - 60) {
                Response::error('Please wait a minute before sending another message.', 429);
            }
        }

        $record = [
            'id' => gmdate('Ymd-His') . '-' . bin2hex(random_bytes(4)),
            'name' => Str::limit($name, 120),
            'email' => Str::limit($email, 160),
            'phone' => Str::limit($phone, 40),
            'subject' => Str::limit($subject, 200),
            'message' => Str::limit($message, 5000),
            'read' => false,
            'receivedAt' => gmdate('c'),
            'ip' => $ipHash,
        ];

        $file = $this->dir . '/' . $record['id'] . '.json';
        $json = json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if ($json === false || @file_put_contents($file, $json, LOCK_EX) === false) {
            Response::error('Could not save your message. Please call us instead.', 500);
        }

        @chmod($file, 0660);

        // The submitter has no use for the hashed IP - do not echo it back.
        unset($record["ip"]);

        return $record;
    }

    /** @return array<int,array> Newest first. */
    public function all(): array
    {
        if (!is_dir($this->dir)) {
            return [];
        }

        $files = glob($this->dir . '/*.json') ?: [];
        rsort($files, SORT_STRING);

        $records = [];

        foreach ($files as $file) {
            $parsed = json_decode((string) @file_get_contents($file), true);

            if (is_array($parsed)) {
                unset($parsed['ip']);
                $records[] = $parsed;
            }
        }

        return $records;
    }

    public function markRead(string $id, bool $read): array
    {
        $file = $this->fileFor($id);
        $parsed = json_decode((string) @file_get_contents($file), true);

        if (!is_array($parsed)) {
            Response::error('No such inquiry.', 404);
        }

        $parsed['read'] = $read;
        @file_put_contents($file, json_encode($parsed, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

        unset($parsed['ip']);

        return $parsed;
    }

    public function delete(string $id): void
    {
        @unlink($this->fileFor($id));
    }

    /** Ids are generated, never user-supplied text - validate before touching disk. */
    private function fileFor(string $id): string
    {
        if (!preg_match('/^[0-9]{8}-[0-9]{6}-[a-f0-9]{8}$/', $id)) {
            Response::error('Invalid inquiry id.', 400);
        }

        $file = $this->dir . '/' . $id . '.json';

        if (!is_file($file)) {
            Response::error('No such inquiry.', 404);
        }

        return $file;
    }
}
