import { Link } from 'react-router-dom';

const Logo = ({ onClick, isFooter = false }) => {
    return (
        <Link 
            to="/" 
            className={isFooter ? "footer-logo" : "navbar-brand"} 
            onClick={onClick} 
            style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                color: 'inherit'
            }}
        >
            <img 
                src="https://cdn.phototourl.com/member/2026-04-01-18b3281e-b51e-4ec6-b664-ab4e364d159d.png" 
                alt="Logo ISFD 102" 
                className="brand-logo"
                style={{ height: isFooter ? '50px' : '45px', width: 'auto', objectFit: 'contain' }}
            />
            <div className={isFooter ? "brand-text-footer" : "brand-text"}>
                <span className="brand-title">
                    Recursero Académico
                </span>
                <span className="brand-subtitle">
                    Unidad Académica ENSAM | ISFD N°102
                </span>
            </div>
        </Link>
    );
};

export default Logo;