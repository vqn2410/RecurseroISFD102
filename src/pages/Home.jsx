import { useState, useEffect } from 'react';
import { getResources } from '../services/resourceService';
import { Link } from 'react-router-dom';
import ResourceCard from '../components/ResourceCard';
import { Layers, Search } from 'lucide-react';
import '../styles/home.css';

const Home = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentResources = async () => {
            try {
                const data = await getResources();
                setResources(data.slice(0, 6)); // Simulate limit for recent
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentResources();
    }, []);

    return (
        <div className="home-container animate-fade-in">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Recursos Educativos al Alcance</h1>
                    <p className="hero-subtitle">
                        Explora materiales didácticos, bibliografía, enlaces y más para potenciar el aprendizaje
                        en las diferentes disciplinas y áreas transversales.
                    </p>
                    <div className="hero-actions">
                        <Link to="/categorias?tipo=Biolog%C3%ADa" className="btn btn-primary">
                            <Layers size={18} /> Explorar Áreas
                        </Link>
                    </div>
                </div>
            </section>

            <section className="recent-resources mt-10">
                <div className="section-header">
                    <h2>Recursos Destacados y Recientes</h2>
                    <p className="text-secondary">Lo último agregado por nuestros docentes.</p>
                </div>

                {loading ? (
                    <div className="loading-state text-center py-5">
                        <p className="text-secondary">Cargando recursos...</p>
                    </div>
                ) : resources.length > 0 ? (
                    <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
                        {resources.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state text-center py-5">
                        <Search size={48} className="mx-auto mb-3 text-secondary" />
                        <h3 className="mb-2">Aún no hay recursos</h3>
                        <p className="text-secondary">Los recursos subidos por los docentes aparecerán aquí.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
