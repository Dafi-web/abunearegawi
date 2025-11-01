import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications/my-notifications');
      setNotifications(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="page-header">
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <button
              className="btn btn-secondary"
              onClick={handleMarkAllAsRead}
            >
              Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>You have no notifications</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification._id || notification.id}
                className={`notification-card card ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-header">
                  <span className={`notification-type ${notification.type}`}>
                    {notification.type}
                  </span>
                  <span className="notification-date">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                {!notification.read && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleMarkAsRead(notification._id || notification.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;


