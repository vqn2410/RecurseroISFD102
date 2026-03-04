import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetMsg, setResetMsg] = useState('');
    const [loading, setLoading] = useState(false);
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

    return (
        <div className="auth-container animate-fade-in">
            <div className="card form-card">
                <div className="form-header">
                    <h2 className="text-center">Acceso Docentes</h2>
                    <p className="text-center text-secondary">Ingrese sus credenciales para continuar</p>
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

                <form onSubmit={handleLogin} className="auth-form">
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
                                placeholder="docente@instituto.edu.ar"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Contraseña</label>
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

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
