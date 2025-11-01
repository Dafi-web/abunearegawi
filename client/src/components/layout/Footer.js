import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="footer">
      {/* Background animations */}
      <div className="footer-animation animation-praying-hands">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <path fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" d="M50,20 Q60,30 55,45 Q50,40 45,45 Q40,30 50,20 Z" />
          <path fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" d="M30,55 Q40,50 50,55 Q60,50 70,55 L70,85 L30,85 Z" />
        </svg>
      </div>
      <div className="footer-animation animation-cross">
        <svg width="60" height="60" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          <line x1="25" y1="50" x2="75" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
        </svg>
      </div>
      <div className="footer-animation animation-heart">
        <svg width="50" height="50" viewBox="0 0 100 100">
          <path fill="rgba(255,255,255,0.2)" d="M50,85 L30,65 Q20,55 20,40 Q20,25 30,20 Q40,15 50,25 Q60,15 70,20 Q80,25 80,40 Q80,55 70,65 Z" />
        </svg>
      </div>
      
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section about">
            <div className="footer-logo">
              <div className="footer-logo-icon">✟</div>
              <h3>{t('footer.about')}</h3>
            </div>
            <p className="footer-description">{t('footer.aboutText')}</p>
            <div className="social-section">
              <h4>{t('footer.followUs')}</h4>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-section links">
            <h3>{t('footer.quickLinks')}</h3>
            <ul>
              <li><Link to="/"><span className="link-icon">🏠</span> {t('nav.home')}</Link></li>
              <li><Link to="/events"><span className="link-icon">📅</span> {t('nav.events')}</Link></li>
              <li><Link to="/calendar"><span className="link-icon">🗓️</span> {t('nav.calendar')}</Link></li>
              <li><Link to="/membership"><span className="link-icon">👥</span> {t('nav.membership')}</Link></li>
              <li><Link to="/donate"><span className="link-icon">💝</span> {t('nav.donate')}</Link></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>{t('footer.contact')}</h3>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>{t('footer.location')}</h4>
                <p>{t('footer.address')}</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <a href={`mailto:${t('footer.email')}`}>{t('footer.email')}</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <a href={`tel:${t('footer.phone')}`}>{t('footer.phone')}</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {t('footer.about')}. {t('footer.rights')}</p>
          <p className="designer-credit">Designed by <span className="designer-name">dafiTech</span> (dawit)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
