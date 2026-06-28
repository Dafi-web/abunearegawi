import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import './Membership.css';

const Membership = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/payments/create-membership');

      if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
        return;
      }

      setError(t('membership.error'));
    } catch (err) {
      console.error('Error starting membership:', err);
      setError(err.response?.data?.message || t('membership.error'));
    } finally {
      setLoading(false);
    }
  };

  if (user?.isMember) {
    return (
      <div className="membership-page">
        <div className="container">
          <div className="card">
            <h2>{t('membership.alreadyMember')}</h2>
            <p>{t('membership.thankYouMessage')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="membership-page">
      <div className="container">
        <div className="membership-card">
          <h2>{t('membership.title')}</h2>
          <p className="membership-info">
            {t('membership.description')}
          </p>
          {error && <div className="alert alert-danger">{error}</div>}

          <p className="payment-methods-info" style={{ marginBottom: '20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
            {t('membership.paymentOptions')}
          </p>

          <button
            type="button"
            className="btn btn-primary btn-large"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? t('membership.processing') : t('membership.subscribe')}
          </button>

          <p className="payment-info">
            {t('membership.securePayment')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Membership;
