import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import { formatNewsDate } from '../data/news';

export default function LatestNewsCarousel() {
    const { news } = useSiteContent();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const published = useMemo(
        () => news
            .filter((item) => item.status === 'published' && !item.hidden)
            .sort((a, b) => b.date.localeCompare(a.date)),
        [news],
    );

    useEffect(() => {
        if (paused || published.length < 2) return undefined;
        const timer = window.setInterval(() => setIndex((current) => (current + 1) % published.length), 2000);
        return () => window.clearInterval(timer);
    }, [paused, published.length]);

    if (!published.length) return null;

    const safeIndex = index % published.length;
    const active = published[safeIndex];
    const move = (delta: number) => setIndex((current) => (current + delta + published.length) % published.length);

    return (
        <section className="latest-news-section" aria-labelledby="latest-news-heading">
            <div className="container">
                <div className="latest-news-heading-row">
                    <div>
                        <span className="latest-news-eyebrow">News & updates</span>
                        <h2 id="latest-news-heading">Latest News</h2>
                    </div>
                    <Link to="/news" className="latest-news-all-link">View all news <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
                </div>

                <div
                    className="latest-news-carousel"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocusCapture={() => setPaused(true)}
                    onBlurCapture={() => setPaused(false)}
                >
                    <article className="latest-news-slide" key={active.id}>
                        <Link to={`/news/${active.slug}`} className={`latest-news-image${active.cover ? '' : ' latest-news-image--empty'}`}>
                            {active.cover ? <img src={active.cover} alt="" /> : <i className="fas fa-newspaper" aria-hidden="true" />}
                        </Link>
                        <div className="latest-news-copy">
                            <time dateTime={active.date}>{formatNewsDate(active.date)}</time>
                            <h3><Link to={`/news/${active.slug}`}>{active.title}</Link></h3>
                            <p>{active.excerpt}</p>
                            <Link to={`/news/${active.slug}`} className="latest-news-read-link">Read full story <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
                        </div>
                    </article>

                    {published.length > 1 ? (
                        <>
                            <button type="button" className="latest-news-arrow latest-news-arrow--previous" onClick={() => move(-1)} aria-label="Previous news item"><i className="fas fa-chevron-left" /></button>
                            <button type="button" className="latest-news-arrow latest-news-arrow--next" onClick={() => move(1)} aria-label="Next news item"><i className="fas fa-chevron-right" /></button>
                            <div className="latest-news-dots" aria-label="Choose news item">
                                {published.map((item, itemIndex) => (
                                    <button type="button" key={item.id} className={itemIndex === safeIndex ? 'active' : ''} onClick={() => setIndex(itemIndex)} aria-label={`Show ${item.title}`} aria-current={itemIndex === safeIndex ? 'true' : undefined} />
                                ))}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
