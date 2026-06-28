import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import './Donate.css';

const Donate = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetAmounts = [10, 25, 50, 100];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) < 1) {
      setError(t('donate.invalidAmount'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/payments/create-mollie-payment', {
        amount: parseFloat(amount),
      });

      if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
        return;
      }

      setError(t('donate.failedInit'));
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err.response?.data?.message || t('donate.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-page">
      <div className="container">
        <div className="donate-card">
          <h2>{t('donate.title')}</h2>
          <p className="donate-info">
            {t('donate.description')}
          </p>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('donate.selectAmount')}</label>
              <div className="amount-buttons">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`amount-btn ${amount === preset.toString() ? 'active' : ''}`}
                    onClick={() => {
                      setAmount(preset.toString());
                      setCustomAmount(false);
                    }}
                    disabled={loading}
                  >
                    €{preset}
                  </button>
                ))}
                <button
                  type="button"
                  className={`amount-btn ${customAmount ? 'active' : ''}`}
                  onClick={() => {
                    setCustomAmount(true);
                    setAmount('');
                  }}
                  disabled={loading}
                >
                  {t('donate.custom')}
                </button>
              </div>
              {customAmount && (
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder={t('donate.enterAmount')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="custom-amount-input"
                  disabled={loading}
                />
              )}
            </div>

            <p className="payment-methods-info" style={{ marginBottom: '20px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
              {t('donate.paymentOptions')}
            </p>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading || !amount || parseFloat(amount) < 1}
            >
              {loading ? t('donate.processing') : `${t('donate.donate')} €${amount || '0'}`}
            </button>
          </form>

          <p className="payment-info">
            {t('donate.securePayment')}
            {!isAuthenticated && (
              <span> {t('donate.noAccount')}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Donate;
