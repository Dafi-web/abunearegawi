import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Membership.css';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
console.log('Stripe Publishable Key (Membership):', STRIPE_PUBLISHABLE_KEY ? STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...' : 'NOT SET');

let stripePromise = null;
if (STRIPE_PUBLISHABLE_KEY && !STRIPE_PUBLISHABLE_KEY.includes('your_key') && STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
  try {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
    console.log('Stripe promise created successfully (Membership)');
  } catch (error) {
    console.error('Error loading Stripe (Membership):', error);
  }
} else {
  console.error('Invalid Stripe key or key not set (Membership)');
}

const MembershipFormInternal = ({ clientSecret: clientSecretProp, setClientSecret: setParentClientSecret }) => {
  const { t } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState(clientSecretProp || '');
  const [creatingIntent, setCreatingIntent] = useState(false);

  // Sync with parent
  useEffect(() => {
    if (setParentClientSecret && clientSecret && clientSecret !== clientSecretProp) {
      setParentClientSecret(clientSecret);
    }
  }, [clientSecret, setParentClientSecret, clientSecretProp]);

  // Create setup intent for subscription
  useEffect(() => {
    if (stripe && !clientSecret && !clientSecretProp) {
      setCreatingIntent(true);
      const createSetupIntent = async () => {
        try {
          const response = await api.post('/payments/create-setup-intent');
          if (response.data && response.data.clientSecret) {
            setClientSecret(response.data.clientSecret);
            if (setParentClientSecret) {
              setParentClientSecret(response.data.clientSecret);
            }
          } else {
            setError('Failed to initialize payment. Please try again.');
          }
        } catch (error) {
          console.error('Error creating setup intent:', error);
          setError(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
        } finally {
          setCreatingIntent(false);
        }
      };
      createSetupIntent();
    }
  }, [stripe, clientSecret, clientSecretProp, setParentClientSecret]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const effectiveClientSecret = clientSecret || clientSecretProp;
    if (!stripe || !elements || !effectiveClientSecret) {
      setError('Payment form is not ready. Please wait...');
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

      // Confirm the setup intent
      const { error: confirmError, setupIntent } = await stripe.confirmSetup({
        elements,
        clientSecret: effectiveClientSecret,
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      if (!setupIntent || !setupIntent.payment_method) {
        setError('Please select a payment method');
        setLoading(false);
        return;
      }

      // Check payment method type - subscriptions need cards
      const paymentMethod = typeof setupIntent.payment_method === 'string' 
        ? await stripe.paymentMethods.retrieve(setupIntent.payment_method)
        : setupIntent.payment_method;

      if (paymentMethod.type === 'ideal') {
        setError('For monthly subscriptions, please use a card. iDEAL is available for one-time donations.');
        setLoading(false);
        return;
      }

      const paymentMethodId = typeof setupIntent.payment_method === 'string' 
        ? setupIntent.payment_method 
        : setupIntent.payment_method.id;

      const response = await api.post('/payments/subscribe', {
        paymentMethodId: paymentMethodId,
      });

      if (response.data.clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          response.data.clientSecret,
          {
            payment_method: paymentMethodId,
          }
        );

        if (confirmError) {
          setError(confirmError.message);
        } else {
          await loadUser();
          navigate('/');
          alert('Membership subscription successful!');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs',
    paymentMethodOrder: ['card', 'ideal'],
    fields: {
      billingDetails: 'auto',
    },
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

  const effectiveClientSecret = clientSecret || clientSecretProp;

  return (
    <div className="membership-page">
      <div className="container">
        <div className="membership-card">
          <h2>{t('membership.title')}</h2>
          <p className="membership-info">
            {t('membership.description')}
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
          
          {creatingIntent && (
            <div style={{ padding: '10px', background: '#f0f7ff', borderRadius: '4px', marginBottom: '20px' }}>
              <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>
                ⏳ {t('membership.initializing')}
              </p>
            </div>
          )}

          {effectiveClientSecret && stripe ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('membership.paymentMethod')}</label>
                <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                  {t('membership.choosePaymentMethod')}
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
                  {t('membership.cardRequired')}
                </p>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!stripe || !elements || loading}
              >
                {loading ? t('membership.processing') : t('membership.subscribe')}
              </button>
            </form>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              {t('membership.loadingForm')}
            </div>
          )}
          <p className="payment-info">
            {t('membership.securePayment')}
          </p>
        </div>
      </div>
    </div>
  );
};

const Membership = () => {
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState(null);

  if (!stripePromise) {
    return (
      <div className="membership-page">
        <div className="container">
          <div className="membership-card">
            <div className="alert alert-danger">
              {t('membership.stripeNotConfigured')}
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
      <MembershipFormInternal clientSecret={clientSecret} setClientSecret={setClientSecret} />
    </Elements>
  );
};

export default Membership;
