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

const UploadForm = ({ onUploadSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('adjunto'); // adjunto, enlace
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState('');
    const [fileOrUrl, setFileOrUrl] = useState(''); // holds url text or file
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

            const isFileRequired = type === 'adjunto' && !fileOrUrl;
            const isUrlRequired = type === 'enlace' && !fileOrUrl;

            if (isFileRequired && !fileObject) {
                setError("Debe seleccionar un archivo para subir.");
                setLoading(false);
                return;
            }

            if (isUrlRequired && !fileOrUrl) {
                setError("Debe proveer una URL/Enlace válido.");
                setLoading(false);
                return;
            }

            const resourceData = {
                title,
                description,
                type,
                categories,
                tags: tagsArray,
                fileUrl: type === 'enlace' ? fileOrUrl : '',
                createdBy: auth.currentUser ? auth.currentUser.uid : null
            };

            await createResource(resourceData, fileObject);

            setSuccess("Recurso subido correctamente.");
            if (onUploadSuccess) onUploadSuccess();

            // Reset
            setTitle('');
            setDescription('');
            setType('adjunto');
            setCategories([]);
            setTags('');
            setFileOrUrl('');
            setFileObject(null);

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

                <div className="grid grid-cols-2">
                    <div className="form-group">
                        <label className="form-label" htmlFor="type">Tipo de Recurso</label>
                        <select
                            id="type"
                            className="form-select"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setFileObject(null);
                                setFileOrUrl('');
                            }}
                            required
                        >
                            <option value="adjunto">Archivo Adjunto (PDF, Imagen, Video...)</option>
                            <option value="enlace">Enlace Externo (YouTube, Drive...)</option>
                        </select>
                    </div>
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

                <div className="form-group">
                    {type === 'enlace' ? (
                        <>
                            <label className="form-label" htmlFor="urlLink">Enlace (URL)</label>
                            <input
                                id="urlLink"
                                type="url"
                                className="form-input"
                                value={fileOrUrl}
                                onChange={(e) => setFileOrUrl(e.target.value)}
                                required
                                placeholder="https://..."
                            />
                        </>
                    ) : (
                        <>
                            <label className="form-label" htmlFor="fileUpload">Archivo</label>
                            <input
                                id="fileUpload"
                                type="file"
                                className="form-input"
                                onChange={handleFileChange}
                                required
                            />
                        </>
                    )}
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
