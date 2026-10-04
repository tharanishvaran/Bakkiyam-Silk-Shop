import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '../../api';
import type { Category } from '../../types';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', sort_order: 0, active: 1 });

  const load = () => {
    getAdminCategories().then(data => {
      if (Array.isArray(data)) setCats(data);
    }).catch(err => {
      console.error(err);
    });
  };

  useEffect(() => { load(); }, []);

  const startEdit = (cat: Category) => {
    setEditing(cat.id);
    setAdding(false);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      sort_order: cat.sort_order ?? 0,
      active: cat.active ?? 1,
    });
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setFormData({ name: '', description: '', sort_order: cats.length + 1, active: 1 });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editing !== null) {
        await updateCategory(editing, formData);
        toast.success('Category updated successfully!');
        setEditing(null);
      } else {
        await createCategory(formData);
        toast.success('Category created successfully!');
        setAdding(false);
      }
      load();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Sarees in this category will become uncategorized.`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleToggle = async (cat: Category) => {
    try {
      await updateCategory(cat.id, {
        name: cat.name,
        description: cat.description || '',
        sort_order: cat.sort_order || 0,
        active: cat.active ? 0 : 1,
      });
      toast.success(cat.active ? 'Category hidden' : 'Category activated');
      load();
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark-text)' }}>Categories</h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem' }}>Manage saree collection categories ({cats.length} total)</p>
        </div>
        {!adding && editing === null && (
          <button onClick={startAdd} className="btn btn-primary" id="admin-add-category">
            <Plus size={16} /> Add New Category
          </button>
        )}
      </div>

      {/* Responsive Form Card for Add / Edit */}
      {(adding || editing !== null) && (
        <div style={{
          background: 'var(--dark-card)',
          border: '1px solid var(--gold)',
          borderRadius: '8px',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)' }}>
              {editing !== null ? 'Edit Category' : 'Create New Category'}
            </h3>
            <button
              onClick={() => { setEditing(null); setAdding(false); }}
              style={{ background: 'none', border: 'none', color: 'var(--dark-text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  className="form-input"
                  placeholder="e.g. Kanchipuram Silk Sarees"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Order (Number)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.sort_order}
                  onChange={e => setFormData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Brief description of this saree collection category..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={15} />
                <span>{saving ? 'Saving...' : editing !== null ? 'Update Category' : 'Create Category'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setEditing(null); setAdding(false); }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 600, color: 'var(--dark-text)' }}>{cat.name}</td>
                  <td style={{ color: 'var(--dark-text-muted)', fontSize: '0.82rem', maxWidth: '280px' }}>
                    {cat.description ? cat.description : '—'}
                  </td>
                  <td style={{ color: 'var(--gold)', fontWeight: 500 }}>{cat.sort_order}</td>
                  <td>
                    <span className="badge" style={{
                      background: cat.active ? 'rgba(76,175,130,0.15)' : 'rgba(229,115,115,0.15)',
                      color: cat.active ? '#4CAF82' : '#E57373',
                      border: `1px solid ${cat.active ? 'rgba(76,175,130,0.3)' : 'rgba(229,115,115,0.3)'}`,
                    }}>
                      {cat.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleToggle(cat)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--dark-border)', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}
                        title={cat.active ? 'Hide Category' : 'Show Category'}
                      >
                        {cat.active ? <Eye size={14} color="#4CAF82" /> : <EyeOff size={14} color="#E57373" />}
                      </button>
                      <button
                        onClick={() => startEdit(cat)}
                        style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}
                        title="Edit Category"
                      >
                        <Edit size={14} color="var(--gold)" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        style={{ background: 'rgba(229,115,115,0.1)', border: '1px solid rgba(229,115,115,0.2)', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer', display: 'flex' }}
                        title="Delete Category"
                      >
                        <Trash2 size={14} color="#E57373" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cats.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--dark-text-muted)' }}>
                    No categories created yet. Click "Add New Category" above to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
