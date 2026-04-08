import { useState, useEffect } from 'react';
import { createNews, getNews, deleteNews } from '../services/newsService';
import { auth } from '../services/firebase';
import { PlusCircle, Trash2, Image as ImageIcon, Type, Heading1, Heading2, X, Upload } from 'lucide-react';
import '../styles/admin.css';

const AdminNoticiasPanel = ({ userData }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [mainImageLink, setMainImageLink] = useState('');
    const [blocks, setBlocks] = useState([]); // {id, type, value}

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await getNews();
            setNews(data);
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBlock = (type) => {
        const newBlock = {
            id: Date.now().toString(),
            type: type,
            value: ''
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleRemoveBlock = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const handleBlockChange = (id, value) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, value } : b));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const userName = userData?.nombreCompleto || auth.currentUser?.email || "Admin";
            const newsData = { title, subtitle, mainImage: mainImageLink, blocks, createdBy: userName };
            await createNews(newsData);
            alert("Noticia publicada exitosamente");
            resetForm();
            fetchNews();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al publicar la noticia.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (n) => {
        if (window.confirm(`¿Estás seguro de eliminar la noticia "${n.title}"?`)) {
            try {
                await deleteNews(n.id, n.blocks, n.mainImage);
                setNews(news.filter(item => item.id !== n.id));
            } catch (error) {
                console.error("Failed to delete news:", error);
                alert("Error al eliminar la noticia");
            }
        }
    };

    const resetForm = () => {
        setIsCreating(false);
        setTitle('');
        setSubtitle('');
        setMainImageLink('');
        setBlocks([]);
    };

    if (isCreating) {
        return (
            <div className="publish-news-form">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>Publicar Nueva Noticia</h2>
                    <button className="btn btn-outline" onClick={resetForm}>Cancelar</button>
                </div>
                
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label>Título de la Noticia *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-input" placeholder="Ej: Nueva campaña de donación" />
                    </div>
                    <div className="form-group">
                        <label>Subtítulo (Opcional)</label>
                        <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="form-input" placeholder="Breve descripción o bajada de la noticia" />
                    </div>
                    <div className="form-group">
                        <label>Link / URL de Imagen de Portada (Opcional)</label>
                        <input type="text" value={mainImageLink} onChange={(e) => setMainImageLink(e.target.value)} className="form-input" placeholder="Ej: https://ejemplo.com/imagen.jpg" />
                    </div>

                    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Contenido de la Noticia</h3>
                        
                        <div className="blocks-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                            {blocks.map((block, index) => (
                                <div key={block.id} style={{ position: 'relative', padding: '1rem', backgroundColor: '#f9fafa', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBlock(block.id)}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}
                                    >
                                        <X size={20} />
                                    </button>

                                    {block.type === 'titulo' && (
                                        <div>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Título / Encabezado</label>
                                            <input type="text" value={block.value} onChange={(e) => handleBlockChange(block.id, e.target.value)} className="form-input" style={{ fontSize: '1.2rem', fontWeight: 'bold' }} placeholder="Escribe un título..." required />
                                        </div>
                                    )}

                                    {block.type === 'subtitulo' && (
                                        <div>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Subtítulo</label>
                                            <input type="text" value={block.value} onChange={(e) => handleBlockChange(block.id, e.target.value)} className="form-input" style={{ fontSize: '1.05rem', fontWeight: '600' }} placeholder="Escribe un subtítulo..." required />
                                        </div>
                                    )}

                                    {block.type === 'parrafo' && (
                                        <div>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Párrafo de texto</label>
                                            <textarea value={block.value} onChange={(e) => handleBlockChange(block.id, e.target.value)} className="form-input" rows={4} placeholder="Escribe el texto aquí..." required />
                                        </div>
                                    )}

                                    {block.type === 'imagen' && (
                                        <div>
                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Link / URL de la Imagen</label>
                                            <input type="text" value={block.value} onChange={(e) => handleBlockChange(block.id, e.target.value)} className="form-input" placeholder="Pega el link de la imagen aquí..." required />
                                            {block.value && block.value.startsWith('http') && <img src={block.value} alt="Preview" style={{ marginTop: '0.5rem', maxHeight: '150px', borderRadius: '4px' }} />}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {blocks.length === 0 && <p className="text-center text-secondary">Aún no has agregado contenido a esta noticia.</p>}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button type="button" className="btn btn-outline" onClick={() => handleAddBlock('titulo')}><Heading1 size={16} /> Agregar Título</button>
                            <button type="button" className="btn btn-outline" onClick={() => handleAddBlock('subtitulo')}><Heading2 size={16} /> Agregar Subtítulo</button>
                            <button type="button" className="btn btn-outline" onClick={() => handleAddBlock('parrafo')}><Type size={16} /> Agregar Párrafo</button>
                            <button type="button" className="btn btn-outline" onClick={() => handleAddBlock('imagen')}><ImageIcon size={16} /> Agregar Imagen</button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting || !title}>
                        {submitting ? 'Publicando...' : 'Publicar Noticia'} <Upload size={18} />
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Gestión de Noticias</h2>
                <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
                    <PlusCircle size={18} /> Nueva Noticia
                </button>
            </div>

            {loading ? (
                <p className="text-center py-5">Cargando noticias...</p>
            ) : news.length === 0 ? (
                <div className="empty-state text-center py-5">
                    <ImageIcon size={48} className="mx-auto mb-3 text-secondary" />
                    <h3 className="mb-2">Aún no hay noticias</h3>
                    <p className="text-secondary">Crea una nueva noticia para que se muestre en la página principal.</p>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Fecha</th>
                                <th>Autor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map(n => (
                                <tr key={n.id}>
                                    <td data-label="Título" style={{ fontWeight: '500' }}>{n.title}</td>
                                    <td data-label="Fecha">
                                        {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td data-label="Autor">{n.createdBy}</td>
                                    <td data-label="Acciones" className="actions-cell">
                                        <button
                                            className="btn-icon text-error hover-bg-red"
                                            onClick={() => handleDelete(n)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminNoticiasPanel;
