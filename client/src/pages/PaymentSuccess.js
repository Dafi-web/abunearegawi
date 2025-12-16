import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    
    if (paymentIntent || paymentIntentClientSecret) {
      setStatus('success');
    } else {
      setStatus('unknown');
    }
  }, [searchParams]);

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
            <h2>Payment Successful!</h2>
            <p>Thank you for your payment. Your transaction has been completed successfully.</p>
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











