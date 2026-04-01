import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, File, Image as ImageIcon, Video, Link as LinkIcon, ExternalLink, Calendar } from 'lucide-react';
import '../styles/resource-card.css';

const CATEGORY_COLORS = {
    "Biología": { bg: "#dcfce7", text: "#166534" },
    "Física": { bg: "#f3e8ff", text: "#6b21a8" },
    "Matemática": { bg: "#e0f2fe", text: "#075985" },
    "Primaria": { bg: "#ffedd5", text: "#9a3412" },
    "Inicial": { bg: "#fce7f3", text: "#9d174d" },
    "Economía": { bg: "#fef9c3", text: "#854d0e" },
    "Educación Ambiental": { bg: "#ecfdf5", text: "#065f46" },
    "ESI (Educación Sexual Integral)": { bg: "#ffe4e6", text: "#9f1239" },
    "Fonoaudiología": { bg: "#ecfeff", text: "#155e75" },
    "Tics": { bg: "#e0e7ff", text: "#3730a3" }
};

const ResourceCard = ({ resource }) => {
    const { title, description, type, category, categories, fileUrl, createdAt, tags } = resource;

    const getCategoryStyle = (cat) => {
        const style = CATEGORY_COLORS[cat];
        if (style) {
            return { backgroundColor: style.bg, color: style.text, borderColor: style.text + "33" };
        }
        return {}; // default badge style
    };

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
                            categories.map(cat => (
                                <Link 
                                    key={cat} 
                                    to={`/categorias?tipo=${encodeURIComponent(cat)}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <span 
                                        className="badge category-badge" 
                                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', cursor: 'pointer', ...getCategoryStyle(cat) }}
                                    >
                                        {cat}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            category && (
                                <Link 
                                    to={`/categorias?tipo=${encodeURIComponent(category)}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <span 
                                        className="badge category-badge" 
                                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', cursor: 'pointer', ...getCategoryStyle(category) }}
                                    >
                                        {category}
                                    </span>
                                </Link>
                            )
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
                {(resource.subidoPor || resource.fechaSubida || resource.createdAt) && (
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                        Subido por {
                            (resource.creatorEmail === 'nvergara@abc.gob.ar' || 
                             resource.subidoPor === 'nvergara' || 
                             resource.subidoPor === 'nvergara@abc.gob.ar') 
                                ? 'Administrador UA ENSAM' 
                                : (resource.subidoPor || 'Docente')
                        } el {formatDate(resource.fechaSubida || resource.createdAt)}
                    </p>
                )}
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
