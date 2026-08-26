<?php

declare(strict_types=1);

/**
 * Every response this API sends is JSON. Helpers keep the shape consistent so
 * the TypeScript client can rely on `{ ok: true, data }` / `{ ok: false, error }`.
 */
final class Response
{
    public static function json(mixed $payload, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate');
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function ok(mixed $data = null, int $status = 200): never
    {
        self::json(['ok' => true, 'data' => $data], $status);
    }

    public static function error(string $message, int $status = 400, ?array $extra = null): never
    {
        $body = ['ok' => false, 'error' => $message];

        if ($extra !== null) {
            $body += $extra;
        }

        self::json($body, $status);
    }
}
