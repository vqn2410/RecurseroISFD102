import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, firebaseConfig } from '../services/firebase';
import { CheckCircle, XCircle, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

const SolicitudesPanel = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'solicitudes'), orderBy('fechaCreacion', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSolicitudes(list);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching solicitudes:", err);
            setError("Error al cargar las solicitudes.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAprobar = async (solicitud) => {
        if (!window.confirm(`¿Estás seguro de aprobar la solicitud de ${solicitud.nombre} ${solicitud.apellido} (${solicitud.email})?`)) {
            return;
        }

        setProcessingId(solicitud.id);
        setError('');
        setSuccess('');

        try {
            const apps = getApps();
            const secondaryApp = apps.find(app => app.name === 'SecondaryApp') || initializeApp(firebaseConfig, 'SecondaryApp');
            const secondaryAuth = getAuth(secondaryApp);

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, solicitud.email, solicitud.claveProvisoria);
            const newUser = userCredential.user;

            // Save user data to Firestore
            await setDoc(doc(db, 'docentes', newUser.uid), {
                uid: newUser.uid,
                email: newUser.email,
                nombreCompleto: `${solicitud.nombre} ${solicitud.apellido}`,
                rol: 'docente',
                firstLogin: true,
                fechaCreacion: serverTimestamp()
            });

            // Sign out the new user from secondary app
            await signOut(secondaryAuth);

            // Update solicitud status to approved
            await updateDoc(doc(db, 'solicitudes', solicitud.id), {
                estado: 'aprobada',
                fechaAprobacion: serverTimestamp()
            });

            setSuccess(`Usuario ${solicitud.nombre} ${solicitud.apellido} aprobado y creado correctamente.`);

        } catch (err) {
            console.error("Approval error:", err);
            let errMsg = 'Ocurrió un error al aprobar la solicitud.';
            if (err.code === 'auth/email-already-in-use') {
                errMsg = 'El email ya se encuentra registrado en el sistema. Puedes rechazar la solicitud.';
            }
            setError(errMsg);
        } finally {
            setProcessingId(null);
        }
    };

    const handleRechazar = async (id) => {
        if (!window.confirm('¿Estás seguro de rechazar y eliminar esta solicitud?')) {
            return;
        }

        setProcessingId(id);
        setError('');
        setSuccess('');

        try {
            await deleteDoc(doc(db, 'solicitudes', id));
            setSuccess('Solicitud rechazada y eliminada correctamente.');
        } catch (err) {
            console.error("Rejection error:", err);
            setError("Error al rechazar la solicitud.");
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Fecha desconocida';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="card animate-fade-in" style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Solicitudes de Usuario</h2>
            
            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                    <CheckCircle2 size={16} />
                    <span>{success}</span>
                </div>
            )}

            {loading ? (
                <p className="text-center text-secondary py-5">Cargando solicitudes...</p>
            ) : solicitudes.length === 0 ? (
                <p className="text-center text-secondary py-5">No hay solicitudes pendientes.</p>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map(sol => (
                                <tr key={sol.id}>
                                    <td data-label="Fecha">{formatDate(sol.fechaCreacion)}</td>
                                    <td data-label="Nombre Completo">{sol.nombre} {sol.apellido}</td>
                                    <td data-label="Email">{sol.email}</td>
                                    <td data-label="Estado">
                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }} className="td-flex-right">
                                            <span className={`badge ${sol.estado === 'pendiente' ? 'category-badge' : 'badge'}`} style={{ backgroundColor: sol.estado === 'aprobada' ? '#dcfce7' : '', color: sol.estado === 'aprobada' ? '#166534' : '' }}>
                                                {sol.estado === 'pendiente' ? <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> : <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                                                {sol.estado === 'pendiente' ? 'Pendiente' : 'Aprobada'}
                                            </span>
                                        </div>
                                    </td>
                                    <td data-label="Acciones" className="actions-cell">
                                        {sol.estado === 'pendiente' && (
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                                    onClick={() => handleAprobar(sol)}
                                                    disabled={processingId === sol.id}
                                                >
                                                    <CheckCircle size={14} style={{ marginRight: '4px' }}/> Aprobar
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                                                    onClick={() => handleRechazar(sol.id)}
                                                    disabled={processingId === sol.id}
                                                >
                                                    <XCircle size={14} style={{ marginRight: '4px' }}/> Rechazar
                                                </button>
                                            </div>
                                        )}
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

export default SolicitudesPanel;
