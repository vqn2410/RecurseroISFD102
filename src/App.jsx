import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './services/firebase';

import Navbar from './components/Navbar';

import Home from './pages/Home';

// Lazy loading components optimization
const Categories = lazy(() => import('./pages/Categories'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SobreEnsam = lazy(() => import('./pages/SobreEnsam'));
const Login = lazy(() => import('./components/Login'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const ChangePassword = lazy(() => import('./components/ChangePassword'));

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(!isFirebaseConfigured || !auth ? false : true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'docentes', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setIsFirstLogin(data.firstLogin === true);
          } else {
            // Auto-provision initial users missing from Firestore 'docentes'
            const emailPart = currentUser.email ? currentUser.email.split('@')[0] : 'Docente';
            const isRootAdmin = currentUser.email === 'nvergara@abc.gob.ar' || currentUser.email === 'recursosoficial102@gmail.com';

            const newUserData = {
              uid: currentUser.uid,
              email: currentUser.email,
              nombreCompleto: currentUser.displayName || emailPart,
              rol: isRootAdmin ? "administrador" : "docente",
              firstLogin: false,
              fechaCreacion: serverTimestamp(),
              onlineStatus: true
            };

            await setDoc(userDocRef, newUserData);
            setUserData(newUserData);
            setIsFirstLogin(false);
          }
        } catch (error) {
          console.error("Error checking user status:", error);
          setUserData(null);
          setIsFirstLogin(false); // default to false on error 
        }
      } else {
        setUserData(null);
        setIsFirstLogin(false);
      }

      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fef2f2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '2rem' }}>⚠️ ERROR CRÍTICO DE ENTORNO VERCEL</h1>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', border: '1px solid #f87171', maxWidth: '600px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <p style={{ color: '#4b5563', marginBottom: '1rem', fontWeight: 'bold' }}>La plataforma no puede iniciar porque las variables de Firebase están en blanco o ausentes.</p>
          <ul style={{ textAlign: 'left', color: '#1f2937', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            <li><strong>Paso 1:</strong> Ingresa a tu panel de Vercel.</li>
            <li><strong>Paso 2:</strong> Ve a <em>Project Settings → Environment Variables</em>.</li>
            <li><strong>Paso 3:</strong> Agrega TODAS tus variables de <code>.env</code> usando el nombre exacto: <code>VITE_FIREBASE_API_KEY</code>, etc.</li>
            <li><strong>Paso 4:</strong> Una vez agregadas, DEBES generar un <strong>Nuevo Despliegue (Redeploy)</strong> para que Vite las fusione en el código.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="app-container"><p style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</p></div>;
  }

  // Element for Admin that enforces password change
  const adminElement = !user ? <Navigate to="/login" replace /> :
    (isFirstLogin ? <Navigate to="/cambiar-password" replace /> : <AdminPanel userData={userData} />);

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} userData={userData} />
        <main className="main-content">
          <Suspense fallback={<div className="loading-state text-center py-10"><p className="text-secondary">Cargando...</p></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/buscar" element={<SearchPage />} />
              <Route path="/sobre-ensam" element={<SobreEnsam />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to={isFirstLogin ? "/cambiar-password" : "/admin"} replace />} />
              <Route path="/cambiar-password" element={user && isFirstLogin ? <ChangePassword /> : <Navigate to={user ? "/admin" : "/login"} replace />} />
              <Route path="/admin" element={adminElement} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
