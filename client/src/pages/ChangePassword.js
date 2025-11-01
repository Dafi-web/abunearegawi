import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import './ChangePassword.css';

const ChangePassword = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('changePassword.passwordsNoMatch'));
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(t('changePassword.passwordTooShort'));
      setLoading(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError(t('changePassword.samePassword'));
      setLoading(false);
      return;
    }

    try {
      const response = await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(response.data.message || t('changePassword.success'));
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        t('changePassword.error')
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="change-password-page">
        <div className="container">
          <div className="change-password-card">
            <p>{t('changePassword.loginRequired')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="change-password-page">
      <div className="container">
        <div className="change-password-card">
          <h2>{t('changePassword.title')}</h2>
          <p className="subtitle">{t('changePassword.subtitle')}</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('changePassword.currentPassword')}</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder={t('changePassword.enterCurrentPassword')}
              />
            </div>

            <div className="form-group">
              <label>{t('changePassword.newPassword')}</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder={t('changePassword.enterNewPassword')}
              />
              <small className="form-hint">{t('changePassword.passwordHint')}</small>
            </div>

            <div className="form-group">
              <label>{t('changePassword.confirmPassword')}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder={t('changePassword.confirmNewPassword')}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t('changePassword.changing') : t('changePassword.changePassword')}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

