import { Phone, MessageCircle, MapPin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Collections', href: '#collections' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

import { smoothScrollTo } from '../utils/scroll';

export default function Footer() {
  const { settings } = useSettings();

  const waNum = (settings.whatsapp_number || '919159808720').replace(/\D/g, '');
  const phone1 = settings.contact_phone_1 || '9159808720';
  const phone2 = settings.contact_phone_2 || '7871620812';
  const phone3 = settings.contact_phone_3 || '9865975616';
  const instaUrl = settings.instagram_url || 'https://www.instagram.com/bhakkiyam_pattu_center?stkn=aW40cHE0MHpmdG13';
  const mapsUrl = settings.maps_url || 'https://maps.app.goo.gl/b5TtEwr47nMyN39G8?g_st=aw';
  const address = settings.address || 'Meenavar Street, Mottuchulam, Siruvanthadu, Tamil Nadu, India';

  const scrollTo = (id: string) => {
    smoothScrollTo(id);
  };

  return (
    <footer style={{
      background: 'var(--dark-surface)',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      padding: '4rem 0 0',
    }}>
      <div className="container">
        {/* Gold top accent */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), var(--maroon), var(--gold), transparent)', marginBottom: '3.5rem' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/logo-horizontal.png" alt="Bakkiyam Pattu Center" style={{ height: '52px', maxWidth: '240px', width: 'auto', objectFit: 'contain' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-decorative)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '1rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              "Tradition Woven Into Every Thread"
            </p>
            <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.85rem', lineHeight: 1.8 }}>
              Your trusted destination for traditional silk sarees in Siruvanthadu, Tamil Nadu.
            </p>

            {/* Instagram Social Badge */}
            <div style={{ marginTop: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                Follow Our Showroom
              </p>
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '20px',
                  background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(220, 39, 67, 0.25)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>@bhakkiyam_pattu_center</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>
              Navigation
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href.replace('#', ''))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--dark-text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--dark-text-muted)')}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

            {/* Location */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>
                Location
              </h4>
              {/* Showroom Location with direct map link */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', textDecoration: 'none' }}
                title="Click to open shop location in Google Maps"
              >
                <MapPin size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <p style={{ color: 'var(--dark-text)', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {address}
                </p>
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
              >
                Open in Google Maps ↗
              </a>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.25rem' }}>
                Contact Us
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {/* Contact 1 */}
                <div style={{ background: 'rgba(201,168,76,0.06)', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600 }}>
                      {settings.contact_phone_1_name || 'V. Kannan'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <a href={`tel:+91${phone1.replace(/\D/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--dark-text)', fontSize: '0.9rem', fontWeight: 600 }}>
                      <Phone size={13} color="var(--gold)" /> +91 {phone1}
                    </a>
                    {phone2 && (
                      <a href={`tel:+91${phone2.replace(/\D/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--dark-text-muted)', fontSize: '0.85rem' }}>
                        <Phone size={12} /> +91 {phone2} {settings.contact_phone_2_name && settings.contact_phone_2_name !== settings.contact_phone_1_name ? `(${settings.contact_phone_2_name})` : ''}
                      </a>
                    )}
                  </div>
                </div>

                {/* Contact 3 */}
                {phone3 && (
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '0.2rem', fontWeight: 600 }}>
                      {settings.contact_phone_3_name || 'S.K. Veerappan'}
                    </p>
                    <a href={`tel:+91${phone3.replace(/\D/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--dark-text)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>
                      <Phone size={13} color="var(--gold)" /> +91 {phone3}
                    </a>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <a
                  href={`https://wa.me/${waNum}?text=Hello%20Bakkiyam%20Pattu%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20saree%20collections.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ fontSize: '0.8rem', padding: '0.6rem 1.25rem', width: '100%', justifyContent: 'center' }}
                >
                  <MessageCircle size={15} />
                  WhatsApp Enquiry
                </a>

                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '0.78rem',
                    padding: '0.55rem 1rem',
                    borderRadius: '4px',
                    background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 600,
                    boxShadow: '0 3px 10px rgba(220, 39, 67, 0.25)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Instagram Profile</span>
                </a>
              </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(201,168,76,0.1)',
          padding: '1.5rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>
            © 2026 Bakkiyam Pattu Center. All Rights Reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-decorative)', fontStyle: 'italic', fontSize: '0.85rem', color: 'rgba(201,168,76,0.5)' }}>
            Tradition • Elegance • Craftsmanship
          </p>
          {/* Admin Login Link */}
          <Link
            to="/admin/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--gold)',
              fontSize: '0.78rem',
              padding: '0.35rem 0.85rem',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '3px',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
              e.currentTarget.style.borderColor = 'var(--gold)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
            }}
          >
            <Lock size={12} />
            <span>Staff / Admin Login</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
