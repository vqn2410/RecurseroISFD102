import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';

import Navbar from './components/Navbar';

// Lazy loading components optimization
const Home = lazy(() => import('./pages/Home'));
const Categories = lazy(() => import('./pages/Categories'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const Login = lazy(() => import('./components/Login'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const ChangePassword = lazy(() => import('./components/ChangePassword'));

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setIsFirstLogin(data.firstLogin === true);
          } else {
            setUserData(null);
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

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="app-container"><p style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</p></div>;
  }

  // Element for Admin that enforces password change
  const adminElement = !user ? <Navigate to="/login" replace /> :
    (isFirstLogin ? <Navigate to="/cambiar-password" replace /> : <AdminPanel userData={userData} />);

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} />
        <main className="main-content">
          <Suspense fallback={<div className="loading-state text-center py-10"><p className="text-secondary">Cargando...</p></div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/buscar" element={<SearchPage />} />
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
