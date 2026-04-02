import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, File, Image as ImageIcon, Video, Link as LinkIcon, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
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
    const navigate = useNavigate();
    const { id, title, description, type, category, categories } = resource;

    const getCategoryStyle = (cat) => {
        const style = CATEGORY_COLORS[cat];
        return style ? { backgroundColor: style.bg, color: style.text } : {};
    };

    const getIcon = () => {
        switch (type) {
            case 'texto': return <FileText size={20} className="text-blue" />;
            case 'pdf': return <File size={20} className="text-red" />;
            case 'imagen': return <ImageIcon size={20} className="text-green" />;
            case 'video': case 'youtube': return <Video size={20} className="text-purple" />;
            case 'enlace': return <LinkIcon size={20} className="text-gray" />;
            default: return <File size={20} className="text-gray" />;
        }
    };

    return (
        <article className="resource-card-square animate-fade-in" onClick={() => navigate(`/recurso/${id}`)} style={{ cursor: 'pointer' }}>
            <div className="card-top">
                <div className="type-badge">{getIcon()}</div>
                <div className="cat-badges">
                    {(categories || [category]).filter(Boolean).map(cat => (
                        <span key={cat} className="mini-badge" style={getCategoryStyle(cat)}>{cat}</span>
                    ))}
                </div>
            </div>

            <div className="card-main">
                <h3 className="card-title-sq">{title}</h3>
                <p className="card-desc-sq">{description}</p>
            </div>

            <div className="card-bottom">
                <button className="btn-card-action" onClick={(e) => { e.stopPropagation(); navigate(`/recurso/${id}`); }}>
                    Detalles <ArrowRight size={14} />
                </button>
            </div>
        </article>
    );
};

export default memo(ResourceCard);
