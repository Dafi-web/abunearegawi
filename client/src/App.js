import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Calendar from './pages/Calendar';
import Membership from './pages/Membership';
import Donate from './pages/Donate';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/Posts';
import AdminCalendar from './pages/admin/Calendar';
import AdminMembers from './pages/admin/Members';
import Notifications from './pages/Notifications';
import PaymentSuccess from './pages/PaymentSuccess';
import ChangePassword from './pages/ChangePassword';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import './App.css';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = STRIPE_PUBLISHABLE_KEY && !STRIPE_PUBLISHABLE_KEY.includes('your_key') 
  ? loadStripe(STRIPE_PUBLISHABLE_KEY) 
  : null;

function App() {
  useEffect(() => {
    document.title = 'Abune Aregawi Church';
  }, []);

  return (
    <Elements stripe={stripePromise || undefined}>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events" element={<Events />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/donate" element={<Donate />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/posts"
                  element={
                    <AdminRoute>
                      <AdminPosts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/calendar"
                  element={
                    <AdminRoute>
                      <AdminCalendar />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/members"
                  element={
                    <AdminRoute>
                      <AdminMembers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <PrivateRoute>
                      <Notifications />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <PrivateRoute>
                      <ChangePassword />
                    </PrivateRoute>
                  }
                />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </Elements>
  );
}

export default App;
