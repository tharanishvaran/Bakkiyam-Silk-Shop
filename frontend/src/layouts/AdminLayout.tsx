import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Tag, Image, Settings, Users, LogOut, Menu, X, ArrowLeft, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/sarees', icon: ShoppingBag, label: 'Collections' },
  { path: '/admin/categories', icon: Tag, label: 'Categories' },
  { path: '/admin/gallery', icon: Image, label: 'Gallery' },
  { path: '/admin/users', icon: Users, label: 'Admin Users' },
  { path: '/admin/settings', icon: Settings, label: 'Site Settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#120B15',
        color: 'var(--dark-text)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.25rem 1.25rem',
          borderBottom: '1px solid rgba(201, 168, 76, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/feather.png"
            alt="Bakkiyam"
            style={{ height: '38px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(201,168,76,0.3))' }}
          />
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
              Admin Panel
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: 'var(--dark-text)', margin: 0, fontWeight: 600 }}>
              Bakkiyam Pattu
            </p>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '6px',
              color: 'var(--gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = isActive(item.path, item.exact);
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`admin-nav-item ${active ? 'active' : ''}`}
              style={{
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
                background: active ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                color: active ? 'var(--gold)' : 'rgba(245, 236, 215, 0.75)',
                fontWeight: active ? 600 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: active ? '1px solid rgba(201,168,76,0.25)' : 'none',
                borderLeftWidth: '3px',
                borderLeftColor: active ? 'var(--gold)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <item.icon size={18} style={{ color: active ? 'var(--gold)' : 'inherit', flexShrink: 0 }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Area with Back to Website & Logout */}
      <div
        style={{
          marginTop: 'auto',
          padding: '1rem',
          borderTop: '1px solid rgba(201, 168, 76, 0.18)',
          background: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        {/* Back to Website Button */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '6px',
            background: 'rgba(201, 168, 76, 0.1)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            color: 'var(--gold)',
            fontSize: '0.82rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(201, 168, 76, 0.2)';
            e.currentTarget.style.borderColor = 'var(--gold)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(201, 168, 76, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.3)';
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to Website</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '6px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#F87171',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
            e.currentTarget.style.borderColor = '#EF4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
          }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', background: 'var(--dark-bg)', position: 'relative' }}>
      {/* Desktop Persistent Sidebar */}
      <aside
        className="desktop-sidebar"
        style={{
          width: '260px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          borderRight: '1px solid rgba(201,168,76,0.18)',
          zIndex: 100,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          {/* Solid dark backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Opaque Full-Height Drawer */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 'min(285px, 85vw)',
              height: '100%',
              background: '#120B15',
              boxShadow: '4px 0 25px rgba(0,0,0,0.85)',
              borderRight: '1px solid rgba(201, 168, 76, 0.25)',
              zIndex: 1001,
            }}
          >
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className="admin-main"
        style={{
          flex: 1,
          minHeight: '100vh',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Mobile Header Bar */}
        <header
          className="mobile-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            background: 'var(--dark-surface)',
            borderRadius: '10px',
            border: '1px solid rgba(201, 168, 76, 0.2)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              style={{
                background: 'rgba(201, 168, 76, 0.12)',
                border: '1px solid rgba(201, 168, 76, 0.35)',
                color: 'var(--gold)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
              }}
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/feather.png" alt="Bakkiyam" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--dark-text)', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                  Admin Portal
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', display: 'block' }}>
                  Bakkiyam Pattu
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/"
            title="Go to showroom website"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              background: 'rgba(201, 168, 76, 0.1)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
              color: 'var(--gold)',
              fontSize: '0.75rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <span>Website</span>
            <ExternalLink size={12} />
          </Link>
        </header>

        <Outlet />
      </main>

      <style>{`
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
          .admin-main {
            margin-left: 260px !important;
            padding: 2rem !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .admin-main {
            margin-left: 0 !important;
            padding: 1rem !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
