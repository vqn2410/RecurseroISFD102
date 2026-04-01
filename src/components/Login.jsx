import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, CheckCircle2, UserPlus, LogIn, User } from 'lucide-react';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetMsg, setResetMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSolicitando, setIsSolicitando] = useState(false);
    const [solicitudNombre, setSolicitudNombre] = useState('');
    const [solicitudApellido, setSolicitudApellido] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setResetMsg('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check firstLogin in Firestore
            const userDocRef = doc(db, 'docentes', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                await updateDoc(userDocRef, { onlineStatus: true });

                if (userData.firstLogin === true) {
                    navigate('/cambiar-password');
                } else {
                    navigate('/admin');
                }
            } else {
                // If no document exists, assume regular access, or handle as needed
                // For security, you might want to create the doc or force change.
                // Let's assume standard access if not explicitly firstLogin.
                navigate('/admin');
            }
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Credenciales incorrectas. Verifique su email y contraseña.');
            } else {
                setError('Ocurrió un error al iniciar sesión. Intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setResetMsg('');

        const emailToReset = email.trim() || window.prompt('Por favor, ingresa tu correo electrónico:');

        if (!emailToReset || emailToReset.trim() === '') {
            setError('Debes ingresar un correo electrónico válido para restablecer tu contraseña.');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, emailToReset.trim());
            setResetMsg('Se ha enviado un correo para restablecer tu contraseña.');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-email') {
                setError('El formato del correo electrónico no es válido.');
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-user-token' || err.code === 'auth/invalid-credential') {
                setError('No existe ninguna cuenta registrada con ese correo.');
            } else {
                setError('Ocurrió un error al enviar el correo de restablecimiento. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSolicitarUsuario = async (e) => {
        e.preventDefault();
        const correo = email.trim().toLowerCase();
        
        if (!correo.endsWith('@abc.gob.ar')) {
            setError('El correo institucional debe tener el dominio @abc.gob.ar');
            return;
        }

        if (password.length < 6) {
            setError('La clave provisional debe tener al menos 6 caracteres.');
            return;
        }

        if (!solicitudNombre.trim() || !solicitudApellido.trim()) {
            setError('Debes ingresar tu nombre y apellido.');
            return;
        }

        setLoading(true);
        setError('');
        setResetMsg('');

        try {
            if (!db) {
                throw new Error("Base de datos no disponible. Verifique su conexión.");
            }
            
            await addDoc(collection(db, 'solicitudes'), {
                nombre: solicitudNombre.trim(),
                apellido: solicitudApellido.trim(),
                email: correo,
                claveProvisoria: password,
                fechaCreacion: serverTimestamp(),
                estado: 'pendiente'
            });

            setResetMsg('Tu solicitud ha sido enviada con éxito. Aguarda a que un administrador te dé de alta.');
            setIsSolicitando(false);
            setSolicitudNombre('');
            setSolicitudApellido('');
            setPassword('');
            setEmail('');
        } catch (err) {
            console.error('Error enviando solicitud:', err);
            setError(`Ocurrió un error: ${err.message || 'Error de conexión'}. Intente nuevamente.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="card form-card">
                <div className="form-header">
                    <h2 className="text-center">{isSolicitando ? 'Solicitar Usuario' : 'Acceso Docentes'}</h2>
                    <p className="text-center text-secondary">
                        {isSolicitando ? 'Completa tus datos para solicitar el alta' : 'Ingrese sus credenciales para continuar'}
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {resetMsg && (
                    <div className="alert alert-success">
                        <CheckCircle2 size={16} />
                        <span>{resetMsg}</span>
                    </div>
                )}

                <form onSubmit={isSolicitando ? handleSolicitarUsuario : handleLogin} className="auth-form">
                    {isSolicitando && (
                        <>
                            <div className="form-group grid grid-cols-2" style={{ gap: '1rem' }}>
                                <div>
                                    <label className="form-label" htmlFor="nombre">Nombre</label>
                                    <div className="input-with-icon">
                                        <User className="input-icon" size={18} />
                                        <input
                                            id="nombre"
                                            type="text"
                                            className="form-input has-icon"
                                            value={solicitudNombre}
                                            onChange={(e) => setSolicitudNombre(e.target.value)}
                                            required={isSolicitando}
                                            placeholder="Juan"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label" htmlFor="apellido">Apellido</label>
                                    <div className="input-with-icon">
                                        <User className="input-icon" size={18} />
                                        <input
                                            id="apellido"
                                            type="text"
                                            className="form-input has-icon"
                                            value={solicitudApellido}
                                            onChange={(e) => setSolicitudApellido(e.target.value)}
                                            required={isSolicitando}
                                            placeholder="Pérez"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email institucional</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={18} />
                            <input
                                id="email"
                                type="email"
                                className="form-input has-icon"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="docente@abc.gob.ar"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">{isSolicitando ? 'Clave Provisoria' : 'Contraseña'}</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                id="password"
                                type="password"
                                className="form-input has-icon"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {!isSolicitando && (
                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.875rem', cursor: 'pointer', padding: 0 }}
                                disabled={loading}
                            >
                                ¿Olvidé mi contraseña?
                            </button>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading 
                            ? (isSolicitando ? 'Enviando...' : 'Ingresando...') 
                            : (isSolicitando ? 'Enviar Solicitud' : 'Iniciar Sesión')}
                    </button>
                    
                    <div className="text-center" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSolicitando(!isSolicitando);
                                setError('');
                                setResetMsg('');
                            }}
                            className="btn btn-outline w-full"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            disabled={loading}
                        >
                            {isSolicitando ? (
                                <><LogIn size={18} /> Volver al Inicio de Sesión</>
                            ) : (
                                <><UserPlus size={18} /> Solicitar Usuario Docente</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
