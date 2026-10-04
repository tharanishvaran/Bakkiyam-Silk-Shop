import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Eye, Phone, X, ArrowLeft } from 'lucide-react';
import { getSarees, getCategories } from '../../api';
import type { Saree, Category } from '../../types';

const SAMPLE_IMAGES: Record<string, string> = {
  'Kanchipuram': '/saree-kanchipuram.jpg',
  'Emerald': '/saree-emerald.jpg',
  'Zari': '/saree-emerald.jpg',
  'Wedding': '/saree-ivory.jpg',
  'Bridal': '/saree-bridal.jpg',
  'Traditional': '/saree-traditional.jpg',
  'Fancy': '/saree-fancy.jpg',
  'Cotton': '/saree-cotton-silk.jpg',
  'Party': '/saree-party-wear.jpg',
  'New Arrival': '/saree-new-arrival.jpg',
  'Pure Silk': '/saree-purple.jpg',
  'Festive': '/saree-peacock.jpg',
  'Soft Silk': '/saree-pink.jpg',
  'Designer': '/saree-designer.jpg',
  'default': '/hero-bg.jpg',
};

function getSampleImage(saree: Saree): string {
  if (saree.primary_image) return saree.primary_image;
  const name = (saree.name || '').toLowerCase();
  const cat = (saree.category_name || '').toLowerCase();
  const combined = `${name} ${cat}`;

  if (combined.includes('traditional')) return '/saree-traditional.jpg';
  if (combined.includes('fancy') || combined.includes('fancee')) return '/saree-fancy.jpg';
  if (combined.includes('cotton')) return '/saree-cotton-silk.jpg';
  if (combined.includes('party')) return '/saree-party-wear.jpg';
  if (combined.includes('new arrival') || saree.new_arrival) return '/saree-new-arrival.jpg';
  if (combined.includes('emerald') || combined.includes('zari')) return '/saree-emerald.jpg';
  if (combined.includes('kanchipuram')) return '/saree-kanchipuram.jpg';
  if (combined.includes('ivory') || combined.includes('wedding')) return '/saree-ivory.jpg';
  if (combined.includes('crimson') || combined.includes('bridal')) return '/saree-bridal.jpg';
  if (combined.includes('purple')) return '/saree-purple.jpg';
  if (combined.includes('peacock')) return '/saree-peacock.jpg';
  if (combined.includes('soft') || combined.includes('pink')) return '/saree-pink.jpg';
  if (combined.includes('designer')) return '/saree-designer.jpg';

  return SAMPLE_IMAGES.default;
}

interface SareeModalProps {
  saree: Saree;
  onClose: () => void;
}

