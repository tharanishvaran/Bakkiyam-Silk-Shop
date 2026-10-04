import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ZoomIn, MessageCircle, Phone, Sparkles, Check, CheckSquare, Layers, ArrowLeft } from 'lucide-react';
import { getGallery } from '../../api';
import type { GalleryItem } from '../../types';
import { useSettings } from '../../context/SettingsContext';

const SAMPLE_GALLERY: GalleryItem[] = [
  {
    id: 1,
    image_url: '/saree-box-collection-1.jpg',
    title: 'Showroom Box Collection - Pink, Emerald & Violet Pattu',
    description: 'Handcrafted traditional silk sarees in premium gift boxes featuring rich contrast borders, peacock butta, and grand zari pallu.',
    sort_order: 1,
    published: 1
  },
  {
    id: 2,
    image_url: '/saree-box-collection-2.jpg',
    title: 'Festive Trousseau Box - Mint Green, Indigo & Dual-Tone Sarees',
    description: 'Auspicious wedding and festive pattu sarees showcasing exquisite temple borders, delicate gold thread motifs, and vibrant contrast drapes.',
    sort_order: 2,
    published: 1
  },
  {
    id: 3,
    image_url: '/saree-box-collection-3.jpg',
    title: 'Bridal Grandeur Box - Pistachio, Olive Gold & Mustard Blue',
    description: 'Authentic pure silk sarees with heavy bridal zari weaving, twin peacock motifs, and ornate borders direct from our Siruvanthadu showroom.',
    sort_order: 3,
    published: 1
  },
  {
    id: 4,
    image_url: '/saree-kanchipuram.jpg',
    title: 'Royal Kanchipuram Silk Saree',
    description: 'Classic red and gold handwoven Kanchipuram silk saree with traditional temple zari border.',
    sort_order: 4,
    published: 1
  },
  {
    id: 5,
    image_url: '/saree-emerald.jpg',
    title: 'Emerald Green Pattu Saree',
    description: 'Rich emerald green pure silk saree with intricate golden floral motifs and grand pallu.',
    sort_order: 5,
    published: 1
  },
  {
    id: 6,
    image_url: '/saree-bridal.jpg',
    title: 'Crimson Bridal Muhurtham Saree',
    description: 'Magnificent crimson bridal silk with heavy gold zari for wedding ceremonies.',
    sort_order: 6,
    published: 1
  },
  {
    id: 7,
    image_url: '/saree-ivory.jpg',
    title: 'Ivory Wedding Silk Saree',
    description: 'Pristine ivory and cream silk saree with delicate gold floral embroidery.',
    sort_order: 7,
    published: 1
  },
  {
    id: 8,
    image_url: '/saree-purple.jpg',
    title: 'Royal Purple Silk Saree',
    description: 'Majestic royal purple pattu with intricate geometric borders and contrast pallu.',
    sort_order: 8,
    published: 1
  },
  {
    id: 9,
    image_url: '/saree-peacock.jpg',
    title: 'Peacock Blue Festive Saree',
    description: 'Vibrant peacock blue silk saree featuring traditional peacock motifs.',
    sort_order: 9,
    published: 1
  },
  {
    id: 10,
    image_url: '/saree-pink.jpg',
    title: 'Rose Pink Soft Silk Saree',
    description: 'Lightweight and graceful soft silk saree in delicate rose pink for celebrations.',
    sort_order: 10,
    published: 1
  },
  {
    id: 11,
    image_url: '/showroom.jpg',
    title: 'Bakkiyam Showroom Collection',
    description: 'Warm and welcoming traditional saree showroom at Meenavar Street, Siruvanthadu.',
    sort_order: 11,
    published: 1
  },
];

