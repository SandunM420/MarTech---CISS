type RichContentProps = {
    html: string;
    className?: string;
    as?: 'div' | 'span';
};

/**
 * Renders HTML accepted by the content API's strict allowlist sanitiser.
 * Bundled defaults are authored in this repository; stored values are cleaned
 * by Sanitize::html before they can reach the public content response.
 */
export default function RichContent({ html, className, as: Tag = 'div' }: RichContentProps) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
