<?php

declare(strict_types=1);

/**
 * Small string helpers that do not assume ext-mbstring is loaded.
 *
 * mbstring is normally present on cPanel hosting, but it is an extension and
 * not guaranteed. Truncation matters here beyond portability: this site carries
 * Sinhala and Tamil course text, and cutting UTF-8 with plain substr() can slice
 * a character in half and produce mojibake.
 */
final class Str
{
    /** Truncate to $limit characters without splitting a multibyte character. */
    public static function limit(string $value, int $limit): string
    {
        if ($limit <= 0 || $value === '') {
            return '';
        }

        if (function_exists('mb_substr')) {
            return mb_substr($value, 0, $limit, 'UTF-8');
        }

        // preg_split with /u walks real UTF-8 code points.
        $characters = preg_split('//u', $value, -1, PREG_SPLIT_NO_EMPTY);

        if ($characters === false) {
            // Not valid UTF-8 - fall back to a byte cut, then drop any trailing
            // partial sequence so the result is still decodable.
            $cut = substr($value, 0, $limit);

            while ($cut !== '' && !self::isUtf8($cut)) {
                $cut = substr($cut, 0, -1);
            }

            return $cut;
        }

        if (count($characters) <= $limit) {
            return $value;
        }

        return implode('', array_slice($characters, 0, $limit));
    }

    private static function isUtf8(string $value): bool
    {
        return (bool) preg_match('//u', $value);
    }
}
