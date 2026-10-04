import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, MessageCircle, MapPin, Navigation, User, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../../context/SettingsContext';

export default function ContactSection() {
  const { settings } = useSettings();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const waNum = (settings.whatsapp_number || '919159808720').replace(/\D/g, '');
  const phone1 = settings.contact_phone_1 || '9159808720';
  const phone2 = settings.contact_phone_2 || '7871620812';
  const phone3 = settings.contact_phone_3 || '9865975616';
  const instaUrl = settings.instagram_url || 'https://www.instagram.com/bhakkiyam_pattu_center?stkn=aW40cHE0MHpmdG13';
  const mapsUrl = settings.maps_url || 'https://maps.app.goo.gl/b5TtEwr47nMyN39G8?g_st=aw';
  const address = settings.address || 'Meenavar Street, Mottuchulam, Siruvanthadu, Tamil Nadu, India';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    const msg = encodeURIComponent(
      `Hello Bakkiyam Pattu Center,\n\nName: ${form.name}\nPhone: ${form.phone}\n\nMessage: ${form.message}`
    );
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
    setTimeout(() => {
      toast.success('Enquiry sent via WhatsApp!');
      setForm({ name: '', phone: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <section id="contact" style={{ padding: 'var(--section-padding) 0', background: 'var(--dark-bg)' }}>
      <div className="container" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.p className="section-eyebrow" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            Get In Touch
          </motion.p>
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} style={{ marginBottom: '1rem' }}>
            Visit <span>Bakkiyam Pattu Center</span>
          </motion.h2>
          <motion.p className="section-subtitle" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ margin: '0 auto' }}>
            We'd love to meet you. Come visit us or send an enquiry.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            {/* Shop Card */}
            <div style={{
              background: 'var(--dark-card)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '6px',
              padding: '2rem',
              marginBottom: '1.5rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--maroon), var(--gold), var(--purple-royal))' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <img src="/feather.png" alt="Bakkiyam Logo" style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--dark-text)', marginBottom: '0.2rem' }}>Bakkiyam Pattu Center</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>TRADITIONAL SILK SAREES</p>
                </div>
              </div>

              <div className="gold-divider" style={{ margin: '1rem 0' }} />

              {/* Address with direct Google Maps link */}
              <div style={{ marginBottom: '1.5rem' }}>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    textDecoration: 'none',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
                    e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
                  }}
                  title="Click to open showroom address in Google Maps"
                >
                  <MapPin size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                      Showroom Address • Direct Map Link ↗
                    </span>
                    <p style={{ color: 'var(--dark-text)', lineHeight: 1.6, fontSize: '0.88rem', whiteSpace: 'pre-line' }}>
                      {address}
                    </p>
                  </div>
                </a>
              </div>

              {/* Contacts */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <User size={14} color="var(--gold)" />
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--gold)' }}>
                    {settings.contact_phone_1_name || 'V. Kannan'}
                  </span>
                </div>
                <a
                  href={`tel:+91${phone1.replace(/\D/g, '')}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--dark-text)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '0.2rem 0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--dark-text)')}
                >
                  <Phone size={14} color="var(--gold)" />
                  +91 {phone1}
                </a>

                {phone2 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {settings.contact_phone_2_name && settings.contact_phone_2_name !== settings.contact_phone_1_name && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <User size={12} color="var(--gold)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 500 }}>
                          {settings.contact_phone_2_name}
                        </span>
                      </div>
                    )}
                    <a
                      href={`tel:+91${phone2.replace(/\D/g, '')}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--dark-text)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        textDecoration: 'none',
                        padding: '0.2rem 0',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--dark-text)')}
                    >
                      <Phone size={14} color="var(--gold)" />
                      +91 {phone2}
                    </a>
                  </div>
                )}
              </div>

              {phone3 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <User size={14} color="var(--gold)" />
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--gold)' }}>
                      {settings.contact_phone_3_name || 'S.K. Veerappan'}
                    </span>
                  </div>
                  <a
                    href={`tel:+91${phone3.replace(/\D/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--dark-text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      padding: '0.25rem 0',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--dark-text)')}
                  >
                    <Phone size={14} color="var(--gold)" />
                    +91 {phone3}
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <a href={`tel:+91${phone1.replace(/\D/g, '')}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.7rem 1rem', fontSize: '0.8rem' }} title={`Call ${settings.contact_phone_1_name || 'Showroom'}`}>
                  <Phone size={15} />
                  <span>Call {settings.contact_phone_1_name || 'Us'} (+91 {phone1})</span>
                </a>
                <a
                  href={`https://wa.me/${waNum}?text=Hello%20Bakkiyam%20Pattu%20Center%2C%20I%20would%20like%20to%20know%20more%20about%20your%20saree%20collections.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.7rem 1rem', fontSize: '0.8rem' }}
                  title="WhatsApp Enquiry"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: '1 1 100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.7rem 1rem',
                    borderRadius: '4px',
                    background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(220, 39, 67, 0.25)',
                    transition: 'opacity 0.2s',
                  }}
                  title="Follow us on Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Follow @bhakkiyam_pattu_center on Instagram</span>
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ flex: '1 1 100%', justifyContent: 'center', padding: '0.7rem 1rem', fontSize: '0.8rem' }}
                >
                  <Navigation size={15} />
                  Get Directions
                </a>
              </div>
            </div>

            {/* Map embed */}
            <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)', height: '220px', background: 'var(--dark-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
              <MapPin size={32} color="var(--gold)" />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>Bakkiyam Pattu Center</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--dark-text-muted)', marginBottom: '1rem' }}>Meenavar Street, Siruvanthadu</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                >
                  <Navigation size={14} />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          {/* Enquiry Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }}>
            <div style={{
              background: 'var(--dark-card)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '6px',
              padding: '2.5rem',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--dark-text)', marginBottom: '0.5rem' }}>Send an Enquiry</h3>
              <p style={{ color: 'var(--dark-text-muted)', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Have a question about our collections? We'll respond via WhatsApp promptly.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="enquiry-name">Your Name</label>
                  <input
                    id="enquiry-name"
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="enquiry-phone">Phone Number</label>
                  <input
                    id="enquiry-phone"
                    type="tel"
                    className="form-input"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="enquiry-message">Message</label>
                  <textarea
                    id="enquiry-message"
                    className="form-textarea"
                    placeholder="Tell us about your saree requirements, occasion, preferred color, etc."
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    required
                    style={{ minHeight: '140px' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                  style={{ justifyContent: 'center', padding: '0.9rem' }}
                >
                  {sending ? (
                    <div style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'var(--dark-bg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : <Send size={16} />}
                  <span>{sending ? 'Sending...' : 'Send Enquiry via WhatsApp'}</span>
                </button>
              </form>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--dark-border)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}>
                  Or contact us directly at
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  <a href={`tel:+91${phone1.replace(/\D/g, '')}`} style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} title={settings.contact_phone_1_name || 'Primary Contact'}>
                    <Phone size={14} /> +91 {phone1} ({settings.contact_phone_1_name || 'V. Kannan'})
                  </a>
                  {phone2 && (
                    <a href={`tel:+91${phone2.replace(/\D/g, '')}`} style={{ color: 'var(--dark-text)', fontWeight: 500, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} title={settings.contact_phone_2_name || 'Contact 2'}>
                      <Phone size={14} /> +91 {phone2} ({settings.contact_phone_2_name || 'V. Kannan'})
                    </a>
                  )}
                  {phone3 && (
                    <a href={`tel:+91${phone3.replace(/\D/g, '')}`} style={{ color: 'var(--dark-text-muted)', fontWeight: 500, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} title={settings.contact_phone_3_name || 'Partner'}>
                      <Phone size={14} /> +91 {phone3} ({settings.contact_phone_3_name || 'S.K. Veerappan'})
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
