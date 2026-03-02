import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseConfig } from '../services/firebase';
import { UserPlus, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/auth.css';

const RegisterUser = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
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
            const secondaryApp = initializeApp(firebaseConfig, 'SecondaryApp');
            const secondaryAuth = getAuth(secondaryApp);

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
            const newUser = userCredential.user;

            // Ensure the Admin's session is active and valid to write to Firestore
            // Save user data to Firestore
            await setDoc(doc(db, 'users', newUser.uid), {
                uid: newUser.uid,
                email: newUser.email,
                nombreCompleto: fullName,
                rol: 'docente',
                firstLogin: true,
                fechaCreacion: serverTimestamp()
            });

            // Sign out the new user from secondary app
            await signOut(secondaryAuth);

            setSuccess(`Docente ${fullName} registrado correctamente. Email: ${email}`);
            setEmail('');
            setFullName('');
            setPassword('');

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('El email ingresado ya está registrado.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else {
                setError('Ocurrió un error al registrar el docente. Intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card animate-fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="form-header">
                <h2>Registrar Nuevo Docente</h2>
                <p className="text-secondary">Cree una cuenta para que un docente pueda subir recursos.</p>
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
                        El docente deberá cambiar esta contraseña en su primer ingreso.
                    </p>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-3" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar Docente'}
                </button>
            </form>
        </div>
    );
};

export default RegisterUser;
