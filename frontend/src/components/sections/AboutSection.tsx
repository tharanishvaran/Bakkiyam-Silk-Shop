import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSettings } from '../../context/SettingsContext';

export default function AboutSection() {
  const { settings } = useSettings();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const aboutText = settings.about_text || 'Bakkiyam Pattu Center is a traditional saree showroom located in Siruvanthadu, Tamil Nadu. Our collections are focused on elegant sarees for weddings, festivals, celebrations and special occasions.';

  return (
    <section id="about" style={{ padding: 'var(--section-padding) 0', background: 'var(--dark-surface)', position: 'relative', overflow: 'hidden' }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '-200px',
        transform: 'translateY(-50%)',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(61,31,92,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" ref={ref}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative' }}
          >
            <div style={{
              position: 'relative',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(201,168,76,0.25)',
            }}>
              <img
                src="/showroom.jpg"
                alt="Bakkiyam Pattu Center Showroom"
                style={{ width: '100%', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, rgba(107,27,42,0.3), transparent)',
              }} />
            </div>

            {/* Decorative frame */}
            <div style={{
              position: 'absolute',
              bottom: '-12px',
              right: '-12px',
              width: '80%',
              height: '80%',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '4px',
              zIndex: -1,
            }} />

            {/* Logo overlay card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                position: 'absolute',
                bottom: '-1.5rem',
                left: '1.5rem',
                background: 'rgba(13,10,14,0.95)',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '6px',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <img src="/logo-horizontal.png" alt="Bakkiyam Pattu Center" style={{ height: '46px', maxWidth: '180px', width: 'auto', objectFit: 'contain' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 600 }}>Established</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--dark-text)' }}>Siruvanthadu, TN</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div style={{ paddingTop: '2rem' }}>
            <motion.p className="section-eyebrow" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
              Our Story
            </motion.p>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ marginBottom: '1.5rem' }}
            >
              About <span>Bakkiyam Pattu Center</span>
            </motion.h2>

            <div className="gold-divider" style={{ marginBottom: '1.5rem' }} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ color: 'var(--dark-text-muted)', lineHeight: 1.9, marginBottom: '1.25rem' }}
            >
              {aboutText}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ color: 'var(--dark-text-muted)', lineHeight: 1.9, marginBottom: '2rem' }}
            >
              From the most beautiful Kanchipuram silk sarees to soft silks for everyday elegance, we bring you the finest in traditional Indian textile artistry. Every thread tells a story of heritage, patience and unmatched skill.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}
            >
              {['Traditional Craft', 'Premium Quality', 'Trusted Service'].map(tag => (
                <span key={tag} className="badge badge-gold">{tag}</span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{
                padding: '1.25rem',
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderLeft: '3px solid var(--gold)',
                borderRadius: '3px',
              }}
            >
              <p style={{ fontFamily: 'var(--font-decorative)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>
                "Tradition • Elegance • Craftsmanship"
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
