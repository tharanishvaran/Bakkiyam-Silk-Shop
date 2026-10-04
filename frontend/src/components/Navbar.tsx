import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Lock, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { smoothScrollTo } from '../utils/scroll';
import { useSettings } from '../context/SettingsContext';

const navLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/#collections', label: 'Collections' },
  { href: '/#saree-types', label: 'Saree Types' },
  { href: '/#about', label: 'About Us' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#services', label: 'Services' },
  { href: '/#contact', label: 'Contact' },
];

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.764.882 2.791.882 3.18 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.505 3.58 1.385 5.07L2.05 22l5.085-1.334C8.58 21.52 10.24 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.57 0-3.04-.44-4.29-1.2l-.31-.18-3.02.79.81-2.94-.2-.32C4.2 15.1 3.8 13.59 3.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
    </svg>
  );
}

export default function Navbar() {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const waNum = (settings.whatsapp_number || '919159808720').replace(/\D/g, '');
  const phoneNum = (settings.contact_phone_1 || '919159808720').replace(/\D/g, '');
  const instaUrl = settings.instagram_url || 'https://www.instagram.com/bhakkiyam_pattu_center?stkn=aW40cHE0MHpmdG13';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync Lenis state with mobile menu opening/closing
  useEffect(() => {
    if (menuOpen) {
      (window as any).__lenis?.stop();
    } else {
      (window as any).__lenis?.start();
    }
    return () => {
      (window as any).__lenis?.start();
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    (window as any).__lenis?.start();

    const id = href.replace('/#', '').replace('#', '');

    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        smoothScrollTo(id);
      }, 300);
    } else {
      // Small timeout ensures the mobile menu begins closing while smooth scrolling triggers
      setTimeout(() => {
        smoothScrollTo(id);
      }, 60);
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 850,
          background: scrolled ? 'rgba(13, 10, 14, 0.96)' : 'rgba(13, 10, 14, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(201,168,76,0.18)',
          padding: scrolled ? '0.6rem 0' : '0.85rem 0',
          transition: 'padding 0.3s ease, background 0.3s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/#home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <img
              src="/logo-horizontal.png"
              alt="Bakkiyam Pattu Center Logo"
              className="nav-logo-img"
              style={{
                height: scrolled ? '42px' : '48px',
                width: 'auto',
                maxWidth: '220px',
                transition: 'height 0.3s ease',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </button>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(245,236,215,0.85)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  padding: '0.5rem 0.85rem',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,236,215,0.85)')}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons Group */}
          <div className="nav-actions-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            {/* Direct Phone Call Button */}
            <a
              href={`tel:+${phoneNum}`}
              className="nav-icon-btn nav-call-btn"
              aria-label={`Call Bakkiyam Pattu Center (+${phoneNum})`}
              title={`Call Us (+${phoneNum})`}
            >
              <Phone size={17} />
            </a>

            {/* Official WhatsApp Button */}
            <a
              href={`https://wa.me/${waNum}?text=Hello%20Bakkiyam%20Pattu%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20saree%20collections.`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon-btn nav-whatsapp-btn"
              aria-label={`WhatsApp Enquiry (+${waNum})`}
              title={`Chat with us on WhatsApp (+${waNum})`}
            >
              <WhatsAppIcon size={19} />
            </a>

            {/* Instagram Profile Link */}
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-icon-btn nav-instagram-btn"
              aria-label="Instagram Profile"
              title="Follow Bakkiyam Pattu Center on Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            {/* Explore CTA - Desktop Only */}
            <button
              onClick={() => handleNavClick('/#collections')}
              className="btn btn-primary desktop-only-btn"
              style={{ padding: '0.52rem 1.1rem', fontSize: '0.76rem' }}
            >
              <span>Explore Collections</span>
              <ChevronRight size={14} />
            </button>

            {/* Admin Login Button - Desktop Only */}
            <button
              onClick={() => navigate('/admin/login')}
              className="btn btn-outline desktop-only-btn"
              style={{
                padding: '0.52rem 0.85rem',
                fontSize: '0.74rem',
                borderColor: 'rgba(201,168,76,0.3)',
                color: 'var(--gold)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              title="Admin Management Portal"
            >
              <Lock size={13} />
              <span>Admin</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              className="nav-menu-btn"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent="true"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(320px, 85vw)',
              background: 'rgba(13, 10, 14, 0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(201,168,76,0.25)',
              zIndex: 900,
              padding: '1.25rem 1.15rem',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <img src="/logo-horizontal.png" alt="Bakkiyam Logo" style={{ height: '36px', maxWidth: '170px', objectFit: 'contain' }} />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Slim elegant divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)', margin: '0.4rem 0 0.5rem 0' }} />

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 + 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(245,236,215,0.85)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    padding: '0.65rem 0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    borderLeft: '3px solid transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.05)';
                    (e.currentTarget as HTMLElement).style.borderLeftColor = 'var(--gold)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(245,236,215,0.85)';
                    (e.currentTarget as HTMLElement).style.background = 'none';
                    (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
                  }}
                >
                  <ChevronRight size={14} style={{ color: 'var(--gold)' }} />
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* Call Showroom */}
              <a
                href={`tel:+${phoneNum}`}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', borderColor: 'rgba(201,168,76,0.45)', color: 'var(--gold)' }}
              >
                <Phone size={16} />
                <span>Call Us (+{phoneNum})</span>
              </a>

              {/* WhatsApp Enquiry */}
              <a
                href={`https://wa.me/${waNum}?text=Hello%20Bakkiyam%20Pattu%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20saree%20collections.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
              >
                <WhatsAppIcon size={18} />
                <span>WhatsApp Enquiry</span>
              </a>

              {/* Instagram */}
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '4px',
                  background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(220, 39, 67, 0.3)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Instagram Profile</span>
              </a>

              {/* Admin Login */}
              <button
                onClick={() => { setMenuOpen(false); navigate('/admin/login'); }}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', color: 'var(--dark-text-muted)' }}
              >
                <Lock size={14} />
                <span>Admin Login</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            data-lenis-prevent="true"
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 880 }}
          />
        )}
      </AnimatePresence>

      <style>{`
        .nav-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex-shrink: 0;
        }
        .nav-call-btn {
          background: rgba(201,168,76,0.15);
          border: 1px solid rgba(201,168,76,0.4);
          color: var(--gold);
        }
        .nav-call-btn:hover {
          background: var(--gold);
          color: #0D0A0E;
          transform: scale(1.08);
        }
        .nav-whatsapp-btn {
          background: #25D366;
          color: white;
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
        }
        .nav-whatsapp-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.45);
        }
        .nav-instagram-btn {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(220, 39, 67, 0.35);
        }
        .nav-instagram-btn:hover {
          transform: scale(1.08);
        }
        .nav-menu-btn {
          display: none;
          background: rgba(201, 168, 76, 0.12);
          border: 1px solid rgba(201, 168, 76, 0.4);
          color: var(--gold);
          border-radius: 6px;
          padding: 0.4rem;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          position: relative;
          z-index: 950;
        }
        .nav-menu-btn:active {
          transform: scale(0.92);
          background: rgba(201, 168, 76, 0.25);
        }

        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .desktop-only-btn { display: none !important; }
          .nav-menu-btn { display: flex !important; }
          .nav-logo-img { height: 40px !important; max-width: 185px !important; }
          .nav-actions-wrap { gap: 0.45rem !important; }
          .nav-icon-btn { width: 34px !important; height: 34px !important; }
        }

        @media (max-width: 390px) {
          .nav-logo-img { height: 34px !important; max-width: 155px !important; }
          .nav-actions-wrap { gap: 0.35rem !important; }
          .nav-icon-btn { width: 32px !important; height: 32px !important; }
          .nav-menu-btn { width: 34px !important; height: 34px !important; }
        }
      `}</style>
    </>
  );
}
