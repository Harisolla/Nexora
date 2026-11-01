import { motion, useReducedMotion } from 'framer-motion';

/**
 * PageTransition
 * Seamless opacity cross-fade between routes.
 * Avoids vertical transform offsets (y translations) during mounting
 * so that GSAP ScrollTrigger calculates accurate geometry from frame 0.
 */
const VARIANTS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

export default function PageTransition({ children }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div style={{ width: '100%' }}>{children}</div>;
  }

  return (
    <motion.div
      variants={VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
