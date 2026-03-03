import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { LogOut, User, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import '../styles/navbar.css';

const PROFESORADOS = [
    "Biología", "Física", "Matemática", "Primaria", "Inicial", "Economía"
];

const AREAS_TRANSVERSALES = [
    "Educación Ambiental", "ESI (Educación Sexual Integral)", "Fonoaudiología", "Tics"
];

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        try {
            if (user) {
                // Actualizar DB sin bloquear (Fire-and-forget), por si la red falla no nos estanque el logout
                updateDoc(doc(db, 'docentes', user.uid), { onlineStatus: false }).catch(err => {
                    console.warn("Could not update online status immediately:", err);
                });
            }

            // Realizar sign out oficial
            await signOut(auth);

            // Forzar una redirección dura para destruir todo el estado residual de React y el Router.
            // Esto es 100% efectivo contra condiciones de carrera.
            window.location.href = '/';

        } catch (error) {
            console.error('Error logging out: ', error);
            // Redirigir de todos modos como fallback
            window.location.href = '/';
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <img src="https://i.postimg.cc/j5LScsMX/Diseno-sin-titulo.png" alt="Logo ISFD 102" className="brand-logo" />
                    <span className="brand-text">Recursero Académico UA ENSAM | ISFD N°102</span>
                </Link>

                <div className="navbar-search-desktop">
                    <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`); closeMenu(); } }}>
                        <div className="search-input-wrapper">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar recursos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="nav-search-input"
                            />
                        </div>
                    </form>
                </div>

                {/* Desktop Menu */}
                <div className="navbar-menu-desktop">
                    <div className="dropdown">
                        <button className="dropdown-btn">Profesorados</button>
                        <div className="dropdown-content">
                            {PROFESORADOS.map(prof => (
                                <Link key={prof} to={`/categorias?tipo=${encodeURIComponent(prof)}`} onClick={closeMenu}>
                                    {prof}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="dropdown">
                        <button className="dropdown-btn">Áreas Transversales</button>
                        <div className="dropdown-content">
                            {AREAS_TRANSVERSALES.map(area => (
                                <Link key={area} to={`/categorias?tipo=${encodeURIComponent(area)}`} onClick={closeMenu}>
                                    {area}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="navbar-auth">
                        {user ? (
                            <>
                                <Link to="/admin" className="btn btn-outline" onClick={closeMenu}>
                                    Panel Admin
                                </Link>
                                <button onClick={handleLogout} className="btn btn-danger">
                                    <LogOut size={16} /> Salir
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary" onClick={closeMenu}>
                                <User size={16} /> Login Docentes
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="navbar-menu-mobile">
                    <div className="mobile-search-section">
                        <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`); closeMenu(); } }}>
                            <div className="search-input-wrapper">
                                <Search size={16} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar recursos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="nav-search-input mobile"
                                />
                            </div>
                        </form>
                    </div>

                    <div className="mobile-section">
                        <h4 className="mobile-section-title">Profesorados</h4>
                        {PROFESORADOS.map(prof => (
                            <Link key={prof} to={`/categorias?tipo=${encodeURIComponent(prof)}`} className="mobile-link" onClick={closeMenu}>
                                {prof}
                            </Link>
                        ))}
                    </div>

                    <div className="mobile-section">
                        <h4 className="mobile-section-title">Áreas Transversales</h4>
                        {AREAS_TRANSVERSALES.map(area => (
                            <Link key={area} to={`/categorias?tipo=${encodeURIComponent(area)}`} className="mobile-link" onClick={closeMenu}>
                                {area}
                            </Link>
                        ))}
                    </div>

                    <div className="mobile-auth-section">
                        {user ? (
                            <>
                                <Link to="/admin" className="btn btn-outline w-full justify-center mb-2" onClick={closeMenu}>
                                    Panel Admin
                                </Link>
                                <button onClick={handleLogout} className="btn btn-danger w-full justify-center">
                                    <LogOut size={16} /> Salir
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary w-full justify-center" onClick={closeMenu}>
                                <User size={16} /> Login Docentes
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
