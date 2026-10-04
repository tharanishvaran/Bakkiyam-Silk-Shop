import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function PublicLayout() {
  useEffect(() => {
    // Lenis smooth scroll - load dynamically
    let lenis: any;
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        prevent: (node: any) => {
          return (
            node?.classList?.contains('modal-overlay') ||
            node?.classList?.contains('modal-content') ||
            node?.classList?.contains('saree-modal-container') ||
            node?.closest?.('.modal-overlay') ||
            node?.closest?.('.modal-content') ||
            node?.closest?.('.saree-modal-container') ||
            node?.closest?.('[data-lenis-prevent]')
          );
        },
      });

      (window as any).__lenis = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }).catch(() => {});

    return () => {
      (window as any).__lenis = null;
      lenis?.destroy?.();
    };
  }, []);

  return (
    <div style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
