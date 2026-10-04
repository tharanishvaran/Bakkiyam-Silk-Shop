import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const highlights = [
  { icon: '🌸', label: 'Traditional Collections', desc: 'Curated sarees with heritage craftsmanship' },
  { icon: '💍', label: 'Wedding Styles', desc: 'Magnificent bridal & wedding collections' },
  { icon: '✨', label: 'Festive Sarees', desc: 'Vibrant sarees for all celebrations' },
  { icon: '💬', label: 'Personal Assistance', desc: 'Expert guidance in saree selection' },
];

export default function BrandIntroSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="brand" style={{ padding: 'var(--section-padding) 0', background: 'var(--dark-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background ornament */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,27,42,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" ref={ref}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          {/* Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <p className="section-eyebrow">Our Legacy</p>
            </motion.div>

            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ marginBottom: '1.5rem' }}
            >
              Where Tradition Meets <span>Timeless Beauty</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="gold-divider"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontFamily: 'var(--font-decorative)',
                fontSize: '1.15rem',
                color: 'rgba(245,236,215,0.7)',
                lineHeight: 1.9,
                marginBottom: '1.5rem',
                fontStyle: 'italic',
              }}
            >
              "Bakkiyam Pattu Center brings together traditional elegance, beautiful saree designs and a love for timeless Indian craftsmanship."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ color: 'var(--dark-text-muted)', lineHeight: 1.8, marginBottom: '2rem' }}
            >
              Located in Siruvanthadu, we offer a wide variety of saree collections for weddings, celebrations, festivals and special occasions. Every saree in our collection is chosen with love and an eye for quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
              <p style={{ fontFamily: 'var(--font-decorative)', color: 'var(--gold)', fontSize: '1.05rem', letterSpacing: '0.15em', fontStyle: 'italic' }}>
                Tradition • Elegance • Craftsmanship
              </p>
            </motion.div>
          </div>

          {/* Logo + Highlights */}
          <div>
            {/* Logo Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '2.5rem',
                padding: '2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(201,168,76,0.15)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(201,168,76,0.05), transparent)', borderRadius: '8px' }} />
              <img
                src="/logo.png"
                alt="Bakkiyam Pattu Center"
                style={{ height: '175px', width: 'auto', maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }}
              />
            </motion.div>

            {/* Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    transition: 'all 0.3s',
                    cursor: 'default',
                  }}
                  whileHover={{ borderColor: 'rgba(201,168,76,0.4)', y: -2 }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{h.icon}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.82rem', color: 'var(--gold)', marginBottom: '0.25rem' }}>{h.label}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--dark-text-muted)', lineHeight: 1.5 }}>{h.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
