<?php

declare(strict_types=1);

/**
 * Field-level cleaning for each stored document.
 *
 * Everything an admin submits passes through here before it touches disk, so
 * the public site never has to trust what it reads back. Rich-text fields go
 * through the HTML allowlist; everything else is reduced to plain text.
 */
final class Content
{
    public const CATEGORIES = ['certificate', 'advanced-certificate', 'nvq', 'diploma'];

    /** Course fields that keep formatting. The rest are plain text. */
    private const RICH_COURSE_FIELDS = ['modulesInfo', 'feesInfo'];

    private const PLAIN_COURSE_FIELDS = ['courseId', 'level', 'method', 'medium', 'duration'];

    private const SETTINGS_KEYS = [
        'siteName', 'tagline', 'phone', 'phoneDisplay', 'email', 'address',
        'facebook', 'linkedin', 'instagram', 'tiktok',
    ];

    public static function courses(mixed $data): array
    {
        if (!is_array($data)) {
            Response::error('Course catalog must be an object.', 422);
        }

        $clean = [];
        $seen = [];

        foreach (self::CATEGORIES as $category) {
            $list = $data[$category] ?? [];

            if (!is_array($list)) {
                Response::error('Category "' . $category . '" must be a list.', 422);
            }

            $clean[$category] = [];

            foreach ($list as $course) {
                $record = self::course($course);

                // Ids address a course across the whole catalog, so a duplicate
                // would make edits and deletes ambiguous.
                if (isset($seen[$record['id']])) {
                    Response::error('Duplicate course id: ' . $record['id'], 422);
                }

                $seen[$record['id']] = true;
                $clean[$category][] = $record;
            }
        }

        return $clean;
    }

    private static function course(mixed $course): array
    {
        if (!is_array($course)) {
            Response::error('Each course must be an object.', 422);
        }

        $variant = ($course['variant'] ?? '') === 'simple' ? 'simple' : 'detailed';

        $id = Sanitize::plain((string) ($course['id'] ?? ''));

        if (!preg_match('/^[A-Za-z0-9._-]{1,80}$/', $id)) {
            Response::error('Course id is missing or has unsupported characters: "' . $id . '"', 422);
        }

        $clean = [
            'id' => $id,
            'variant' => $variant,
            'title' => Str::limit(Sanitize::plain((string) ($course['title'] ?? '')), 300),
            'hidden' => (bool) ($course['hidden'] ?? false),
        ];

        if ($variant === 'simple') {
            return $clean;
        }

        foreach (self::PLAIN_COURSE_FIELDS as $field) {
            $clean[$field] = Str::limit(Sanitize::plain((string) ($course[$field] ?? '')), 300);
        }

        foreach (self::RICH_COURSE_FIELDS as $field) {
            $clean[$field] = Sanitize::html((string) ($course[$field] ?? ''));
        }

        $entry = $course['entryRequirements'] ?? [];

        if (!is_array($entry)) {
            $entry = [];
        }

        $lines = array_map(
            // Each requirement remains one list item, but may contain the same
            // safe inline formatting and links as other rich-text fields.
            static fn ($line) => Sanitize::html(Str::limit((string) $line, 2000)),
            $entry
        );

        $clean['entryRequirements'] = array_values(array_filter(
            $lines,
            static fn ($line) => trim(strip_tags($line)) !== ''
        ));

        return $clean;
    }

    /** A newest-first collection of public news articles and admin drafts. */
    public static function news(mixed $data): array
    {
        if (!is_array($data)) {
            Response::error('News must be a list.', 422);
        }

        $clean = [];
        $ids = [];
        $slugs = [];

        foreach ($data as $item) {
            if (!is_array($item)) {
                Response::error('Each news item must be an object.', 422);
            }

            $id = Sanitize::plain((string) ($item['id'] ?? ''));
            $slug = strtolower(Sanitize::plain((string) ($item['slug'] ?? '')));

            if (!preg_match('/^[A-Za-z0-9._-]{1,80}$/', $id)) {
                Response::error('A news item has an invalid id.', 422);
            }

            if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
                Response::error('News URL slugs may contain lowercase letters, numbers and single dashes.', 422);
            }

            if (isset($ids[$id]) || isset($slugs[$slug])) {
                Response::error('News ids and URL slugs must be unique.', 422);
            }

            $ids[$id] = true;
            $slugs[$slug] = true;

            $cover = trim((string) ($item['cover'] ?? ''));
            if ($cover !== '' && (!str_starts_with($cover, '/') || str_contains($cover, '..'))) {
                Response::error('News cover images must use a local uploaded image.', 422);
            }

            $date = Sanitize::plain((string) ($item['date'] ?? ''));
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                Response::error('News dates must use YYYY-MM-DD.', 422);
            }

            $clean[] = [
                'id' => $id,
                'title' => Str::limit(Sanitize::plain((string) ($item['title'] ?? '')), 300),
                'slug' => $slug,
                'excerpt' => Str::limit(Sanitize::plain((string) ($item['excerpt'] ?? '')), 600),
                'body' => Sanitize::html(Str::limit((string) ($item['body'] ?? ''), 50000)),
                'cover' => $cover,
                'author' => Str::limit(Sanitize::plain((string) ($item['author'] ?? '')), 120),
                'date' => $date,
                'status' => ($item['status'] ?? '') === 'published' ? 'published' : 'draft',
                'hidden' => (bool) ($item['hidden'] ?? false),
            ];
        }

        usort($clean, static fn ($a, $b) => strcmp($b['date'], $a['date']));

        return $clean;
    }

    public static function settings(mixed $data): array
    {
        if (!is_array($data)) {
            Response::error('Settings must be an object.', 422);
        }

        $clean = [];

        foreach (self::SETTINGS_KEYS as $key) {
            $clean[$key] = Str::limit(Sanitize::plain((string) ($data[$key] ?? '')), 500);
        }

        if ($clean['email'] !== '' && !filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('The contact email address is not valid.', 422);
        }

        foreach (['facebook', 'linkedin', 'instagram', 'tiktok'] as $key) {
            if ($clean[$key] === '') {
                continue;
            }

            if (!filter_var($clean[$key], FILTER_VALIDATE_URL)) {
                Response::error('The ' . $key . ' link must be a full URL.', 422);
            }
        }

        return $clean;
    }

    /** Free-form key/value page copy. Values keep inline formatting. */
    public static function text(mixed $data): array
    {
        if (!is_array($data)) {
            Response::error('Text content must be an object.', 422);
        }

        $clean = [];

        foreach ($data as $key => $value) {
            if (!is_string($key) || !self::isContentKey($key)) {
                continue;
            }

            $clean[$key] = Sanitize::html((string) $value);
        }

        return $clean;
    }

    /** Image slots: slot key -> URL of the chosen image. */
    public static function slots(mixed $data): array
    {
        if (!is_array($data)) {
            Response::error('Image slots must be an object.', 422);
        }

        $clean = [];

        foreach ($data as $key => $value) {
            if (!is_string($key) || !self::isContentKey($key)) {
                continue;
            }

            $url = trim((string) $value);

            // Same-origin paths only. A slot pointing at a remote host would
            // let anyone with admin access load third-party script-adjacent
            // content into the live site, and would break if that host went down.
            if ($url !== '' && !str_starts_with($url, '/')) {
                continue;
            }

            if (str_contains($url, '..')) {
                continue;
            }

            $clean[$key] = $url;
        }

        return $clean;
    }

    private static function isContentKey(string $key): bool
    {
        return (bool) preg_match('/^[a-z0-9][a-z0-9.-]{0,79}$/i', $key);
    }
}
