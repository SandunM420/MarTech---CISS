<?php

declare(strict_types=1);

/**
 * Allowlist HTML sanitiser for rich-text fields.
 *
 * Rich text is stored as HTML and rendered back into the live site, so anything
 * that survives here ends up executing in visitors' browsers. Everything not on
 * the allowlist is stripped: no <script>, no event handlers, no javascript:
 * URLs, no <iframe>, no style attributes.
 *
 * This runs on SAVE, so the stored data is already clean - the public site
 * never has to trust what it reads.
 */
final class Sanitize
{
    private const ALLOWED_TAGS = [
        // contentEditable in Chromium uses <div> for Enter-created blocks.
        // Keeping attribute-free divs preserves paragraph breaks on save;
        // stripping them would join every paragraph into one line.
        'p', 'div', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li',
        'a', 'h3', 'h4', 'blockquote', 'span',
    ];

    private const ALLOWED_ATTRIBUTES = [
        'a' => ['href', 'title', 'target', 'rel'],
    ];

    public static function html(string $input): string
    {
        $input = trim($input);

        if ($input === '') {
            return '';
        }

        if (!class_exists('DOMDocument')) {
            // Without ext-dom we cannot parse safely, so fall back to text.
            return self::plain($input);
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);

        // The meta charset makes DOMDocument treat the input as UTF-8; the
        // wrapper keeps it from inventing <html><body> around our fragment.
        $loaded = $document->loadHTML(
            '<?xml encoding="UTF-8"><div id="ciss-root">' . $input . '</div>',
            LIBXML_HTML_NODEFDTD | LIBXML_HTML_NOIMPLIED | LIBXML_NONET
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (!$loaded) {
            return self::plain($input);
        }

        $root = $document->getElementById('ciss-root');

        if ($root === null) {
            return self::plain($input);
        }

        self::clean($root);

        $output = '';

        foreach ($root->childNodes as $child) {
            $output .= $document->saveHTML($child);
        }

        return trim($output);
    }

    public static function plain(string $input): string
    {
        return trim(strip_tags($input));
    }

    /** Depth-first: unwrap disallowed elements, drop disallowed attributes. */
    private static function clean(DOMNode $node): void
    {
        // Snapshot first - the live NodeList shifts as nodes are removed.
        $children = [];

        foreach ($node->childNodes as $child) {
            $children[] = $child;
        }

        foreach ($children as $child) {
            if ($child instanceof DOMText) {
                continue;
            }

            if ($child instanceof DOMComment) {
                $child->parentNode?->removeChild($child);
                continue;
            }

            if (!$child instanceof DOMElement) {
                $child->parentNode?->removeChild($child);
                continue;
            }

            $tag = strtolower($child->tagName);

            // Script and style carry payload in their text, so remove outright
            // rather than unwrapping and keeping the contents.
            if ($tag === 'script' || $tag === 'style' || $tag === 'iframe' || $tag === 'object' || $tag === 'embed') {
                $child->parentNode?->removeChild($child);
                continue;
            }

            self::clean($child);

            if (!in_array($tag, self::ALLOWED_TAGS, true)) {
                self::unwrap($child);
                continue;
            }

            self::stripAttributes($child, $tag);
        }
    }

    private static function stripAttributes(DOMElement $element, string $tag): void
    {
        $allowed = self::ALLOWED_ATTRIBUTES[$tag] ?? [];
        $names = [];

        foreach ($element->attributes as $attribute) {
            $names[] = $attribute->nodeName;
        }

        foreach ($names as $name) {
            if (!in_array(strtolower($name), $allowed, true)) {
                $element->removeAttribute($name);
            }
        }

        if ($tag !== 'a') {
            return;
        }

        $href = trim($element->getAttribute('href'));

        if ($href === '' || !self::safeUrl($href)) {
            $element->removeAttribute('href');
            return;
        }

        $element->setAttribute('href', $href);

        // External links open in a new tab; noopener stops the opened page
        // reaching back through window.opener.
        if ($element->getAttribute('target') === '_blank') {
            $element->setAttribute('rel', 'noopener noreferrer');
        } else {
            $element->removeAttribute('target');
            $element->removeAttribute('rel');
        }
    }

    private static function safeUrl(string $url): bool
    {
        // Relative paths and anchors are fine.
        if (str_starts_with($url, '/') || str_starts_with($url, '#')) {
            return true;
        }

        $scheme = strtolower((string) parse_url($url, PHP_URL_SCHEME));

        return in_array($scheme, ['http', 'https', 'mailto', 'tel'], true);
    }

    /** Replaces an element with its children, keeping the text content. */
    private static function unwrap(DOMElement $element): void
    {
        $parent = $element->parentNode;

        if ($parent === null) {
            return;
        }

        while ($element->firstChild !== null) {
            $parent->insertBefore($element->firstChild, $element);
        }

        $parent->removeChild($element);
    }
}
