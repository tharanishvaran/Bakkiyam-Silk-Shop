import { motion } from 'framer-motion';
import {
  Sparkles,
  Crown,
  HeartHandshake,
  RefreshCw,
  Palette,
  PackageCheck,
  ShieldCheck,
  Award,
  Gem,
  CheckCircle2,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const services = [
  {
    icon: Crown,
    title: 'Exclusive Silk Saree Collections',
    tagline: 'Authentic Heritage Weaves',
    desc: 'Explore an exquisite range of handpicked Kanchipuram silk, pure pattu, traditional zari, festive weaves, and lightweight soft silk sarees directly curated from master weaving artisans.',
    highlights: ['Pure Silk Mark standards', 'Rich zari borders & pallus', 'Traditional & modern styles'],
    color: '#C9A84C',
  },
  {
    icon: Sparkles,
    title: 'Bridal & Wedding Consultation',
    tagline: 'Muhurtham & Reception Elegance',
    desc: 'Our showroom offers dedicated, personalized trousseau selection for brides and families. Experience peaceful, guided selections with our experienced saree specialists for your biggest day.',
    highlights: ['Exclusive bridal color palettes', 'Family wedding coordination', 'Auspicious muhurtham sarees'],
    color: '#9B2335',
  },
  {
    icon: RefreshCw,
    title: 'Silk Saree Finishing & Polishing',
    tagline: 'Heirloom Luster Restoration',
    desc: 'Traditional silk saree polishing, roll pressing, and care services. We restore vintage and precious heirloom silk sarees, bringing back their original sheen, texture, and natural elegance.',
    highlights: ['Gentle organic roll pressing', 'Restores zari brilliance', 'Heirloom silk rejuvenation'],
    color: '#1A5C3A',
  },
  {
    icon: HeartHandshake,
    title: 'Personalized Saree Assistance',
    tagline: 'One-on-One Guidance',
    desc: 'Selecting the perfect saree requires patience and an understanding of fabrics. Our knowledgeable staff patiently assists you in finding the weave, drape, and color that suits you best.',
    highlights: ['Personalized styling advice', 'Occasion-based recommendations', 'Patient, family-friendly service'],
    color: '#0F4C75',
  },
  {
    icon: Palette,
    title: 'Custom Inquiries & Color Selections',
    tagline: 'Tailored for Your Function',
    desc: 'Looking for a particular contrast pallu, temple border motif, or specific color theme for family group events? We help source and coordinate matching traditional saree ensembles.',
    highlights: ['Group occasion matching', 'Traditional border selections', 'Contrast color pairings'],
    color: '#8B2A3D',
  },
  {
    icon: PackageCheck,
    title: 'Safe Packaging & Delivery Assistance',
    tagline: 'Doorstep Care & Gifting',
    desc: 'Each saree is carefully inspected and wrapped in protective coverings suitable for silk longevity. We also facilitate safe domestic delivery and video-call saree viewing for distant customers.',
    highlights: ['Protective saree coverings', 'Video-call showcase on WhatsApp', 'Secure dispatch assistance'],
    color: '#3D1F5C',
  },
];

const whyUs = [
  {
    icon: Award,
    title: 'Decades of Traditional Heritage',
    desc: 'Deeply rooted in Tamil Nadu textile heritage with a sterling reputation for genuine quality and authentic handloom craft.',
  },
  {
    icon: Gem,
    title: '100% Uncompromised Quality',
    desc: 'Every single saree is personally examined for weave density, thread perfection, zari authenticity, and finish before reaching our display.',
  },
  {
    icon: ShieldCheck,
    title: 'Pure Craftsmanship, No Gimmicks',
    desc: 'We focus entirely on pure quality, authentic artistry, and lasting relationship with our patrons rather than commercial discounts.',
  },
  {
    icon: CheckCircle2,
    title: 'Extensive Showroom Inventory',
    desc: 'Spacious physical showroom in Siruvanthadu featuring hundreds of fresh designs across bridal, wedding, party, and festive categories.',
  },
  {
    icon: Clock,
    title: 'Customer-First Hospitality',
    desc: 'Experience warm, respectful hospitality where you can touch, feel, and inspect the drape at your own leisurely pace.',
  },
  {
    icon: MapPin,
    title: 'Convenient Siruvanthadu Location',
    desc: 'Centrally located at Meenavar Street, Mottuchulam, Siruvanthadu with easy access from Villupuram, Puducherry, and nearby towns.',
  },
];

export default function ServicesSection() {
  const { settings } = useSettings();
  const phone1 = settings.contact_phone_1 || '9159808720';
  const contactName = settings.contact_phone_1_name || 'V. Kannan';
  const waNum = (settings.whatsapp_number || '919159808720').replace(/\D/g, '');

  return (
    <>
      {/* Services Section */}
      <section
        id="services"
        style={{
          padding: 'var(--section-padding) 0',
          background: 'var(--dark-surface)',
          scrollMarginTop: '90px',
          position: 'relative',
        }}
      >
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <motion.p
              className="section-eyebrow"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Showroom Offerings & Expertise
            </motion.p>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ marginBottom: '1rem' }}
            >
              Our Dedicated <span>Services</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ margin: '0 auto', maxWidth: '680px' }}
            >
              From personal bridal consultations and authentic silk collections to heirloom saree polishing,
              we ensure an unmatched saree experience for you and your family.
            </motion.p>
          </div>

          {/* Services Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {services.map((s, i) => {
              const IconComponent = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  style={{
                    background: 'var(--dark-card)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: '8px',
                    padding: '2.25rem 2rem',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = s.color;
                    e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.4), 0 0 15px ${s.color}25`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
                  }}
                >
                  {/* Top Color Accent Line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${s.color}, transparent)`,
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                    }}
                  />

                  <div>
                    {/* Icon Badge */}
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '10px',
                        background: `rgba(201,168,76,0.08)`,
                        border: `1px solid ${s.color}50`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem',
                        color: s.color,
                      }}
                    >
                      <IconComponent size={28} />
                    </div>

                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      {s.tagline}
                    </span>

                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        color: 'var(--dark-text)',
                        marginBottom: '0.85rem',
                        lineHeight: 1.35,
                      }}
                    >
                      {s.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.88rem',
                        color: 'var(--dark-text-muted)',
                        lineHeight: 1.8,
                        marginBottom: '1.5rem',
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(201,168,76,0.1)',
                      paddingTop: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                    }}
                  >
                    {s.highlights.map(h => (
                      <div
                        key={h}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.78rem',
                          color: 'rgba(245,236,215,0.75)',
                        }}
                      >
                        <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>✦</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Consultation CTA */}
          <div
            style={{
              marginTop: '3.5rem',
              padding: '2rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(107,27,42,0.3) 0%, rgba(26,92,58,0.2) 100%)',
              border: '1px solid rgba(201,168,76,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  color: 'var(--dark-text)',
                  marginBottom: '0.35rem',
                }}
              >
                Need Saree Polishing or Bridal Guidance?
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--dark-text-muted)',
                }}
              >
                Speak directly with our showroom team for immediate assistance and collection previews.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href={`tel:+91${phone1.replace(/\D/g, '')}`}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.7rem 1.4rem' }}
                title={`Call ${contactName}`}
              >
                <Phone size={15} />
                <span>Call {contactName} (+91 {phone1})</span>
              </a>
              <a
                href={`https://wa.me/${waNum}?text=${encodeURIComponent('Hello Bakkiyam Pattu Center, I would like to know more about your services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ fontSize: '0.82rem', padding: '0.7rem 1.4rem' }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        id="why-us"
        style={{
          padding: 'var(--section-padding) 0',
          background: 'var(--dark-bg)',
          scrollMarginTop: '90px',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <motion.p
              className="section-eyebrow"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              The Bakkiyam Distinction
            </motion.p>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ marginBottom: '1rem' }}
            >
              Why Families Trust <span>Bakkiyam Pattu Center</span>
            </motion.h2>
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ margin: '0 auto', maxWidth: '640px' }}
            >
              Building generations of cherished relationships through genuine silk authenticity,
              unmatched traditional craftsmanship, and heartfelt personal service.
            </motion.p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {whyUs.map((w, i) => {
              const IconComp = w.icon;
              return (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'flex-start',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(201,168,76,0.12)',
                    borderRadius: '8px',
                    padding: '1.75rem',
                    transition: 'all 0.3s ease',
                  }}
                  whileHover={{
                    borderColor: 'rgba(201,168,76,0.35)',
                    background: 'rgba(201,168,76,0.03)',
                    y: -3,
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold)',
                      flexShrink: 0,
                    }}
                  >
                    <IconComp size={22} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: 'var(--dark-text)',
                        marginBottom: '0.45rem',
                      }}
                    >
                      {w.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        color: 'var(--dark-text-muted)',
                        lineHeight: 1.75,
                      }}
                    >
                      {w.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
