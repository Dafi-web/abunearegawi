import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../utils/api';
import './Donate.css';

const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const DonateFormInternal = ({ clientSecret: clientSecretProp, setClientSecret: setParentClientSecret }) => {
  const { t } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const { isAuthenticated } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState(clientSecretProp || '');
  const [creatingIntent, setCreatingIntent] = useState(false);

  const presetAmounts = [10, 25, 50, 100];

  // Sync with parent
  useEffect(() => {
    if (setParentClientSecret && clientSecret && clientSecret !== clientSecretProp) {
      setParentClientSecret(clientSecret);
    }
  }, [clientSecret, setParentClientSecret, clientSecretProp]);

  // Create payment intent when amount is selected and stripe is ready
  useEffect(() => {
    if (amount && parseFloat(amount) >= 1 && stripe && !clientSecret && !clientSecretProp) {
      setCreatingIntent(true);
      const createPaymentIntent = async () => {
        try {
          const response = await api.post('/payments/create-intent', {
            amount: parseFloat(amount),
          });
          if (response.data && response.data.clientSecret) {
            setClientSecret(response.data.clientSecret);
            if (setParentClientSecret) {
              setParentClientSecret(response.data.clientSecret);
            }
          } else {
            setError(t('donate.failedInit'));
          }
        } catch (error) {
          console.error('Error creating payment intent:', error);
          setError(error.response?.data?.message || t('donate.failedInit'));
        } finally {
          setCreatingIntent(false);
        }
      };
      createPaymentIntent();
    }
  }, [amount, stripe, clientSecret, clientSecretProp, setParentClientSecret, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const effectiveClientSecret = clientSecret || clientSecretProp;
    if (!stripe || !elements || !amount || parseFloat(amount) < 1 || !effectiveClientSecret) {
      setError(t('donate.invalidAmount'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: effectiveClientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (confirmError) {
        setError(confirmError.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || t('donate.error'));
    } finally {
      setLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs',
    paymentMethodOrder: ['ideal', 'card'],
    fields: {
      billingDetails: 'auto',
    },
  };

  const effectiveClientSecret = clientSecret || clientSecretProp;

  return (
    <div className="donate-page">
      <div className="container">
        <div className="donate-card">
          <h2>{t('donate.title')}</h2>
          <p className="donate-info">
            {t('donate.description')}
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
          
          {creatingIntent && (
            <div style={{ padding: '10px', background: '#f0f7ff', borderRadius: '4px', marginBottom: '20px' }}>
              <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>
                ⏳ {t('donate.initializing')}
              </p>
            </div>
          )}

          <form>
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
                    disabled={creatingIntent}
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
                  disabled={creatingIntent}
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
                  disabled={creatingIntent}
                />
              )}
            </div>
          </form>

          {effectiveClientSecret && stripe ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('donate.paymentMethod')}</label>
                <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                  {t('donate.choosePaymentMethod')}
                </p>
                <div className="payment-element-container">
                  <PaymentElement 
                    options={paymentElementOptions}
                    onReady={(e) => {
                      console.log('Payment Element ready', e);
                    }}
                  />
                </div>
                <p className="payment-methods-info" style={{ marginTop: '10px', fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                  {t('donate.paymentOptions')}
                </p>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!stripe || !elements || loading || !amount}
              >
                {loading ? t('donate.processing') : `${t('donate.donate')} €${amount || '0'}`}
              </button>
            </form>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              {amount && parseFloat(amount) >= 1 ? t('donate.loadingForm') : t('donate.selectAmountFirst')}
            </div>
          )}
          
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

const Donate = () => {
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState(null);

  if (!stripePromise) {
    return (
      <div className="donate-page">
        <div className="container">
          <div className="donate-card">
            <div className="alert alert-danger">
              {t('donate.stripeNotConfigured')}
              <br />
              <small>
                Please set <code>REACT_APP_STRIPE_PUBLISHABLE_KEY</code> with your live Stripe key in the Vercel environment.
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={clientSecret ? { clientSecret } : undefined}
      key={clientSecret || 'initial'}
    >
      <DonateFormInternal clientSecret={clientSecret} setClientSecret={setClientSecret} />
    </Elements>
  );
};

export default Donate;
