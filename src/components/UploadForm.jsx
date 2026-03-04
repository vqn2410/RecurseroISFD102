import { useState } from 'react';
import { createResource } from '../services/resourceService';
import { auth } from '../services/firebase';
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/auth.css';

const PROFESORADOS = [
    "Biología", "Física", "Matemática", "Primaria", "Inicial", "Economía"
];

const AREAS_TRANSVERSALES = [
    "Educación Ambiental", "ESI (Educación Sexual Integral)", "Fonoaudiología", "Tics"
];

const UploadForm = ({ onUploadSuccess, userData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState('');
    const [linkUrl, setLinkUrl] = useState(''); // holds url text
    const [fileObject, setFileObject] = useState(null); // holds File object

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const toggleCategory = (cat) => {
        setCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (categories.length === 0) {
            setError("Debe seleccionar al menos una sección obligatoriamente (Profesorado o Área).");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

            if (!fileObject && !linkUrl) {
                setError("Debe proporcionar un Archivo o un Enlace válido.");
                setLoading(false);
                return;
            }

            const computedType = fileObject ? 'adjunto' : 'enlace';

            const resourceData = {
                title,
                description,
                type: computedType,
                categories,
                tags: tagsArray,
                fileUrl: linkUrl,
                createdBy: auth.currentUser ? auth.currentUser.uid : null,
                subidoPor: userData?.nombreCompleto || (auth.currentUser ? (auth.currentUser.displayName || (auth.currentUser.email ? auth.currentUser.email.split('@')[0] : 'Docente')) : 'Docente')
            };

            await createResource(resourceData, fileObject);

            setSuccess("Recurso subido correctamente.");
            if (onUploadSuccess) onUploadSuccess();

            // Reset
            setTitle('');
            setDescription('');
            setCategories([]);
            setTags('');
            setLinkUrl('');
            setFileObject(null);
            const fileInput = document.getElementById('fileUpload');
            if (fileInput) fileInput.value = '';

        } catch (err) {
            console.error(err);
            setError("Error al subir el recurso. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileObject(e.target.files[0]);
        }
    };

    return (
        <div className="card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="form-header">
                <h2>Subir Nuevo Recurso</h2>
                <p className="text-secondary">Complete los datos para agregar material didáctico u otros recursos.</p>
            </div>

            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <CheckCircle2 size={16} />
                    <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="title">Título del Recurso</label>
                    <input
                        id="title"
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Ej. Guía de ejercicios de Cinemática"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        className="form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="3"
                        placeholder="Breve reseña sobre el material..."
                    />
                </div>



                <div className="form-group">
                    <label className="form-label">Secciones / Destinos (Puede seleccionar varios)</label>
                    <div className="categories-selection grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div>
                            <strong>Profesorados</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                                {PROFESORADOS.map(prof => (
                                    <label key={prof} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={categories.includes(prof)}
                                            onChange={() => toggleCategory(prof)}
                                            className="form-checkbox"
                                        />
                                        <span>{prof}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <strong>Áreas Transversales</strong>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                                {AREAS_TRANSVERSALES.map(area => (
                                    <label key={area} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={categories.includes(area)}
                                            onChange={() => toggleCategory(area)}
                                            className="form-checkbox"
                                        />
                                        <span>{area}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="tags">Etiquetas (separadas por comas)</label>
                    <input
                        id="tags"
                        type="text"
                        className="form-input"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Ej. ejercicios, 1er año, cinemática"
                    />
                </div>

                <div className="form-group" style={{ border: '2px dashed #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold' }}>Opción 1: Subir un Archivo</label>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '10px' }}>PDF, Word, Imágenes, etc.</p>
                    <input
                        id="fileUpload"
                        type="file"
                        className="form-input"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="text-center" style={{ margin: '10px 0', fontWeight: 'bold', color: '#666' }}>O</div>

                <div className="form-group" style={{ border: '2px dashed #ddd', padding: '15px', borderRadius: '8px' }}>
                    <label className="form-label" style={{ fontWeight: 'bold' }} htmlFor="urlLink">Opción 2: Enlace Externo</label>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Link a YouTube, Drive, páginas web, etc.</p>
                    <input
                        id="urlLink"
                        type="url"
                        className="form-input"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-3" disabled={loading}>
                    {loading ? 'Subiendo...' : 'Subir Recurso'}
                    {!loading && <Upload size={18} />}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;
