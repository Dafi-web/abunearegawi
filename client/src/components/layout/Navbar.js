import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../LanguageSelector';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-wrapper">
            <svg viewBox="0 0 200 200" className="rotating-text-svg">
              <defs>
                <path id="circle-path" d="M 100,100 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
              </defs>
              <text fill="#ffc72c" font-size="18" font-weight="900" letter-spacing="1.5" className="rotating-text">
                <textPath xlinkHref="#circle-path" textAnchor="middle" startOffset="50%">
                  ABUNE AREGAWI TIGRYANS ORTHODOX CHURCH 
                </textPath>
              </text>
            </svg>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3usQYZkzW7IMkQ0i8544h2QNR8KG5qe-yKA&s" 
              alt="Abune Aregawi Church Logo"
              className="navbar-logo"
            />
          </div>
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/">{t('nav.home')}</Link></li>
          <li><Link to="/events">{t('nav.events')}</Link></li>
          <li><Link to="/calendar">{t('nav.calendar')}</Link></li>
          <li><Link to="/donate">{t('nav.donate')}</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/membership">{t('nav.membership')}</Link></li>
              {user?.role === 'admin' && (
                <li><Link to="/admin/dashboard">{t('nav.admin')}</Link></li>
              )}
              <li>
                <span className="user-name">{user?.name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  {t('nav.logout')}
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">{t('nav.login')}</Link></li>
              <li><Link to="/register">{t('nav.register')}</Link></li>
            </>
          )}
          <li>
            <LanguageSelector />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

