import { useState, useEffect } from 'react';
import { getResources, deleteResource } from '../services/resourceService';
import { auth } from '../services/firebase';
import UploadForm from './UploadForm';
import RegisterUser from './RegisterUser';
import DocentesPanel from './DocentesPanel';
import ResourceCard from './ResourceCard';
import SolicitudesPanel from './SolicitudesPanel';
import { PlusCircle, List, UserPlus, Trash2, Users, ClipboardList } from 'lucide-react';
import '../styles/admin.css';

const AdminPanel = ({ userData }) => {
    const [activeTab, setActiveTab] = useState('resources'); // resources, upload, register, docentes
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = !userData || (userData?.rol && ['admin', 'administrador'].includes(userData.rol.toLowerCase()));

    const fetchResources = async () => {
        setLoading(true);
        try {
            const filterUserId = isAdmin ? null : auth.currentUser?.uid;
            const data = await getResources(null, filterUserId);
            setResources(data);
        } catch (error) {
            console.error("Failed to fetch resources:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'resources') {
            fetchResources();
        }
    }, [activeTab]);

    const handleDelete = async (resource) => {
        if (window.confirm(`¿Estás seguro de eliminar el recurso "${resource.title}"?`)) {
            try {
                await deleteResource(resource.id, resource.fileUrl);
                setResources(resources.filter(r => r.id !== resource.id));
            } catch (error) {
                console.error("Failed to delete resource:", error);
            }
        }
    };

    return (
        <div className="admin-container animate-fade-in">
            <div className="admin-header">
                <div>
                    <h1 style={{ margin: 0 }}>{isAdmin ? 'Panel de Administración' : 'Mis Recursos'}</h1>
                    <p className="text-secondary" style={{ margin: 0 }}>
                        {isAdmin ? 'Gestión de recursos y usuarios' : 'Gestión de sus recursos subidos'}
                    </p>
                </div>
                <div className="admin-tabs">
                    <button
                        className={`btn ${activeTab === 'resources' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        <List size={18} /> Recursos
                    </button>
                    <button
                        className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <PlusCircle size={18} /> Subir
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                className={`btn ${activeTab === 'docentes' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('docentes')}
                            >
                                <Users size={18} /> Base de Datos
                            </button>
                            <button
                                className={`btn ${activeTab === 'solicitudes' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('solicitudes')}
                            >
                                <ClipboardList size={18} /> Solicitudes
                            </button>
                            <button
                                className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('register')}
                            >
                                <UserPlus size={18} /> Registrar
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="admin-content">
                {activeTab === 'resources' && (
                    <div>
                        {loading ? (
                            <p className="text-center">Cargando recursos...</p>
                        ) : resources.length === 0 ? (
                            <p className="text-center text-secondary">No hay recursos disponibles.</p>
                        ) : (
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Categoría</th>
                                            <th>Tipo</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resources.map(resource => (
                                            <tr key={resource.id}>
                                                <td>{resource.title}</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                        {resource.categories && resource.categories.length > 0 ? (
                                                            resource.categories.map(cat => <span key={cat} className="badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>{cat}</span>)
                                                        ) : (
                                                            <span className="badge">{resource.category}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{resource.type}</td>
                                                <td>
                                                    {resource.createdAt?.toDate
                                                        ? resource.createdAt.toDate().toLocaleDateString()
                                                        : 'N/A'}
                                                </td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="btn-icon text-error hover-bg-red"
                                                        onClick={() => handleDelete(resource)}
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
                )}

                {activeTab === 'upload' && (
                    <UploadForm onUploadSuccess={() => setActiveTab('resources')} userData={userData} />
                )}

                {activeTab === 'register' && isAdmin && (
                    <RegisterUser />
                )}

                {activeTab === 'docentes' && isAdmin && (
                    <DocentesPanel />
                )}

                {activeTab === 'solicitudes' && isAdmin && (
                    <SolicitudesPanel />
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
