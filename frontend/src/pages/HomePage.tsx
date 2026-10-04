import HeroSection from '../components/sections/HeroSection';
import BrandIntroSection from '../components/sections/BrandIntroSection';
import CollectionsSection from '../components/sections/CollectionsSection';
import GallerySection from '../components/sections/GallerySection';
import ServicesSection from '../components/sections/ServicesSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntroSection />
      <CollectionsSection />
      <GallerySection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
