import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getResources } from '../services/resourceService';
import ResourceCard from '../components/ResourceCard';
import { AlertCircle, Filter, Dna, Microscope, Leaf, Bug, Zap, Orbit, Activity, Calculator, PieChart, Binary, TrendingUp, Pencil, BookOpen, Shapes, Backpack, Palette, Smile, Gamepad, Baby, Coins, Building, Banknote, TreeDeciduous, Recycle, Sun, Sprout, HeartHandshake, Users, Heart, Ear, MessageCircle, Mic, Volume2, Monitor, Cpu, Wifi, Bot } from 'lucide-react';
import '../styles/home.css';
import '../styles/categories.css';

const PROFESORADOS = [
    "Biología", "Física", "Matemática", "Primaria", "Inicial", "Economía"
];

const AREAS_TRANSVERSALES = [
    "Educación Ambiental", "ESI (Educación Sexual Integral)", "Fonoaudiología", "Tics"
];

const getCategoryTheme = (category) => {
    switch (category) {
        case 'Biología':
            return {
                className: 'theme-biologia',
                icons: [Dna, Microscope, Leaf, Bug],
                subtitle: 'Explora recursos sobre células, ADN, ecosistemas y organismos vivos.'
            };
        case 'Física':
            return {
                className: 'theme-fisica',
                icons: [Zap, Orbit, Activity, Calculator],
                subtitle: 'Encuentra gráficos de ecuaciones, representaciones de caída libre, movimiento y energía.'
            };
        case 'Matemática':
            return {
                className: 'theme-matematica',
                icons: [Calculator, PieChart, Binary, TrendingUp],
                subtitle: 'Material didáctico sobre fórmulas, símbolos matemáticos y gráficos de funciones.'
            };
        case 'Primaria':
            return {
                className: 'theme-primaria',
                icons: [Pencil, BookOpen, Shapes, Backpack],
                subtitle: 'Recursos amigables y básicos para la enseñanza inicial y primaria.'
            };
        case 'Inicial':
            return {
                className: 'theme-inicial',
                icons: [Palette, Smile, Gamepad, Baby],
                subtitle: 'Elementos visuales simples, coloridos y orientados a la educación temprana.'
            };
        case 'Economía':
            return {
                className: 'theme-economia',
                icons: [TrendingUp, Coins, Building, Banknote],
                subtitle: 'Gráficos de estadísticas, recursos de comercio, dinero y producción.'
            };
        case 'Educación Ambiental':
            return {
                className: 'theme-ambiental',
                icons: [TreeDeciduous, Recycle, Sun, Sprout],
                subtitle: 'Concientización, reciclaje, energías renovables y cuidado de la naturaleza.'
            };
        case 'ESI (Educación Sexual Integral)':
            return {
                className: 'theme-esi',
                icons: [HeartHandshake, Users, Heart, Smile],
                subtitle: 'Materiales claros y respetuosos sobre diversidad, inclusión y derechos.'
            };
        case 'Fonoaudiología':
            return {
                className: 'theme-fonoaudiologia',
                icons: [Ear, MessageCircle, Mic, Volume2],
                subtitle: 'Recursos relacionados con el lenguaje, la comunicación y la audición.'
            };
        case 'Tics':
            return {
                className: 'theme-tics',
                icons: [Monitor, Cpu, Wifi, Bot],
                subtitle: 'Tecnología, computadoras, redes e inteligencia artificial aplicada al aula.'
            };
        default:
            return {
                className: 'theme-default',
                icons: [BookOpen, Shapes, Monitor, Leaf],
                subtitle: 'Encuentra material didáctico específico para esta área de estudio.'
            };
    }
};

const Categories = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Get the 'tipo' query parameter
    const searchParams = new URLSearchParams(location.search);
    const categoryFilter = searchParams.get('tipo');

    useEffect(() => {
        const fetchFilteredResources = async () => {
            setLoading(true);
            try {
                const data = await getResources(categoryFilter);
                setResources(data);
            } catch (error) {
                console.error("Error fetching categorized resources:", error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryFilter) {
            fetchFilteredResources();
        } else {
            setLoading(false);
        }
    }, [categoryFilter]);

    const theme = getCategoryTheme(categoryFilter);

    return (
        <div className="category-container animate-fade-in">
            {!categoryFilter ? (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)', fontSize: '2.5rem' }}>Explorar Áreas</h2>

                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-secondary)' }}>Profesorados</h3>
                    <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3" style={{ marginBottom: '4rem' }}>
                        {PROFESORADOS.map(prof => {
                            const theme = getCategoryTheme(prof);
                            const FirstIcon = theme.icons[0];
                            return (
                                <Link to={`/categorias?tipo=${encodeURIComponent(prof)}`} key={prof} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={`card ${theme.className} category-card-anim`} style={{ height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', padding: '2.5rem 1rem' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1.2rem', display: 'inline-flex' }}>
                                            <FirstIcon size={48} strokeWidth={2} />
                                        </div>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{prof}</h3>
                                        <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.9 }}>{theme.subtitle}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>

                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--text-secondary)' }}>Áreas Transversales</h3>
                    <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
                        {AREAS_TRANSVERSALES.map(area => {
                            const theme = getCategoryTheme(area);
                            const FirstIcon = theme.icons[0];
                            return (
                                <Link to={`/categorias?tipo=${encodeURIComponent(area)}`} key={area} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={`card ${theme.className} category-card-anim`} style={{ height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'transform 0.2s', padding: '2.5rem 1rem' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%', marginBottom: '1.2rem', display: 'inline-flex' }}>
                                            <FirstIcon size={48} strokeWidth={2} />
                                        </div>
                                        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{area}</h3>
                                        <p style={{ fontSize: '0.875rem', margin: 0, opacity: 0.9 }}>{theme.subtitle}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <>
                    <div className={`category-header ${theme.className}`}>
                        <div className="category-bg-icons">
                            {theme.icons.map((Icon, idx) => (
                                <Icon key={idx} size={84} className="category-icon-anim" />
                            ))}
                        </div>
                        <h1 className="category-title">{categoryFilter}</h1>
                        <p className="category-subtitle">{theme.subtitle}</p>
                    </div>

                    <div className="resources-grid">
                        {loading ? (
                            <div className="loading-state text-center py-5">
                                <p className="text-secondary">Cargando recursos de {categoryFilter}...</p>
                            </div>
                        ) : resources.length > 0 ? (
                            <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
                                {resources.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state text-center py-5">
                                <Filter size={48} className="mx-auto mb-3 text-secondary" />
                                <h3 className="mb-2">Aún no hay recursos aquí</h3>
                                <p className="text-secondary">No se han subido materiales en la sección '{categoryFilter}'.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Categories;
