import { useState, useEffect } from 'react';
import { getNews } from '../services/newsService';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

const NewsSidebar = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getNews();
                setNews(data.slice(0, 5)); // Show only 5 most recent
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return <div>Cargando noticias...</div>;
    if (news.length === 0) return null;

    return (
        <aside className="news-sidebar" style={{
            background: 'var(--surface-color)',
            borderLeft: '1px solid var(--border-color)',
            padding: '1.5rem',
            height: 'fit-content',
            position: 'sticky',
            top: '100px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '4px', height: '1.5rem', background: 'var(--primary)', borderRadius: '2px' }}></span>
                Noticias Recientes
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {news.map(item => (
                    <Link key={item.id} to="/noticias" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span className="news-date" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <Calendar size={12} /> {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}
                            </span>
                            <h4 style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.3', fontWeight: '600', color: 'var(--text-primary)' }} className="hover-primary">
                                {item.title}
                            </h4>
                        </div>
                    </Link>
                ))}
            </div>

            <Link to="/noticias" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: '600',
                textDecoration: 'none'
            }}>
                Ver todas <ChevronRight size={14} />
            </Link>
        </aside>
    );
};

export default NewsSidebar;
