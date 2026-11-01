import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register once at module level
gsap.registerPlugin(ScrollTrigger);

/**
 * AnimatedSection
 *
 * Scroll-reveal wrapper powered by GSAP ScrollTrigger.
 *
 * Props:
 *   children   – content to animate
 *   className  – optional CSS class for the wrapper div
 *   delay      – animation delay in seconds (default 0)
 *   direction  – 'up' | 'left' | 'right' | 'none'  (default 'up')
 *   stagger    – if true, staggers direct children instead of the wrapper
 */
export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  stagger = false,
}) {
  const containerRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      // Respect prefers-reduced-motion
      if (prefersReduced) {
        gsap.set(el, { opacity: 1, x: 0, y: 0 });
        return;
      }

      // Determine initial transform offsets
      const fromVars = {
        opacity: 0,
        x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
        y: direction === 'up' ? 40 : 0,
      };

      const toVars = {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        delay,
      };

      const scrollTriggerConfig = {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      };

      if (stagger) {
        // Animate direct children with a stagger
        const targets = el.children;
        if (!targets.length) return;

        gsap.set(targets, fromVars);
        gsap.to(targets, {
          ...toVars,
          stagger: 0.12,
          scrollTrigger: scrollTriggerConfig,
        });
      } else {
        gsap.set(el, fromVars);
        gsap.to(el, {
          ...toVars,
          scrollTrigger: scrollTriggerConfig,
        });
      }
    },
    { scope: containerRef, dependencies: [direction, delay, stagger, prefersReduced] },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
