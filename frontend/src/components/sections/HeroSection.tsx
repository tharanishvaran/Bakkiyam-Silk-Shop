import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Maximize2, X, ChevronDown, CheckCircle2, MapPin, ExternalLink } from 'lucide-react';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.764.882 2.791.882 3.18 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z" />
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.505 3.58 1.385 5.07L2.05 22l5.085-1.334C8.58 21.52 10.24 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18.2c-1.57 0-3.04-.44-4.29-1.2l-.31-.18-3.02.79.81-2.94-.2-.32C4.2 15.1 3.8 13.59 3.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
    </svg>
  );
}

import { smoothScrollTo } from '../../utils/scroll';
import { useSettings } from '../../context/SettingsContext';

export default function HeroSection() {
  const { settings } = useSettings();
  const [loaded, setLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const heroTitle = settings.hero_title || 'Timeless Elegance, Woven in Pure Silk';
  const heroSubtitle = settings.hero_subtitle || 'Discover exquisite bridal, wedding, and festive pattu sarees directly from Siruvanthadu weavers.';
  const waNum = (settings.whatsapp_number || '919159808720').replace(/\D/g, '');
  const phoneNum = (settings.contact_phone_1 || '919159808720').replace(/\D/g, '');
  const mapsUrl = settings.maps_url || 'https://maps.app.goo.gl/b5TtEwr47nMyN39G8?g_st=aw';
  const showroomAddress = settings.address || 'Meenavar Street, Mottuchulam, Siruvanthadu, Tamil Nadu, India';

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const scrollToCollections = () => {
    smoothScrollTo('collections');
  };

  return (
    <>
      <section id="home" className="hero-section">
        {/* Ambient Silk Aura Glow */}
        <div className="hero-ambient-glow" />
        <div className="hero-vignette" />

        {/* Floating Silk Particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: `${(i % 3) * 2 + 3}px`,
                height: `${(i % 3) * 2 + 3}px`,
                borderRadius: '50%',
                background: i % 2 === 0 ? 'rgba(201,168,76,0.65)' : 'rgba(232,201,106,0.5)',
                left: `${(i * 7.5 + 4) % 100}%`,
                top: `${(i * 9 + 8) % 100}%`,
              }}
              animate={{
                y: [0, -35, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.7, 1.2, 0.7],
              }}
              transition={{
                duration: 4 + (i % 4),
                repeat: Infinity,
                delay: (i * 0.3) % 3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
          {/* Top Auspicious Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ height: '1px', width: '30px', background: 'linear-gradient(to right, transparent, var(--gold))' }} />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.68rem, 1.8vw, 0.8rem)',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold-light)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Sparkles size={13} color="var(--gold)" />
              ஸ்ரீ வீரன் துணை • BAKKIYAM PATTU CENTER • வாழ்க வளமுடன்
            </span>
            <div style={{ height: '1px', width: '30px', background: 'linear-gradient(to left, transparent, var(--gold))' }} />
          </motion.div>

          {/* MAIN HERO BANNER CONTAINER */}
          <motion.div
            className="hero-banner-container"
            initial={{ opacity: 0, scale: 0.94, y: 22 }}
            animate={loaded ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="hero-banner-card"
              onClick={() => setIsLightboxOpen(true)}
              title="Click to view full-resolution banner"
            >
              {/* Corner gold traditional accents */}
              <div className="banner-corner banner-corner-tl" />
              <div className="banner-corner banner-corner-tr" />
              <div className="banner-corner banner-corner-bl" />
              <div className="banner-corner banner-corner-br" />

              {/* Shimmer light sweep animation */}
              <div className="hero-banner-shimmer" />

              <img
                src="/hero-banner.jpg"
                alt="Bakkiyam Pattu Center - பாக்கியம் பட்டு சேலைகள்"
                className="hero-banner-img"
                loading="eager"
                decoding="async"
              />

              {/* Expand Badge */}
              <div className="hero-expand-badge">
                <Maximize2 size={12} />
                <span>View Full Banner</span>
              </div>
            </div>
          </motion.div>

          {/* SHOP ADDRESS DIRECT LINK CARD ON HOME PAGE */}
          <motion.a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-address-direct-card"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            title="Click to open Bakkiyam Pattu Center direct location in Google Maps"
          >
            <div className="hero-address-badge-icon">
              <MapPin size={22} color="var(--gold)" />
            </div>
            <div className="hero-address-info-col">
              <div className="hero-address-title-row">
                <span className="hero-address-title">Showroom Address • Direct Map Link</span>
                <span className="hero-address-live-tag">Google Maps ↗</span>
              </div>
              <span className="hero-address-text">{showroomAddress}</span>
            </div>
            <div className="hero-address-cta-pill">
              <span>Get Route</span>
              <ExternalLink size={13} />
            </div>
          </motion.a>

          {/* Showroom Tagline & Action Buttons */}
          <div className="hero-content-meta">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.7rem, 4vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                color: 'var(--ivory)',
                marginBottom: '0.6rem',
              }}
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontFamily: 'var(--font-decorative)',
                fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                color: 'rgba(245,236,215,0.82)',
                maxWidth: '720px',
                margin: '0 auto',
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            >
              {heroSubtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="hero-btn-group"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <button onClick={scrollToCollections} className="btn btn-primary" id="hero-explore-btn">
                <Sparkles size={16} />
                <span>Explore Saree Collections</span>
              </button>

              <a
                href={`https://wa.me/${waNum}?text=${encodeURIComponent('Hello Bakkiyam Pattu Center, I saw your saree collections and would like to know more.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                id="hero-whatsapp-btn"
              >
                <WhatsAppIcon size={17} />
                <span>WhatsApp Inquiry</span>
              </a>

              <a href={`tel:+${phoneNum}`} className="btn btn-outline" id="hero-call-btn">
                <Phone size={15} />
                <span>Call Showroom</span>
              </a>
            </motion.div>

            {/* Trust Badges Strip */}
            <motion.div
              className="hero-highlights-strip"
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="hero-highlight-pill">
                <CheckCircle2 size={13} color="var(--gold)" />
                <span>100% Pure Silk & Zari</span>
              </div>
              <div className="hero-highlight-pill">
                <CheckCircle2 size={13} color="var(--gold)" />
                <span>Direct Weaver Pricing</span>
              </div>
              <div className="hero-highlight-pill">
                <CheckCircle2 size={13} color="var(--gold)" />
                <span>Bridal & Muhurtham Pattu</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-highlight-pill"
                style={{ textDecoration: 'none' }}
                title="Click to view Bakkiyam showroom on Google Maps"
              >
                <MapPin size={13} color="var(--gold)" />
                <span>Siruvanthadu Showroom ↗</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: '1.75rem',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            cursor: 'pointer',
          }}
          onClick={scrollToCollections}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              color: 'rgba(201,168,76,0.6)',
              textTransform: 'uppercase',
            }}
          >
            Explore Below
          </span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={18} color="var(--gold)" />
          </motion.div>
        </motion.div>
      </section>

      {/* FULL RESOLUTION LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(10, 8, 12, 0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
            }}
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(201, 168, 76, 0.4)',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
                zIndex: 10000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gold)';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#FFF';
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Image Box */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                maxWidth: '96vw',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/hero-banner.jpg"
                alt="Bakkiyam Pattu Center Official Banner"
                style={{
                  width: '100%',
                  maxWidth: '1200px',
                  height: 'auto',
                  borderRadius: '12px',
                  border: '2px solid rgba(201, 168, 76, 0.6)',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 60px rgba(201, 168, 76, 0.35)',
                }}
              />

              <div
                style={{
                  marginTop: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                }}
              >
                <a
                  href={`https://wa.me/${waNum}?text=${encodeURIComponent('Hello Bakkiyam Pattu Center, I am enquiring about the sarees featured on your banner.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
                >
                  <WhatsAppIcon size={18} />
                  <span>Inquire on WhatsApp</span>
                </a>

                <a
                  href={`tel:+${phoneNum}`}
                  className="btn btn-outline"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
                >
                  <Phone size={16} />
                  <span>Call Us: {settings.contact_phone_1 || '+91 91598 08720'}</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