export default function GallerySection() {
  const { settings } = useSettings();
  const phone1 = settings.contact_phone_1 || '9159808720';
  const contactName = settings.contact_phone_1_name || 'Showroom';
  const [items, setItems] = useState<GalleryItem[]>(SAMPLE_GALLERY);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    getGallery()
      .then(data => {
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(SAMPLE_GALLERY);
        }
      })
      .catch(() => setItems(SAMPLE_GALLERY));
  }, []);

  // Lock background scroll when lightbox modal is open
  useEffect(() => {
    if (selected) {
      document.body.classList.add('modal-open');
      (window as any).__lenis?.stop();
    } else {
      document.body.classList.remove('modal-open');
      (window as any).__lenis?.start();
    }
    return () => {
      document.body.classList.remove('modal-open');
      (window as any).__lenis?.start();
    };
  }, [selected]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCardClick = (item: GalleryItem) => {
    if (multiSelectMode) {
      toggleSelect(item.id);
    } else {
      setSelected(item);
    }
  };

  // Build WhatsApp enquiry link for all selected sarees
  const selectedItems = items.filter(it => selectedIds.includes(it.id));
  const generateMultiWhatsAppUrl = () => {
    const lines = [
      `Hello Bakkiyam Pattu Center,`,
      `I am interested in these ${selectedItems.length} sarees from your gallery showcase:`,
      ...selectedItems.map((item, idx) => `${idx + 1}. ${item.title}`),
      `\nPlease share more details and photos. Thank you!`,
    ];
    return `https://wa.me/919159808720?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  return (
    <section
      id="gallery"
      style={{
        padding: 'var(--section-padding) 0',
        background: 'var(--dark-bg)',
        scrollMarginTop: '90px',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div ref={ref} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <motion.p
            className="section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Showroom Showcase
          </motion.p>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: '1rem' }}
          >
            A Visual <span>Journey of Silk</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ margin: '0 auto 1.5rem', maxWidth: '640px' }}
          >
            Explore our authentic saree collections, boxed presentation sets, and master handloom weaves
            captured live from our Siruvanthadu showroom.
          </motion.p>

          {/* Multi-Select Toggle Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <button
              onClick={() => {
                const next = !multiSelectMode;
                setMultiSelectMode(next);
                if (!next) setSelectedIds([]);
              }}
              className={multiSelectMode ? "btn btn-primary" : "btn btn-outline"}
              style={{
                fontSize: '0.85rem',
                padding: '0.55rem 1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckSquare size={16} />
              <span>{multiSelectMode ? 'Exit Multi-Select' : 'Select Multiple Sarees'}</span>
            </button>

            {multiSelectMode && (
              <>
                <button
                  onClick={() => {
                    if (selectedIds.length === items.length) setSelectedIds([]);
                    else setSelectedIds(items.map(it => it.id));
                  }}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}
                >
                  <Layers size={15} />
                  <span>{selectedIds.length === items.length ? 'Deselect All' : `Select All (${items.length})`}</span>
                </button>
                <span style={{ fontSize: '0.82rem', color: 'var(--gold)', fontWeight: 600 }}>
                  {selectedIds.length} saree{selectedIds.length === 1 ? '' : 's'} selected
                </span>
              </>
            )}
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <div
          style={{
            columns: '3 300px',
            columnGap: '1.25rem',
          }}
        >
          {items.map((item, i) => {
            const isBoxedSet = item.image_url.includes('saree-box-collection');
            const isSelected = selectedIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  marginBottom: '1.25rem',
                  breakInside: 'avoid',
                  border: isSelected
                    ? '2px solid var(--gold)'
                    : isBoxedSet
                    ? '2px solid rgba(201,168,76,0.35)'
                    : '1px solid rgba(201,168,76,0.12)',
                  borderRadius: '8px',
                  display: 'block',
                  background: 'var(--dark-card)',
                  boxShadow: isSelected
                    ? '0 0 25px rgba(201,168,76,0.4), 0 8px 30px rgba(0,0,0,0.6)'
                    : isBoxedSet
                    ? '0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(201,168,76,0.15)'
                    : '0 4px 15px rgba(0,0,0,0.3)',
                  transform: isSelected ? 'scale(0.985)' : 'none',
                  transition: 'all 0.25s ease',
                }}
                onClick={() => handleCardClick(item)}
                whileHover={{ scale: isSelected ? 0.99 : 1.015, y: -3 }}
              >
                {/* Selection Checkbox Pill (Always visible if multiSelectMode OR when selected) */}
                {(multiSelectMode || isSelected) && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(item.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      right: '0.85rem',
                      zIndex: 10,
                      background: isSelected ? 'var(--gold)' : 'rgba(13,10,14,0.85)',
                      color: isSelected ? '#0D0A0E' : 'var(--gold)',
                      border: `2px solid ${isSelected ? 'var(--gold)' : 'rgba(201,168,76,0.5)'}`,
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSelected ? <Check size={18} strokeWidth={3} /> : null}
                  </div>
                )}

                {/* Badge for Boxed Showcase */}
                {isBoxedSet && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.85rem',
                      left: '0.85rem',
                      zIndex: 3,
                    }}
                  >
                    <span
                      className="badge badge-gold"
                      style={{
                        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Sparkles size={11} />
                      Showroom Box Collection
                    </span>
                  </div>
                )}

                <img
                  src={item.image_url}
                  alt={item.title || 'Bakkiyam Saree Collection'}
                  loading="lazy"
                  style={{
                    width: '100%',
                    display: 'block',
                    transition: 'transform 0.5s ease',
                    filter: isSelected ? 'brightness(1.05)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!multiSelectMode) (e.currentTarget.style.transform = 'scale(1.04)');
                  }}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Permanent subtle caption at bottom */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    background: isSelected ? 'rgba(38, 28, 44, 0.98)' : 'rgba(22,15,26,0.95)',
                    borderTop: `1px solid ${isSelected ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      color: isSelected ? 'var(--gold)' : 'var(--dark-text)',
                      fontWeight: 600,
                      marginBottom: '0.2rem',
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.78rem',
                        color: 'var(--dark-text-muted)',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.description.length > 75 ? item.description.slice(0, 75) + '...' : item.description}
                    </p>
                  )}
                </div>

                {/* Hover overlay with zoom icon (only if not in multi-select) */}
                {!multiSelectMode && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      bottom: '65px',
                      background: 'rgba(13,10,14,0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s ease',
                      pointerEvents: 'none',
                    }}
                    className="gallery-overlay"
                  >
                    <div
                      style={{
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        color: 'var(--gold)',
                        background: 'rgba(13,10,14,0.75)',
                        padding: '0.65rem',
                        borderRadius: '50%',
                        border: '1px solid rgba(201,168,76,0.4)',
                      }}
                      className="gallery-zoom-icon"
                    >
                      <ZoomIn size={26} />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Multi-Select Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: '1.25rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 950,
              background: 'rgba(19, 15, 21, 0.96)',
              border: '2px solid var(--gold)',
              borderRadius: '12px',
              padding: '0.85rem 1.5rem',
              boxShadow: '0 15px 40px rgba(0,0,0,0.8), 0 0 25px rgba(201,168,76,0.25)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              maxWidth: '94vw',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  background: 'var(--gold)',
                  color: '#0D0A0E',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '20px',
                }}
              >
                {selectedIds.length}
              </span>
              <span style={{ color: 'var(--dark-text)', fontSize: '0.9rem', fontWeight: 600 }}>
                Saree{selectedIds.length === 1 ? '' : 's'} Selected
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <a
                href={generateMultiWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.82rem' }}
              >
                <MessageCircle size={16} />
                <span>WhatsApp Enquiry ({selectedIds.length})</span>
              </a>

              <a
                href={`tel:+91${phone1.replace(/\D/g, '')}`}
                className="btn btn-outline"
                style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
                title={`Call ${contactName}`}
              >
                <Phone size={15} />
                <span>Call {contactName}</span>
              </a>

              <button
                onClick={() => setSelectedIds([])}
                className="btn btn-ghost"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.8rem', color: 'var(--dark-text-muted)' }}
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            data-lenis-prevent="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(7,5,8,0.92)',
              backdropFilter: 'blur(12px)',
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
              data-lenis-prevent="true"
              initial={{ scale: 0.92, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 25 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '920px',
                width: '100%',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'var(--dark-surface)',
                border: '1px solid rgba(201,168,76,0.3)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 25px rgba(201,168,76,0.2)',
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
                  onClick={() => setSelected(null)}
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
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Gallery</span>
                </button>

                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close"
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
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Large Image Preview & Scrollable Body */}
              <div
                data-lenis-prevent="true"
                style={{
                  overflowY: 'auto',
                  flexGrow: 1,
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  touchAction: 'pan-y',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    background: '#070508',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '340px',
                  }}
                >
                  <img
                    src={selected.image_url}
                    alt={selected.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '62vh',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Details & WhatsApp Enquiry */}
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem' }}>
                    <div>
                      <h2
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.5rem',
                          color: 'var(--dark-text)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {selected.title}
                      </h2>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Siruvanthadu Showroom Exclusive
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        toggleSelect(selected.id);
                        if (!multiSelectMode) setMultiSelectMode(true);
                      }}
                      className={selectedIds.includes(selected.id) ? "btn btn-primary" : "btn btn-outline"}
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                    >
                      <CheckSquare size={14} />
                      <span>{selectedIds.includes(selected.id) ? 'Selected for Enquiry ✓' : '+ Select Saree'}</span>
                    </button>
                  </div>

                  <div className="gold-divider" style={{ margin: '1rem 0' }} />

                  {selected.description && (
                    <p
                      style={{
                        color: 'rgba(245,236,215,0.8)',
                        lineHeight: 1.8,
                        fontSize: '0.92rem',
                        marginBottom: '1.75rem',
                      }}
                    >
                      {selected.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.85rem',
                      flexWrap: 'wrap',
                      borderTop: '1px solid rgba(201,168,76,0.15)',
                      paddingTop: '1.25rem',
                    }}
                  >
                    <a
                      href={`https://wa.me/919159808720?text=${encodeURIComponent(`Hello Bakkiyam Pattu Center, I am enquiring about this saree from your gallery: "${selected.title}". Please share details and availability.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                      style={{ flex: '1 1 200px', justifyContent: 'center', padding: '0.8rem 1.25rem' }}
                    >
                      <MessageCircle size={16} />
                      <span>Enquire on WhatsApp</span>
                    </a>
                    <a
                      href="tel:+919159808720"
                      className="btn btn-outline"
                      style={{ flex: '1 1 180px', justifyContent: 'center', padding: '0.8rem 1.25rem' }}
                    >
                      <Phone size={16} />
                      <span>Call Us (+91 91598 08720)</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-overlay:hover .gallery-zoom-icon {
          opacity: 1 !important;
        }
        .gallery-overlay:hover {
          background: rgba(13, 10, 14, 0.45) !important;
        }
      `}</style>
    </section>
  );
}
