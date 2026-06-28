import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { loadUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [paymentType, setPaymentType] = useState('payment');

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      setStatus('unknown');
      return;
    }

    const checkMollieStatus = async () => {
      try {
        const response = await api.get(`/payments/mollie-status/${paymentId}`);
        setPaymentType(response.data.type || 'payment');

        if (response.data.status === 'completed') {
          if (response.data.type === 'membership') {
            await loadUser();
          }
          setStatus('success');
        } else if (response.data.status === 'failed') {
          setStatus('failed');
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('unknown');
      }
    };

    checkMollieStatus();
  }, [searchParams, loadUser]);

  const successTitle = paymentType === 'membership'
    ? 'Membership Activated!'
    : paymentType === 'donation'
      ? 'Donation Successful!'
      : 'Payment Successful!';

  const successMessage = paymentType === 'membership'
    ? 'Thank you for becoming a member. Your monthly subscription is now active.'
    : paymentType === 'donation'
      ? 'Thank you for your generous donation. Your support means a lot to our church.'
      : 'Thank you for your payment. Your transaction has been completed successfully.';

  if (status === 'loading') {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="payment-status">
            <h2>Processing payment...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="payment-status success">
            <div className="success-icon">✓</div>
            <h2>{successTitle}</h2>
            <p>{successMessage}</p>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="payment-status">
            <h2>Payment Failed</h2>
            <p>Your payment could not be completed. Please try again.</p>
            <Link to={paymentType === 'membership' ? '/membership' : '/donate'} className="btn btn-primary">
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="payment-status">
            <h2>Payment Pending</h2>
            <p>Your payment is being processed. You will receive confirmation once it is complete.</p>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="container">
        <div className="payment-status">
          <h2>Payment Status</h2>
          <p>We are processing your payment information.</p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