function SareeModal({ saree, onClose }: SareeModalProps) {
  const waMessage = encodeURIComponent(`Hello Bakkiyam Pattu Center, I am interested in ${saree.name}. Please share more details.`);
  const image = getSampleImage(saree);
  const details = [
    { label: 'Fabric / Material', value: saree.fabric },
    { label: 'Color', value: saree.color },
    { label: 'Design Style', value: saree.design_style },
    { label: 'Occasion', value: saree.occasion },
    { label: 'Weave Details', value: saree.weave_details },
    { label: 'Border Details', value: saree.border_details },
    { label: 'Pallu Details', value: saree.pallu_details },
  ].filter(d => d.value);

  // Prevent background scrolling and pause Lenis smooth scroll while modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    (window as any).__lenis?.stop();
    return () => {
      document.body.classList.remove('modal-open');
      (window as any).__lenis?.start();
    };
  }, []);

  return (
    <motion.div
      className="modal-overlay saree-modal-overlay"
      data-lenis-prevent="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 5, 8, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
        overflow: 'hidden',
        overscrollBehavior: 'contain',
        touchAction: 'pan-y',
      }}
    >
      <motion.div
        className="modal-content saree-modal-container"
        data-lenis-prevent="true"
        initial={{ opacity: 0, scale: 0.94, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 25 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          background: 'var(--dark-surface)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '10px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 25px rgba(201,168,76,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top Navigation Bar with Back & Close */}
        <div
          style={{
            flexShrink: 0,
            background: 'rgba(19, 15, 21, 0.98)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(201,168,76,0.2)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '6px',
              padding: '0.45rem 0.85rem',
              color: 'var(--gold)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Sarees</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--dark-text-muted)',
              transition: 'all 0.2s',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          data-lenis-prevent="true"
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            flexGrow: 1,
            touchAction: 'pan-y',
          }}
        >
          {/* Modal Body Grid */}
          <div className="saree-modal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Image Column */}
          <div style={{ position: 'relative', background: '#0a080c', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={image}
              alt={saree.name}
              style={{
                width: '100%',
                maxHeight: '560px',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(13,10,14,0.6) 0%, transparent 40%)' }} />
            {saree.category_name && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
                <span className="badge badge-gold" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                  {saree.category_name}
                </span>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--dark-text)', lineHeight: 1.25, marginBottom: '0.35rem' }}>
                {saree.name}
              </h2>
              {saree.category_name && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {saree.category_name}
                </p>
              )}
            </div>

            <div className="gold-divider" style={{ margin: '0.5rem 0 1.25rem' }} />

            {saree.description && (
              <p style={{ color: 'rgba(245,236,215,0.75)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                {saree.description}
              </p>
            )}

            {details.length > 0 && (
              <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.12)' }}>
                <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.85rem' }}>
                  Saree Craftsmanship & Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {details.map(d => (
                    <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--dark-text-muted)', flexShrink: 0 }}>{d.label}</span>
                      <span style={{ color: 'var(--dark-text)', fontWeight: 500, textAlign: 'right' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--dark-border)', paddingTop: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-decorative)', fontStyle: 'italic', color: 'var(--gold)', fontSize: '1.05rem', marginBottom: '1rem', textAlign: 'center' }}>
                Interested in this Masterpiece?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={`https://wa.me/919159808720?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ justifyContent: 'center', padding: '0.85rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <span>WhatsApp Enquiry</span>
                </a>
                <a href="tel:+919159808720" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.85rem' }}>
                  <Phone size={16} />
                  <span>Call Us (+91 91598 08720)</span>
                </a>
                <button
                  onClick={onClose}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'center', color: 'var(--dark-text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Collections</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface SareeCardProps {
  saree: Saree;
  index: number;
  onClick: () => void;
  frameStyle: 'gold' | 'arch' | 'rounded' | 'minimal';
}

function SareeCard({ saree, index, onClick, frameStyle }: SareeCardProps) {
  const image = getSampleImage(saree);

  const borderStyles: Record<string, React.CSSProperties> = {
    gold: { border: '1px solid rgba(201,168,76,0.4)', borderRadius: '3px' },
    arch: { border: '1px solid rgba(107,27,42,0.6)', borderRadius: '12px 12px 3px 3px' },
    rounded: { border: '1px solid rgba(61,31,92,0.6)', borderRadius: '12px' },
    minimal: { border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      style={{
        background: 'var(--dark-card)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        ...borderStyles[frameStyle],
      }}
      onClick={onClick}
      className={frameStyle === 'gold' ? 'saree-card-frame-gold' : ''}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
        <img
          src={image}
          alt={saree.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Hover overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(13,10,14,0.85), transparent 50%)',
          opacity: 0,
          transition: 'opacity 0.4s',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '1rem',
        }}
        className="card-overlay"
        >
          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>VIEW DETAILS</span>
        </div>

        {/* Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {saree.featured === 1 && <span className="badge badge-gold">Featured</span>}
          {saree.new_arrival === 1 && <span className="badge" style={{ background: 'rgba(26,92,58,0.5)', color: '#4CAF82', border: '1px solid rgba(26,92,58,0.6)' }}>New</span>}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1.25rem' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--gold), transparent)', marginBottom: '0.875rem', opacity: 0.5 }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '0.3rem', lineHeight: 1.3 }}>
          {saree.name}
        </h3>
        {saree.category_name && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            {saree.category_name}
          </p>
        )}
        {saree.short_description && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--dark-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {saree.short_description.length > 80 ? saree.short_description.slice(0, 80) + '...' : saree.short_description}
          </p>
        )}
        <button
          style={{
            background: 'none',
            border: '1px solid rgba(201,168,76,0.3)',
            color: 'var(--gold)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.5rem 1rem',
            borderRadius: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s',
            width: '100%',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.1)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'none';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
          }}
        >
          <Eye size={13} />
          View Details
        </button>
      </div>

      <style>{`
        .card-overlay { opacity: 0 !important; }
        div:hover > div > .card-overlay { opacity: 1 !important; }
      `}</style>
    </motion.div>
  );
}

const FRAME_STYLES: ('gold' | 'arch' | 'rounded' | 'minimal')[] = ['gold', 'arch', 'rounded', 'minimal', 'gold', 'arch', 'rounded', 'minimal'];

export default function CollectionsSection() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selectedSaree, setSelectedSaree] = useState<Saree | null>(null);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    Promise.all([
      getSarees(),
      getCategories(),
    ]).then(([s, c]) => {
      setSarees(s);
      setCategories(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory ? sarees.filter(s => s.category_id === activeCategory) : sarees;

  return (
    <section id="collections" style={{ padding: 'var(--section-padding) 0', background: 'var(--dark-surface)', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.p
            className="section-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Our Collection
          </motion.p>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ marginBottom: '1rem' }}
          >
            Exquisite <span>Saree Collections</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ margin: '0 auto 2.5rem' }}
          >
            Discover our handpicked collection of traditional and contemporary sarees for every occasion.
          </motion.p>

          {/* Category Filter */}
          <motion.div
            id="saree-types"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              justifyContent: 'center',
              marginBottom: '3rem',
            }}
          >
            <button
              onClick={() => setActiveCategory(null)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '2px',
                border: `1px solid ${!activeCategory ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                background: !activeCategory ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: !activeCategory ? 'var(--gold)' : 'var(--dark-text-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '0.06em',
                transition: 'all 0.2s',
              }}
            >
              All Collections
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '2px',
                  border: `1px solid ${activeCategory === cat.id ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                  background: activeCategory === cat.id ? 'rgba(201,168,76,0.15)' : 'transparent',
                  color: activeCategory === cat.id ? 'var(--gold)' : 'var(--dark-text-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Saree Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ aspectRatio: '3/5' }} className="skeleton" />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}
          >
            <AnimatePresence>
              {filtered.map((saree, i) => (
                <SareeCard
                  key={saree.id}
                  saree={saree}
                  index={i}
                  onClick={() => setSelectedSaree(saree)}
                  frameStyle={FRAME_STYLES[i % FRAME_STYLES.length]}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--dark-text-muted)', fontFamily: 'var(--font-decorative)', fontStyle: 'italic', fontSize: '1.1rem' }}>
              No sarees found in this category. Please check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Saree Detail Modal */}
      <AnimatePresence>
        {selectedSaree && (
          <SareeModal saree={selectedSaree} onClose={() => setSelectedSaree(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .saree-modal-grid { grid-template-columns: 1fr !important; }
          .saree-modal-container { max-height: 95vh !important; border-radius: 8px !important; }
          .saree-modal-overlay { padding: 0.5rem !important; }
        }
      `}</style>
    </section>
  );
}
