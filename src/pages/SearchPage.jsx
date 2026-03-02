import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import ResourceCard from '../components/ResourceCard';
import { Search, AlertCircle, Filter } from 'lucide-react';
import '../styles/home.css';

const SearchPage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Get the 'q' query parameter
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        // We use onSnapshot to provide REALTIME updates for the search results.
        // We fetch all resources and filter client-side because Firestore doesn't natively support
        // full-text search across multiple fields (title, description, tags) without a 3rd party service.
        const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
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

    // Filter resources based on query
    const filteredResources = resources.filter((resource) => {
        const queryLower = searchQuery.toLowerCase();

        const matchTitle = resource.title?.toLowerCase().includes(queryLower);
        const matchDescription = resource.description?.toLowerCase().includes(queryLower);
        const matchCategory = resource.category?.toLowerCase().includes(queryLower);

        // check categories array
        const matchCategoriesArray = resource.categories?.some(cat => cat.toLowerCase().includes(queryLower));

        // check tags array
        const matchTags = resource.tags?.some(tag => tag.toLowerCase().includes(queryLower));

        return matchTitle || matchDescription || matchCategory || matchCategoriesArray || matchTags;
    });

    return (
        <div className="category-container animate-fade-in">
            <div className="category-header bg-white" style={{ background: 'var(--surface-color)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="category-bg-icons" style={{ opacity: 0.05, color: 'var(--primary)' }}>
                    <Search size={84} className="category-icon-anim" />
                </div>
                <h1 className="category-title" style={{ color: 'var(--primary)' }}>Resultados de Búsqueda</h1>
                <p className="category-subtitle" style={{ color: 'var(--text-secondary)' }}>
                    Buscando: <strong>"{searchQuery}"</strong>
                </p>
            </div>

            <div className="resources-grid">
                {!searchQuery ? (
                    <div className="alert alert-error mt-10" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                        <AlertCircle size={16} />
                        <span>Por favor, ingrese un término de búsqueda en la barra superior.</span>
                    </div>
                ) : loading ? (
                    <div className="loading-state text-center py-5">
                        <p className="text-secondary">Buscando recursos en tiempo real...</p>
                    </div>
                ) : filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
                        {filteredResources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state text-center py-5">
                        <Filter size={48} className="mx-auto mb-3 text-secondary" />
                        <h3 className="mb-2">No se encontraron resultados</h3>
                        <p className="text-secondary">No hay materiales que coincidan con "{searchQuery}". Pruebe con otros términos o etiquetas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
