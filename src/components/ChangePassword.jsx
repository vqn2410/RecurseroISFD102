import { useState } from 'react';
import { updatePassword, signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../styles/auth.css';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        if (pwd.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
        if (!/[A-Z]/.test(pwd)) return "La contraseña debe incluir al menos una mayúscula.";
        if (!/[a-z]/.test(pwd)) return "La contraseña debe incluir al menos una minúscula.";
        if (!/[0-9]/.test(pwd)) return "La contraseña debe incluir al menos un número.";
        return null; // Valid
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        const validationError = validatePassword(newPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No hay usuario logueado.");
            }

            // Update password in Auth
            await updatePassword(user, newPassword);

            // Update firstLogin field in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { firstLogin: false });

            setSuccess(true);
            setTimeout(() => {
                navigate('/admin');
            }, 2000);

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/requires-recent-login') {
                setError('Por seguridad, debe volver a iniciar sesión para cambiar la contraseña.');
                setTimeout(async () => {
                    await signOut(auth);
                    navigate('/login');
                }, 3000);
            } else {
                setError('Error al cambiar la contraseña. Intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container animate-fade-in">
                <div className="card text-center py-5">
                    <CheckCircle2 size={48} className="text-secondary mx-auto mb-3" />
                    <h2 className="mb-2">¡Contraseña actualizada!</h2>
                    <p className="text-secondary">Redirigiendo al panel de administración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container animate-fade-in">
            <div className="card form-card">
                <div className="form-header">
                    <h2 className="text-center">Primer Ingreso</h2>
                    <p className="text-center text-secondary">
                        Por seguridad, debe cambiar su contraseña provisoria antes de continuar.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="auth-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="newPassword">Nueva contraseña</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                id="newPassword"
                                type="password"
                                className="form-input has-icon"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <p className="password-hint">
                            Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y números.
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirmar contraseña</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                id="confirmPassword"
                                type="password"
                                className="form-input has-icon"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-3" disabled={loading}>
                        {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
