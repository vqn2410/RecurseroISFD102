import { memo } from 'react';
import { FileText, File, Image as ImageIcon, Video, Link as LinkIcon, ExternalLink, Calendar } from 'lucide-react';
import '../styles/resource-card.css';

const ResourceCard = ({ resource }) => {
    const { title, description, type, category, categories, fileUrl, createdAt, tags } = resource;

    const getIcon = () => {
        switch (type) {
            case 'texto': return <FileText className="resource-icon text-blue" />;
            case 'pdf': return <File className="resource-icon text-red" />;
            case 'imagen': return <ImageIcon className="resource-icon text-green" />;
            case 'video': return <Video className="resource-icon text-purple" />;
            case 'youtube': return <Video className="resource-icon text-purple" />;
            case 'enlace': return <LinkIcon className="resource-icon text-gray" />;
            case 'adjunto': return <File className="resource-icon text-blue" />;
            default: return <File className="resource-icon text-gray" />;
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getEmbedYoutubeUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    return (
        <article className="card resource-card animate-fade-in">
            <div className="card-header">
                <div className="card-type-icon">{getIcon()}</div>
                <div className="card-meta">
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {categories && categories.length > 0 ? (
                            categories.map(cat => <span key={cat} className="badge category-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{cat}</span>)
                        ) : (
                            <span className="badge category-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{category}</span>
                        )}
                    </div>
                    {createdAt && (
                        <span className="date">
                            <Calendar size={12} className="date-icon" />
                            {formatDate(createdAt)}
                        </span>
                    )}
                </div>
            </div>

            <div className="card-body">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>

                {tags && tags.length > 0 && (
                    <div className="tags-container">
                        {tags.map((tag, idx) => (
                            <span key={idx} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            {type === 'youtube' && fileUrl && (
                <div className="video-container">
                    {getEmbedYoutubeUrl(fileUrl) ? (
                        <iframe
                            width="100%"
                            height="200"
                            src={getEmbedYoutubeUrl(fileUrl)}
                            title={title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
                            Ver video en YouTube <ExternalLink size={16} />
                        </a>
                    )}
                </div>
            )}

            <div className="card-footer">
                {type !== 'youtube' && fileUrl && (
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full"
                    >
                        {type === 'enlace' ? 'Abrir Enlace' : 'Ver / Descargar'} <ExternalLink size={16} />
                    </a>
                )}
            </div>
        </article>
    );
};

export default memo(ResourceCard);
