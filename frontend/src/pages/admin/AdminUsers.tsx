import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Key, Trash2, Shield, X, Check, Lock, User, Edit2 } from 'lucide-react';
import { getAdminUsers, createAdminUser, updateAdminUser, updateAdminUserPassword, deleteAdminUser } from '../../api';
import type { AdminUser } from '../../types';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUsername = localStorage.getItem('bakkiyam_admin_user') || 'admin';

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState('Administrator');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit User Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTargetUser, setEditTargetUser] = useState<AdminUser | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editRole, setEditRole] = useState('Administrator');
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset Password Modal State
  const [showPwModal, setShowPwModal] = useState(false);
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);
  const [resetPw, setResetPw] = useState('');
  const [confirmResetPw, setConfirmResetPw] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to load administrator accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open Edit User Modal
  const openEditModal = (user: AdminUser) => {
    setEditTargetUser(user);
    setEditUsername(user.username);
    setEditDisplayName(user.display_name || '');
    setEditRole(user.role || 'Administrator');
    setShowEditModal(true);
  };

  // Handle Edit User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTargetUser) return;
    if (!editUsername.trim()) {
      toast.error('Username is required');
      return;
    }

    try {
      setIsUpdating(true);
      await updateAdminUser(editTargetUser.id, {
        username: editUsername.trim(),
        display_name: editDisplayName.trim(),
        role: editRole,
      });
      toast.success(`Administrator "${editUsername.trim()}" updated successfully!`);

      if (editTargetUser.username === currentUsername && editUsername.trim() !== currentUsername) {
        localStorage.setItem('bakkiyam_admin_user', editUsername.trim());
      }

      setShowEditModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to update administrator');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Add New User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await createAdminUser({
        username: newUsername.trim(),
        display_name: newDisplayName.trim() || undefined,
        role: newRole,
        password: newPassword,
      });
      toast.success(`Administrator "${newUsername}" added successfully!`);
      setShowAddModal(false);
      setNewUsername('');
      setNewDisplayName('');
      setNewRole('Administrator');
      setNewPassword('');
      setConfirmPassword('');
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;
    if (resetPw.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (resetPw !== confirmResetPw) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsResetting(true);
      await updateAdminUserPassword(targetUser.id, resetPw);
      toast.success(`Password updated for "${targetUser.username}"!`);
      setShowPwModal(false);
      setTargetUser(null);
      setResetPw('');
      setConfirmResetPw('');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Delete User (allows deleting default admin or current user when another admin exists)
  const handleDeleteUser = async (user: AdminUser) => {
    const isCurrent = user.username === currentUsername;
    if (users.length <= 1) {
      toast.error('Cannot delete the last remaining administrator account! Please add another admin first.');
      return;
    }

    const isDefaultAdmin = user.username.toLowerCase() === 'admin';
    const confirmMsg = isCurrent
      ? `⚠️ WARNING: You are deleting your currently logged-in account ("${user.username}").\n\nYou will be logged out and must sign in with another administrator account.\n\nAre you sure you want to proceed?`
      : isDefaultAdmin
      ? `Are you sure you want to permanently delete the default admin account ("${user.username}")?`
      : `Are you sure you want to permanently remove administrator "${user.username}"?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      const res = await deleteAdminUser(user.id);
      toast.success(res?.message || `Administrator "${user.username}" removed`);
      if (res?.isSelf || isCurrent) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('bakkiyam_admin_user');
        window.location.href = '/admin/login';
      } else {
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete administrator');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <Shield size={24} color="var(--gold)" />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 1.85rem)', color: 'var(--dark-text)' }}>
              Admin Users
            </h1>
          </div>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.85rem' }}>
            Manage staff accounts and permissions for Bakkiyam Pattu Center portal
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={16} />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Users List Container */}
      <div
        style={{
          background: 'var(--dark-card)',
          border: '1px solid var(--dark-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--dark-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.05em' }}>
            Active Accounts ({users.length})
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--dark-text-muted)' }}>
            Logged in as: <strong style={{ color: 'var(--gold)' }}>{currentUsername}</strong>
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>
            Loading administrators...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>
            No admin users found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="admin-table" style={{ width: '100%', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Display Name</th>
                  <th>Role</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isCurrent = u.username === currentUsername;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: isCurrent ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isCurrent ? 'var(--gold)' : 'var(--dark-text-muted)',
                              border: isCurrent ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                            }}
                          >
                            <User size={16} />
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--dark-text)' }}>{u.username}</span>
                            {isCurrent && (
                              <span
                                style={{
                                  marginLeft: '0.5rem',
                                  fontSize: '0.65rem',
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '999px',
                                  background: 'rgba(201,168,76,0.15)',
                                  color: 'var(--gold)',
                                  border: '1px solid rgba(201,168,76,0.3)',
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--dark-text)' }}>{u.display_name || '—'}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: u.role === 'Administrator' ? 'rgba(201,168,76,0.15)' : 'rgba(15,76,117,0.2)',
                            color: u.role === 'Administrator' ? 'var(--gold)' : 'var(--peacock-light)',
                            border: `1px solid ${u.role === 'Administrator' ? 'rgba(201,168,76,0.3)' : 'rgba(15,76,117,0.4)'}`,
                          }}
                        >
                          {u.role || 'Administrator'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--dark-text-muted)', fontSize: '0.8rem' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                          <button
                            onClick={() => openEditModal(u)}
                            title="Edit account details (username, name, role)"
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: 'var(--dark-text)',
                              borderRadius: '4px',
                              padding: '0.4rem 0.65rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Edit2 size={13} color="var(--gold)" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              setTargetUser(u);
                              setShowPwModal(true);
                            }}
                            title="Reset password"
                            style={{
                              background: 'rgba(201,168,76,0.1)',
                              border: '1px solid rgba(201,168,76,0.3)',
                              color: 'var(--gold)',
                              borderRadius: '4px',
                              padding: '0.4rem 0.65rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.2s',
                            }}
                          >
                            <Key size={13} />
                            <span>Reset Pw</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={users.length <= 1}
                            title={users.length <= 1 ? 'Cannot delete the only remaining admin' : u.username === 'admin' ? 'Delete default admin' : 'Delete administrator'}
                            style={{
                              background: 'rgba(229,115,115,0.1)',
                              border: '1px solid rgba(229,115,115,0.3)',
                              color: users.length <= 1 ? 'rgba(229,115,115,0.3)' : '#E57373',
                              borderRadius: '4px',
                              padding: '0.4rem 0.65rem',
                              fontSize: '0.75rem',
                              cursor: users.length <= 1 ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              opacity: users.length <= 1 ? 0.4 : 1,
                              transition: 'all 0.2s',
                            }}
                          >
                            <Trash2 size={13} />
                            <span>{u.username === 'admin' ? 'Delete Admin' : 'Delete'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE NEW ADMIN MODAL */}
      {showAddModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,8,12,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: 'var(--dark-surface)',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: '10px',
              padding: '2rem',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={18} color="var(--gold)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--dark-text)' }}>
                  Add Administrator
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--dark-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="form-label" htmlFor="new-admin-username">Username *</label>
                <input
                  id="new-admin-username"
                  type="text"
                  className="form-input"
                  placeholder="e.g. kannan"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="form-label" htmlFor="new-admin-name">Full / Display Name</label>
                <input
                  id="new-admin-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kannan Veerappan"
                  value={newDisplayName}
                  onChange={e => setNewDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="new-admin-role">Role</label>
                <select
                  id="new-admin-role"
                  className="form-select"
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                >
                  <option value="Administrator">Administrator (Full Access)</option>
                  <option value="Showroom Manager">Showroom Manager</option>
                  <option value="Catalog Staff">Catalog Staff</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="new-admin-pwd">Password * (min 6 characters)</label>
                <input
                  id="new-admin-pwd"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="new-admin-cpwd">Confirm Password *</label>
                <input
                  id="new-admin-cpwd"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ padding: '0.55rem 1.3rem', fontSize: '0.85rem' }}
                >
                  <Check size={16} />
                  <span>{isSubmitting ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showPwModal && targetUser && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,8,12,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowPwModal(false)}
        >
          <div
            style={{
              background: 'var(--dark-surface)',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: '10px',
              padding: '2rem',
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} color="var(--gold)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--dark-text)' }}>
                  Reset Password
                </h3>
              </div>
              <button onClick={() => setShowPwModal(false)} style={{ background: 'none', border: 'none', color: 'var(--dark-text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--dark-text-muted)', marginBottom: '1.25rem' }}>
              Enter a new password for administrator <strong style={{ color: 'var(--gold)' }}>{targetUser.username}</strong>
            </p>

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" htmlFor="reset-user-pwd">New Password * (min 6 characters)</label>
                <input
                  id="reset-user-pwd"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={resetPw}
                  onChange={e => setResetPw(e.target.value)}
                  minLength={6}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="form-label" htmlFor="reset-user-cpwd">Confirm New Password *</label>
                <input
                  id="reset-user-cpwd"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmResetPw}
                  onChange={e => setConfirmResetPw(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowPwModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Lock size={15} />
                  <span>{isResetting ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ADMIN USER MODAL */}
      {showEditModal && editTargetUser && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,8,12,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              background: 'var(--dark-surface)',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: '10px',
              padding: '2rem',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit2 size={18} color="var(--gold)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--dark-text)' }}>
                  Edit Administrator Account
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--dark-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="form-label" htmlFor="edit-admin-username">Username *</label>
                <input
                  id="edit-admin-username"
                  type="text"
                  className="form-input"
                  placeholder="e.g. kannan"
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="edit-admin-name">Full / Display Name</label>
                <input
                  id="edit-admin-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. V. Kannan"
                  value={editDisplayName}
                  onChange={e => setEditDisplayName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="edit-admin-role">Role</label>
                <select
                  id="edit-admin-role"
                  className="form-select"
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                >
                  <option value="Administrator">Administrator (Full Access)</option>
                  <option value="Staff">Showroom Staff</option>
                  <option value="Editor">Catalog Editor</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  <Check size={15} />
                  <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

