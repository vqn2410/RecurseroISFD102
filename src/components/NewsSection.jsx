import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getNews } from '../services/newsService';
import { Newspaper, Calendar, X } from 'lucide-react';
import '../styles/news.css';

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchRecentNews = async () => {
            try {
                const data = await getNews();
                setNews(data);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentNews();
    }, []);

    const openNews = (item) => {
        setSelectedNews(item);
        document.body.style.overflow = 'hidden';
    };

    const closeNews = () => {
        setSelectedNews(null);
        document.body.style.overflow = 'auto';
    };

    if (loading) {
        return (
            <div className="section-header mt-10 text-center py-5">
                <p className="text-secondary">Cargando noticias...</p>
            </div>
        );
    }

    if (news.length === 0) {
        return null; // Hide the section if there are no news
    }

    return (
        <section id="noticias" className="news-section mt-10 animate-fade-in">
            <div className="section-header">
                <h2 className="pulse-red">Info <span className="ensam-pill">ENSAM</span></h2>
                <p className="text-secondary">Novedades y avisos importantes de la institución.</p>
            </div>

            <div className="news-grid">
                {news.map((item) => (
                    <div key={item.id} className="news-card" onClick={() => openNews(item)}>
                        {item.mainImage && (
                            <div className="news-card-image">
                                <img src={item.mainImage} alt={item.title} />
                            </div>
                        )}
                        <div className="news-card-content">
                            <h3 className="news-card-title">{item.title}</h3>
                            {item.subtitle && <p className="news-card-subtitle">{item.subtitle}</p>}
                            <div className="news-card-footer mt-auto">
                                <span className="news-date">
                                    <Calendar size={14} />
                                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedNews && createPortal(
                <div className="news-modal-overlay" onClick={closeNews}>
                    <div className="news-modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <button className="news-modal-close" onClick={closeNews}>
                            <X size={24} />
                        </button>
                        
                        {selectedNews.mainImage && (
                            <div className="news-modal-hero">
                                <img src={selectedNews.mainImage} alt={selectedNews.title} />
                            </div>
                        )}

                        <div className="news-modal-body">
                            <div className="news-modal-header">
                                <span className="news-modal-date">
                                    <Calendar size={16} /> 
                                    {selectedNews.createdAt?.toDate ? selectedNews.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                </span>
                                <h2>{selectedNews.title}</h2>
                                {selectedNews.subtitle && <h4 className="news-modal-subtitle">{selectedNews.subtitle}</h4>}
                            </div>

                            <div className="news-modal-blocks">
                                {selectedNews.blocks?.map((block, index) => {
                                    switch (block.type) {
                                        case 'titulo':
                                            return <h3 key={index} className="news-block-title">{block.value}</h3>;
                                        case 'subtitulo':
                                            return <h4 key={index} className="news-block-subtitle">{block.value}</h4>;
                                        case 'parrafo':
                                            return <p key={index} className="news-block-paragraph">{block.value}</p>;
                                        case 'imagen':
                                            return (
                                                <div key={index} className="news-block-image">
                                                    <img src={block.value} alt={`news-block-${index}`} />
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </div>

                            <div className="news-modal-author text-secondary mt-5" style={{ fontSize: '0.85rem' }}>
                                Publicado por: {selectedNews.createdBy}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
};

export default NewsSection;
