import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'ti', name: 'ትግርኛ', flag: 'data:image/png;base64,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' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className="language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        {currentLanguage.flag.startsWith('data:') ? (
          <img src={currentLanguage.flag} alt={currentLanguage.name} className="language-flag-img" />
        ) : (
          <span className="language-flag">{currentLanguage.flag}</span>
        )}
        <span className="language-name">{currentLanguage.name}</span>
        <span className="language-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.flag.startsWith('data:') ? (
                <img src={lang.flag} alt={lang.name} className="language-flag-img" />
              ) : (
                <span className="language-flag">{lang.flag}</span>
              )}
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

