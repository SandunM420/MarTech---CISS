import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { formatNewsDate } from '../data/news';

export default function News() {
    const { news } = useSiteContent();
    const [month, setMonth] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const published = useMemo(
        () => news.filter((item) => item.status === 'published' && !item.hidden).sort((a, b) => b.date.localeCompare(a.date)),
        [news],
    );
    const filtered = useMemo(
        () => published.filter((item) => (
            (!month || item.date.startsWith(`${month}-`))
            && (!fromDate || item.date >= fromDate)
            && (!toDate || item.date <= toDate)
        )),
        [published, month, fromDate, toDate],
    );
    const hasFilters = Boolean(month || fromDate || toDate);
    const clearFilters = () => {
        setMonth('');
        setFromDate('');
        setToDate('');
    };

    return (
        <>
            <section className="news-index-header">
                <div className="container"><span>News & updates</span><h1>Latest News</h1><p>Stories, announcements and updates from CISS.</p></div>
            </section>
            <section className="news-index-section">
                <div className="container">
                    {published.length ? <div className="news-filter-panel" aria-label="Filter news by date">
                        <div className="news-filter-heading">
                            <div><span>Find an article</span><h2>Filter by date</h2></div>
                            {hasFilters ? <button type="button" onClick={clearFilters}><i className="fas fa-rotate-left" aria-hidden="true" /> Clear filters</button> : null}
                        </div>
                        <div className="news-filter-fields">
                            <label><span>Month</span><input type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>
                            <span className="news-filter-divider" aria-hidden="true">or</span>
                            <label><span>From date</span><input type="date" value={fromDate} max={toDate || undefined} onChange={(event) => setFromDate(event.target.value)} /></label>
                            <label><span>To date</span><input type="date" value={toDate} min={fromDate || undefined} onChange={(event) => setToDate(event.target.value)} /></label>
                        </div>
                        <p className="news-filter-count" aria-live="polite">Showing {filtered.length} of {published.length} {published.length === 1 ? 'article' : 'articles'}</p>
                    </div> : null}

                    {filtered.length ? (
                        <div className="news-card-grid">
                            {filtered.map((item) => (
                                <article className="news-card" key={item.id}>
                                    <Link to={`/news/${item.slug}`} className={`news-card-image${item.cover ? '' : ' news-card-image--empty'}`}>
                                        {item.cover ? <img src={item.cover} alt="" /> : <i className="fas fa-newspaper" aria-hidden="true" />}
                                    </Link>
                                    <div className="news-card-copy">
                                        <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                                        <h2><Link to={`/news/${item.slug}`}>{item.title}</Link></h2>
                                        <p>{item.excerpt}</p>
                                        <Link to={`/news/${item.slug}`}>Read story <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : published.length ? <div className="news-public-empty"><i className="fas fa-calendar-xmark" /><h2>No news found for these dates</h2><p>Choose another month or date range, or <button type="button" className="news-empty-clear" onClick={clearFilters}>clear the filters</button>.</p></div>
                        : <div className="news-public-empty"><i className="fas fa-newspaper" /><h2>No news published yet</h2><p>Please check back soon.</p></div>}
                </div>
            </section>
        </>
    );
}
