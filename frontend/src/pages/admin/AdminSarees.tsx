import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Search } from 'lucide-react';
import { getAdminSarees, getAdminCategories, deleteSaree, toggleSareeField } from '../../api';
import type { Saree, Category } from '../../types';
import toast from 'react-hot-toast';

export default function AdminSarees() {
  const navigate = useNavigate();
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const load = () => {
    Promise.all([getAdminSarees(), getAdminCategories()])
      .then(([sareeData, catData]) => {
        if (Array.isArray(sareeData)) setSarees(sareeData);
        if (Array.isArray(catData)) setCategories(catData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteSaree(id);
      toast.success('Saree deleted successfully');
      load();
    } catch {
      toast.error('Failed to delete saree');
    }
  };

  const handleToggle = async (id: number, field: string) => {
    try {
      await toggleSareeField(id, field);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = sarees.filter(s => {
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.color && s.color.toLowerCase().includes(search.toLowerCase())) ||
      (s.fabric && s.fabric.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCat === 'all' || String(s.category_id) === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark-text)', marginBottom: '0.25rem' }}>Collections</h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem' }}>{sarees.length} sarees in database</p>
        </div>
        <button onClick={() => navigate('/admin/sarees/new')} className="btn btn-primary" id="admin-add-saree">
          <Plus size={16} />
          <span>Add New Saree</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dark-text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search sarees by name, color, fabric..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ position: 'relative', minWidth: '200px' }}>
          <select
            className="form-select"
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '6px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>Loading sarees...</div>
        ) : sarees.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--dark-text-muted)', marginBottom: '1rem' }}>No sarees in database yet.</p>
            <button onClick={() => navigate('/admin/sarees/new')} className="btn btn-primary">
              <Plus size={16} /> Add First Saree
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>
            No sarees matching your search criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Saree</th>
                  <th>Category</th>
                  <th>Published</th>
                  <th>Featured</th>
                  <th>New</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(saree => (
                  <tr key={saree.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {saree.primary_image ? (
                          <img
                            src={saree.primary_image}
                            alt={saree.name}
                            style={{ width: '42px', height: '52px', objectFit: 'cover', borderRadius: '3px', border: '1px solid var(--dark-border)' }}
                          />
                        ) : (
                          <div style={{ width: '42px', height: '52px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', border: '1px solid var(--dark-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--dark-text-muted)' }}>
                            No Img
                          </div>
                        )}
                        <div>
                          <p style={{ color: 'var(--dark-text)', fontWeight: 600, fontSize: '0.875rem' }}>{saree.name}</p>
                          {saree.color && <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.75rem' }}>{saree.color}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>{saree.category_name || '—'}</td>
                    <td>
                      <button
                        onClick={() => handleToggle(saree.id, 'published')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                        title={saree.published ? 'Published on website (click to hide)' : 'Hidden (click to publish)'}
                      >
                        {saree.published ? <Eye size={18} color="#4CAF82" /> : <EyeOff size={18} color="#E57373" />}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(saree.id, 'featured')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                        title={saree.featured ? 'Featured on homepage' : 'Not featured'}
                      >
                        <Star size={18} color={saree.featured ? 'var(--gold)' : 'var(--dark-text-muted)'} fill={saree.featured ? 'var(--gold)' : 'transparent'} />
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(saree.id, 'new_arrival')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                        title={saree.new_arrival ? 'Marked as New Arrival' : 'Normal'}
                      >
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: saree.new_arrival ? '#4CAF82' : 'var(--dark-text-muted)', letterSpacing: '0.05em' }}>NEW</span>
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => navigate(`/admin/sarees/${saree.id}/edit`)}
                          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', padding: '0.4rem', cursor: 'pointer', color: 'var(--gold)', display: 'flex' }}
                          title="Edit Saree"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(saree.id, saree.name)}
                          style={{ background: 'rgba(229,115,115,0.1)', border: '1px solid rgba(229,115,115,0.2)', borderRadius: '4px', padding: '0.4rem', cursor: 'pointer', color: '#E57373', display: 'flex' }}
                          title="Delete Saree"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
