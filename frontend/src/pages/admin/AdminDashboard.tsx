import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Tag, Image, Eye, Plus, TrendingUp } from 'lucide-react';
import { getAdminStats, getAdminSarees } from '../../api';
import type { AdminStats, Saree } from '../../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentSarees, setRecentSarees] = useState<Saree[]>([]);

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error);
    getAdminSarees().then(s => setRecentSarees(s.slice(0, 5))).catch(console.error);
  }, []);

  const statCards = [
    { label: 'Total Collections', value: stats?.totalSarees ?? '—', icon: ShoppingBag, color: 'var(--gold)' },
    { label: 'Published', value: stats?.publishedSarees ?? '—', icon: Eye, color: '#4CAF82' },
    { label: 'Categories', value: stats?.categories ?? '—', icon: Tag, color: 'var(--peacock-light)' },
    { label: 'Gallery Images', value: stats?.galleryImages ?? '—', icon: Image, color: 'var(--maroon-light)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark-text)', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem' }}>Welcome to Bakkiyam Pattu Center Admin Panel</p>
        </div>
        <button
          onClick={() => navigate('/admin/sarees/new')}
          className="btn btn-primary"
          id="add-new-saree-btn"
        >
          <Plus size={16} />
          <span>Add New Saree</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
        {statCards.map(card => (
          <div key={card.label} className="admin-stat-card" style={{ padding: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--dark-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>{card.label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: card.color }}>{card.value}</p>
              </div>
              <div style={{ background: `${card.color}15`, borderRadius: '8px', padding: '0.6rem' }}>
                <card.icon size={20} color={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Collections */}
      <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--dark-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={18} color="var(--gold)" />
            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.92rem', color: 'var(--dark-text)' }}>Recent Collections</h3>
          </div>
          <button onClick={() => navigate('/admin/sarees')} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            View All →
          </button>
        </div>

        {recentSarees.length > 0 ? (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <table className="admin-table" style={{ minWidth: '480px' }}>
              <thead>
                <tr>
                  <th>Saree Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                </tr>
              </thead>
              <tbody>
                {recentSarees.map(saree => (
                  <tr key={saree.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/sarees/${saree.id}/edit`)}>
                    <td style={{ color: 'var(--dark-text)', fontWeight: 500 }}>{saree.name}</td>
                    <td style={{ color: 'var(--dark-text-muted)' }}>{saree.category_name || '—'}</td>
                    <td>
                      <span className="badge" style={{
                        background: saree.published ? 'rgba(76,175,130,0.15)' : 'rgba(229,115,115,0.15)',
                        color: saree.published ? '#4CAF82' : '#E57373',
                        border: `1px solid ${saree.published ? 'rgba(76,175,130,0.3)' : 'rgba(229,115,115,0.3)'}`,
                      }}>
                        {saree.published ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      {saree.featured ? <span style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>★</span> : <span style={{ color: 'var(--dark-text-muted)' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--dark-text-muted)' }}>
            <ShoppingBag size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>No sarees yet. <button onClick={() => navigate('/admin/sarees/new')} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer' }}>Add your first saree.</button></p>
          </div>
        )}
      </div>
    </div>
  );
}
