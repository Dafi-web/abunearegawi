import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';
import './Users.css';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'user', label: 'User' },
];

const subscriptionStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'canceled', label: 'Canceled' },
];

const defaultFormState = {
  name: '',
  email: '',
  role: 'user',
  isMember: false,
  subscriptionStatus: 'active',
  memberSince: '',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(defaultFormState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users;
    if (roleFilter !== 'all') {
      list = list.filter((user) => user.role === roleFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }
    return list;
  }, [users, roleFilter, searchTerm]);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      isMember: Boolean(user.isMember),
      subscriptionStatus: user.subscriptionStatus || 'active',
      memberSince: user.memberSince
        ? new Date(user.memberSince).toISOString().split('T')[0]
        : '',
    });
    setError('');
    setSuccessMessage('');
  };

  const closeModal = () => {
    setSelectedUser(null);
    setFormData(defaultFormState);
    setError('');
    setSuccessMessage('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        isMember: formData.isMember,
        subscriptionStatus: formData.isMember ? formData.subscriptionStatus : '',
        memberSince: formData.isMember && formData.memberSince ? formData.memberSince : null,
      };

      const response = await api.put(`/admin/users/${selectedUser._id}`, payload);

      setUsers((prev) =>
        prev.map((user) => (user._id === response.data._id ? response.data : user))
      );

      setSuccessMessage('User updated successfully.');
      setTimeout(() => {
        closeModal();
      }, 1200);
    } catch (err) {
      console.error('Error updating user:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to update user.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    const user = users.find((u) => u._id === userId);
    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.name}?`
    );
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      const message = err.response?.data?.message || 'Failed to delete user.';
      window.alert(message);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-users">
      <div className="container">
        <div className="header">
          <div>
            <h1>User Management</h1>
            <p className="subtitle">
              Review, update, or remove registered users. Changes apply immediately.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={loadUsers}>
            Refresh
          </button>
        </div>

        <div className="controls card">
          <div className="control-group">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="control-group">
            <label htmlFor="roleFilter">Role</label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="all">All</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="summary">
            Showing <strong>{filteredUsers.length}</strong> of{' '}
            <strong>{users.length}</strong> users
          </div>
        </div>

        <div className="users-table">
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <p>No users match your current filters.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Member</th>
                  <th>Subscription Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      {user.isMember ? (
                        <span className="status status-member">Yes</span>
                      ) : (
                        <span className="status status-nonmember">No</span>
                      )}
                    </td>
                    <td>
                      {user.subscriptionStatus ? (
                        <span className={`status status-${user.subscriptionStatus}`}>
                          {user.subscriptionStatus.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="status status-unknown">N/A</span>
                      )}
                    </td>
                    <td>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="modal-close" onClick={closeModal} aria-label="Close edit modal">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group checkbox">
                  <label htmlFor="isMember">
                    <input
                      id="isMember"
                      name="isMember"
                      type="checkbox"
                      checked={formData.isMember}
                      onChange={handleCheckboxChange}
                    />
                    <span>Mark as active member</span>
                  </label>
                </div>
                {formData.isMember && (
                  <>
                    <div className="form-group">
                      <label htmlFor="memberSince">Member Since</label>
                      <input
                        id="memberSince"
                        name="memberSince"
                        type="date"
                        value={formData.memberSince}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subscriptionStatus">Subscription Status</label>
                      <select
                        id="subscriptionStatus"
                        name="subscriptionStatus"
                        value={formData.subscriptionStatus}
                        onChange={handleFormChange}
                      >
                        {subscriptionStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                        <option value="">Not set</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {error && <div className="alert alert-danger mt">{error}</div>}
              {successMessage && <div className="alert alert-success mt">{successMessage}</div>}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;



