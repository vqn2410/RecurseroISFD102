import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import ResourceCard from '../components/ResourceCard';
import { Search, AlertCircle, Filter } from 'lucide-react';
import '../styles/home.css';
import { LandingFooter } from '../components/LandingUI';

const SearchPage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Get the 'q' query parameter
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        // We use onSnapshot to provide REALTIME updates for the search results.
        const q = query(collection(db, "recursos"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = [];
            snapshot.forEach((doc) => {
                usersList.push({ id: doc.id, ...doc.data() });
            });
            setResources(usersList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching resources in realtime: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const [filterType, setFilterType] = useState('todos');

    const filterOptions = [
        { id: 'todos', label: 'Todos' },
        { id: 'pdf', label: 'PDF' },
        { id: 'video', label: 'Video' },
        { id: 'youtube', label: 'YouTube' },
        { id: 'imagen', label: 'Imagen' },
        { id: 'enlace', label: 'Enlaces' },
        { id: 'texto', label: 'Texto' }
    ];

    // Filter resources based on query and type
    const filteredResources = resources.filter((resource) => {
        const queryLower = searchQuery.toLowerCase();
        const matchQuery = resource.title?.toLowerCase().includes(queryLower) ||
                           resource.description?.toLowerCase().includes(queryLower) ||
                           resource.tags?.some(tag => tag.toLowerCase().includes(queryLower));
        
        const matchType = filterType === 'todos' || resource.type === filterType;
        
        return matchQuery && matchType;
    });

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '0' }}>
            <div className="category-header" style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-color)', marginBottom: 0 }}>
                <div className="container" style={{ position: 'relative', zIndex: 1, padding: '3rem 1.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="category-bg-icons" style={{ opacity: 0.05, color: 'var(--primary)' }}>
                        <Search size={84} />
                    </div>
                    <h1 className="category-title" style={{ color: 'var(--primary)', fontSize: '2.5rem' }}>Resultados de Búsqueda</h1>
                    <p className="category-subtitle" style={{ color: 'var(--text-secondary)' }}>
                        Mostrando hallazgos para: <strong>"{searchQuery}"</strong>
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: '70px', zIndex: 10, padding: '1rem 0' }}>
               <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Filter size={18} color="var(--text-secondary)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Filtrar por:</span>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {filterOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFilterType(opt.id)}
                                    style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '99px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        background: filterType === opt.id ? 'var(--primary)' : 'var(--bg-color)',
                                        color: filterType === opt.id ? 'white' : 'var(--text-secondary)',
                                        border: `1px solid ${filterType === opt.id ? 'var(--primary)' : 'var(--border-color)'}`,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
               </div>
            </div>

            <div className="container" style={{ marginTop: '3rem', marginBottom: '5rem' }}>
                {!searchQuery ? (
                    <div className="alert alert-error" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <AlertCircle size={16} />
                        <span>Por favor, ingrese un término de búsqueda en la barra superior.</span>
                    </div>
                ) : loading ? (
                    <div className="loading-state text-center py-5">
                        <p className="text-secondary">Buscando recursos...</p>
                    </div>
                ) : filteredResources.length > 0 ? (
                    <div className="resources-grid-dense">
                        {filteredResources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state text-center py-5">
                        <Search size={48} className="mx-auto mb-3 text-secondary" />
                        <h3 className="mb-2">No se encontraron resultados</h3>
                        <p className="text-secondary">Pruebe con otros términos o cambie los filtros.</p>
                    </div>
                )}
            </div>
            
            <LandingFooter />
        </div>
    );
};

export default SearchPage;
