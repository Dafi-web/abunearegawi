import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-nav">
          <Link to="/admin/posts" className="btn btn-primary">Manage Posts</Link>
          <Link to="/admin/calendar" className="btn btn-primary">Manage Calendar</Link>
          <Link to="/admin/members" className="btn btn-primary">Manage Members</Link>
        </div>
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Members</h3>
              <p className="stat-number">{stats.totalMembers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Donations</h3>
              <p className="stat-number">€{stats.totalDonations.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Monthly Revenue</h3>
              <p className="stat-number">€{stats.monthlyRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


