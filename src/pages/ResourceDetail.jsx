import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResourceById } from '../services/resourceService';
import { 
    FileText, File, Image as ImageIcon, Video, Link as LinkIcon, 
    ArrowLeft, Tag, ExternalLink, Download, 
    Info, Layers, Share2, Clipboard, Globe 
} from 'lucide-react';
import '../styles/resource-detail.css';
import { LandingFooter } from '../components/LandingUI';

const CATEGORY_THEMES = {
    "Biología": { gradient: "linear-gradient(135deg, #10B981, #047857)", color: "#10B981" },
    "Física": { gradient: "linear-gradient(135deg, #4F46E5, #312E81)", color: "#4F46E5" },
    "Matemática": { gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)", color: "#0EA5E9" },
    "Primaria": { gradient: "linear-gradient(135deg, #F59E0B, #B45309)", color: "#F59E0B" },
    "Inicial": { gradient: "linear-gradient(135deg, #EC4899, #BE185D)", color: "#EC4899" },
    "Economía": { gradient: "linear-gradient(135deg, #64748B, #334155)", color: "#64748B" },
    "Educación Ambiental": { gradient: "linear-gradient(135deg, #22C55E, #166534)", color: "#22C55E" },
    "ESI (Educación Sexual Integral)": { gradient: "linear-gradient(135deg, #A855F7, #7E22CE)", color: "#A855F7" },
    "Fonoaudiología": { gradient: "linear-gradient(135deg, #06B6D4, #0E7490)", color: "#06B6D4" },
    "Tics": { gradient: "linear-gradient(135deg, #3B82F6, #1D4ED8)", color: "#3B82F6" },
    "default": { gradient: "linear-gradient(135deg, #374151, #111827)", color: "#374151" }
};

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const data = await getResourceById(id);
                setResource(data);
                
                // Automatic scroll to the resource content after loading
                setTimeout(() => {
                    window.scrollTo({ top: 120, behavior: 'instant' });
                }, 10);
            } catch (err) {
                console.error("Detalle fetch error:", err);
                setError('No se pudo encontrar el recurso solicitado.');
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
        window.scrollTo(0, 100);
    }, [id]);

    const getTheme = () => {
        if (!resource) return CATEGORY_THEMES.default;
        const mainCat = resource.categories?.[0] || resource.category;
        return CATEGORY_THEMES[mainCat] || CATEGORY_THEMES.default;
    };

    const getIcon = (type, size = 24) => {
        switch (type) {
            case 'texto': return <FileText size={size} />;
            case 'pdf': return <File size={size} />;
            case 'imagen': return <ImageIcon size={size} />;
            case 'video': case 'youtube': return <Video size={size} />;
            case 'enlace': return <LinkIcon size={size} />;
            default: return <File size={size} />;
        }
    };


    const getEmbedYoutubeUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    if (loading) return (
        <div className="container py-10 text-center animate-pulse" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-secondary" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Cargando portal de recurso...</p>
        </div>
    );
    
    if (error) return (
        <div className="container py-10 text-center" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fef2f2', padding: '3rem', borderRadius: '24px', border: '1px solid #f87171' }}>
                <Info size={64} style={{ color: '#ef4444', marginBottom: '1.5rem' }} />
                <h1 style={{ color: '#991b1b', marginBottom: '1rem' }}>Recurso no encontrado</h1>
                <p style={{ color: '#b91c1c', marginBottom: '2rem' }}>{error}</p>
                <button onClick={() => navigate(-1)} className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626' }}>
                    Regresar al Explorador
                </button>
            </div>
        </div>
    );

    if (!resource) return null;

    const theme = getTheme();
    const isVideo = (resource.type === 'video' || resource.type === 'youtube') && resource.fileUrl;
    const embedUrl = isVideo ? getEmbedYoutubeUrl(resource.fileUrl) : null;

    return (
        <div className="detail-page animate-fade-in" style={{ paddingBottom: 0 }}>
            <button onClick={() => navigate(-1)} className="detail-back-btn">
                <ArrowLeft size={18} /> Volver
            </button>

            <header className="detail-header" style={{ background: theme.gradient, height: '220px' }}>
                <div className="detail-header-overlay" style={{ opacity: 0.8 }}></div>
                <div className="detail-header-icons">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                            {getIcon(resource.type, 180)}
                        </div>
                    ))}
                </div>
            </header>

            <div className="detail-card-container" style={{ marginTop: '-120px' }}>
                <div className="detail-main-card">
                    {/* Header integration in card */}
                    <div className="detail-content-header" style={{ padding: '2.5rem 2.5rem 0', borderBottom: 'none' }}>
                        <div className="detail-meta-pill mb-2" style={{ background: 'rgba(var(--primary-rgb, 79, 70, 229), 0.1)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', backdropFilter: 'none' }}>
                            {getIcon(resource.type, 16)}
                            <span>Recurso {resource.type?.toUpperCase()}</span>
                        </div>
                        <h1 className="detail-header-title" style={{ color: 'var(--text-primary)', textShadow: 'none', textAlign: 'left', marginBottom: '1rem', marginTop: '0.5rem', width: '100%' }}>{resource.title}</h1>

                        {/* Botón de Acción Rápida (PARA CARGA SIN SCROLL) */}
                        {resource.fileUrl && (
                            <div style={{ marginBottom: '2rem' }}>
                                <a 
                                    href={resource.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-primary"
                                    style={{ background: theme.gradient, borderColor: 'transparent', width: 'auto', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 'Bold', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '12px' }}
                                >
                                    {resource.type === 'enlace' || resource.type === 'youtube' ? (
                                        <>Explorar Recurso <ExternalLink size={20} /></>
                                    ) : (
                                        <>Descargar Material <Download size={20} /></>
                                    )}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="detail-content-grid" style={{ paddingTop: '1rem' }}>
                        <article className="detail-body">
                            {/* Vista Previa Automática (AHORA PRIMERO) */}
                            {(resource.type === 'imagen' || resource.type === 'pdf' || embedUrl) && (
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h2 className="detail-section-title">
                                        <ImageIcon size={20} /> Vista Previa del Material
                                    </h2>
                                    <div className="detail-video-wrapper">
                                        {resource.type === 'imagen' && (
                                            <img 
                                                src={resource.fileUrl} 
                                                alt={resource.title} 
                                                style={{ width: '100%', maxHeight: '600px', objectFit: 'contain', background: '#f8fafc', padding: '1rem' }} 
                                            />
                                        )}
                                        {resource.type === 'pdf' && (
                                            <iframe
                                                src={`${resource.fileUrl}#toolbar=0`}
                                                width="100%"
                                                height="600px"
                                                title={resource.title}
                                                style={{ border: 'none' }}
                                            ></iframe>
                                        )}
                                        {embedUrl && (
                                            <iframe
                                                width="100%"
                                                height="450"
                                                src={embedUrl}
                                                title={resource.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        )}
                                    </div>
                                </div>
                            )}

                            <h2 className="detail-section-title">
                                <FileText size={20} /> Información y Descripción
                            </h2>
                            <div className="detail-description">
                                {resource.description || 'Sin descripción disponible.'}
                            </div>
                        </article>

                        <aside className="detail-sidebar">
                            <h3 className="detail-section-title">
                                <Info size={18} /> Información
                            </h3>
                            
                            <div className="detail-info-item">
                                <div className="detail-info-label">Categoría Principal</div>
                                <div className="detail-info-value" style={{ color: theme.color }}>
                                    <Layers size={16} /> {resource.category || resource.categories?.[0] || 'General'}
                                </div>
                            </div>

                            <div className="detail-info-item">
                                <div className="detail-info-label">Tipo de Archivo</div>
                                <div className="detail-info-value">
                                    {getIcon(resource.type, 16)} {resource.type?.toUpperCase()}
                                </div>
                            </div>

                            <div className="detail-info-item">
                                <div className="detail-info-label">Etiqutas Relacionadas</div>
                                <div className="detail-tag-cloud">
                                    {(resource.categories || []).map(cat => (
                                        <span key={cat} style={{ background: theme.color, color: 'white', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                                            {cat}
                                        </span>
                                    ))}
                                    {(resource.tags || []).map(tag => (
                                        <span key={tag} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            <Tag size={12} /> {tag}
                                        </span>
                                    ))}
                                    {(!resource.categories?.length && !resource.tags?.length) && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No hay etiquetas</span>}
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <button 
                                    className="btn btn-outline" 
                                    style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("¡Enlace copiado!");
                                    }}
                                >
                                    <LinkIcon size={16} /> Copiar URL Directa
                                </button>
                            </div>
                        </aside>
                    </div>

                    <div className="detail-cta-bar">
                        {resource.fileUrl ? (
                            <a 
                                href={resource.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn btn-primary btn-detail-main"
                                style={{ background: theme.gradient, borderColor: 'transparent' }}
                            >
                                {resource.type === 'enlace' || resource.type === 'youtube' ? (
                                    <>Abrir Recurso Externo <ExternalLink size={24} /></>
                                ) : (
                                    <>Descargar Material <Download size={24} /></>
                                )}
                            </a>
                        ) : (
                            <div className="alert alert-error" style={{ width: '100%', textAlign: 'center', background: '#fef2f2', color: '#991b1b', border: '1px solid #f87171' }}>
                                ⚠️ El archivo original no está disponible momentáneamente.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <LandingFooter />
        </div>
    );
};

export default ResourceDetail;
