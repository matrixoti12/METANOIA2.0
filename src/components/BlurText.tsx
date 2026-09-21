import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.05,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  onAnimationComplete,
}) => {
  const safeText = text || '';
  const elements = animateBy === 'words' ? safeText.split(' ') : safeText.split('');
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: rootMargin as any });

  const defaultFrom =
    direction === 'top'
      ? { filter: 'blur(12px)', opacity: 0, y: -25 }
      : { filter: 'blur(12px)', opacity: 0, y: 25 };

  const defaultTo = { filter: 'blur(0px)', opacity: 1, y: 0 };

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={defaultFrom}
          animate={isInView ? defaultTo : defaultFrom}
          transition={{
            duration: 0.55,
            delay: (index * delay) / (animateBy === 'letters' ? 3 : 1),
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          onAnimationComplete={
            index === elements.length - 1 ? onAnimationComplete : undefined
          }
          className={`inline-block ${animateBy === 'words' ? 'mr-[0.3em] last:mr-0' : ''}`}
        >
          {segment === ' ' ? '\u00A0' : segment}
        </motion.span>
      ))}
    </div>
  );
};
