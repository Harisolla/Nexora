/**
 * NEXORA — HomePage
 * Composes all homepage sections.
 */
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PageTransition from '../components/animations/PageTransition';

import HeroSection from '../components/home/HeroSection';
import FeaturedCollection from '../components/home/FeaturedCollection';
import ProductStory from '../components/home/ProductStory';
import CategoriesSection from '../components/home/CategoriesSection';
import TrendingSection from '../components/home/TrendingSection';
import NewsletterSection from '../components/home/NewsletterSection';

gsap.registerPlugin(ScrollTrigger);

function EditorialBanner() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;

      const elements = contentRef.current.children;
      gsap.fromTo(
        elements,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '6rem 1.5rem',
        backgroundColor: 'var(--color-highlight)',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}
    >
      <div ref={contentRef} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <p className="section-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
          NEXORA MANIFESTO
        </p>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            marginBottom: '2rem',
          }}
        >
          OBJECTS FOR<br />WHAT'S NEXT.
        </div>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '1rem',
            maxWidth: '480px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          We curate products that push boundaries — everyday essentials reimagined with purpose, craft, and intention.
        </p>
        <Link to="/shop" className="btn-primary">
          Shop the Collection
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <PageTransition>
      <main>
        <HeroSection />
        <FeaturedCollection />
        <ProductStory id="story" />
        <CategoriesSection />
        <TrendingSection />
        <EditorialBanner />
        <NewsletterSection />
      </main>
    </PageTransition>
  );
}

