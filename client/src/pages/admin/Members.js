import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadMembers();
    loadPaymentStatus();
  }, [selectedMonth, selectedYear]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentStatus = async () => {
    try {
      const response = await api.get(
        `/members/payments/status?month=${selectedMonth}&year=${selectedYear}`
      );
      setPaymentStatus(response.data);
    } catch (error) {
      console.error('Error loading payment status:', error);
    }
  };

  const handleSendReminder = async (userId) => {
    try {
      await api.post('/notifications/payment-reminder', { userId });
      alert('Payment reminder sent successfully');
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Error sending reminder');
    }
  };

  const handleRemindAllUnpaid = async () => {
    if (window.confirm('Send payment reminders to all unpaid members?')) {
      try {
        const response = await api.post(
          `/notifications/remind-all-unpaid?month=${selectedMonth}&year=${selectedYear}`
        );
        alert(response.data.message);
        loadPaymentStatus();
      } catch (error) {
        console.error('Error sending reminders:', error);
        alert('Error sending reminders');
      }
    }
  };

  const getUnpaidCount = () => {
    return paymentStatus.filter(status => !status.paid).length;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-members">
      <div className="container">
        <h1>Manage Members</h1>

        <div className="filters card">
          <h3>Payment Status Filter</h3>
          <div className="filter-controls">
            <div className="form-group">
              <label>Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary"
                onClick={handleRemindAllUnpaid}
              >
                Remind All Unpaid ({getUnpaidCount()})
              </button>
            </div>
          </div>
        </div>

        <div className="members-list">
          <h2>All Members ({members.length})</h2>
          <div className="members-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Member Since</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const status = paymentStatus.find(
                    (s) => s.member.id === member._id
                  );
                  return (
                    <tr key={member._id}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        {member.memberSince
                          ? new Date(member.memberSince).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            member.subscriptionStatus === 'active'
                              ? 'active'
                              : 'inactive'
                          }`}
                        >
                          {member.subscriptionStatus || 'inactive'}
                        </span>
                      </td>
                      <td>
                        {status ? (
                          <span className={status.paid ? 'paid' : 'unpaid'}>
                            {status.paid ? (
                              <span>✓ Paid</span>
                            ) : (
                              <span>✗ Unpaid</span>
                            )}
                          </span>
                        ) : (
                          <span className="unknown">Unknown</span>
                        )}
                      </td>
                      <td>
                        {status && !status.paid && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleSendReminder(member._id)}
                          >
                            Send Reminder
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;


