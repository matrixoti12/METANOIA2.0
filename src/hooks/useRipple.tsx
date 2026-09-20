import React, { useState, useCallback } from 'react';
import { playCyberClick } from '../utils/audio';

export interface RippleData {
  id: number;
  x: number;
  y: number;
  size: number;
  color?: string;
}

export function useRipple(defaultColor: 'cyan' | 'magenta' | 'yellow' = 'cyan') {
  const [ripples, setRipples] = useState<RippleData[]>([]);

  const triggerRipple = useCallback(
    (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, customColor?: string) => {
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = rect.left + rect.width / 2;
        clientY = rect.top + rect.height / 2;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const newRipple: RippleData = {
        id: Date.now() + Math.random(),
        x,
        y,
        size,
        color: customColor || (defaultColor === 'cyan' ? '#00f0ff' : defaultColor === 'magenta' ? '#ff007f' : '#ffe600')
      };

      setRipples((prev) => [...prev, newRipple]);
      playCyberClick();

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    },
    [defaultColor]
  );

  const RippleElements = () => (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            transform: 'translate(-50%, -50%) scale(0)',
            backgroundColor: ripple.color,
            boxShadow: `0 0 20px 6px ${ripple.color}`,
            opacity: 0.75,
          }}
        />
      ))}
    </span>
  );

  return { triggerRipple, RippleElements };
}
