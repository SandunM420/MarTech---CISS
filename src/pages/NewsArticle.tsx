import { Link, useParams } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';
import RichContent from '../components/RichContent';
import ScrollTopButton from '../components/ScrollTopButton';
import { formatNewsDate } from '../data/news';

export default function NewsArticle() {
    const { slug } = useParams();
    const { news } = useSiteContent();
    const item = news.find((entry) => entry.slug === slug && entry.status === 'published' && !entry.hidden);

    if (!item) {
        return <section className="news-not-found"><div className="container"><i className="fas fa-newspaper" /><h1>News article not found</h1><p>It may be unpublished or no longer available.</p><Link to="/news" className="btn btn-primary">View latest news</Link></div></section>;
    }

    return (
        <>
            <article className="news-article">
                <header className="news-article-header">
                    <div className="container news-article-heading">
                        <Link to="/news" className="news-back-link"><i className="fas fa-arrow-left" /> All news</Link>
                        <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                        <h1>{item.title}</h1>
                        <p>{item.excerpt}</p>
                        <span>By {item.author}</span>
                    </div>
                </header>
                {item.cover ? <div className="container news-article-cover"><img src={item.cover} alt="" /></div> : null}
                <div className="container news-article-layout">
                    <RichContent className="news-article-body rich-content" html={item.body} />
                </div>
            </article>
            <ScrollTopButton />
        </>
    );
}
