import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { Search, RefreshCw, Users, Mail, Clock, ShieldCheck, Shield, Edit, Trash2, Key } from 'lucide-react';

const DocentesPanel = () => {
    const [docentes, setDocentes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDocentes = () => {
        const q = query(collection(db, 'users'), orderBy('fechaCreacion', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersList = [];
            snapshot.forEach((doc) => {
                usersList.push({ id: doc.id, ...doc.data() });
            });
            setDocentes(usersList);
            setLoading(false);
            setRefreshing(false);
        }, (error) => {
            console.error("Error fetching docentes: ", error);
            setLoading(false);
            setRefreshing(false);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsub = fetchDocentes();
        return () => unsub();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        // onSnapshot is already realtime, but giving users a feedback interaction
        setTimeout(() => setRefreshing(false), 800);
    };

    const handleDeleteUser = async (userRecord) => {
        if (window.confirm(`¿Estás seguro de eliminar el usuario docente de ${userRecord.nombreCompleto || userRecord.email}? (Esto solo lo eliminará de la base de datos visual)`)) {
            try {
                await deleteDoc(doc(db, 'users', userRecord.id));
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                alert("Hubo un error al eliminar el usuario.");
            }
        }
    };

    const handleResetPassword = async (email) => {
        if (window.confirm(`¿Enviar correo de recuperación de contraseña a ${email}?`)) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert(`Correo de recuperación enviado a ${email}`);
            } catch (error) {
                console.error("Error al enviar correo de recuperación:", error);
                alert("Hubo un error al enviar el correo.");
            }
        }
    };

    const handleToggleRole = async (userRecord) => {
        const newRole = (userRecord.rol === 'administrador' || userRecord.rol === 'admin') ? 'docente' : 'administrador';
        if (window.confirm(`¿Cambiar el rol de ${userRecord.nombreCompleto} a ${newRole}?`)) {
            try {
                await updateDoc(doc(db, 'users', userRecord.id), { rol: newRole });
            } catch (error) {
                console.error("Error al cambiar rol:", error);
                alert("Hubo un error al cambiar el rol.");
            }
        }
    };

    const handleEditName = async (userRecord) => {
        const newName = window.prompt(`Modificar nombre de ${userRecord.email}:\nIngresa el nuevo nombre completo:`, userRecord.nombreCompleto || '');
        if (newName !== null && newName !== userRecord.nombreCompleto) {
            try {
                await updateDoc(doc(db, 'users', userRecord.id), { nombreCompleto: newName.trim() });
                // No need for alert as onSnapshot will auto-refresh the UI
            } catch (error) {
                console.error("Error al actualizar nombre:", error);
                alert("Hubo un error al actualizar el nombre del usuario.");
            }
        }
    };

    const filteredDocentes = docentes.filter(docente => {
        const nameMatch = docente.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = docente.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || emailMatch;
    });

    const onlineCount = docentes.filter(d => d.onlineStatus === true).length;

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="docentes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></span>
                        {onlineCount} {onlineCount === 1 ? 'Usuario conectado' : 'Usuarios conectados'}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
                    <div className="input-with-icon" style={{ flexGrow: 1 }}>
                        <Search className="input-icon" size={18} />
                        <input
                            type="text"
                            className="form-input has-icon"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-outline"
                        onClick={handleRefresh}
                        title="Refrescar lista"
                    >
                        <RefreshCw size={18} className={refreshing ? "spin-anim" : ""} />
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                {loading && !refreshing ? (
                    <p className="text-center py-5 text-secondary">Cargando docentes...</p>
                ) : filteredDocentes.length === 0 ? (
                    <p className="text-center py-5 text-secondary">No se encontraron docentes registrados.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Creado en</th>
                                <th>1er Ingreso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocentes.map(docente => (
                                <tr key={docente.id}>
                                    <td style={{ textAlign: 'center' }}>
                                        {docente.onlineStatus ? (
                                            <span className="badge" title="Online" style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '0.2rem', minWidth: 'auto', borderRadius: '50%', display: 'inline-flex' }}>
                                                <div style={{ width: '8px', height: '8px' }}></div>
                                            </span>
                                        ) : (
                                            <span className="badge" title="Offline" style={{ backgroundColor: 'var(--border-color)', color: 'transparent', padding: '0.2rem', minWidth: 'auto', borderRadius: '50%', display: 'inline-flex' }}>
                                                <div style={{ width: '8px', height: '8px' }}></div>
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={16} className="text-secondary" />
                                            <span style={{ fontWeight: 500 }}>{docente.nombreCompleto || 'Sin nombre'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                            <Mail size={14} />
                                            {docente.email}
                                        </div>
                                    </td>
                                    <td>
                                        {(docente.rol === 'administrador' || docente.rol === 'admin') ? (
                                            <span className="badge" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                                                <ShieldCheck size={12} style={{ marginRight: '4px' }} /> {docente.rol}
                                            </span>
                                        ) : (
                                            <span className="badge">
                                                <Shield size={12} style={{ marginRight: '4px' }} /> {docente.rol || 'docente'}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            <Clock size={14} />
                                            {formatDate(docente.fechaCreacion)}
                                        </div>
                                    </td>
                                    <td>
                                        {docente.firstLogin ? (
                                            <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#D97706' }}>Pendiente</span>
                                        ) : (
                                            <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}>Completado</span>
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        <button className="btn-icon" onClick={() => handleEditName(docente)} title="Editar Nombre">
                                            <Edit size={16} />
                                        </button>
                                        <button className="btn-icon" onClick={() => handleToggleRole(docente)} title="Cambiar Rol (Admin/Docente)">
                                            <Shield size={16} />
                                        </button>
                                        <button className="btn-icon text-secondary" style={{ cursor: 'pointer' }} onClick={() => handleResetPassword(docente.email)} title="Restablecer Contraseña">
                                            <Key size={16} />
                                        </button>
                                        <button className="btn-icon text-error hover-bg-red" onClick={() => handleDeleteUser(docente)} title="Eliminar Docente">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default DocentesPanel;
