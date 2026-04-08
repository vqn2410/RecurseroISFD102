import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Logo from './logo';
import { Instagram, Facebook, Youtube, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

export const LandingNavbar = ({ user, userData }) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
      <Navbar user={user} userData={userData} transparent={true} />
    </div>
  );
};

export const LandingFooter = () => {
  return (
    <footer style={{ padding: '5rem 2rem', background: 'var(--white)', borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>

          {/* Brand & Logo */}
          <div>
            <Logo isFooter={true} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '300px', marginTop: '1.5rem' }}>
              Plataforma de recursos educativos la Unidad Académica de la Escuela Normal Superior "Antonio Mentruyt" | ISFD N° 102.
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>Enlaces de Interés</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ExternalLink size={14} /> Inicio
                </Link>
              </li>
              <li>
                <Link to="/categorias" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ExternalLink size={14} /> Categorías
                </Link>
              </li>
              <li>
                <Link to="/sobre-ensam" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ExternalLink size={14} /> Nuestra Historia
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>Contacto y Redes</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <a href="https://www.instagram.com/bibliotecamentruyt/" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}><Instagram size={20} /></a>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Facebook size={20} /></a>
              <a href="https://www.youtube.com/watch?v=4CI6BPkip5U" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}><Youtube size={20} /></a>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><MapPin size={16} /> Manuel Castro 990, Banfield</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Mail size={16} /> <a href="mailto:isfd102lomasdezamora@abc.gob.ar">isfd102lomasdezamora@abc.gob.ar</a></li>
            </ul>
          </div>

        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            &copy; {new Date().getFullYear()} Unidad Académica de la Escuela Normal Superior "Antonio Mentruyt" | ISFD N° 102 - Todos los derechos reservados.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Designed by NvProductions
          </p>
        </div>
      </div>
    </footer>
  );
};
