import { useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig } from '../services/firebase';
import { UserPlus, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/auth.css';

const RegisterUser = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminSelected, setIsAdminSelected] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Create a secondary app instance to register without logging out the admin
            const apps = getApps();
            const secondaryApp = apps.find(app => app.name === 'SecondaryApp') || initializeApp(firebaseConfig, 'SecondaryApp');
            const secondaryAuth = getAuth(secondaryApp);

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const newUser = userCredential.user;

            // Ensure the Admin's session is active and valid to write to Firestore
            // Save user data to Firestore
            await setDoc(doc(db, 'docentes', newUser.uid), {
                uid: newUser.uid,
                email: newUser.email,
                nombreCompleto: fullName,
                rol: isAdminSelected ? 'admin' : 'docente',
                firstLogin: true,
                fechaCreacion: serverTimestamp()
            });

            // Sign out the new user from secondary app
            await signOut(secondaryAuth);

            const successMsg = `Usuario ${fullName} registrado correctamente como ${isAdminSelected ? 'Administrador' : 'Docente'}. Email: ${email}`;
            setSuccess(successMsg);
            alert(successMsg);

            setEmail('');
            setFullName('');
            setPassword('');
            setIsAdminSelected(false);

        } catch (err) {
            console.error("Registration error:", err);
            let errMsg = 'Ocurrió un error al registrar el docente.';
            if (err.code === 'auth/email-already-in-use') {
                errMsg = 'El email ingresado ya está registrado.';
            } else if (err.code === 'auth/weak-password') {
                errMsg = 'La contraseña debe tener al menos 6 caracteres.';
            } else if (err.code === 'auth/invalid-email') {
                errMsg = 'El formato del email no es válido.';
            } else {
                errMsg = `Ocurrió un error: ${err.message}`;
            }
            setError(errMsg);
            alert(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card animate-fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="form-header">
                <h2>Registrar Nuevo Usuario</h2>
                <p className="text-secondary">Cree una cuenta para un nuevo docente o administrador.</p>
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

            <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Nombre Completo</label>
                    <div className="input-with-icon">
                        <User className="input-icon" size={18} />
                        <input
                            id="fullName"
                            type="text"
                            className="form-input has-icon"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                </div>

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
                    <label className="form-label" htmlFor="password">Contraseña Provisional</label>
                    <div className="input-with-icon">
                        <UserPlus className="input-icon" size={18} />
                        <input
                            id="password"
                            type="text"
                            className="form-input has-icon"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Min. 6 caracteres"
                        />
                    </div>
                    <p className="password-hint">
                        El usuario deberá cambiar esta contraseña en su primer ingreso.
                    </p>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                        type="checkbox"
                        id="isAdmin"
                        checked={isAdminSelected}
                        onChange={(e) => setIsAdminSelected(e.target.checked)}
                        className="form-checkbox"
                        style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="isAdmin" style={{ cursor: 'pointer', fontWeight: '500' }}>
                        Asignar rol de Administrador
                    </label>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-3" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar Docente'}
                </button>
            </form>
        </div>
    );
};

export default RegisterUser;
