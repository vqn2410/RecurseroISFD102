import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { LogOut, User, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/navbar.css';
import Logo from './logo';

const PROFESORADOS = [
    "Biología", "Física", "Matemática", "Primaria", "Inicial", "Economía"
];

const AREAS_TRANSVERSALES = [
    "Educación Ambiental", "ESI (Educación Sexual Integral)", "Fonoaudiología", "Tics"
];

const Navbar = ({ user, userData, transparent = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const searchParams = new URLSearchParams(location.search);
    const categoryFilter = searchParams.get('tipo');

    let isAutoTransparent = transparent;
    // Removed location.pathname overrides here for consistent legibility

    const isAdmin = !userData || (userData?.rol && ['admin', 'administrador'].includes(userData.rol.toLowerCase()));
    const isTransparentActive = isAutoTransparent && !isScrolled;

    const handleLogout = async () => {
        try {
            if (user) {
                // Actualizar DB sin bloquear (Fire-and-forget)
                updateDoc(doc(db, 'docentes', user.uid), { onlineStatus: false }).catch(err => {
                    console.warn("Could not update online status immediately:", err);
                });
            }

            // Realizar sign out oficial
            await signOut(auth);

            // Forzar una redirección dura
            window.location.href = '/';

        } catch (error) {
            console.error('Error logging out: ', error);
            window.location.href = '/';
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className={`navbar ${isTransparentActive ? 'navbar-transparent' : ''}`}>
            <div className="navbar-container">
                <Logo onClick={closeMenu} />

                <div className={`navbar-search-desktop ${isSearchExpanded ? 'expanded' : 'collapsed'}`}>
                    <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`); closeMenu(); setIsSearchExpanded(false); } }}>
                        <div className="search-input-wrapper desktop-search-wrapper">
                            {!isSearchExpanded ? (
                                <button
                                    type="button"
                                    className="search-toggle-icon"
                                    onClick={() => setIsSearchExpanded(true)}
                                    aria-label="Abrir búsqueda"
                                >
                                    <Search size={20} />
                                </button>
                            ) : (
                                <div className="search-expandable expanded animate-expand">
                                    <Search size={16} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Buscar recursos..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="nav-search-input expandable"
                                        autoFocus
                                        onBlur={() => {
                                            if (!searchQuery.trim()) {
                                                setTimeout(() => setIsSearchExpanded(false), 200);
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="search-close-btn"
                                        onClick={() => { setIsSearchExpanded(false); setSearchQuery(''); }}
                                        aria-label="Cerrar búsqueda"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Desktop Menu */}
                <div className="navbar-menu-desktop">
                    <Link to="/sobre-ensam" className="dropdown-btn" style={{ textDecoration: 'none' }} onClick={closeMenu}>
                        Sobre el ENSAM
                    </Link>

                    <Link to="/noticias" className="dropdown-btn" style={{ textDecoration: 'none' }} onClick={closeMenu}>
                        Noticias
                    </Link>

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
                                    {isAdmin ? 'Panel Admin' : 'Mis Recursos'}
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
                        <Link to="/sobre-ensam" className="mobile-section-title" style={{ display: 'block', textDecoration: 'none', marginBottom: '1rem', color: 'var(--primary)' }} onClick={closeMenu}>
                            Sobre el ENSAM
                        </Link>
                    </div>

                    <div className="mobile-section">
                        <Link to="/noticias" className="mobile-section-title" style={{ display: 'block', textDecoration: 'none', marginBottom: '1rem', color: 'var(--primary)' }} onClick={closeMenu}>
                            Noticias
                        </Link>
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
                                    {isAdmin ? 'Panel Admin' : 'Mis Recursos'}
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
