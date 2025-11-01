import React, { useState, useEffect, useRef } from 'react';
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
              <li className="user-menu-container" ref={userMenuRef}>
                <button
                  className="user-icon-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="user-name-text">{user?.name}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <p className="user-dropdown-name">{user?.name}</p>
                      <p className="user-dropdown-email">{user?.email}</p>
                      {user?.role === 'admin' && (
                        <span className="user-dropdown-role">{t('nav.admin')}</span>
                      )}
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link
                      to="/change-password"
                      className="user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15H7.5C6.83696 15 6.20107 15.2634 5.73223 15.7322C5.26339 16.2011 5 16.837 5 17.5V19.5C5 19.8978 5.15804 20.2794 5.43934 20.5607C5.72064 20.842 6.10218 21 6.5 21H17.5C17.8978 21 18.2794 20.842 18.5607 20.5607C18.842 20.2794 19 19.8978 19 19.5V17.5C19 16.837 18.7366 16.2011 18.2678 15.7322C17.7989 15.2634 17.163 15 16.5 15H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V9C12 8.20435 12.3161 7.44129 12.8787 6.87868C13.4413 6.31607 14.2044 6 15 6C15.7956 6 16.5587 6.31607 17.1213 6.87868C17.6839 7.44129 18 8.20435 18 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{t('nav.changePassword')}</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="user-dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{t('nav.admin')}</span>
                      </Link>
                    )}
                    <div className="user-dropdown-divider"></div>
                    <button
                      className="user-dropdown-item user-dropdown-logout"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
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

